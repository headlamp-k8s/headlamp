---
title: Windows Installation
sidebar_label: Windows
sidebar_position: 3
---

Headlamp is available for Windows as a direct download from its [releases page](https://github.com/kubernetes-sigs/headlamp/releases) on GitHub (.exe file) and from package registries
like [Winget](https://learn.microsoft.com/en-us/windows/package-manager/winget/) and [Chocolatey](https://chocolatey.org/).

## Install via Winget

To install Headlamp from the Winget registry, simply run the following command:

```powershell
winget install headlamp
```

### Upgrading

To upgrade Headlamp when its installed with Winget, run the command:

```powershell
winget upgrade headlamp
```

## Install via Chocolatey

To install Headlamp from the Chocolatey registry, first install the choco command by following
its [official instructions](https://chocolatey.org/install#generic).
After `choco` is available, [install Headlamp](https://community.chocolatey.org/packages/headlamp#install) by running the following command:

```powershell
choco install headlamp
```

### Upgrading

To upgrade Headlamp when its installed with Chocolatey, run the command:

```powershell
choco upgrade headlamp
```

## If Windows Defender flags the installer

Windows Defender sometimes reports the Headlamp installer as a trojan. The
installers are code signed and published from the project's own release
workflow, and the reports so far have been false positives from Defender's
heuristics, which installers of this kind are prone to. See
[#8050](https://github.com/kubernetes-sigs/headlamp/issues/8050).

To check that the file you downloaded is the one the project built, look at its
signature:

```powershell
Get-AuthenticodeSignature .\Headlamp-<version>-win-x64.exe | Format-List Status, SignerCertificate
```

`Status` should be `Valid`. You can also check the download against the release
checksums, which are themselves signed, as described in
[Verifying Releases](../verify-releases.md).

If the signature is valid, reporting the detection is what gets it cleared:
send the file to Microsoft through
[Submit a file for malware analysis](https://www.microsoft.com/en-us/wdsi/filesubmission),
as a software developer, saying it is incorrectly detected as malware. Microsoft
updates its definitions once it has reviewed the file, which clears the warning
for everyone rather than only on your machine. It helps to include the detection
name Defender showed, which you can find under Protection history in the Windows
Security app.

## Install via Github Releases

To install Headlamp from its official installer, first download the _.exe_ file for the [latest release](https://github.com/kubernetes-sigs/headlamp/releases/latest)'s assets section (located at the bottom of the section). Then double click the file and follow the installer's instructions.

### Upgrading

To upgrade Headlamp when it's installed directly from its installer, you have to
download the new version of the installer and re-install it. There is no automatic upgrade.

If you install via Chocolatey or Winget they can manage upgrades for you.
