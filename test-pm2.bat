@echo off
chcp 65001 >nul
setlocal enabledelayedexpansion

echo ========================================
echo Testing PM2 operations...
echo Current time: %date% %time%
echo ========================================

cd /d "C:\wwwroot\game_box"
echo Current directory: %cd%

echo Testing PM2 installation...
pm2 --version
if errorlevel 1 (
    echo ERROR: PM2 not found, installing...
    npm install -g pm2
    if errorlevel 1 (
        echo ERROR: Failed to install PM2
        exit /b 1
    )
)

echo Current PM2 status:
pm2 status

echo Testing npm start...
echo Starting process in background...
start /b npm start
timeout /t 5 >nul

echo Checking if port 3000 is in use...
netstat -an | findstr :3000

echo Testing PM2 with game_box...
pm2 stop game_box >nul 2>&1
pm2 delete game_box >nul 2>&1

echo Starting with PM2...
pm2 start npm --name "game_box" -- start

echo Waiting 5 seconds...
timeout /t 5 >nul

echo PM2 Status:
pm2 list

echo PM2 Describe:
pm2 describe game_box

echo Recent logs:
pm2 logs game_box --lines 20

echo ========================================
echo Test completed
echo ========================================

pause 