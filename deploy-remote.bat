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

echo Stopping existing game_box service...
REM 查找并停止在3000端口运行的进程（Next.js默认端口）
for /f "tokens=5" %%a in ('netstat -ano ^| findstr :3000') do (
    echo Stopping process ID: %%a
    taskkill /f /pid %%a >nul 2>&1
)

echo Starting service with npm...
start /b npm start
if errorlevel 1 (
    echo ERROR: Failed to start service with npm
    exit /b 1
)

echo Waiting for service to start...
timeout /t 5 /nobreak >nul

echo Checking if service is running on port 3000...
netstat -ano | findstr :3000 >nul
if errorlevel 1 (
    echo WARNING: No process found listening on port 3000
) else (
    echo Service is running successfully on port 3000
    netstat -ano | findstr :3000
)

echo ========================================
echo Deployment completed successfully!
echo Completion time: %date% %time%
echo =======================================

REM 如果是本地运行，添加暂停以便查看结果
if "%1"=="local" (
    echo.
    echo Press any key to exit...
    pause >nul
)