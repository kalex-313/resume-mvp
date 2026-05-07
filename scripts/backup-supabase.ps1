param(
  [string]$OutputDir = "backups/supabase",
  [string]$DbUrl = $env:SUPABASE_DB_URL
)

$ErrorActionPreference = "Stop"

if ([string]::IsNullOrWhiteSpace($DbUrl)) {
  Write-Error "Missing SUPABASE_DB_URL. Copy the database connection string from Supabase Project Settings > Database > Connection string, then set it for this PowerShell session."
}

$timestamp = Get-Date -Format "yyyyMMdd-HHmmss"
$targetDir = Join-Path $OutputDir $timestamp
New-Item -ItemType Directory -Force -Path $targetDir | Out-Null

$schemaFile = Join-Path $targetDir "schema.sql"
$dataFile = Join-Path $targetDir "public-data.sql"

Write-Host "Creating RoleArc Supabase backup in $targetDir"

npx.cmd supabase db dump --db-url "$DbUrl" --schema public --file "$schemaFile"
npx.cmd supabase db dump --db-url "$DbUrl" --schema public --data-only --file "$dataFile"

Write-Host "Backup complete:"
Write-Host "  $schemaFile"
Write-Host "  $dataFile"
Write-Host ""
Write-Host "Keep this folder private. It may contain resume content and user-related data."
