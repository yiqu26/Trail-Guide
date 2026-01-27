@echo off
echo ================================================
echo   Trail Guide - 資料庫設定
echo ================================================
echo.
echo 請在 SSMS 中執行以下 SQL 腳本：
echo.
echo   1. database\001_create_database.sql
echo   2. database\002_seed_data.sql
echo.
echo 腳本位置: %~dp0..\database\
echo.
echo 或使用 sqlcmd 執行：
echo   sqlcmd -S localhost -E -i "%~dp0..\database\001_create_database.sql"
echo   sqlcmd -S localhost -E -i "%~dp0..\database\002_seed_data.sql"
echo.
pause
