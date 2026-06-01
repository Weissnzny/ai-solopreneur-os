# Creates a double-clickable desktop shortcut "AI Solopreneur OS" that runs setup.cmd.
# Portable: uses this repo's own path, so it works wherever the OS is installed.
# Adapted from the W_Counsel app shortcut pattern (name is ASCII, so no Unicode rename needed).
$ErrorActionPreference = 'Stop'
$repo    = Split-Path -Parent $PSScriptRoot      # repo root (this script lives in scripts/)
$desktop = [Environment]::GetFolderPath('Desktop')
$link    = Join-Path $desktop 'AI Solopreneur OS.lnk'

$ws = New-Object -ComObject WScript.Shell
$s  = $ws.CreateShortcut($link)
$s.TargetPath       = Join-Path $repo 'setup.cmd'
$s.WorkingDirectory = $repo
$s.Description      = 'AI Solopreneur OS - open and set up the OS (runs on your Claude Code account)'
$s.WindowStyle      = 1
$s.Save()

Write-Host ("Created desktop shortcut: " + $link)
