
!# Notes

!## Last Edited: December 2nd, 2025

## 2025:

Nothing yet. 

## 2024:

#DROP# Asset Guidelines For Homepage

**Footer Icons:**

Footer icons must follow these rules:

* Must be grayscaled (`Filter > Adjust > Desaturate > Lightness`).
* NOTE: If the logo is not colored (eg: pure black) then color adjustments can be applied. Target color is as follows:
    * `#7d7d7d`.
    * `rgb(125, 125, 125)`.
    * From pitch black, `hsl(0, 0%, 49%)`.
    * Must be exported in .png.
    * Must be 250x250 pixels.

It is recommended that images are edited with Krita.

#PORD#
#DROP# Open Rename Computer (Advanced) through RUN

* Press `WINDOWS + R`.
* Enter `sysdm.cpl` and press enter.

#PORD#
#DROP# Linux - Enable TTY Serial Connection

* Run `lsusb` and `ls -l /dev/` to find the device to host serial connection.
* Run `sudo systemctl start getty@tty[DEVICE-ID].service` to start serial connection.
* Run `sudo systemctl enable getty@tty[DEVICE-ID].service` to let serial connection run on boot.
* Run `sudo systemctl status getty@tty[DEVICE-ID].service` to get serial connection status.

#PORD#
#DROP# Python - Iterate Amount of Times Per Second

```
import time
framerate = 5
fpsCalc = (1 / (framerate / 100)) / 100
while True:
    print("Test")
    time.sleep(fpsCalc)
```

#PORD#
#DROP# Linux Manual Partitioning With Disk Encryption

[Check tutorial on ertugrulharman.com](https://ertugrulharman.com/en/2017/09/06/how-to-install-debian-alongside-windows-dual-boot-with-full-disk-encryption/)

#PORD#
#DROP# Tmux - Simple Usage

* Tmux is started by typing `tmux` into the terminal.
* To split pane horizontally, press `CTRL + A/B` then `"`.
* To split pane vertically, press `CTRL + A/B` then `%`.
* To select a different pane, press `CTRL + A/B` then press the arrow key in the direction to select.
* The command `exit` will close a pane.
* If the terminal in a specific pane is hanging or unresponsive, the keybind to kill a single pane that is currently selected in tmux is `CTRL + A/B` then `X`. When prompted, press `Y`.

#PORD#