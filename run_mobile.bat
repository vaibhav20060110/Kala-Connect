@echo off
echo ========================================================
echo   kalaSetu (कला सेतु) - Flutter Mobile App Runner
echo ========================================================
echo.

where flutter >nul 2>nul
if %errorlevel% neq 0 (
    echo [NOTICE] Flutter SDK is not currently detected in your system PATH.
    echo.
    echo To run the native Android mobile app on your machine or phone:
    echo 1. Download Flutter SDK from: https://docs.flutter.dev/get-started/install/windows/mobile
    echo 2. Add 'flutter\bin' to your system environment PATH.
    echo 3. Connect your Android phone (with USB debugging) or start Android Studio emulator.
    echo 4. Run this script again: run_mobile.bat
    echo.
    echo In the meantime, the full web application is ready and running at:
    echo http://localhost:5000/demo (with PWA installability and Mobile Phone Demo Mode)
    echo.
    pause
    exit /b 1
)

echo [1/3] Running flutter pub get...
cd frontend
call flutter pub get

echo [2/3] Checking connected devices...
call flutter devices

echo [3/3] Launching kalaSetu Mobile App...
call flutter run

pause
