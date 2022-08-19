$ErrorActionPreference = 'Stop'; # stop on all errors
$toolsDir   = "$(Split-Path -parent $MyInvocation.MyCommand.Definition)"
$headlampVersion = '0.12.0'
$url = "https://github.com/kinvolk/headlamp/releases/download/v${headlampVersion}/Headlamp-${headlampVersion}-win-x64.exe"
$checksum = '627743ae73df261f88411c1dd68a5d909d5ce70383827bed272e10cc7f1adc79'

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
