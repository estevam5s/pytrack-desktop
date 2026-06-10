$ErrorActionPreference = 'Stop'
$version = '1.0.1'
$url = "https://github.com/estevam5s/pytrack-desktop/releases/download/desktop-v$version/PyTrack_${version}_x64-setup.exe"
Install-ChocolateyPackage -PackageName 'pytrack' -FileType 'exe' -SilentArgs '/S' -Url64bit $url
