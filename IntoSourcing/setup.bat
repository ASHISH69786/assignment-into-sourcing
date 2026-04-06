@echo off
REM Purchase Order System - Windows Setup Script

setlocal enabledelayedexpansion

echo ======================================
echo Purchase Order System - Setup Script
echo ======================================
echo.

REM Check Java
echo Checking prerequisites...
java -version >nul 2>&1
if %errorlevel% neq 0 (
    echo X Java is not installed. Please install Java 21 or higher.
    pause
    exit /b 1
)

REM Check Maven
mvn -version >nul 2>&1
if %errorlevel% neq 0 (
    echo X Maven is not installed. Please install Maven 3.9.0 or higher.
    pause
    exit /b 1
)

echo.
echo Build backend...
call mvn clean package -DskipTests
if %errorlevel% neq 0 (
    echo X Build failed
    pause
    exit /b 1
)

echo.
echo Starting backend application...
start java -jar target\purchase-order-system-1.0.0.jar

REM Wait for backend to start
timeout /t 5 /nobreak

echo.
echo Setting up frontend...
cd frontend
call npm install --silent
if %errorlevel% neq 0 (
    echo X npm install failed
    pause
    exit /b 1
)

echo.
echo Starting frontend...
start npm start
cd ..

echo.
echo ======================================
echo System is ready!
echo ======================================
echo Frontend: http://localhost:3000
echo Backend:  http://localhost:8080/api
echo.
echo Close this window when done.
pause

