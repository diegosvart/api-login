# ===================================================
# DEBUG HELPER SCRIPT - API LOGIN  
# ===================================================

Write-Host "Deteniendo cualquier proceso Node.js existente..." -ForegroundColor Yellow
try {
    Get-Process node -ErrorAction SilentlyContinue | Stop-Process -Force -ErrorAction SilentlyContinue
    Write-Host "Procesos Node.js detenidos" -ForegroundColor Green
} catch {
    Write-Host "No habia procesos Node.js ejecutandose" -ForegroundColor Cyan
}

Write-Host ""
Write-Host "INSTRUCCIONES PARA DEBUG:" -ForegroundColor Magenta
Write-Host "===========================================" -ForegroundColor Magenta
Write-Host "1. Ve al panel de Debug de VS Code (Ctrl+Shift+D)" -ForegroundColor White
Write-Host "2. Selecciona 'Debug API Login' en el dropdown" -ForegroundColor White
Write-Host "3. Haz clic en el boton verde de Play para iniciar debugging" -ForegroundColor White
Write-Host "4. Coloca breakpoints en los archivos:" -ForegroundColor White
Write-Host "   * src/middleware/auth.ts (lineas marcadas con BREAKPOINT)" -ForegroundColor Yellow
Write-Host "   * src/controllers/AuthController.ts (metodo profile)" -ForegroundColor Yellow
Write-Host "   * src/routes/auth.ts (linea del middleware)" -ForegroundColor Yellow
Write-Host ""
Write-Host "5. Usa el archivo tests/debug-step-by-step.http para hacer requests" -ForegroundColor White
Write-Host ""
Write-Host "PASOS PARA DEBUGGEAR EL MIDDLEWARE:" -ForegroundColor Green
Write-Host "===========================================" -ForegroundColor Green
Write-Host "1. Pon un breakpoint en linea donde dice 'BREAKPOINT 1'" -ForegroundColor White
Write-Host "2. Inicia el debugger desde VS Code" -ForegroundColor White
Write-Host "3. Haz una peticion POST a /auth/register" -ForegroundColor White
Write-Host "4. Copia el token de la respuesta" -ForegroundColor White
Write-Host "5. Pon breakpoint en 'BREAKPOINT 5' para ver token extraction" -ForegroundColor White
Write-Host "6. Haz peticion GET a /auth/profile con el token copiado" -ForegroundColor White
Write-Host ""
Write-Host "DEBUGGING TIPS:" -ForegroundColor Blue
Write-Host "- Usa F10 (Step Over) para ir linea por linea" -ForegroundColor White
Write-Host "- Usa F11 (Step Into) para entrar en funciones" -ForegroundColor White
Write-Host "- Usa F5 (Continue) para ir al siguiente breakpoint" -ForegroundColor White
Write-Host "- Usa Shift+F5 para detener el debugger" -ForegroundColor White
Write-Host ""
Write-Host "El debugger esta listo. Inicia desde VS Code!" -ForegroundColor Magenta
