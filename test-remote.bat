@echo off
chcp 65001 >nul

echo ========================================
echo Remote execution test script
echo Current time: %date% %time%
echo ========================================

echo Current directory: %cd%
echo Current user: %username%
echo Computer name: %computername%

echo Checking Git availability...
git --version >nul 2>&1
if errorlevel 1 (
    echo ERROR: Git is not available
) else (
    echo Git is available
    git --version
)

echo Checking Node.js availability...
where node >nul 2>&1
if errorlevel 1 (
    echo Node.js not found in PATH
) else (
    echo Node.js is available
    node --version
)

echo Checking NPM availability...
where npm >nul 2>&1
if errorlevel 1 (
    echo NPM not found in PATH
) else (
    echo NPM is available
    npm --version
)

echo Checking PM2 availability...
where pm2 >nul 2>&1
if errorlevel 1 (
    echo PM2 not found in PATH
) else (
    echo PM2 is available
    pm2 --version
)

echo Checking project directory...
if exist "C:\wwwroot\game_box" (
    echo Project directory exists
    cd /d "C:\wwwroot\game_box"
    echo Current directory after cd: %cd%
    
    if exist ".git" (
        echo Git repository found
        git status
    ) else (
        echo No Git repository found
    )
) else (
    echo ERROR: Project directory does not exist
)

echo ========================================
echo Test completed
echo ======================================== 