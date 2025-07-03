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

REM Node.js 环境检查
echo ========================================
echo Checking Node.js environment...

REM 检查 Node.js 是否可用
where node >nul 2>&1
if errorlevel 1 (
    echo Node.js not found in PATH, trying to load NVM...
    
    REM 尝试加载 NVM
    if exist "%USERPROFILE%\.nvm\nvm.exe" (
        echo Loading NVM...
        call "%USERPROFILE%\.nvm\nvm.exe" use 18.15.0
    ) else (
        echo ERROR: Node.js and NVM not found
        exit /b 1
    )
)

echo Node.js version:
node --version
if errorlevel 1 (
    echo ERROR: Node.js command failed
    exit /b 1
)

echo NPM version:
npm --version
if errorlevel 1 (
    echo ERROR: NPM command failed
    exit /b 1
)

REM 安装依赖
echo ========================================
echo Installing dependencies...
npm ci
if errorlevel 1 (
    echo NPM ci failed, trying npm install...
    npm install
    if errorlevel 1 (
        echo ERROR: Failed to install dependencies
        exit /b 1
    )
)
echo Dependencies installed successfully

REM 构建项目
echo ========================================
echo Building project...
npm run build
if errorlevel 1 (
    echo Build failed, trying with override config...
    if exist "deploy-override.js" (
        node deploy-override.js
        if errorlevel 1 (
            echo ERROR: Build failed completely
            exit /b 1
        )
    ) else (
        echo ERROR: Build failed and no override config found
        exit /b 1
    )
)
echo Build completed successfully

REM 重启服务
echo ========================================
echo Restarting service...

REM 检查 PM2 是否可用
where pm2 >nul 2>&1
if errorlevel 1 (
    echo PM2 not found, trying to install globally...
    npm install -g pm2
    if errorlevel 1 (
        echo ERROR: Failed to install PM2
        exit /b 1
    )
)

echo Using PM2 to restart service...
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

echo Service status:
pm2 list

echo ========================================
echo Deployment completed successfully!
echo Completion time: %date% %time%
echo ========================================

pause 