Write-Host "========================================================" -ForegroundColor Cyan
Write-Host "  Deploying Pravin Kamble Portfolio to GitHub Pages" -ForegroundColor Cyan
Write-Host "  Target: https://github.com/Pravin-Kamble/Pravin-Kamble.github.io" -ForegroundColor Cyan
Write-Host "========================================================" -ForegroundColor Cyan
Write-Host ""

Set-Location -Path $PSScriptRoot

Write-Host "[1/5] Initializing Git..." -ForegroundColor Yellow
git init

Write-Host "[2/5] Staging files..." -ForegroundColor Yellow
git add .

Write-Host "[3/5] Committing changes..." -ForegroundColor Yellow
git commit -m "Launch Pravin Kamble developer portfolio"

Write-Host "[4/5] Setting main branch & remote..." -ForegroundColor Yellow
git branch -M main
git remote remove origin 2>$null
git remote add origin https://github.com/Pravin-Kamble/Pravin-Kamble.github.io.git

Write-Host "[5/5] Pushing to GitHub..." -ForegroundColor Yellow
git push -u origin main

if ($LASTEXITCODE -eq 0) {
    Write-Host ""
    Write-Host "========================================================" -ForegroundColor Green
    Write-Host "  SUCCESS! Your portfolio is live on GitHub Pages!" -ForegroundColor Green
    Write-Host "  Visit: https://pravin-kamble.github.io" -ForegroundColor Green
    Write-Host "========================================================" -ForegroundColor Green
} else {
    Write-Host ""
    Write-Host "Push completed or requires login. Check output above." -ForegroundColor Red
}

Read-Host -Prompt "Press Enter to exit"
