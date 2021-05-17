---
title: Linux Installation
linktitle: Linux
weight: 15
---

Currently we ship a Linux desktop application in two formats: [Flatpak](#flatpak), and [AppImage](#appimage).

## Flatpak

[Flatpak](https://flatpak.org/) gives an isolated and bundled way of running Headlamp, with decoupled runtime updates (besides other [benefits](https://en.wikipedia.org/wiki/Flatpak#Features)).

You need to make sure that Flatpak is [installed](https://flatpak.org/setup/) in your Linux distro.

For installing Headlamp as a Flatpak, follow the instructions in its [Flathub page](https://flathub.org/apps/details/io.kinvolk.Headlamp).

For running it, just launch it as usually in your Linux desktop, or run:

```bash
flatpak run io.kinvolk.Headlamp
```

## AppImage

Headlamp can be used as an [AppImage](https://appimage.org/) by downloading and running it directly.

To download, choose the latest AppImage file from the [releases page](https://github.com/kinvolk/headlamp/releases).
You can then run it by doing:

```bash
./Headlamp.AppImage
```
