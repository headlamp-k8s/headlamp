$ErrorActionPreference = 'Stop'; # stop on all errors
$toolsDir   = "$(Split-Path -parent $MyInvocation.MyCommand.Definition)"
$headlampVersion = '0.25.1'
$url = "https://github.com/headlamp-k8s/headlamp/releases/download/v${headlampVersion}/Headlamp-${headlampVersion}-win-x64.exe"
$checksum = '990f6a020fff1187384f4055771345a084f640c95a3979232fa199e94f5dcc55'

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
