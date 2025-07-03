@echo off
echo ========================================
echo 游戏盒子项目部署状态检查
echo 检查时间: %date% %time%
echo ========================================

REM 检查项目目录
echo [1] 检查项目目录...
if exist "C:\wwwroot\game_box" (
    echo ✓ 项目目录存在: C:\wwwroot\game_box
    cd /d C:\wwwroot\game_box
) else (
    echo ✗ 项目目录不存在: C:\wwwroot\game_box
    goto :end
)

echo 当前目录: %cd%
echo.

REM 检查Git状态
echo [2] 检查Git状态...
git --version >nul 2>&1
if errorlevel 1 (
    echo ✗ Git未安装或不可用
) else (
    echo ✓ Git可用
    echo 当前分支:
    git branch
    echo.
    echo 最新提交:
    git log --oneline -1
    echo.
    echo 工作区状态:
    git status --porcelain
    if errorlevel 1 (
        echo ✗ Git状态检查失败
    ) else (
        echo ✓ Git状态正常
    )
)
echo.

REM 检查Node.js环境
echo [3] 检查Node.js环境...
where node >nul 2>nul
if errorlevel 1 (
    echo ✗ Node.js未安装
) else (
    echo ✓ Node.js已安装
    node -v
    npm -v
)
echo.

REM 检查项目文件
echo [4] 检查项目文件...
if exist "package.json" (
    echo ✓ package.json存在
) else (
    echo ✗ package.json不存在
)

if exist "next.config.js" (
    echo ✓ next.config.js存在
) else (
    echo ✗ next.config.js不存在
)

if exist ".next" (
    echo ✓ 构建目录(.next)存在
) else (
    echo ✗ 构建目录(.next)不存在 - 可能需要重新构建
)

if exist "node_modules" (
    echo ✓ node_modules存在
) else (
    echo ✗ node_modules不存在 - 需要安装依赖
)
echo.

REM 检查PM2状态
echo [5] 检查PM2服务状态...
pm2 --version >nul 2>&1
if errorlevel 1 (
    echo ✗ PM2未安装
) else (
    echo ✓ PM2已安装
    pm2 --version
    echo.
    echo PM2进程列表:
    pm2 list
    echo.
    pm2 list | findstr "game_box" >nul
    if errorlevel 1 (
        echo ✗ 未找到game_box进程
    ) else (
        echo ✓ game_box进程正在运行
        echo game_box进程详情:
        pm2 show game_box
    )
)
echo.

REM 检查端口占用
echo [6] 检查端口占用...
netstat -an | findstr ":3000" >nul
if errorlevel 1 (
    echo ✗ 端口3000未被占用 - 服务可能未启动
) else (
    echo ✓ 端口3000被占用 - 服务可能正在运行
)
echo.

REM 检查最近的部署日志
echo [7] 检查PM2日志...
if exist "%USERPROFILE%\.pm2\logs\game_box-out.log" (
    echo ✓ 找到PM2输出日志
    echo 最近的日志内容:
    powershell "Get-Content '%USERPROFILE%\.pm2\logs\game_box-out.log' -Tail 10"
) else (
    echo ✗ 未找到PM2输出日志
)

if exist "%USERPROFILE%\.pm2\logs\game_box-error.log" (
    echo ✓ 找到PM2错误日志
    echo 最近的错误日志:
    powershell "Get-Content '%USERPROFILE%\.pm2\logs\game_box-error.log' -Tail 5"
) else (
    echo ✗ 未找到PM2错误日志
)
echo.

:end
echo ========================================
echo 检查完成！
echo.
echo 建议操作:
echo 1. 如果Git状态异常，运行: git reset --hard HEAD
echo 2. 如果缺少依赖，运行: npm ci
echo 3. 如果缺少构建，运行: npm run build
echo 4. 如果服务未启动，运行: pm2 start npm --name "game_box" -- start
echo 5. 查看完整日志: pm2 logs game_box
echo ========================================
pause 