# 🚀 Setup Rápido - API Login con PostgreSQL
# Este script configura todo el entorno en un solo comando

param(
    [switch]$SkipBuild,
    [switch]$Quiet,
    [switch]$Help
)

if ($Help) {
    Write-Host @"
🚀 Setup Rápido - API Login con PostgreSQL

USAGE:
    .\quick-setup.ps1 [OPTIONS]

OPTIONS:
    -SkipBuild      Saltar la construcción de dependencias npm
    -Quiet          Modo silencioso (menos output)
    -Help           Mostrar esta ayuda

EXAMPLES:
    .\quick-setup.ps1                    # Setup completo
    .\quick-setup.ps1 -SkipBuild        # Solo Docker, sin npm
    .\quick-setup.ps1 -Quiet            # Setup silencioso
"@
    exit 0
}

function Write-Step($message, $color = "Cyan") {
    if (-not $Quiet) {
        Write-Host "🔄 $message" -ForegroundColor $color
    }
}

function Write-Success($message) {
    Write-Host "✅ $message" -ForegroundColor Green
}

function Write-Error($message) {
    Write-Host "❌ $message" -ForegroundColor Red
}

function Write-Warning($message) {
    Write-Host "⚠️  $message" -ForegroundColor Yellow
}

# Verificaciones previas
Write-Step "Verificando prerequisites..."

# Docker
try {
    $dockerVersion = docker --version 2>$null
    if (-not $dockerVersion) { throw "Docker not found" }
    Write-Success "Docker encontrado: $dockerVersion"
}
catch {
    Write-Error "Docker no está instalado o no está disponible"
    Write-Host "Instala Docker Desktop desde: https://www.docker.com/products/docker-desktop/" -ForegroundColor Yellow
    exit 1
}

# Node.js
if (-not $SkipBuild) {
    try {
        $nodeVersion = node --version 2>$null
        if (-not $nodeVersion) { throw "Node not found" }
        Write-Success "Node.js encontrado: $nodeVersion"
    }
    catch {
        Write-Error "Node.js no está instalado"
        Write-Host "Instala Node.js desde: https://nodejs.org/" -ForegroundColor Yellow
        exit 1
    }
}

# Verificar archivo .env
Write-Step "Configurando variables de entorno..."
if (-not (Test-Path ".env")) {
    if (Test-Path ".env.example") {
        Copy-Item ".env.example" ".env"
        Write-Success "Archivo .env creado desde .env.example"
    }
    else {
        Write-Error "No se encontró .env.example"
        exit 1
    }
}
else {
    Write-Success "Archivo .env ya existe"
}

# Instalar dependencias
if (-not $SkipBuild) {
    Write-Step "Instalando dependencias..."
    try {
        if (-not $Quiet) {
            npm install
        }
        else {
            npm install --silent 2>$null
        }
        Write-Success "Dependencias instaladas"
    }
    catch {
        Write-Error "Error instalando dependencias npm"
        exit 1
    }
}

# Verificar/iniciar Docker Desktop
Write-Step "Verificando Docker Desktop..."
try {
    docker info > $null 2>&1
    if ($LASTEXITCODE -ne 0) {
        Write-Warning "Docker Desktop no está corriendo. Iniciando..."
        Start-Process "C:\Program Files\Docker\Docker\Docker Desktop.exe"
        
        Write-Step "Esperando que Docker Desktop se inicie..."
        $timeout = 60
        $elapsed = 0
        do {
            Start-Sleep -Seconds 2
            $elapsed += 2
            docker info > $null 2>&1
            if ($elapsed -gt $timeout) {
                Write-Error "Timeout esperando Docker Desktop"
                exit 1
            }
        } while ($LASTEXITCODE -ne 0)
    }
    Write-Success "Docker Desktop está corriendo"
}
catch {
    Write-Error "Error verificando Docker Desktop"
    exit 1
}

# Iniciar contenedores
Write-Step "Iniciando contenedores PostgreSQL y Redis..."
try {
    if (-not $Quiet) {
        docker compose up -d db redis
    }
    else {
        docker compose up -d db redis > $null 2>&1
    }
    Write-Success "Contenedores iniciados"
}
catch {
    Write-Error "Error iniciando contenedores"
    exit 1
}

# Esperar que estén healthy
Write-Step "Esperando que los servicios estén listos..."
$maxWait = 30
$waited = 0

do {
    Start-Sleep -Seconds 2
    $waited += 2
    
    $dbStatus = docker inspect api-login-db --format='{{.State.Health.Status}}' 2>$null
    $redisStatus = docker inspect api-login-redis --format='{{.State.Health.Status}}' 2>$null
    
    if ($dbStatus -eq "healthy" -and $redisStatus -eq "healthy") {
        break
    }
    
    if ($waited -gt $maxWait) {
        Write-Warning "Servicios tardando más de lo esperado, continuando..."
        break
    }
} while ($true)

# Verificar conexión a base de datos
Write-Step "Verificando conexión a PostgreSQL..."
try {
    $result = docker exec api-login-db psql -U postgres -d api_login_dev -c "SELECT COUNT(*) FROM users;" --csv 2>$null
    if ($result) {
        $userCount = ($result -split "`n")[1]
        Write-Success "PostgreSQL conectado - Usuarios en BD: $userCount"
    }
    else {
        Write-Warning "PostgreSQL conectado pero sin datos iniciales"
    }
}
catch {
    Write-Warning "No se pudo verificar la conexión a PostgreSQL directamente"
}

# Mostrar status final
Write-Step "Verificando status de contenedores..."
if (-not $Quiet) {
    docker compose ps
}

Write-Host ""
Write-Host "🎉 Setup completado exitosamente!" -ForegroundColor Green
Write-Host ""
Write-Host "📋 Próximos pasos:" -ForegroundColor Cyan
Write-Host "1. Ejecutar API: " -NoNewline -ForegroundColor White
Write-Host "npm run dev" -ForegroundColor Yellow
Write-Host "2. Probar health: " -NoNewline -ForegroundColor White  
Write-Host "http://localhost:3000/health" -ForegroundColor Yellow
Write-Host "3. Test completo: " -NoNewline -ForegroundColor White
Write-Host ".\test-api.ps1" -ForegroundColor Yellow
Write-Host ""
Write-Host "🔧 Comandos útiles:" -ForegroundColor Cyan
Write-Host "   docker compose ps" -ForegroundColor White
Write-Host "   docker compose logs db" -ForegroundColor White
Write-Host "   docker exec -it api-login-db psql -U postgres -d api_login_dev" -ForegroundColor White
Write-Host ""
Write-Host "📚 Documentación: " -NoNewline -ForegroundColor Cyan
Write-Host "docs/08-docker-commands-guide.md" -ForegroundColor Yellow
Write-Host ""
