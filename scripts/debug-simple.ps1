# Script para debugging simple
Write-Host "Stopping existing Node processes..." -ForegroundColor Yellow
Get-Process node -ErrorAction SilentlyContinue | Stop-Process -Force -ErrorAction SilentlyContinue

Write-Host "Starting debug server with Node.js inspect..." -ForegroundColor Green

# Usar node directamente con --inspect y --require ts-node/register
$env:NODE_ENV="development"
$env:TS_NODE_PROJECT="./tsconfig.json"

# Ejecutar con node --inspect y ts-node/register
node --inspect=0.0.0.0:9229 --require ts-node/register src/app.ts
