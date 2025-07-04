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
call npm run build
echo Build completed successfully

REM 重启服务
echo ========================================
echo Restarting service with PM2...

echo Checking PM2 installation...
pm2 --version >nul 2>&1
if errorlevel 1 (
    echo ERROR: PM2 is not installed or not available
    echo Installing PM2...
    npm install -g pm2
    if errorlevel 1 (
        echo ERROR: Failed to install PM2
        exit /b 1
    )
)

echo PM2 version:
pm2 --version

echo Current PM2 processes:
pm2 list

echo Stopping existing game_box process if exists...
pm2 stop game_box >nul 2>&1
echo Deleting existing game_box process if exists...
pm2 delete game_box >nul 2>&1

echo Creating logs directory...
if not exist "logs" mkdir logs

echo Starting new game_box process with ecosystem config...
pm2 start ecosystem.config.js
if errorlevel 1 (
    echo ERROR: Failed to start service with PM2
    echo Checking PM2 logs...
    pm2 logs game_box --lines 10
    exit /b 1
)

echo Waiting for service to start...
timeout /t 3 >nul

echo Service status:
pm2 list

echo Checking if service is running...
pm2 describe game_box
if errorlevel 1 (
    echo ERROR: Service is not running properly
    echo PM2 logs:
    pm2 logs game_box --lines 20
    exit /b 1
)

echo Service started successfully

echo ========================================
echo Deployment completed successfully!
echo Completion time: %date% %time%
echo =======================================

REM 如果是本地运行，添加暂停以便查看结果1
if "%1"=="local" (
    echo.
    echo Press any key to exit...
    pause >nul
)