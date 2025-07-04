@echo off
echo Quick PM2 Fix Script
echo ====================

cd /d "C:\wwwroot\game_box"

echo Killing all node processes...
taskkill /f /im node.exe >nul 2>&1
taskkill /f /im npm.cmd >nul 2>&1

echo Cleaning PM2...
pm2 kill >nul 2>&1
pm2 resurrect >nul 2>&1

echo Starting fresh...
pm2 start npm --name "game_box" -- start

echo Status:
pm2 list

echo Logs:
pm2 logs game_box --lines 5

pause 