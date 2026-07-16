async function printTxt(text, newline) {
    if (newline === undefined) {
        commandText.value = commandText.value + "\n" + text;
    } else {
        commandText.value = commandText.value + text;
    }
}

async function cmdSent() {
    cmd = commandBox.value;
    cmdSplit = commandBox.value.split(" ");
    printTxt("[" + Date.now() + "] > " + cmd)
    commandBox.value = ""
    switch (cmdSplit[0]) {
        case "cls":
            commandText.value = "";
            printTxt("Terminal cleared.");
            break;
        case "help":
            printTxt(`=== Help Menu: ===
* cls:          clears terminal screen.
* help:         shows this menu.
* intro:        read my intro. 
* man:          redirect to blog page. 
* newschool:    get me out of here (returns to professional homepage).
* reloadbanner: grabs a new banner gif (in case the current one bores you).
==================`);
            break;
        case "intro":
            printTxt("••••• GLOBBRUH •••••");
            printTxt("programming | cybersecurity | networking");
            printTxt("I make ■ pegs fit in ● holes.");
            break;
        case "man":
            x = await getDocument(location.origin + "/blog/content.md");
            x = x.split("\n")
            let y = [];
            for (let i = 0; i < x.length; i++) {
                console.log(i)
                console.log(x[i])
                if (x[i].includes("* [")) {
                    var blogName = x[i].split("[")[1].split("]")[0];
                    var blogFile = x[i].split("(")[1].split(")")[0].split("=")[1];
                    y.push([blogName, blogFile]);
                }
            }
            printTxt("MAN - Manuals? Or blog pages...")
            if (cmdSplit[1] !== undefined) {
                for (let i = 0; i < y.length; i++) {
                    if (y[i][1] === cmdSplit[1]) {
                        window.location = location.origin + "/blog?doc=" + cmdSplit[1];
                    }
                }
            }
            printTxt ("Usage: man [blogcode]");
            printTxt ("Blogs in database:")
            for (let i = 0; i < y.length; i++) {
                printTxt("* " + y[i][0] + " (blogcode: " + y[i][1] + ").");
            }
            break;
        case "newschool":
            window.location = location.origin;
            break;
        case "reloadbanner":
            x = await bannerLoader();
            printTxt("New banner loaded!");
            printTxt("Gif URL: " + x);
            break;
        case "":
            break;
        default:
            printTxt("Command not found.");
            break;
    }
    commandText.scrollTop = commandText.scrollHeight;
}

async function searchKey() {
    if (event.key === "Enter") {
        cmdSent();
    }
}

async function loadIn() {
    printTxt("**********\nglObbruhS Terminal v1.0\n**********\nEnter 'help' for help menu.", 1);
}

var commandBox = document.getElementsByTagName("input")[0];
var commandText = document.getElementsByTagName("textarea")[0];
loadIn();