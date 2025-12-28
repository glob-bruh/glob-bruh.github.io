
!# How to Pretend That Your Jagex

!## Published: December 7th, 2024 /// Last Edited: December 7th, 2024

#TOC#

## Foreword

RuneScape is a fantasy MMORPG built in Java by Jagex (whose name is based on their slogan “**Ja** va **G** aming **Ex** perts”). The game was released in 2001, and (after some growing pains) still operates to this day. The goal of the game is to level up your characters stats, acquire gold, and collect rare items.

RuneScape is still making money to this day through a system called “memberships”. This means that while the game has a massive free-to-play (F2P) mode, you could pay a monthly  membership to unlock all its content and extra perks. By default, both private server projects I'll be going over will automatically make all players members, unless configured otherwise. 

One might argue “it's just some lowly old MMORPG game server. How hard can it be to set up?” Turns out it was actually a huge adventure alone to set up, and I learned quite a lot about how Java and databases works, despite the hours I had to sit through listening to Scape Theme and Newbie Melody.

RuneScape has a few different versions. They go by unique names, but we will only be focusing on these versions of the game:

* RuneScape Classic / RuneScape 2001 / RuneScape 1. On my network this is referred to as 2001scape, but it's powered by OpenRSC.
* Old-School Runescape / Runescape 2009 / RuneScape 2. On my network this is referred to as 2009scape, and it will be referred to as such in this document.

Before we begin, some context. Some commands will have parts where words are surrounded in <brackets>, like this:

```
./<Folder Containing Script>/test.sh
```

In cases like this, you need to replace the stuff in brackets with your own configs. 

Also, depending on what changes over these various projects, parts of this document may be rewritten to be more up-to-date. If you notice any inaccuracies in my documentation, feel free to reach out and I will promptly change it to be accurate. 

I will also mention that this document will cover much of RuneScapes history, but I never played RuneScape 2 during its original run. I was in a household where everyone played the game. As such I will say this is still intended to be technical documentation (going more into the deep depths of general game server provisioning and management) as opposed to a RuneScape history document. If you want to learn more about RuneScape history in general, I would highly recommend checking out [Colonello's YouTube channel](https://www.youtube.com/@ColonelloRS) and watching some of his videos. 

Finally, I recommend anyone looking to pursue this to have at least some knowledge of Java and databases, as you will be messing with both of those quite a lot throughout this session. 

## Some important RuneScape history

RuneScape's history is very complicated, so to give a picture to how the games were released and shut down (and which games called what) I will leave some history of the game here.

RuneScape Classic was launched in 2001 as a successor to another Java project called DeviousMUD. Jagex would be established as a proper game company, and the game would receive many new players because of its fun leveling system and simple gameplay mechanics. The exponential bump in players would force Jagex to deploy beefier servers, which would add to mounting costs. Jagex would then release the memberships system in 2002 as a way to generate income to handle costs. On January 12th 2006, Jagex [facilitated a banwave]((https://oldschool.runescape.wiki/w/Update:Nearly_5000_RS-classic_accounts_banned) of over 5000 accounts caught using automation (or “botting”) tools on RuneScape Classic. Jagex would then make the decision to halt all sign-ups on RuneScape Classic. The game would re-open signups on rare occasions, but besides that there was no way to sign-up to the game. The game would meet its demise on August 6th 2018, however Jagex Mod Wolf would later reveal that the servers closure was delayed for a couple hours more to allow a RuneScape streamer going by the name “Titus Furius” to complete a quest. 

Jagex would release the RuneScape 2 beta in 2003 before releasing the full game as a sequel to RuneScape Classic in 2004. Players that held an account on RuneScape Classic would have their stats automatically copied to the new game, and could transfer their items to RuneScape 2 during the first few months of launch. On July 22nd 2013 RuneScape 3 would launch as a complete graphics overhaul for RuneScape 2, and is still running to this day. 

Old-School RuneScape (OSRS) was developed from a backup copy of RuneScape 2's server code from 2007. It was launched on February 16th 2013 as a complete offshoot to the current RuneScape game, and would require players to start anew regardless of whether they already had an account or not. Even though OSRS was completely separate from the actual RuneScape games, loyal and dedicated fans of the older RuneScape experience would begin to play it more than ever, and the game would have an entire dedicated team put to making sure it receives updates and support to this day. 

## System Setup

My infrastructure for the RuneScape server is hosted entirely on a single virtual machine, and you will need the following specs to be able to run a server. Funny enough, since RuneScape 2 is a game that used to run in a web browser with a Java plugin, the server itself does not require a high spec system. These specs are approximates, and are based on what my server currently reports. Also remember that these could vary based off how many users will be playing on the server:

* About 7-10gb of memory (about 2gb for Debian/Linux, about 1gb for OpenRSC, about 2gb for 2009scape including map preloads, and about 2gb for MariaDB).
* About 7-10gb of storage. 

The operating system I will be using to build the entire server infrastructure is Debian (with no desktop installed). Once the operating system is installed, other important software needs to be installed in order to run the server:

* **MariaDB:** This is required because both OpenRSC and 2009scape require MariaDB to store information in databases. Note that if you change the root password on MariaDB before installing phpMyAdmin then you may run into issues when it tries to set up its own database.
* **[phpMyAdmin](https://www.phpmyadmin.net/) or some other database management tool:** phpMyAdmin is a tool that lets you manage a server's database over a webpage. While it's not mandatory, it is very nice to have when you're managing the database. Do note that installing phpMyAdmin will also install the Apache2 web server alongside it. You don't have to use phpMyAdmin to manage your own database, that's just what I use.

* **[Screen:](https://wiki.debian.org/screen)** If you want to quickly fire up the game server in the background, the best way to do so is with screen. If you are looking to run the server long-term I recommend building a systemd service, which will be explained in the included instructions. 

Everything listed here can be installed with your systems package manager, and anything that requires manual installation and configuration will be discussed in their respective sections. 

#NOTE# Remember to allow any ports that the server needs to use through your systems firewall.

## Running the OpenRSC server

Jagex shutdown RuneScape Classic in 2018, meaning that there is no longer an official way to play the 2001 classic. Jagex would cite the reason being that they were struggling to put safety tools in the (at the time) 17 year old game, and a growing list of serious bugs that were becoming harder to patch.

Some background, [RSC+](https://rsc.plus/) was an already well-established custom client built for RuneScape Classic. As soon as Jagex announced that they would be shutting down Classic, the RSC+ devs scrambled to make RSC+ a software preservation tool. RSC+ developers would come to the realization that they could decrypt and record network traffic between official Jagex servers and their own client, saving this information to disk. These replays could then be loaded back into the game. They would push out this feature before the servers shut down and users playing on RSC+ would record a series of “replays”. A decently large team would play RuneScape Classic for numerous days, documenting everything possible before the shutdown. You can [read the whole story](https://rsc.plus/#about-tab) on their website. OpenRSC started development after the shutdown was announced, and uses RSC+'s replays to ensure it remains an authentic experience. It was built after a team with open source cooperation reversed-engineered RuneScape Classic. They would also use their knowledge in the private server community to construct the server, and now [run their own private servers](https://rsc.vet/) to this day. With these 2 tools, the public is now able to faithfully play RuneScape Classic once again. 

#NOTE# I want to give a shout out to the amazing folks behind the [RSC+ project](https://github.com/RSCPlus/rscplus/graphs/contributors) and the [OpenRSC project](https://github.com/Open-RSC/Core-Framework/graphs/contributors).

The most valuable resource I used while setting up the server was the [OpenRSC wiki “running your own server” page](https://rsc.vet/wiki/index.php/Running_your_own_server). 

### Get the server code

To get the latest server code from the OpenRSC project, use GIT:

```
git clone https://github.com/Open-RSC/Core-Framework
```

You can also go to the repo's page and download it as a zip file.

### Database configuration

OpenRSC recommends using [HeidiSQL](https://www.heidisql.com/) to manage your database, but I found phpMyAdmin to work just as well. Best security practice is to create a separate database user that is not the root account, which I recommend. 

The first step is to configure a file in the OpenRSC server called [connections.conf](https://github.com/Open-RSC/Core-Framework/blob/develop/server/connections.conf). In here you will find many parameters to configure:

* **db_type:** by default this is set to “sqlite”, which is great if we just wanted to run OpenRSC alone and didn't want to deal with databases. However, since we most likely do want to utilize MariaDB, we will put “mysql” here.
* **MySQL:**
    * **db_host:** The IP address and port of where the database is. If you're hosting the database off the same machine then the default value of `localhost:3306` should work. If you have a dedicated database server you may need to put the IP of it here
    * **db_user:** This will be the database user that will login to the database to view and manage records. By default it's set to root, but if you want to use a different database user, then that can be written here. 
    * **db_pass:** The password that the aforementioned database user will use to login. 
    * **db_table_prefix:** I am not sure what this does, and have not tried it out yet. If I had to guess, it would be a way of telling OpenRSC to add prefixes to all its database tables, so that other servers (such as copies of OpenRSC) using the database would not overwrite information in tables that share the same name. 
* **SSL:** This is primarily for those who are hosting RuneScape servers publicly and wish to use encryption for communications. If that's something you wish to configure, then you can specify a path to a signed certificate and key file here.
* **Discord:** OpenRSC does support posting to [Discord webhooks](https://support.discord.com/hc/en-us/articles/228383668-Intro-to-Webhooks) when certain events are triggered, such as when an abuse report is made through the game. If you wish to configure that, you can enter webhook URLs here. The default value for each line in this section is null, so make sure a line that is not using webhooks has that instead of a blank value. 

After editing the connections file, we need to configure the database itself. If you are using MariaDB to store information then you should use the [MySQL core script](https://github.com/Open-RSC/Core-Framework/blob/develop/server/database/mysql/core.sql) to set up the database:

1) Make a new database. You can call it anything you want. On phpMyAdmin you can click the `new` button on the homepage, but you can also make it manually:
    a) Login to MySQL CLI with the command `mysql -u <sql username> -p <sql password>`.
    b) Run the SQL command `CREATE DATABASE <OpenRSC database name>;`.
    c) Exit MySQL CLI.
2) Add the line `USE <OpenRSC database name>;` to the top of the core script.
3) Run the script in your database management software. There are 2 ways to go about this:
    a) **Using the phpmyadmin import script function:** On phpmyadmin, if you navigate to `home > import`, you will see a spot to browse your computer for a database file. After you select `global.sql`, click on import and wait about 30 seconds for the import to complete.
    b) **Manually running the script in your database management software:** To run an SQL script with MySQL CLI, run the command `mysql -u <sql username> -p <sql password> <OpenRSC database name> < core.sql`.

### Install JDK

The OpenRSC wiki suggests to use either JDK 8, 11, 13 or 14. On my infrastructure I'm using [Adoptium's JDK 11 LTS](https://adoptium.net/temurin/releases/?version=11&os=linux&arch=x64) release as it is still supported by both Adoptium themselves and OpenRSC. Adoptium only has 2 versions that fit this entire scope, that being 8 and 11, so I recommend going with JDK 11 if you're looking to run OpenRSC (unless you really want to use JDK 8). 

If you try to piggyback off the 2009scape JDK (latest), it will not work. Apache Ant will try to use a JVM option called `usebiasedlocking`, which was removed in JDK 15.

After Java is installed you will need to make a `$JAVA_HOME` environment variable that points to the Java environment. This environment variable tells other software on the system where Java is located, and since Apache Ant has no way to point to a specific Java executable, this is mandatory. For more information, consult Oracle's [documentation](https://docs.oracle.com/en/cloud/saas/enterprise-performance-management-common/diepm/epm_set_java_home_104x6dd63633_106x6dd6441c.html) regarding `$JAVA_HOME`.

### Installing...Apache ANT?

A requirement to build OpenRSC is [Apache Ant](https://ant.apache.org/), which is a Java tool that allows developers to script their own build processes. It originated from Apache Tomcat as a replacement for Make.

Essentially all you really need to do to install the tool is go to the [binary distributions](https://ant.apache.org/bindownload.cgi) page and download the latest archive to the server. You will need to run the server through Apache Ant every time you want to run it. 

### Firing up the OpenRSC server

The following commands will run the OpenRSC server. Keep in mind that if you have a different configuration file you can specify it in the `DconfFile` parameter:

```
cd <Path to OpenRSC>/server
<Path to Apache Ant>/bin/ant runserver -DconfFile=local          
```
You can also use the screen tool to quickly fire up a background session of the OpenRSC server, or you can run it in a systemd service by using the following configuration:

```
[Unit]
Description=2001scape Service
After=syslog.target network.target

[Service]
User=<Your Linux Username>
Environment="JAVA_HOME=<Path to JDK>"
WorkingDirectory=<Path to OpenRSC>/server
ExecStart=<Path to Apache Ant>/bin/ant runserver -DconfFile=local
KillSignal=SIGINT

[Install]
WantedBy=multi-user.target
```

Using a systemd service will also allow you to run the server without setting a `$JAVA_HOME` environment variable.

### Client mods

RSC+ supports client-side modifications. These mods go into the `mods` folder alongside the Java executable. 

The only mod I really know of is the RuneScape Classic music mod. Funny enough, the only place I have been able to locate this mod is via this [YouTube tutorial](https://www.youtube.com/watch?v=N9E8BKShWAs), that links to a [file stored](https://psp2i.wiki/files/music.zip) on a Phantasy Star Portable 2 Infinity Wiki, which is another completely separate game developed by SEGA for the PSP. Despite the obscure source of this zip file, it includes all the MIDI songs and a JSON file telling the game which track should be played in which area. As the YouTube video mentions, the file does not need to be extracted, it just has to be placed in the `mods` folder. 

## Running the 2009scape server

Old School RuneScape is [still kicking around](https://store.steampowered.com/app/1343370/Old_School_RuneScape/) even to this day. The game still attracts about [5000 viewers on Twitch](https://twitchtracker.com/games/459931) and is still supported with [regular updates](https://secure.runescape.com/m=news/archive?oldschool=1).

2009scpae was way more difficult to set up than OpenRSC, primarily due to the sparse amount of documentation surrounding the project. Despite this, I managed to stumble around for a bit and still get it running. 

#NOTE# I also want to express that the team behind this revitalization project mostly consists of hobbyists doing this on their own time. I want to relay their wishes to not be contacted in regards to setting up your own server. The only time they want to be contacted is when it involves their own server they host. I am writing this here to explain what I did to get 2009scape running on my own server, but besides that if you want to run a private server then you're on your own. I will also put here what the team has written on their [GitLabs page](https://gitlab.com/2009scape/2009scape/-/blob/master/README.md):

*“Bug reports and support are only accepted by/offered to players of our live hosted server. We will not provide support to those running their own copies.”*

I also want to shout out the [2009scape team](https://2009scape.org/site/community/staff.html) for working on this amazing project, essentially rebuilding RuneScape 2 from the ground up.

2009scape offers 3 ways to play, which are as follows:

* **Live server:** The team behind 2009scape run their own servers available to the public. You can join and play this version of RuneScape [here](https://2009scape.org/site/game_guide/play.html).
* **Host your own server:** You can host your own server using the open source code provided.
* **Single player:** The launcher will download and host its own server off your PC so you can connect without going over a network. 

### Build the server code

To get the latest server code from the 2009scape project, use GIT:

```
git clone https://gitlab.com/2009scape/2009scape
```

You can also go to the repo's page and download it as a zip file. 

After you have the 2009scape repo cloned, you can begin building the server.

Before we begin, I highly recommend compiling the server on a machine with really good specs. If that machine is the server you intend to run 2009scape on, then leave it on the server and compile using that system. If it's not, then clone the project to a powerful machine and compile it on that system. Regardless of whichever you choose, the source code from the 2009scape project has to still be present on the server you intend to run it on.

Luckily the 2009scape developers have left extremely handy scripts in the project to compile the server. In particular, we will be using the [script simply called `build`](https://gitlab.com/2009scape/2009scape/-/blob/master/build). If we execute the command `./build -h`, we will get the scripts help menu: 

```
Usage: ./build [-h] <-m | -g> [-c <m|g>] [-o <path>]
  -h: Display this message.
  -m: Build the management server.
  -g: Build the game server.
  -c: Clean: m: management, g: gameserver. 
      Can specify both. Need at least one if present.
  -o: Specify jar-file directory.
  -q: Quick build - will skip tests.
```

The command I used to compile the server is `./build -c g -q`. The reason why I used these arguments is as described:

* **`-c g`** - The reason I used this was to specify that I wanted to compile the gameserver completely from scratch.
* **`-q`** - When I tried compiling the server normally, the build would fail citing a failed test being the reason. I would completely skip tests and the server would run completely fine. 

After some time you should have the fully compiled `server.jar` executable. If this executable is not already on the server that is going to run 2009scape, then it has to be uploaded to the server. This server executable has to be moved/placed in the `Server` folder. 

### Database configuration

If you already have OpenRSC running on a database, you can piggyback off the same database with 2009scape. This makes database management a breeze when working with both servers. 

Luckily the developers have included a [phpmyadmin SQL dump file](https://gitlab.com/2009scape/2009scape/-/blob/master/Server/db_exports/global.sql) that will build the database infrastructure automatically. You can do this using the same instructions from the OpenRSC database configuration section. 

This SQL script will make a new database called global, and it will be populated with the correct values. If you do not do this step, account creation and login will not be possible. 

After configuring the database, there is a worldprops folder on the server that contains a [file called `default.conf`](https://gitlab.com/2009scape/2009scape/-/blob/master/Server/worldprops/default.conf). This has to be configured as follows:

* **database_name:** The name the 2009scape database runs under.
* **database_username:** This will be the database user that will login to the database to view and manage records. By default it's set to root, but if you want to use a different database user, then that can be written here.
* **database_password:** The password that the aforementioned database user will use to login.
* **database_address:** The IP address of the database server. If your hosting the server off the same machine that the database is located on then the default IP address `127.0.0.1` should work.
* **database_port:** Leave this default (`3306`) unless the database runs on a different port.

### Which JDK to use?

When setting up the server, I tried compiling and running it using [JDK 11](https://adoptium.net/temurin/releases/?os=linux&arch=x64&version=11). Unfortunately compiling the server executable with tests would fail, which would force me to compile without running tests (`./build -q -g`). Performing the compilation this way would succeed.

I would run the server with the included JDK executable and everything configured, and it would run for about 10 seconds before it would crash and shutdown the server. This is the error the server would produce:
```
[16:53:34]: [Server] 2009Scape started in 3290 milliseconds.
Exception in thread "Major Update Worker" java.lang.NoSuchMethodError: java.util.stream.Stream.toList()Ljava/util/List;
at content.global.skill.gather.woodcutting.WoodcuttingListener.animateWoodcutting(WoodcuttingListener.kt:205)
at content.global.skill.gather.woodcutting.WoodcuttingListener.handleWoodcutting(WoodcuttingListener.kt:74)
at content.global.skill.gather.woodcutting.WoodcuttingListener.access$handleWoodcutting(WoodcuttingListener.kt:39)
at content.global.skill.gather.woodcutting.WoodcuttingListener$defineListeners$2.invoke(WoodcuttingListener.kt:55)
at content.global.skill.gather.woodcutting.WoodcuttingListener$defineListeners$2.invoke(WoodcuttingListener.kt:55)
at core.game.interaction.ScriptProcessor.executeScript(ScriptProcessor.kt:181)
at core.game.interaction.ScriptProcessor.processInteractScript(ScriptProcessor.kt:169)
at core.game.interaction.ScriptProcessor.preMovement(ScriptProcessor.kt:53)
at core.game.node.entity.Entity.tick(Entity.java:215)
at core.game.node.entity.player.Player.tick(Player.java:449)
at core.game.bots.AIPlayer.tick(AIPlayer.java:292)
at core.game.world.update.UpdateSequence.start(UpdateSequence.kt:42)
at core.worker.MajorUpdateWorker.handleTickActions(MajorUpdateWorker.kt:116)
at core.worker.MajorUpdateWorker.handleTickActions$default(MajorUpdateWorker.kt:102)
at core.worker.MajorUpdateWorker.worker$lambda$1(MajorUpdateWorker.kt:43)
at java.base/java.lang.Thread.run(Thread.java:834)
[16:53:54]: [StandaloneCoroutine] Triggering reboot due to heartbeat timeout
```

Upon much googling, I would stumble across [Rusu Dinu's answer on Stack Overflow](https://stackoverflow.com/a/70670810) regarding `.toList()`, which pointed me completely in the right direction:

*“Explanation: You are trying to call `.toList()` on a stream, and streams don't have the `.toList()` method (in Java < 16), therefore you have to use a Collector. Short answer: you could either use `.collect(Collectors.toList())` instead of `.toList()` if you want to run your program with Java < 16, or you could use `.toList()` on the stream (as you are doing now) but run it with at least Java 16.”*

Basically `.toList()` is only a thing you can do in later Java releases (16+). Despite the developers wishes I ran the project through the [latest JDK release](https://adoptium.net/). This would work **flawlessly**, and the crash involving the `animateWoodcutting` function would be resolved.

Fortunately 2009scape only needs Java to execute (unlike OpenRSC using Apache Ant), so you do not need to modify the `$JAVA_HOME` environment variable to run it. Just manually specify which Java binary to execute when you go to run the 2009scape executable. 

### Getting Cache

The Jagex/RuneScape cache files is a bundle of files containing textures, models, and maps that is streamed from the servers to the client. Critical cache files are streamed to the client when the client boots the game, and more gets downloaded as the game is played. Your server must have a working cache bundle. If you place bad cache on the server, the game client will either refuse to start or suffer catastrophic graphical glitches.

Cache files primarily follow a naming scheme of `main_file_cache.idx[##]`.

For some reason, the cache files in the repo don't work (either because they are blank for copyright reasons or they are broken). Also downloading cache files from other online sources would not work, as the client would get stuck on the updating screen when the game boots. 

I found the best way to acquire the cache files is to take them from the downloaded files in 2009scape's single player. If you want to go through this process, do the following:

* Download and run the [2009scape launcher](https://2009scape.org/site/game_guide/play.html). 
* Go to the single player tab and click `Download Single Player`.
* Click `Open Backups`, go up a folder and then go into the cache folder. In the cache folder there is a `runescape` folder that contains all the cache files. 

Since the Saradomin Launcher is also open source, we can find out where the above single player content is downloaded from. On line 18 in the file [SingleplayerUpdateService.cs](https://gitlab.com/2009scape/Saradomin-Launcher/-/blob/master/Saradomin/Infrastructure/Services/SingleplayerUpdateService.cs) of the Saradomin Launcher project, we can find a [link](https://gitlab.com/2009scape/singleplayer/windows/-/archive/master/windows-master.zip) that leads back to the 2009scape GitLab for a file called `windows-master.zip`. This file contains an entire ready-to-play offline version of 2009scape, and located in `/windows-master/game/data/cache/` is all the cache files required for the 2009scape server. While I have not tested this myself, I do have good reason to believe that the cache in the zip file will work. 

On the server, all cache files need to be placed at `Server/data/cache`. Below is a list of files on my servers cache directory:

* `main_file_cache.dat2`
* `main_file_cache.idx0` - `main_file_cache.idx28`
* `main_file_cache.idx255`

The best way to test the cache files on the server is to launch the game and set it into `High Detail` mode on the title screen. The background will pan around and load different areas of the game world, forcing cache from multiple areas of the in-game world to be streamed to the client. I recommend running the game for the same amount of time I did (half an hour) to test cache files. 

### World properties configuration

In the worldprops folder on the server, there is a [file called `default.conf`](https://gitlab.com/2009scape/2009scape/-/blob/master/Server/worldprops/default.conf). This file contains a slew of configurations that define where the pulls other configuration files from and define the servers behavior in general. It is recommended to copy this over to a separate file (I called mine `local.conf`) so that you still have the original unmodified configuration.

#WARN# Ensure you carefully read every line of this configuration file. While it's documented really well, some of the options that are enabled are to test the server and will cause instability or unexpected data/progress loss, or result in other unexpected behavior.

The database section must point to the system that is holding 2009scape's database. This is covered in the `Database Configuration` section. 

### Firing up the 2009scape server

To run the server, go into the `Server` folder and run the following command. Ensure you specify your custom world properties configuration file instead of the default one:

```
<Path to Java>/bin/java -jar server.jar ./worldprops/<Name of Your Custom worldprops Config>
```

As stated before, you can use screen to quickly fire up a background session of the 2009scape server, or you can also run it in a systemd service by using the following configuration:

```
[Unit]
Description=2009scape Service
After=syslog.target network.target

[Service]
User=<Your Username>
WorkingDirectory=<path to 2009scape>/Server
ExecStart=<Path to Java>/bin/java -jar server.jar ./worldprops/<Name of Your Custom worldprops Config>;
KillSignal=SIGINT

[Install]
WantedBy=multi-user.target
```

### Grabbing and configuring the client

There are 2 ways to go about acquiring the client:

* Extract the compiled client from Saradomin Launcher.
* Acquire the client [source code](https://gitlab.com/2009scape/rt4-client) and build the solution with Gradle.

If you choose to extract the compiled client, you can follow the same methodology used to get cache files for the server. Both the zip file and singleplayer install through Saradomin Launcher will have the compiled Java client. These instructions can be found in the `Getting Cache` section.

If you choose to build the client yourself, the RT4 client repo has instructions on how to do so (though I haven't done this myself). From the looks of it, all you need to do is clone the repo then run Gradle:

```
git clone https://gitlab.com/2009scape/rt4-client
cd rt4-client
./gradlew run
```

After acquiring a compiled game client, you must configure where the client will connect to when the game starts. As stated in `Getting Cache`, critical cache data is downloaded the moment the game boots, so its important that we are streaming cache data from our private server rather than the fallback (which is the private server the 2009scape team runs themselves). Alongside the 2009scape Java client executable, make a new [file called `config.json`](https://gitlab.com/2009scape/rt4-client/-/blob/master/client/config.json) if it does not already exist. 

This JSON file needs to be configured as follows. You must use proper JSON formatting/syntax, and if you get lost, refer to the `config.json` file on the RT4 client GitLab repo as a point of reference:

* **ip_management:** The management server no longer exists, so this can point to the IP running the 2009scape server.
* **ip_address:** The IP address running the 2009scape server. 
* **world:** The world number that the client should connect to on launch. By default this is world `1`.
* **server_port, wl_port, js5_port:** The ports that should be used to connect to the 2009scape server. Leave these default (`43594`, `43595`, and `43595` respectively) unless you have changed what ports the server runs on. 

These options alone should allow you to boot the game and play off the 2009scape server.

### Game configurations

In the 2009scape server you will find a folder called `data`, that contains (mostly) JSON configs containing **everything** about the server and its players. Most times a quick analysis of the files in this folder will allow you to easily reconfigure many aspects of the game. I will vaguely give overviews of each aspect of these files.

In 2009scape, there are bots that will roam the game world and interact with various elements, such as pickpocketing nearby NPC's. They don't do much except make the world look more active than it really is. You can actually edit many attributes of these bots, including what these bot's names are, how they look, and what they will say to nearby players. These configs can be found in [the `botdata` folder](https://gitlab.com/2009scape/2009scape/-/tree/master/Server/data/botdata). 

The [`configs` folder](https://gitlab.com/2009scape/2009scape/-/tree/master/Server/data/configs) contains a large amount of configurations for many different mechanics of the game, including NPC spawn locations, where each song in the game is played, various weapon and object behavior configurations, and interfaces configurations. 

The [`economy` folder](https://gitlab.com/2009scape/2009scape/-/tree/master/Server/data/eco) contains a database file for the [Grand Exchange](https://oldschool.runescape.wiki/w/Grand_Exchange), a location in RuneScape where players can buy and sell items. 

The `logs` folder contains a database file for various logs, including chat logs.

In regards to players, you can configure nearly everything about a player including on-hand inventory, their bank, all skill levels, and even their settings. These can be located in the `players` directory, and each player will get their own respective file. 

If you are looking to edit these files, you should consider using the following tools:

* [**OSRSBOX RuneScape Item Search**](https://www.osrsbox.com/tools/item-search/) - An item search tool built by a RuneScape player called [PH01L](https://github.com/osrsbox). They also have a blog and GitHub jam-packed with information and tools for games like RuneScape and World of Warcraft.
* [**Sqlite3**](https://sqlite.org/) - If you want to modify database files on the server you will need sqlite, even if you're already using MariaDB and phpMyAdmin. 
* I might make my own tool in the future that will allow for configuring the above mentioned JSON files automatically. If I do build one I will be sure to update this write-up to include it.

Some aspects of these files don't need to be modified and can be manipulated with administrator-level commands (also called JMOD commands). A good example of this is giving yourself GP (coins, in-game money). You could do this by editing your player's JSON configuration file, but you can also use the command `item 995 <amount>`. Item 995 is one of the coin items (this specific one adds the GP directly to your inventory), as there are also numerous variants for GP. JMOD commands will be explained more in the `Player Permissions` section. 

### World map

The world map is based on RuneScape's April 7th 2009 map. The RuneScape client also has a map you can pull up to view the entire game's world.

A high quality image of the map can be found on the [Runescape wiki](https://runescape.wiki/w/World_map/History#/media/File:RS_map_7_april_2009.png). 

### Player Permissions

2009scape has 3 different roles that a player can be assigned. The player role usually determines what commands they are allowed to run, and are as follows:

* **Normal player**: The only commands a normal player can run usually involve client side settings or provide useful information.
* **Player Moderator (aka PMOD)**: Player moderators (or PMOD for short) can only run player management commands, such as jailing and kicking players. They cannot ban players, as only JMOD's can do that. On official Jagex infrastructure players that demonstrated good security practices and have made good reports regarding user behavior can be selected to become player moderators.
* **Administrator (aka JMOD)**: Administrators are able to use game breaking cheat and testing commands. Players with this permission can wreak havoc on the server, so be careful who you award this power to. On official Jagex infrastructure only Jagex staff would be given this role to test and debug the game, hence the term JMOD (Jagex Mod). Also on official infrastructure, JMOD's would be required to log in through a custom authentication server for security reasons. 

For a full list of commands users can run based on the permissions given, consult the [2009scape commands page](https://2009scape.org/site/game_guide/the_commands.html).

On our server we made every player an JMOD because we wanted on-demand access to the in-game bank and the ability to teleport to other players/specific locations. The decision of what permissions to give users will come down to how many people are playing on the server and how you want the gameplay experience to be.

If you are the operator of the server, I recommend you make your player account an JMOD (unless there is an authenticity/accountability reason not to, in which I suggest you make a secondary account with JMOD). You can use the following SQL query on your 2009scape database to make a specific user an administrator:

```
UPDATE members SET rights = 2 WHERE username = "<Username To Make Admin>";
```

These are the possible values you can set in the rights field:

| Normal Player | 0 |
| PMOD          | 1 | 
| JMOD          | 2 |

Do note that permissions don't apply realtime, so if you are actively logged into the game server and change permissions then you need to logout and login again to refresh your client.Do note that permissions don't apply realtime, so if you are actively logged into the game server and change permissions then you need to logout and login again to refresh your client.

If you want to edit specific attributes of a player, like what's in their inventory, then check out the `Game Configurations` part of this document. 

### Client plugins

On the 2009scape GitLab page, you can find a [project consisting of various java plugins](https://gitlab.com/2009scape/tools/client-plugins) for the 2009scape client.

To install plugins into a client, ensure you have a folder called `plugins` beside the 2009scape client executable (the .jar file). When installing the plugin, you must have both the `.class` and `.properties` files. Here is a list of plugins I recommend adding, especially for private servers:

* **AudioQoL by Ceikry** - This plugin adds quality of life features for audio.
* **BasicInputQoL by Ceikry** - This plugin adds quality of life features for controls, one of my favorites being the middle-click camera pan.
* **Craftify by Bushtail** - This plugin will place nameplates above users heads, so you know who you're standing next to in the game. 
* **EscClose by Chisato** - This plugin will let you close menus by pressing the escape key rather than clicking the `X` button.
* **TabReply by Ceikry** - This plugin lets you reply to private messages by pressing tab. 

### What about the management server?

From what I can determine from a [pull request](https://gitlab.com/2009scape/2009scape/-/commit/2045143378cc66c4ba6c0c900aef15aaa582ac73) that has a commit literally called `Rip Out Management Server`, the management server is no longer present in the code anymore.

*"World server now handles its own management-server-related functionality, a new management server will be written in the future to facilitate cross-world event syncing. World server now runs standalone, this requires the client to be configured to connect the world server port for the world list (world list was previously supplied by the management server on port 5555, which should be swapped to the world server port that is generally 43595 for world 1) work is in progress to update client launchers to make this as seamless as possible."*

## Extra stuff

### Client distribution

If you are looking to distribute fully configured clients to those who want to play, you can use a web server of your choice to host a simple website off the server that offers a zip file containing fully configured clients. If you are using phpMyAdmin then you will already have the Apache2 web server installed. You will just need to make a new site configuration and build the web page.

Numerous elements can be stripped out of the clients to reduce file size, and I was able to get both the RSC+ client and 2009scape client down to a combined zip file with a total size of 20mb. 
