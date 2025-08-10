# Scripts - Automatización y Utilidades

## **QUÉ SE DEFINIÓ INICIALMENTE**

### **Scripts de Automatización Planificados**
Herramientas para acelerar desarrollo y debugging:
- **Debug scripts** - Inicio rápido en modo debug
- **Database scripts** - Migrations y seeding
- **Testing scripts** - Automated testing
- **Deployment scripts** - Production setup
- **Utility scripts** - Maintenance tasks

---

## **QUÉ ESTÁ IMPLEMENTADO**

### ** Scripts Actuales**
```
scripts/
├── debug-setup.ps1 Debug server setup avanzado
└── debug-simple.ps1 Debug startup rápido
```

### ** Debug Scripts Funcionales**

#### **debug-simple.ps1** - Quick Debug Start
```powershell
node --inspect=0.0.0.0:9229
ts-node/register para TypeScript
Proceso single-command para debugging
Compatible con VS Code debugger
```

**Uso:**
```powershell
# Iniciar debug server
.\scripts\debug-simple.ps1

# Output esperado:
# Debugger listening on ws://0.0.0.0:9229/...
# API Server running on port 3000
```

#### **debug-setup.ps1** - Advanced Debug Configuration
```powershell
Environment variables setup
Port checking y cleanup
Process management
Error handling avanzado
```

**Uso:**
```powershell
# Setup completo de debug environment
.\scripts\debug-setup.ps1

# Verifica puertos, configura variables, inicia server
```

---

## **QUÉ FALTA POR IMPLEMENTAR**

### ** Prioridad Alta (Esta Semana)**

#### **1. Database Management Scripts**
```powershell
# scripts/db-setup.ps1
# FALTA: Database initialization
param(
[string]$Environment = "development"
)

# Setup PostgreSQL with Docker
# Run migrations
# Seed initial data
```

```powershell
# scripts/db-migrate.ps1
# FALTA: Migration management
param(
[ValidateSet("up", "down", "fresh")]
[string]$Action = "up"
)

# Execute migrations
# Rollback migrations
# Fresh database setup
```

#### **2. Testing Automation Scripts**
```powershell
# scripts/test-runner.ps1
# FALTA: Comprehensive testing
param(
[ValidateSet("unit", "integration", "all", "coverage")]
[string]$TestType = "all"
)

# Run specific test suites
# Generate coverage reports
# Performance benchmarks
```

#### **3. Environment Setup Scripts**
```powershell
# scripts/env-setup.ps1
# FALTA: Environment configuration
param(
[ValidateSet("development", "staging", "production")]
[string]$Environment = "development"
)

# Generate .env files
# Validate configuration
# Setup secrets management
```

### ** Prioridad Media (Próximo Sprint)**

#### **4. Performance Monitoring Scripts**
```powershell
# scripts/performance-monitor.ps1
# FALTA: System monitoring
# Monitor API response times
# Track memory usage
# Generate performance reports
```

#### **5. Security Audit Scripts**
```powershell
# scripts/security-audit.ps1
# FALTA: Security validation
# npm audit
# dependency vulnerability check
# OWASP security scan
```

#### **6. Backup and Recovery Scripts**
```powershell
# scripts/backup-db.ps1
# FALTA: Database backup automation
# Automated daily backups
# Point-in-time recovery
# Backup validation
```

---

## **Plan de Implementación**

### **Semana 1: Database Scripts**
- [ ] **db-setup.ps1** - PostgreSQL initialization
- [ ] **db-migrate.ps1** - Migration management
- [ ] **db-seed.ps1** - Test data seeding
- [ ] **db-backup.ps1** - Backup automation

### **Semana 2: Testing & Validation**
- [ ] **test-runner.ps1** - Automated testing
- [ ] **performance-monitor.ps1** - Benchmarking
- [ ] **security-audit.ps1** - Security validation
- [ ] **env-setup.ps1** - Environment management

### **Semana 3: Production & Deployment**
- [ ] **build-production.ps1** - Production builds
- [ ] **deploy.ps1** - Deployment automation
- [ ] **health-check.ps1** - System validation
- [ ] **log-analyzer.ps1** - Log analysis

---

## **Scripts por Categoría**

### ** Development Scripts**

| Script | Propósito | Estado | Comando |
|--------|-----------|--------|---------|
| **debug-simple.ps1** | Quick debug start | Funcional | `.\scripts\debug-simple.ps1` |
| **debug-setup.ps1** | Advanced debug setup | Funcional | `.\scripts\debug-setup.ps1` |
| **dev-watch.ps1** | Development with hot reload | Pendiente | `.\scripts\dev-watch.ps1` |

### ** Database Scripts**

| Script | Propósito | Estado | Comando |
|--------|-----------|--------|---------|
| **db-setup.ps1** | Database initialization | Pendiente | `.\scripts\db-setup.ps1` |
| **db-migrate.ps1** | Migration management | Pendiente | `.\scripts\db-migrate.ps1 -Action up` |
| **db-seed.ps1** | Test data seeding | Pendiente | `.\scripts\db-seed.ps1` |
| **db-backup.ps1** | Automated backups | Pendiente | `.\scripts\db-backup.ps1` |

### ** Testing Scripts**

| Script | Propósito | Estado | Comando |
|--------|-----------|--------|---------|
| **test-runner.ps1** | Run all tests | Pendiente | `.\scripts\test-runner.ps1 -TestType all` |
| **test-performance.ps1** | Performance benchmarks | Pendiente | `.\scripts\test-performance.ps1` |
| **test-security.ps1** | Security validation | Pendiente | `.\scripts\test-security.ps1` |

### ** Utility Scripts**

| Script | Propósito | Estado | Comando |
|--------|-----------|--------|---------|
| **env-setup.ps1** | Environment configuration | Pendiente | `.\scripts\env-setup.ps1 -Environment dev` |
| **clean-build.ps1** | Clean build artifacts | Pendiente | `.\scripts\clean-build.ps1` |
| **log-analyzer.ps1** | Log analysis | Pendiente | `.\scripts\log-analyzer.ps1` |

---

## **Configuración de Scripts**

### **Variables de Entorno para Scripts**
```powershell
# scripts/config.ps1
$Global:ProjectConfig = @{
DatabaseUrl = $env:DATABASE_URL ?? "postgresql://localhost:5432/authdb"
NodePort = $env:PORT ?? 3000
DebugPort = $env:DEBUG_PORT ?? 9229
Environment = $env:NODE_ENV ?? "development"
LogLevel = $env:LOG_LEVEL ?? "debug"
}
```

### **Funciones Comunes**
```powershell
# scripts/common/functions.ps1
function Write-ProjectLog {
param([string]$Message, [string]$Level = "INFO")
$timestamp = Get-Date -Format "yyyy-MM-dd HH:mm:ss"
Write-Host "[$timestamp] [$Level] $Message" -ForegroundColor Green
}

function Test-DatabaseConnection {
# FALTA: Test PostgreSQL connectivity
}

function Stop-ProjectProcesses {
# FALTA: Clean process shutdown
}
```

---

## **Script Performance Metrics**

### **Tiempos de Ejecución Objetivo**

| Script | Tiempo Objetivo | Actual | Optimización |
|--------|-----------------|--------|-------------|
| **debug-simple.ps1** | < 5s | ~3s | Optimizado |
| **debug-setup.ps1** | < 10s | ~7s | Optimizado |
| **db-setup.ps1** | < 30s | N/A | Pendiente |
| **test-runner.ps1** | < 60s | N/A | Pendiente |

### **Automation Success Rate**

| Proceso | Success Rate Objetivo | Actual |
|---------|----------------------|--------|
| **Debug startup** | 99% | 95% |
| **Database setup** | 95% | N/A |
| **Test execution** | 98% | N/A |
| **Environment setup** | 90% | N/A |

---

## **Error Handling en Scripts**

### **Patrones de Manejo de Errores**
```powershell
# Template para error handling robusto
try {
# Script logic
Write-ProjectLog "Starting operation..." "INFO"

# Validation
if (-not (Test-Path $ConfigFile)) {
throw "Configuration file not found: $ConfigFile"
}

# Main operation
Start-Operation

Write-ProjectLog "Operation completed successfully" "SUCCESS"
}
catch {
Write-ProjectLog "ERROR: $($_.Exception.Message)" "ERROR"
Write-ProjectLog "Stack trace: $($_.ScriptStackTrace)" "DEBUG"
exit 1
}
finally {
# Cleanup
Stop-ProjectProcesses
}
```

---

## **Integration con VS Code**

### **Tasks Integration**
```json
// .vscode/tasks.json integration
{
"label": "Debug Server Start",
"type": "shell",
"command": ".\\scripts\\debug-simple.ps1",
"group": "build"
}
```

---

*Última actualización: Agosto 10, 2025*
*Estado: Debug scripts funcionales, DB y testing scripts pendientes*

### debug-setup.ps1
Advanced debug setup script with additional configuration.
- More comprehensive setup options
- Includes environment validation
- Alternative debug configuration method

## Usage

For quick debugging, use:
```powershell
.\scripts\debug-simple.ps1
```

Then attach VS Code debugger or use the configured launch profiles in `.vscode/launch.json`.