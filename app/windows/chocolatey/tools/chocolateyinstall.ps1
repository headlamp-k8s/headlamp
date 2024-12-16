$ErrorActionPreference = 'Stop'; # stop on all errors
$toolsDir   = "$(Split-Path -parent $MyInvocation.MyCommand.Definition)"
$headlampVersion = '0.27.0'
$url = "https://github.com/headlamp-k8s/headlamp/releases/download/v${headlampVersion}/Headlamp-${headlampVersion}-win-x64.exe"
$checksum = 'b94dec3f29b0024a694e140ec0a343e8143d147f352fde095eda4908e141035d'

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
