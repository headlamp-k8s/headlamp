$ErrorActionPreference = 'Stop'; # stop on all errors
$toolsDir   = "$(Split-Path -parent $MyInvocation.MyCommand.Definition)"
$headlampVersion = '0.14.0'
$url = "https://github.com/kinvolk/headlamp/releases/download/v${headlampVersion}/Headlamp-${headlampVersion}-win-x64.exe"
$checksum = 'bcc0c30e7111c417d1460d9c5ceb70ee1a45d67c8a0c8c5b639caf9247057311'

$packageArgs = @{
  packageName   = $env:ChocolateyPackageName
  unzipLocation = $toolsDir
  fileType      = 'EXE'
  url           = $url

  softwareName  = 'headlamp*' #part or all of the Display Name as you see it in Programs and Features. It should be enough to be unique

  checksum      = $checksum
  checksumType  = 'sha256'

  silentArgs   = '/S'
  validExitCodes= @(0)
}

Install-ChocolateyPackage @packageArgs
