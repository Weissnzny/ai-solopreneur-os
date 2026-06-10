# Creates a double-clickable desktop shortcut "军师.app" that launches W_Counsel.
# Portable: uses this folder's own path, so anyone who has the app installed can run it.
$ErrorActionPreference = 'Stop'
$app = $PSScriptRoot
$desktop = [Environment]::GetFolderPath('Desktop')
# WScript.Shell.Save() is ANSI-bound and mangles non-Latin names, so save to an
# ASCII path first, then rename to 军师.app via .NET (Unicode-safe).
$tmp   = Join-Path $desktop 'W_Counsel.app.lnk'
$final = Join-Path $desktop ([string]([char]0x519B + [char]0x5E08) + '.app.lnk')  # 军师.app.lnk

$ws = New-Object -ComObject WScript.Shell
$s = $ws.CreateShortcut($tmp)
$s.TargetPath       = Join-Path $app 'W_Counsel.cmd'
$s.WorkingDirectory = $app
$s.IconLocation     = (Join-Path $app 'junshi.ico') + ',0'
$s.WindowStyle      = 7   # minimized
$s.Description      = 'W_Counsel - voice and 3D war-counsel, linked to your Claude Code account'
$s.Save()

if (Test-Path -LiteralPath $final) { Remove-Item -LiteralPath $final -Force }
Move-Item -LiteralPath $tmp -Destination $final -Force
Write-Host ("Created desktop shortcut: " + $final)
