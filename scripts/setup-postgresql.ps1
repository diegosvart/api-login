# Setup Local PostgreSQL para API Login
# Este script configura PostgreSQL localmente (sin Docker)

Write-Host "🚀 Setup PostgreSQL Local - API Login" -ForegroundColor Green
Write-Host ""

# Verificar si PostgreSQL está instalado
try {
    $pgVersion = psql --version 2>$null
    if ($pgVersion) {
        Write-Host "✅ PostgreSQL encontrado: $pgVersion" -ForegroundColor Green
    } else {
        throw "PostgreSQL no encontrado"
    }
} catch {
    Write-Host "❌ PostgreSQL no está instalado" -ForegroundColor Red
    Write-Host "Descarga desde: https://www.postgresql.org/download/windows/" -ForegroundColor Yellow
    Write-Host "O instala con Chocolatey: choco install postgresql" -ForegroundColor Yellow
    exit 1
}

Write-Host ""
Write-Host "📋 Configuración sugerida:" -ForegroundColor Cyan
Write-Host "- Host: localhost" -ForegroundColor White
Write-Host "- Port: 5432" -ForegroundColor White
Write-Host "- Database: api_login_dev" -ForegroundColor White
Write-Host "- User: postgres" -ForegroundColor White
Write-Host "- Password: postgres123" -ForegroundColor White
Write-Host ""

$confirm = Read-Host "¿Continuar con la configuración? (y/n)"
if ($confirm -ne 'y' -and $confirm -ne 'Y') {
    Write-Host "Setup cancelado" -ForegroundColor Yellow
    exit 0
}

# Variables de configuración
$DB_NAME = "api_login_dev"
$DB_USER = "postgres"
$DB_PASS = "postgres123"
$INIT_SCRIPT = "./database/init.sql"

Write-Host ""
Write-Host "🔧 Creando base de datos..." -ForegroundColor Cyan

try {
    # Crear base de datos
    $env:PGPASSWORD = $DB_PASS
    $createDb = "CREATE DATABASE $DB_NAME;"
    echo $createDb | psql -h localhost -U $DB_USER -d postgres 2>$null
    
    Write-Host "✅ Base de datos '$DB_NAME' creada" -ForegroundColor Green
    
    # Ejecutar script de inicialización
    if (Test-Path $INIT_SCRIPT) {
        Write-Host "🔄 Ejecutando script de inicialización..." -ForegroundColor Cyan
        psql -h localhost -U $DB_USER -d $DB_NAME -f $INIT_SCRIPT
        Write-Host "✅ Tablas y datos iniciales creados" -ForegroundColor Green
    } else {
        Write-Host "⚠️  Script de inicialización no encontrado: $INIT_SCRIPT" -ForegroundColor Yellow
    }
    
} catch {
    Write-Host "❌ Error configurando base de datos: $_" -ForegroundColor Red
    Write-Host "Verifica que PostgreSQL esté corriendo y las credenciales sean correctas" -ForegroundColor Yellow
    exit 1
}

Write-Host ""
Write-Host "🎯 Configurando archivo .env..." -ForegroundColor Cyan

# Verificar y actualizar .env
if (Test-Path ".env") {
    $envContent = Get-Content ".env"
    $envContent = $envContent -replace "DB_HOST=.*", "DB_HOST=localhost"
    $envContent = $envContent -replace "DB_PORT=.*", "DB_PORT=5432"
    $envContent = $envContent -replace "DB_NAME=.*", "DB_NAME=$DB_NAME"
    $envContent = $envContent -replace "DB_USER=.*", "DB_USER=$DB_USER"
    $envContent = $envContent -replace "DB_PASSWORD=.*", "DB_PASSWORD=$DB_PASS"
    $envContent | Set-Content ".env"
    Write-Host "✅ Archivo .env actualizado" -ForegroundColor Green
} else {
    Write-Host "⚠️  Archivo .env no encontrado, copia desde .env.example" -ForegroundColor Yellow
}

Write-Host ""
Write-Host "🚀 Setup completado exitosamente!" -ForegroundColor Green
Write-Host ""
Write-Host "📝 Próximos pasos:" -ForegroundColor Cyan
Write-Host "1. Verificar configuración: npm run dev" -ForegroundColor White
Write-Host "2. Probar health check: http://localhost:3000/health" -ForegroundColor White
Write-Host "3. Probar registro: POST /api/auth/register" -ForegroundColor White
Write-Host ""
Write-Host "💡 Para conectar manualmente:" -ForegroundColor Yellow
Write-Host "psql -h localhost -U $DB_USER -d $DB_NAME" -ForegroundColor White
Write-Host ""
