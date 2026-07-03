@echo off
REM ============================================================
REM  AI Solopreneur OS - one-click Windows setup
REM  Prereq: a Claude Pro account (minimum) + VS Code with the
REM  Claude Code extension. This script does NOT install those;
REM  it prepares the folder and opens it for you.
REM  Modeled on the W_Counsel app launcher pattern.
REM ============================================================
title AI Solopreneur OS - setup
cd /d "%~dp0"

echo.
echo   AI Solopreneur OS - setup
echo   -------------------------

REM --- 1. create your local .env from the template (first run only) ---
if not exist ".env" (
  copy /Y ".env.example" ".env" >nul
  echo   [ok] created .env from .env.example  (fill it in only if you wire connectors)
) else (
  echo   [ok] .env already exists - left untouched
)

REM --- 2. open the OS folder in VS Code if the 'code' CLI is available ---
where code >nul 2>nul
if %errorlevel%==0 (
  echo   [ok] opening this folder in VS Code...
  start "" code "%~dp0"
) else (
  echo   [i ] VS Code 'code' command not found on PATH.
  echo       Open VS Code yourself, then: File ^> Open Folder ^> this folder.
)

echo.
echo   Next steps
echo   ----------
echo   1. In VS Code, install the "Claude Code" extension and sign in (Claude Pro min).
echo   2. Open this folder, then run:   /start-day      (or say "onboard me")
echo   3. Fill onboarding\intake.md so the OS speaks in your voice.
echo.
echo   The OS runs on your Claude Code login - no API key needed for normal use.
echo.
pause
