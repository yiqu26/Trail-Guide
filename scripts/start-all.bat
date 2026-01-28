@echo off
echo ================================================
echo   Trail Guide - 步道導覽系統
echo   啟動所有服務
echo ================================================
echo.

:: 啟動後端 API
echo [1/2] 啟動後端 API (Port 5274)...
start "Trail Guide API" cmd /k "cd /d %~dp0..\backend\TrailGuide.API && dotnet run --urls=http://localhost:5274"

:: 等待後端啟動
timeout /t 3 /nobreak > nul

:: 啟動前端
echo [2/2] 啟動前端 (Port 5174)...
start "Trail Guide Frontend" cmd /k "cd /d %~dp0..\frontend && npm run dev"

echo.
echo ================================================
echo   服務啟動中...
echo.
echo   後端 API: http://localhost:5274
echo   Swagger:  http://localhost:5274/swagger
echo   前端:     http://localhost:5174
echo ================================================
echo.
pause
