---
title: Running in headless mode
linktitle: Headless Mode
weight: 50
---

Some users prefer running Headlamp using the desktop app, but directly in their web browser instead
of the Electron's environment as this allows them to leverage the browser's functionality such as
bookmarks, groups, etc.

Running Headlamp in the system's browser can be done by using the `--headless` CLI option.
Assuming you have already downloaded and installed Headlamp on your desktop, you can run it in headless mode as follows:

Example:

  On Linux: `flatpak run io.kinvolk.Headlamp --headless` (or `./Headlamp.AppImage --headless` for AppImage)

  On MacOS: `./Headlamp --headless`

  On Windows: `./Headlamp.exe --headless`
