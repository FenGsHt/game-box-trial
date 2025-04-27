@REM use English

@echo off

echo Starting update service...

REM Find and terminate the current running Node.js process
echo Closing existing service...
taskkill /f /im node.exe >nul 2>&1
if %ERRORLEVEL% EQU 0 (
  echo Node.js process has been closed
) else (
  echo No running Node.js process found, or failed to close
)

REM Wait for the process to close completely
timeout /t 2 /nobreak >nul

REM Pull the latest code
echo Pulling the latest code from Git...
git pull
if %ERRORLEVEL% NEQ 0 (
  echo Git pull failed. Please check your network connection or Git configuration.
  pause
  exit /b %ERRORLEVEL%
)

REM Install dependencies (if needed)
echo Installing dependencies...
call npm install
if %ERRORLEVEL% NEQ 0 (
  echo Dependency installation failed.
  pause
  exit /b %ERRORLEVEL%
)

REM Build the project
echo Building the project...
call npm run build
if %ERRORLEVEL% NEQ 0 (
  echo Project build failed.
  pause
  exit /b %ERRORLEVEL%
)

REM Start the service
echo Starting the service...
start cmd /k "npm run start"

echo Service has been successfully updated and restarted!
echo.
echo Press any key to exit...
pause > nul 