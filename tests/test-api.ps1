# Script de pruebas para API Login
# Ejecutar con: .\test-api.ps1

Write-Host "=== API LOGIN TESTS ===" -ForegroundColor Cyan

# Test 1: Health Check
Write-Host "`n1. Health Check..." -ForegroundColor Yellow
try {
    $health = Invoke-RestMethod -Uri "http://localhost:3000/health" -Method GET
    Write-Host "✅ Servidor OK - Status: $($health.status)" -ForegroundColor Green
    Write-Host "   Service: $($health.service) v$($health.version)" -ForegroundColor Green
} catch {
    Write-Host "❌ ERROR: $($_.Exception.Message)" -ForegroundColor Red
    Write-Host "   ¿Está el servidor corriendo? npm run dev" -ForegroundColor Yellow
    exit
}

# Test 2: Register User
Write-Host "`n2. Register User..." -ForegroundColor Yellow
$regData = @{
    username = "testuser$(Get-Date -Format 'mmss')"
    email = "test$(Get-Date -Format 'mmss')@test.com"
    password = "Test123456!"
    firstName = "Test"
    lastName = "User"
} | ConvertTo-Json

try {
    $regResponse = Invoke-RestMethod -Uri "http://localhost:3000/api/auth/register" -Method POST -Body $regData -ContentType "application/json"
    Write-Host "✅ Usuario registrado: $($regResponse.data.user.email)" -ForegroundColor Green
    Write-Host "   Token: $($regResponse.data.token.Substring(0,30))..." -ForegroundColor Green
    $Global:testToken = $regResponse.data.token
    $Global:testEmail = $regResponse.data.user.email
} catch {
    Write-Host "❌ ERROR: $($_.Exception.Message)" -ForegroundColor Red
    if ($_.Exception.Response) {
        $reader = [System.IO.StreamReader]::new($_.Exception.Response.GetResponseStream())
        $errorDetails = $reader.ReadToEnd()
        Write-Host "   Detalles: $errorDetails" -ForegroundColor Yellow
    }
}

# Test 3: Login
Write-Host "`n3. Login..." -ForegroundColor Yellow
$loginData = @{
    email = $Global:testEmail
    password = "Test123456!"
} | ConvertTo-Json

try {
    $loginResponse = Invoke-RestMethod -Uri "http://localhost:3000/api/auth/login" -Method POST -Body $loginData -ContentType "application/json"
    Write-Host "✅ Login exitoso" -ForegroundColor Green
    Write-Host "   Usuario: $($loginResponse.data.user.email)" -ForegroundColor Green
    $Global:testToken = $loginResponse.data.token
} catch {
    Write-Host "❌ ERROR: $($_.Exception.Message)" -ForegroundColor Red
}

# Test 4: Get Profile
Write-Host "`n4. Get Profile..." -ForegroundColor Yellow
$headers = @{
    "Authorization" = "Bearer $Global:testToken"
    "Content-Type" = "application/json"
}

try {
    $profileResponse = Invoke-RestMethod -Uri "http://localhost:3000/api/auth/profile" -Method GET -Headers $headers
    Write-Host "✅ Perfil obtenido correctamente" -ForegroundColor Green
    Write-Host "   Username: $($profileResponse.data.user.username)" -ForegroundColor Green
    Write-Host "   Nombre: $($profileResponse.data.user.firstName) $($profileResponse.data.user.lastName)" -ForegroundColor Green
} catch {
    Write-Host "❌ ERROR: $($_.Exception.Message)" -ForegroundColor Red
    Write-Host "   Token usado: $($Global:testToken.Substring(0,30))..." -ForegroundColor Yellow
}

# Test 5: Update Profile
Write-Host "`n5. Update Profile..." -ForegroundColor Yellow
$updateData = @{
    firstName = "Updated"
    lastName = "Name"
    email = $Global:testEmail
} | ConvertTo-Json

try {
    $updateResponse = Invoke-RestMethod -Uri "http://localhost:3000/api/auth/profile" -Method PUT -Headers $headers -Body $updateData
    Write-Host "✅ Perfil actualizado" -ForegroundColor Green
    Write-Host "   Nuevo nombre: $($updateResponse.data.user.firstName) $($updateResponse.data.user.lastName)" -ForegroundColor Green
} catch {
    Write-Host "❌ ERROR: $($_.Exception.Message)" -ForegroundColor Red
}

# Test 6: Logout
Write-Host "`n6. Logout..." -ForegroundColor Yellow
try {
    $logoutResponse = Invoke-RestMethod -Uri "http://localhost:3000/api/auth/logout" -Method POST -Headers $headers
    Write-Host "✅ Logout exitoso" -ForegroundColor Green
    Write-Host "   Mensaje: $($logoutResponse.message)" -ForegroundColor Green
} catch {
    Write-Host "❌ ERROR: $($_.Exception.Message)" -ForegroundColor Red
}

Write-Host "`n=== TESTS COMPLETADOS ===" -ForegroundColor Cyan
