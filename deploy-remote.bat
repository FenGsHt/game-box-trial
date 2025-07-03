@echo off
chcp 65001 >nul
setlocal enabledelayedexpansion

echo ========================================
echo Starting deployment to Windows server...
echo Current time: %date% %time%
echo ========================================

REM 检查当前目录
echo Current directory: %cd%
echo Current user: %username%

REM 进入项目目录
echo Checking project directory...
if not exist "C:\wwwroot\game_box" (
    echo ERROR: Project directory C:\wwwroot\game_box does not exist
    exit /b 1
)

cd /d "C:\wwwroot\game_box"
echo Successfully entered directory: %cd%

REM Git 检查和操作
echo ========================================
echo Git operations...
git --version >nul 2>&1
if errorlevel 1 (
    echo ERROR: Git is not available
    exit /b 1
)

echo Configuring Git safe directory...
git config --global --add safe.directory "C:\wwwroot\game_box"

echo Checking Git status...
git status
if errorlevel 1 (
    echo ERROR: Git status failed
    exit /b 1
)

echo Current branch: 
git branch --show-current

echo Latest commit:
git log --oneline -1

REM 重置和拉取代码
echo ========================================
echo Resetting local changes...
git reset --hard HEAD
git clean -fd

echo Fetching from origin...
git fetch origin
if errorlevel 1 (
    echo ERROR: Git fetch failed
    exit /b 1
)

echo Pulling latest code...
git pull origin main
if errorlevel 1 (
    echo ERROR: Git pull failed
    git status
    exit /b 1
)

echo After pull commit:
git log --oneline -1

REM 构建项目
echo ========================================
echo Building project...
npm run build
echo Build completed successfully

REM 重启服务
echo ========================================
echo Restarting service...

echo Checking if game_box process exists...
pm2 describe game_box >nul 2>&1
if errorlevel 1 (
    echo game_box process not found, starting fresh...
    pm2 start npm --name "game_box" -- start
    if errorlevel 1 (
        echo ERROR: Failed to start service with PM2
        exit /b 1
    )
    echo Service started successfully
) else (
    echo game_box process found, restarting...
    pm2 restart game_box
    if errorlevel 1 (
        echo PM2 restart failed, trying to start fresh...
        pm2 stop game_box >nul 2>&1
        pm2 delete game_box >nul 2>&1
        pm2 start npm --name "game_box" -- start
        if errorlevel 1 (
            echo ERROR: Failed to start service with PM2
            exit /b 1
        )
    )
    echo Service restarted successfully
)

echo Service status:
pm2 list

echo ========================================
echo Deployment completed successfully!
echo Completion time: %date% %time%
echo ======================================== 