# Test básico de conexión PostgreSQL
# Este script prueba la conexión sin iniciar el servidor completo

Write-Host "🔍 Test de Conexión PostgreSQL" -ForegroundColor Green
Write-Host ""

# Cargar variables del .env
if (Test-Path ".env") {
    Get-Content ".env" | ForEach-Object {
        if ($_ -match "^([^#][^=]*?)=(.*)$") {
            [Environment]::SetEnvironmentVariable($matches[1], $matches[2], "Process")
        }
    }
    Write-Host "✅ Variables .env cargadas" -ForegroundColor Green
} else {
    Write-Host "❌ Archivo .env no encontrado" -ForegroundColor Red
    exit 1
}

# Variables de conexión
$DB_HOST = $env:DB_HOST
$DB_PORT = $env:DB_PORT
$DB_NAME = $env:DB_NAME
$DB_USER = $env:DB_USER
$DB_PASS = $env:DB_PASSWORD

Write-Host "📋 Configuración de conexión:" -ForegroundColor Cyan
Write-Host "Host: $DB_HOST" -ForegroundColor White
Write-Host "Port: $DB_PORT" -ForegroundColor White
Write-Host "Database: $DB_NAME" -ForegroundColor White
Write-Host "User: $DB_USER" -ForegroundColor White
Write-Host ""

# Test de conexión
Write-Host "🔄 Probando conexión..." -ForegroundColor Cyan

try {
    $env:PGPASSWORD = $DB_PASS
    $result = psql -h $DB_HOST -p $DB_PORT -U $DB_USER -d $DB_NAME -c "SELECT NOW() as current_time, version();" --csv 2>$null
    
    if ($LASTEXITCODE -eq 0) {
        Write-Host "✅ Conexión exitosa!" -ForegroundColor Green
        Write-Host ""
        Write-Host "📊 Información del servidor:" -ForegroundColor Cyan
        echo $result
        
        # Test de tablas
        Write-Host ""
        Write-Host "🔍 Verificando tablas..." -ForegroundColor Cyan
        $tables = psql -h $DB_HOST -p $DB_PORT -U $DB_USER -d $DB_NAME -c "\dt" --csv 2>$null
        if ($tables) {
            Write-Host "✅ Tablas encontradas:" -ForegroundColor Green
            echo $tables
        } else {
            Write-Host "⚠️  No se encontraron tablas" -ForegroundColor Yellow
        }
        
    } else {
        throw "Error de conexión"
    }
    
} catch {
    Write-Host "❌ No se pudo conectar a PostgreSQL" -ForegroundColor Red
    Write-Host "Verifica que:" -ForegroundColor Yellow
    Write-Host "1. PostgreSQL esté corriendo" -ForegroundColor White
    Write-Host "2. Las credenciales sean correctas" -ForegroundColor White
    Write-Host "3. La base de datos exista" -ForegroundColor White
    exit 1
}

Write-Host ""
Write-Host "🎯 Todo listo para ejecutar: npm run dev" -ForegroundColor Green
Write-Host ""
