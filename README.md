# Sistema AEDD de Autenticación

**API de Autenticación Empresarial** implementada con **Algoritmos y Estructuras de Datos** (AEDD) optimizadas para alta performance y escalabilidad. Desarrollado con Node.js, TypeScript, Express y PostgreSQL, aplicando principios de Clean Architecture y patrones de diseño eficientes.

## Objetivos del Proyecto AEDD

- **Implementar estructuras de datos optimizadas** para manejo de 10,000+ usuarios concurrentes
- **Aplicar algoritmos eficientes** con complejidades O(1) y O(log n) garantizadas
- **Optimizar el rendimiento** mediante índices Hash, B-Trees y GIN especializados
- **Demostrar conceptos AEDD** en arquitectura de producción real
- **Cumplir estándares de seguridad** OWASP Top 10, GDPR e ISO 27001

## Arquitectura del Sistema

### Estructura de Directorios

| Directorio | Propósito | Tecnologías AEDD |
|------------|-----------|------------------|
| [`src/`](./src/) | **Implementaciones AEDD** | Hash Tables, B-Trees, Tries |
| [`tests/`](./tests/) | **Pruebas de Performance** | Benchmarks O(1), O(log n), O(n) |
| [`database/`](./database/) | **Esquemas Optimizados** | Índices especializados PostgreSQL |
| [`scripts/`](./scripts/) | **Scripts de Desarrollo** | Setup y deployment automatizado |

### Características Técnicas

- **Algoritmos Optimizados** - Implementaciones con garantías de complejidad temporal
- **Arquitectura Modular** - Separación clara de responsabilidades y capas
- **Base de Datos Optimizada** - Índices especializados para consultas eficientes  
- **Seguridad Robusta** - JWT, bcrypt, validación de entrada y rate limiting
- **TypeScript Completo** - Tipado estático y validaciones en tiempo de compilación

## Estructuras de Datos Implementadas

### Autenticación y Sesiones - O(1)
- **Hash Tables** → Lookup instantáneo de usuarios por email/username
- **Hash Indexes** → Validación de tokens JWT y sesiones activas
- **HashMap Distribuido** → Rate limiting por IP/usuario con sliding window

### Autorización y Permisos - O(log n)
- **B-Trees** → Jerarquías de roles y consultas por rangos temporales
- **Binary Search Trees** → Resolución eficiente de permisos RBAC
- **Trie Structures** → Pattern matching para permisos granulares

### Auditoría y Monitoreo - O(1) per partition
- **Time-based Partitioning** → Logs particionados por mes automáticamente
- **GIN Indexes** → Búsqueda full-text en metadata JSONB
- **Consistent Hashing** → Distribución de logs para escalabilidad

### Seguridad Avanzada - O(log n)
- **LRU Cache** → Gestión inteligente de sesiones activas
- **Token Bucket Algorithm** → Rate limiting adaptativo
- **Bloom Filters** → Detección rápida de credenciales comprometidas

## Algoritmos de Alto Rendimiento

### Criptografía y Hashing
- **bcrypt** (12 rounds) → Hashing seguro de contraseñas con salt
- **SHA-256** → Integridad de tokens y fingerprinting de dispositivos
- **PBKDF2** → Derivación de claves para MFA y OAuth

### Optimización de Consultas
- **Binary Search** → Búsqueda en estructuras ordenadas O(log n)
- **Hash-based Joins** → Joins eficientes entre tablas relacionadas
- **Index-only Scans** → Consultas que evitan acceso a heap

### Gestión de Memoria
- **Connection Pooling** → Reutilización eficiente de conexiones DB
- **Query Plan Caching** → Optimización automática de planes de ejecución
- **Lazy Loading** → Carga bajo demanda de relaciones complejas

### Algoritmos de Seguridad
- **Constant-time Comparison** → Prevención de timing attacks
- **Exponential Backoff** → Rate limiting inteligente contra brute force
- **CSRF Token Rotation** → Renovación automática de tokens de seguridad

## Métricas de Performance Garantizadas

| Operación | Complejidad | Tiempo Objetivo | Estructura Usada |
|-----------|-------------|-----------------|------------------|
| Login de Usuario | O(1) | < 100ms | Hash Index |
| Validación de Token | O(1) | < 50ms | Hash Table |
| Resolución de Permisos | O(log n) | < 200ms | B-Tree + Cache |
| Búsqueda de Usuario | O(1) | < 75ms | Hash Index |
| Cleanup de Sesiones | O(n) | Background | Batch Processing |
| Auditoría de Cambios | O(1) | < 25ms | Trigger Automático |

## Características de Seguridad

### Autenticación Multi-Factor
- **TOTP** (Time-based One-Time Password) con algoritmo SHA-1
- **SMS/Email** con códigos de 6 dígitos y expiración TTL
- **FIDO2/WebAuthn** para autenticación sin contraseña
- **Backup Codes** con hash SHA-256 para recuperación

### Protección Contra Ataques
- **Rate Limiting** → 100 requests/min por IP, 20 login attempts/hour
- **Account Lockout** → Bloqueo progresivo: 5min → 15min → 1hr → 24hr
- **Session Management** → TTL automático, invalidación concurrente
- **CSRF Protection** → Tokens rotatorios con validación double-submit

---

## Instalación y Configuración

### Prerrequisitos
- **Node.js 18+** → Runtime JavaScript
- **PostgreSQL 15+** → Base de datos
- **Git** → Control de versiones
- **VS Code** → Editor recomendado

### Setup Rápido
```bash
# Clonar repositorio
git clone https://github.com/diegosvart/api-login.git
cd api-login

# Instalar dependencias
npm install

# Configurar variables de entorno
cp .env.example .env
# Editar .env con tus configuraciones

# Ejecutar en desarrollo
npm run dev
```

### Scripts Disponibles
```bash
npm run dev          # Servidor desarrollo con nodemon
npm run build        # Compilar TypeScript a JavaScript
npm run start        # Ejecutar versión compilada
npm test             # Ejecutar tests unitarios
npm run lint         # Verificar código con ESLint
npm run format       # Formatear código con Prettier
```

## API Endpoints

### Autenticación
```
POST /api/auth/register  # Registro de usuarios
POST /api/auth/login     # Autenticación
GET  /api/auth/profile   # Perfil del usuario (protegido)
POST /api/auth/logout    # Cerrar sesión
```

### Health Check
```
GET /api/health          # Estado del servidor
```

### Estructura de Respuesta
```json
{
  "success": true,
  "data": { ... },
  "message": "Operación exitosa"
}
```

## Debugging y Desarrollo

### VS Code Debugging
1. **Ctrl+Shift+D** → Panel de Debug
2. **"Launch Program"** → Iniciar con debugging
3. **Colocar breakpoints** en archivos .ts
4. **F10/F11/F5** para debugging paso a paso

### Testing Manual
- Usar archivos `.http` en `/tests/` para requests de prueba
- Endpoints organizados por funcionalidad
- Headers y payloads de ejemplo incluidos

### Estructura del Código

```
src/
├── controllers/        # Controladores de rutas
├── middleware/         # Middleware personalizado
├── models/            # Modelos de datos
├── routes/            # Definición de rutas
├── services/          # Lógica de negocio
├── types/             # Tipos TypeScript
├── utils/             # Utilidades compartidas
├── validation/        # Esquemas de validación
└── app.ts            # Punto de entrada
```

---

Este proyecto demuestra la aplicación práctica de **Algoritmos y Estructuras de Datos** en un sistema de producción real, combinando conocimiento teórico con implementación de nivel empresarial.
developed by deVmc.