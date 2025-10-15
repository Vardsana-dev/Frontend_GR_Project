# ===============================
# 🧹 NX Creations - Clean Project Script
# ===============================
Write-Host "🧼 Cleaning Next.js project cache and unnecessary files..." -ForegroundColor Cyan

# --- Step 1: Define paths ---
$projectPath = "D:\CSC\csc-po-department"
Set-Location $projectPath

# --- Step 2: List of folders to delete ---
$folders = @(
    ".next",
    "node_modules",
    ".turbo",
    ".vercel"
)

# --- Step 3: Delete folders ---
foreach ($folder in $folders) {
    if (Test-Path $folder) {
        Write-Host "🗑 Removing folder: $folder" -ForegroundColor Yellow
        Remove-Item -Recurse -Force $folder
    } else {
        Write-Host "✅ $folder not found, skipping..."
    }
}

# --- Step 4: Delete lock files ---
$files = @(
    "package-lock.json",
    "yarn.lock",
    "pnpm-lock.yaml"
)

foreach ($file in $files) {
    if (Test-Path $file) {
        Write-Host "🗑 Removing file: $file" -ForegroundColor Yellow
        Remove-Item -Force $file
    } else {
        Write-Host "✅ $file not found, skipping..."
    }
}

# --- Step 5: Finish ---
Write-Host "`n🎉 Clean complete! Project is ready for packaging or sending to production." -ForegroundColor Green
Pause
