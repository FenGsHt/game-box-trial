@echo off
chcp 65001 >nul

echo Starting Game Box Service...
cd /d "C:\wwwroot\game_box"
echo Current directory: %cd%
echo Current time: %date% %time%

call npm start 