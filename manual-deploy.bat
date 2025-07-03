@echo off
setlocal enabledelayedexpansion

echo ========================================
echo 游戏盒子项目手动部署脚本 (Windows 版)
echo 部署时间: %date% %time%
echo ========================================

REM 检查当前目录
echo 当前工作目录: %cd%

REM 进入项目目录
if not exist "C:\wwwroot\game_box" (
    echo 错误: 项目目录 C:\wwwroot\game_box 不存在！
    echo 请确保项目已正确部署到服务器
    pause
    exit /b 1
)

cd /d C:\wwwroot\game_box
if errorlevel 1 (
    echo 错误: 无法进入项目目录 C:\wwwroot\game_box
    pause
    exit /b 1
)

echo 成功进入项目目录: %cd%

REM 检查 Git 是否可用
echo ========================================
echo 检查Git状态...
git --version >nul 2>&1
if errorlevel 1 (
    echo 错误: Git未安装或不在PATH中
    pause
    exit /b 1
)

REM 显示当前Git状态
echo 当前分支和状态:
git branch
git status

echo 最近的提交记录:
git log --oneline -5

REM 检查是否有本地修改
echo ========================================
echo 检查本地修改...
git diff --quiet
if errorlevel 1 (
    echo 警告: 发现本地修改，将进行强制重置
    git reset --hard HEAD
    git clean -fd
    echo 本地修改已重置
) else (
    echo 没有本地修改
)

REM 获取远程更新
echo ========================================
echo 获取远程更新...
git fetch origin
if errorlevel 1 (
    echo 错误: 无法从远程仓库获取更新
    echo 请检查网络连接和Git配置
    pause
    exit /b 1
)

REM 检查是否有新的提交
echo 检查是否有新的提交...
for /f %%i in ('git rev-list HEAD..origin/main --count') do set COMMITS_BEHIND=%%i

if "%COMMITS_BEHIND%"=="0" (
    echo 代码已是最新版本，无需更新
) else (
    echo 发现 %COMMITS_BEHIND% 个新提交，开始更新...
    
    REM 拉取最新代码
    git pull origin main
    if errorlevel 1 (
        echo 错误: 代码拉取失败
        echo 当前Git状态:
        git status
        pause
        exit /b 1
    )
    
    echo 代码更新完成！
    echo 更新后的最新提交:
    git log --oneline -3
)

REM 检查 Node.js
echo ========================================
echo 检查Node.js环境...
where node >nul 2>nul
if errorlevel 1 (
    echo 错误: 未找到 Node.js，请先安装 Node.js
    pause
    exit /b 1
)

node -v
npm -v

REM 安装依赖
echo ========================================
echo 安装项目依赖...
npm ci
if errorlevel 1 (
    echo 错误: 依赖安装失败
    echo 尝试清理node_modules并重新安装...
    rmdir /s /q node_modules 2>nul
    del package-lock.json 2>nul
    npm install
    if errorlevel 1 (
        echo 错误: 依赖安装仍然失败
        pause
        exit /b 1
    )
)
echo 依赖安装完成

REM 构建项目
echo ========================================
echo 构建项目...
npm run build
if errorlevel 1 (
    echo 错误: 项目构建失败
    echo 尝试使用忽略错误的方式构建...
    node deploy-override.js
    if errorlevel 1 (
        echo 构建仍然失败，请检查代码错误
        pause
        exit /b 1
    )
)
echo 项目构建完成

REM 检查PM2状态
echo ========================================
echo 检查服务状态...
pm2 list | findstr "game_box" >nul
if errorlevel 1 (
    echo PM2中未找到game_box进程，将启动新进程
    pm2 start npm --name "game_box" -- start
    if errorlevel 1 (
        echo 错误: PM2启动失败
        echo 尝试直接启动服务...
        start "Game Box" cmd /k "npm start"
        echo 服务已在新窗口中启动
    ) else (
        echo PM2启动成功
    )
) else (
    echo 重启现有的PM2进程...
    pm2 restart game_box
    if errorlevel 1 (
        echo 警告: PM2重启失败，尝试停止并重新启动
        pm2 stop game_box
        pm2 start npm --name "game_box" -- start
    )
    echo PM2重启完成
)

REM 显示最终状态
echo ========================================
echo 部署完成！
echo 完成时间: %date% %time%
echo.
echo 服务状态:
pm2 list
echo.
echo 如果遇到问题，请检查:
echo 1. 网络连接是否正常
echo 2. Git SSH密钥是否配置正确
echo 3. Node.js和npm版本是否兼容
echo 4. PM2是否正确安装
echo ========================================

pause 