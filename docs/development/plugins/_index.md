---
title: Plugins
linkTitle: Plugins
---

Plugins are one of the key features of Headlamp and allow to modify change what and how information is displayed, as well as other functionality. The ultimate goal of the plugins system is to allow vendors to build and deploy Headlamp with extra functionality without having to maintain a fork of the project.

# Developing Plugins

Plugins are supposed to be built and shipped out-of-tree, i.e. instead of managing the plugins'
code within the Headlamp project or a Headlamp fork (which would require
always rebuilding/maintaining Headlamp when changing a plugin), they're
supposed to be built outside of the project and just pointed to by the
Headlamp's server.

*⚠️ IMPORTANT FOR DEVS:* The plugins system and plugins lib is still in the process of being
consolidated. This means that 1) it's subject to change, 2) you are very
welcome to contribute to it with different use cases and/or development.
