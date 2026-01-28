@echo off
chcp 65001 >nul
title Trail Guide - Demo Launcher

echo.
echo ╔══════════════════════════════════════════════════════════════╗
echo ║           Trail Guide - Cloudflare Tunnel Demo               ║
echo ╠══════════════════════════════════════════════════════════════╣
echo ║  Frontend: https://trail.ngo-management-hub.com              ║
echo ║  API:      https://trail-api.ngo-management-hub.com          ║
echo ╚══════════════════════════════════════════════════════════════╝
echo.

:: 設定專案路徑
set PROJECT_ROOT=%~dp0..
cd /d "%PROJECT_ROOT%"

:: 確認 .env.cloudflare 存在
if not exist "frontend\.env.cloudflare" (
    echo [ERROR] frontend\.env.cloudflare not found!
    pause
    exit /b 1
)

:: 複製 .env.cloudflare 到 .env.development (Vite 開發時讀取)
echo [1/4] 設定 Cloudflare 環境變數...
copy /Y "frontend\.env.cloudflare" "frontend\.env.development" >nul
echo       Done.

:: 啟動 PostgreSQL (如果用 Docker)
echo [2/4] 檢查 Docker PostgreSQL...
docker ps | findstr trailguide-db >nul 2>&1
if errorlevel 1 (
    echo       Starting PostgreSQL container...
    docker-compose up -d
    timeout /t 3 /nobreak >nul
) else (
    echo       PostgreSQL already running.
)

:: 啟動後端
echo [3/4] 啟動後端 API (Port 5274)...
start "Trail-Guide Backend" cmd /c "cd backend\TrailGuide.API && dotnet run --urls=http://localhost:5274"
timeout /t 5 /nobreak >nul

:: 啟動前端
echo [4/4] 啟動前端 (Port 5174)...
start "Trail-Guide Frontend" cmd /c "cd frontend && npm run dev"
timeout /t 3 /nobreak >nul

echo.
echo ══════════════════════════════════════════════════════════════
echo  服務已啟動！
echo.
echo  本地測試:
echo    Frontend: http://localhost:5174
echo    API:      http://localhost:5274/swagger
echo.
echo  公開網址 (Cloudflare Tunnel):
echo    Frontend: https://trail.ngo-management-hub.com
echo    API:      https://trail-api.ngo-management-hub.com
echo.
echo  測試帳號: test@example.com / Test123!
echo.
echo  注意: 需要另外啟動 Cloudflare Tunnel
echo        執行: cloudflared tunnel run ngo-demo
echo ══════════════════════════════════════════════════════════════
echo.
pause
