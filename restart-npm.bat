@echo off
chcp 65001 >nul
echo ========================================
echo 重启 Game Box 服务 (使用 npm)
echo ========================================

cd /d "C:\wwwroot\game_box"
echo 当前目录: %cd%

echo 停止现有的 Node.js 进程...
taskkill /f /im node.exe >nul 2>&1
taskkill /f /im npm.cmd >nul 2>&1

echo 等待进程完全停止...
timeout /t 3 >nul

echo 检查端口 3000 是否可用...
netstat -an | findstr :3000 >nul
if not errorlevel 1 (
    echo 端口 3000 仍在使用中，强制释放...
    for /f "tokens=5" %%a in ('netstat -ano ^| findstr :3000 ^| findstr LISTENING') do (
        echo 终止进程 ID: %%a
        taskkill /f /pid %%a >nul 2>&1
    )
    timeout /t 2 >nul
)

echo 启动服务...
start /b call npm start

echo 等待服务启动...
timeout /t 8 >nul

echo 检查服务状态...
netstat -an | findstr :3000
if errorlevel 1 (
    echo 错误: 服务未在端口 3000 上运行
    echo 当前 Node.js 进程:
    tasklist | findstr node.exe
    pause
    exit /b 1
) else (
    echo 成功: 服务已在端口 3000 上运行
)

echo ========================================
echo 重启完成!
echo ========================================

if "%1"=="wait" (
    pause
) 