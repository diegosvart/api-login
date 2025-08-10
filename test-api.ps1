# Test rápido de la API con PostgreSQL
# Este script prueba las funcionalidades principales

Write-Host "🧪 Testing API Login con PostgreSQL" -ForegroundColor Green
Write-Host ""

$baseUrl = "http://localhost:3000"

# Test 1: Health Check
Write-Host "1️⃣  Testing Health Check..." -ForegroundColor Cyan
try {
    $health = Invoke-RestMethod -Uri "$baseUrl/health" -Method GET
    Write-Host "✅ Health Check OK" -ForegroundColor Green
    Write-Host "   Database: $($health.database)" -ForegroundColor White
    Write-Host "   Status: $($health.status)" -ForegroundColor White
}
catch {
    Write-Host "❌ Health Check Failed: $_" -ForegroundColor Red
    exit 1
}

Write-Host ""

# Test 2: Registro de Usuario
Write-Host "2️⃣  Testing User Registration..." -ForegroundColor Cyan
$userData = @{
    username  = "testuser_$(Get-Date -Format 'yyyyMMdd_HHmmss')"
    email     = "test_$(Get-Date -Format 'yyyyMMdd_HHmmss')@example.com"
    password  = "TestPassword123!"
    firstName = "Test"
    lastName  = "User"
} | ConvertTo-Json

try {
    $registerResponse = Invoke-RestMethod -Uri "$baseUrl/api/auth/register" -Method POST -Body $userData -ContentType "application/json"
    Write-Host "✅ User Registration OK" -ForegroundColor Green
    Write-Host "   User ID: $($registerResponse.user.id)" -ForegroundColor White
    Write-Host "   Email: $($registerResponse.user.email)" -ForegroundColor White
    
    # Guardar datos para login
    $testEmail = ($userData | ConvertFrom-Json).email
    $testPassword = ($userData | ConvertFrom-Json).password
    
}
catch {
    Write-Host "❌ Registration Failed: $_" -ForegroundColor Red
    Write-Host "Probando con usuario existente..." -ForegroundColor Yellow
    $testEmail = "test@example.com"
    $testPassword = "defaultpassword"
}

Write-Host ""

# Test 3: Login
Write-Host "3️⃣  Testing User Login..." -ForegroundColor Cyan
$loginData = @{
    email    = $testEmail
    password = $testPassword
} | ConvertTo-Json

try {
    $loginResponse = Invoke-RestMethod -Uri "$baseUrl/api/auth/login" -Method POST -Body $loginData -ContentType "application/json"
    Write-Host "✅ User Login OK" -ForegroundColor Green
    Write-Host "   Message: $($loginResponse.message)" -ForegroundColor White
    Write-Host "   User: $($loginResponse.user.firstName) $($loginResponse.user.lastName)" -ForegroundColor White
}
catch {
    Write-Host "❌ Login Failed: $_" -ForegroundColor Red
    Write-Host "Esto puede ser normal si el usuario de prueba no existe" -ForegroundColor Yellow
}

Write-Host ""

# Verificar datos en base de datos
Write-Host "4️⃣  Checking Database..." -ForegroundColor Cyan
try {
    $userCount = docker exec -it api-login-db psql -U postgres -d api_login_dev -t -c "SELECT COUNT(*) FROM users;" 2>$null
    if ($userCount) {
        Write-Host "✅ Database Connection OK" -ForegroundColor Green
        Write-Host "   Total Users: $($userCount.Trim())" -ForegroundColor White
    }
}
catch {
    Write-Host "⚠️  Could not check database directly" -ForegroundColor Yellow
}

Write-Host ""
Write-Host "🎉 Tests Completed!" -ForegroundColor Green
Write-Host ""
Write-Host "💡 Para más pruebas detalladas:" -ForegroundColor Cyan
Write-Host "   - Usa VS Code REST Client con files en /tests/" -ForegroundColor White
Write-Host "   - O prueba manualmente: $baseUrl/api/auth/register" -ForegroundColor White
Write-Host ""
