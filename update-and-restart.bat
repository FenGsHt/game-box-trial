@echo off
echo 开始更新服务...

REM 查找并终止当前运行的Node.js进程
echo 正在关闭现有服务...
taskkill /f /im node.exe >nul 2>&1
if %ERRORLEVEL% EQU 0 (
  echo Node.js进程已关闭
) else (
  echo 没有发现正在运行的Node.js进程，或关闭失败
)

REM 等待进程完全关闭
timeout /t 2 /nobreak >nul

REM 拉取最新代码
echo 正在从Git拉取最新代码...
git pull
if %ERRORLEVEL% NEQ 0 (
  echo Git拉取失败，请检查您的网络连接或Git配置
  pause
  exit /b %ERRORLEVEL%
)

REM 安装依赖（如果需要）
echo 正在安装依赖...
call npm install
if %ERRORLEVEL% NEQ 0 (
  echo 依赖安装失败
  pause
  exit /b %ERRORLEVEL%
)

REM 构建项目
echo 正在构建项目...
call npm run build
if %ERRORLEVEL% NEQ 0 (
  echo 项目构建失败
  pause
  exit /b %ERRORLEVEL%
)

REM 启动服务
echo 正在启动服务...
start cmd /k "npm run start"

echo 服务已成功更新并重启！
timeout /t 5 