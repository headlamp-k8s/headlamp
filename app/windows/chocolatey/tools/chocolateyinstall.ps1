$ErrorActionPreference = 'Stop'; # stop on all errors
$toolsDir   = "$(Split-Path -parent $MyInvocation.MyCommand.Definition)"
$headlampVersion = '0.22.0'
$url = "https://github.com/headlamp-k8s/headlamp/releases/download/v${headlampVersion}/Headlamp-${headlampVersion}-win-x64.exe"
$checksum = '78a1548a79e2d2b3702b393c5095225c8847eafe853165f8c158dd4538003e14'

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
