# Build a portable, no-Rust Windows distributable of W_Counsel.
# Output: dist\W_Counsel\  (a self-contained folder) and dist\W_Counsel-Setup.zip
# The folder bundles a portable node.exe + node_modules, so end users need NOTHING installed.
$ErrorActionPreference = 'Stop'
$root = $PSScriptRoot
$out  = Join-Path $root 'dist'
# Stage into a build folder (NOT 'dist\W_Counsel', which may be the active shell cwd and thus locked).
$dist = Join-Path $out 'W_Counsel_build'
New-Item -ItemType Directory -Force -Path $dist | Out-Null
# Clear contents in-place (robocopy mirror from an empty dir) so a locked root doesn't block us.
$empty = Join-Path $env:TEMP ('wc_empty_' + $PID)
New-Item -ItemType Directory -Force -Path $empty | Out-Null
robocopy $empty $dist /MIR /NFL /NDL /NJH /NJS /NP | Out-Null
Remove-Item -Recurse -Force $empty

Write-Host "Copying app files..."
$files = @('server.js','policy.js','package.json','package-lock.json','README.md','DEVLOG.md',
           'GET-3D-MODEL.md','W_Counsel.cmd','Install-Shortcut.ps1','Install W_Counsel shortcut.cmd','junshi.ico')
foreach ($f in $files) { $p = Join-Path $root $f; if (Test-Path -LiteralPath $p) { Copy-Item -LiteralPath $p -Destination $dist } }

foreach ($d in @('public','content-template','.vscode')) {
  robocopy (Join-Path $root $d) (Join-Path $dist $d) /E /NFL /NDL /NJH /NJS /NP | Out-Null
}
Write-Host "Copying node_modules (this can take a minute)..."
robocopy (Join-Path $root 'node_modules') (Join-Path $dist 'node_modules') /E /NFL /NDL /NJH /NJS /NP | Out-Null

# prune dev-only crumbs from the shipped figure folder
$zhuge = Join-Path $dist 'public\models\zhuge'
foreach ($junk in @('zhuge.glb.bak','zhuge-alt.glb','_tex','for3d_fullbody.png','body.png')) {
  $jp = Join-Path $zhuge $junk; if (Test-Path -LiteralPath $jp) { Remove-Item -Recurse -Force -LiteralPath $jp }
}

Write-Host "Bundling portable Node..."
$node = (Get-Command node).Source
New-Item -ItemType Directory -Force -Path (Join-Path $dist 'node') | Out-Null
Copy-Item -LiteralPath $node -Destination (Join-Path $dist 'node\node.exe')

Write-Host "Zipping..."
$zip = Join-Path $out 'W_Counsel-Setup.zip'
if (Test-Path $zip) { Remove-Item -Force $zip }
Compress-Archive -Path (Join-Path $dist '*') -DestinationPath $zip

$mb = [math]::Round((Get-Item $zip).Length / 1MB, 1)
Write-Host ("DONE -> " + $zip + "  (" + $mb + " MB)")
$global:LASTEXITCODE = 0
exit 0
