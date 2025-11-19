# Script untuk auto start Backend dan Frontend
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  Perpustakaan Layanan Digital Starter" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Get the script directory
$scriptPath = Split-Path -Parent $MyInvocation.MyCommand.Path
$backendPath = Join-Path $scriptPath "backend"
$frontendPath = Join-Path $scriptPath "frontend"

# Function to check if port is in use
function Test-Port {
    param($port)
    $connection = Test-NetConnection -ComputerName localhost -Port $port -InformationLevel Quiet -WarningAction SilentlyContinue
    return $connection
}

# Function to kill process on port
function Stop-ProcessOnPort {
    param($port)
    $process = Get-NetTCPConnection -LocalPort $port -ErrorAction SilentlyContinue | Select-Object -ExpandProperty OwningProcess -Unique
    if ($process) {
        Write-Host "Menghentikan proses pada port $port..." -ForegroundColor Yellow
        Stop-Process -Id $process -Force -ErrorAction SilentlyContinue
        Start-Sleep -Seconds 2
    }
}

# Check and stop existing processes
Write-Host "[1/5] Memeriksa port yang digunakan..." -ForegroundColor Green
if (Test-Port 5000) {
    Write-Host "Port 5000 sedang digunakan. Menghentikan proses..." -ForegroundColor Yellow
    Stop-ProcessOnPort 5000
}
if (Test-Port 5173) {
    Write-Host "Port 5173 sedang digunakan. Menghentikan proses..." -ForegroundColor Yellow
    Stop-ProcessOnPort 5173
}
if (Test-Port 5174) {
    Write-Host "Port 5174 sedang digunakan. Menghentikan proses..." -ForegroundColor Yellow
    Stop-ProcessOnPort 5174
}

Write-Host ""
Write-Host "[2/5] Memeriksa instalasi dependencies..." -ForegroundColor Green

# Check backend dependencies
if (-not (Test-Path (Join-Path $backendPath "node_modules"))) {
    Write-Host "Installing backend dependencies..." -ForegroundColor Yellow
    Set-Location $backendPath
    npm install
}

# Check frontend dependencies
if (-not (Test-Path (Join-Path $frontendPath "node_modules"))) {
    Write-Host "Installing frontend dependencies..." -ForegroundColor Yellow
    Set-Location $frontendPath
    npm install
}

Write-Host ""
Write-Host "[3/5] Memulai Backend Server..." -ForegroundColor Green
Set-Location $backendPath
Start-Process powershell -ArgumentList "-NoExit", "-Command", "Write-Host '=== BACKEND SERVER ===' -ForegroundColor Cyan; npm run dev"

Write-Host "Menunggu backend server siap..." -ForegroundColor Yellow
Start-Sleep -Seconds 5

Write-Host ""
Write-Host "[4/5] Memulai Frontend Server..." -ForegroundColor Green
Set-Location $frontendPath
Start-Process powershell -ArgumentList "-NoExit", "-Command", "Write-Host '=== FRONTEND SERVER ===' -ForegroundColor Magenta; npm run dev"

Write-Host ""
Write-Host "[5/5] Server berhasil dimulai!" -ForegroundColor Green
Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "Backend:  http://localhost:5000" -ForegroundColor Green
Write-Host "Frontend: http://localhost:5173" -ForegroundColor Magenta
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "Tekan tombol apa saja untuk menutup window ini..." -ForegroundColor Yellow
Write-Host "(Server akan tetap berjalan di window terpisah)" -ForegroundColor Yellow
$null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")
