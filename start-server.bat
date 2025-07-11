@echo off
title Travel Account Management System
color 0A
echo.
echo ========================================
echo  Travel Account Management System
echo ========================================
echo.
echo Starting server...
echo.

REM Check if XAMPP PHP exists
if exist "C:\xampp\php\php.exe" (
    echo [INFO] Using XAMPP PHP
    echo [INFO] Make sure XAMPP MySQL is running!
    echo.
    echo [SERVER] Starting on http://localhost:8000
    echo [SETUP]  First time? Go to: http://localhost:8000/php/install.php
    echo [APP]    After setup: http://localhost:8000
    echo.
    echo Press Ctrl+C to stop the server
    echo ========================================
    echo.
    C:\xampp\php\php.exe -S localhost:8000 -t html
) else (
    echo [WARNING] XAMPP PHP not found
    echo [INFO] Trying system PHP...
    echo.
    php -S localhost:8000 -t html
)

echo.
echo Server stopped. Press any key to exit...
pause >nul
