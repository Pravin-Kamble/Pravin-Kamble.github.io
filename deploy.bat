@echo off
title Deploying Portfolio to GitHub Pages...
echo ========================================================
echo   Deploying Pravin Kamble Portfolio to GitHub Pages
echo   Target: https://github.com/Pravin-Kamble/Pravin-Kamble.github.io
echo ========================================================
echo.

cd /d "%~dp0"

echo [1/5] Initializing Git...
git init

echo [2/5] Staging files...
git add .

echo [3/5] Committing changes...
git commit -m "Launch Pravin Kamble developer portfolio"

echo [4/5] Setting main branch and remote origin...
git branch -M main
git remote remove origin 2>nul
git remote add origin https://github.com/Pravin-Kamble/Pravin-Kamble.github.io.git

echo [5/5] Pushing to GitHub...
git push -u origin main

echo.
if %ERRORLEVEL% EQU 0 (
    echo ========================================================
    echo   SUCCESS! Your portfolio has been pushed to GitHub.
    echo   Visit: https://pravin-kamble.github.io in ~60 seconds!
    echo ========================================================
) else (
    echo ========================================================
    echo   Push failed or requires login. Check the message above.
    echo ========================================================
)
echo.
pause
