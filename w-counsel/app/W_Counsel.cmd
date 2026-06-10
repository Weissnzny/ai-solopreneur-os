@echo off
title W_Counsel
cd /d "%~dp0"

REM --- use bundled Node if present (packaged build), else system Node (dev) ---
set "NODE=node"
if exist "%~dp0node\node.exe" set "NODE=%~dp0node\node.exe"

REM --- dev only: install deps if missing AND no bundled node_modules ---
if not exist "node_modules\@anthropic-ai" (
  echo Installing dependencies, first run only...
  call npm install
)

REM --- start the server only if port 5174 is not already serving ---
powershell -NoProfile -Command "try{$c=New-Object Net.Sockets.TcpClient;$c.Connect('127.0.0.1',5174);$c.Close()}catch{exit 1}"
if errorlevel 1 (
  echo Starting W_Counsel server...
  start "W_Counsel server" /min "%NODE%" server.js
)

REM --- wait until the server answers ---
powershell -NoProfile -Command "for($i=0;$i -lt 40;$i++){try{$c=New-Object Net.Sockets.TcpClient;$c.Connect('127.0.0.1',5174);$c.Close();break}catch{Start-Sleep -Milliseconds 400}}"

REM --- open as a standalone APP WINDOW (no tabs / no address bar). Edge first
REM     (WebView2 engine keeps Web Speech mic working), then Chrome, else browser ---
set "EDGE=%ProgramFiles(x86)%\Microsoft\Edge\Application\msedge.exe"
set "CHROME=%ProgramFiles%\Google\Chrome\Application\chrome.exe"
if exist "%EDGE%" (
  start "" "%EDGE%" --app=http://localhost:5174 --window-size=1280,860
) else if exist "%CHROME%" (
  start "" "%CHROME%" --app=http://localhost:5174 --window-size=1280,860
) else (
  start "" "http://localhost:5174"
)
