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
echo Restarting service with npm...

echo Stopping existing Node.js processes...
taskkill /f /im node.exe >nul 2>&1
taskkill /f /im npm.cmd >nul 2>&1
timeout /t 2 >nul

echo Checking if port 3000 is available...
netstat -an | findstr :3000 >nul
if not errorlevel 1 (
    echo Warning: Port 3000 is still in use, trying to free it...
    for /f "tokens=5" %%a in ('netstat -ano ^| findstr :3000 ^| findstr LISTENING') do (
        echo Killing process %%a
        taskkill /f /pid %%a >nul 2>&1
    )
    timeout /t 3 >nul
)

echo Starting service with npm...
start /b call npm start

echo Waiting for service to start...
timeout /t 10 >nul

echo Checking if service is running...
netstat -an | findstr :3000
if errorlevel 1 (
    echo ERROR: Service is not running on port 3000
    echo Checking for any node processes...
    tasklist | findstr node.exe
    exit /b 1
)

echo Service started successfully on port 3000

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