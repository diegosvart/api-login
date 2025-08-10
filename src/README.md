# Backend API - Arquitectura y Servicios

## **QUÉ SE DEFINIÓ INICIALMENTE**

### **Arquitectura Backend Planificada**
Sistema de autenticación con **arquitectura en capas** aplicando principios AEDD:
- **Controllers** - Manejo de requests HTTP
- **Services** - Lógica de negocio con algoritmos optimizados
- **Repositories** - Acceso a datos con complejidad O(1)
- **Middleware** - Validación y autenticación
- **Models** - Interfaces TypeScript optimizadas

### **Patrones AEDD Aplicados**
- **Hash Tables** para lookups O(1) de usuarios
- **JWT Stateless** para validación sin BD
- **Bcrypt Hashing** para seguridad de passwords
- **Middleware Stack** para processing pipeline

---

## **QUÉ ESTÁ IMPLEMENTADO**

### ** Estructura Actual**
```
src/
├── app.ts Servidor Express configurado
├── controllers/
│ ├── AuthController.ts Register, Login endpoints
│ └── DebugController.ts Testing utilities
├── middleware/
│ ├── auth.ts JWT verification
│ └── validation.ts Input validation básica
├── models/
│ └── User.ts User interface
├── services/
│ ├── AuthService.ts Business logic
│ └── JwtService.ts Token management
└── routes/
└── auth.ts Auth endpoints routing
```

### ** Servicios Funcionales**

#### **AuthService - Lógica de Autenticación**
```typescript
register(userData) - Crear usuario con hash password
login(email, password) - Validación de credenciales
verifyPassword(plain, hash) - bcrypt comparison O(1)
logout(token) - Invalidación de sesiones
```

#### **JwtService - Gestión de Tokens**
```typescript
generateToken(payload) - Crear JWT con expiración
verifyToken(token) - Validación stateless
extractPayload(token) - Decodificación segura
refreshToken(token) - Renovación de tokens
```

#### **AuthController - HTTP Handlers**
```typescript
POST /api/auth/register - Registro de usuarios
POST /api/auth/login - Autenticación
GET /api/auth/profile - Perfil protegido (JWT)
POST /api/auth/logout - Cerrar sesión
PUT /api/auth/profile - Actualizar perfil
```

---

## **QUÉ FALTA POR IMPLEMENTAR**

### ** Prioridad Alta (Esta Semana)**

#### **1. UserRepository Real**
```typescript
// src/repositories/UserRepository.ts
class UserRepository {
// FALTA: Implementación con PostgreSQL
async create(user: CreateUserDTO): Promise<User>
async findByEmail(email: string): Promise<User | null> // O(1) con hash index
async findById(id: string): Promise<User | null>
async update(id: string, data: UpdateUserDTO): Promise<User>
async delete(id: string): Promise<boolean>
}
```

#### **2. Session Management**
```typescript
// src/services/SessionService.ts
class SessionService {
// FALTA: Gestión completa de sesiones
async createSession(userId: string, token: string): Promise<Session>
async invalidateSession(token: string): Promise<boolean>
async cleanupExpiredSessions(): Promise<number>
async getUserSessions(userId: string): Promise<Session[]>
}
```

#### **3. Input Validation Completa**
```typescript
// src/validation/schemas.ts
export const registerSchema = Joi.object({
// FALTA: Validación robusta
email: Joi.string().email().required(),
password: Joi.string().min(8).pattern(/[A-Z]/, /[0-9]/, /[!@#$%]/).required(),
username: Joi.string().alphanum().min(3).max(30).required()
});
```

### ** Prioridad Media (Próximo Sprint)**

#### **4. Advanced Middleware**
```typescript
// src/middleware/rateLimiter.ts - Sliding Window Algorithm
class RateLimiter {
// FALTA: Rate limiting con Queue FIFO
async checkLimit(ip: string): Promise<boolean> // O(1) con hash + queue
}

// src/middleware/corsAdvanced.ts
// FALTA: CORS dinámico según ambiente
```

#### **5. Error Handling Avanzado**
```typescript
// src/errors/AppError.ts
export class ValidationError extends AppError {
// FALTA: Clases de error categorizadas
constructor(field: string, message: string)
}

export class AuthenticationError extends AppError {
constructor(message: string = 'Invalid credentials')
}
```

#### **6. Performance Monitoring**
```typescript
// src/middleware/performance.ts
class PerformanceTracker {
// FALTA: Métricas de response time
trackRequest(req: Request): void // O(1) insertion
getMetrics(): PerformanceStats // O(1) aggregation
}
```

---

## **Análisis AEDD por Componente**

### **Complejidad Actual vs Objetivo**

| Componente | Operación | Actual | Objetivo | Estado |
|------------|-----------|--------|----------|---------|
| **AuthService** | login() | O(n) mock | O(1) hash | Pendiente |
| **UserRepository** | findByEmail() | O(n) array | O(1) hash | Pendiente |
| **JwtService** | verify() | O(1) stateless | O(1) | Completo |
| **Middleware** | auth check | O(1) JWT | O(1) | Completo |
| **Validation** | input check | O(1) basic | O(1) Joi | Parcial |

### **Estructuras de Datos Implementadas**

#### ** Hash Maps (Implementadas)**
```typescript
// JWT payload como hash map O(1)
const tokenPayload = {
userId: string, // O(1) access
email: string, // O(1) access
exp: number // O(1) access
};
```

#### ** Priority Queue (Pendiente)**
```typescript
// Para rate limiting avanzado
class RequestQueue {
enqueue(request: Request, priority: number): void // O(log n)
dequeue(): Request | null // O(log n)
peek(): Request | null // O(1)
}
```

---

## **Plan de Implementación**

### **Semana 1: Core Backend**
- [ ] **UserRepository** con PostgreSQL
- [ ] **SessionService** completo
- [ ] **Validation schemas** robustos
- [ ] **Error classes** categorizadas

### **Semana 2: Performance & Security**
- [ ] **Rate limiting** con sliding window
- [ ] **Performance monitoring**
- [ ] **Security headers** avanzados
- [ ] **Unit testing** completo

### **Semana 3: Advanced Features**
- [ ] **Refresh token** mechanism
- [ ] **User profile** management
- [ ] **Admin endpoints** básicos
- [ ] **API documentation** completa

---

## **Configuración de Desarrollo**

### **Variables de Entorno Requeridas**
```env
# Database
DATABASE_URL=postgresql://user:pass@localhost:5432/authdb
DB_HOST=localhost
DB_PORT=5432
DB_NAME=authdb
DB_USER=authuser
DB_PASS=authpass

# JWT
JWT_SECRET=your-256-bit-secret
JWT_EXPIRES_IN=24h

# Server
PORT=3000
NODE_ENV=development
CORS_ORIGIN=http://localhost:3000
```

### **Comandos de Desarrollo**
```bash
# Desarrollo con hot reload
npm run dev

# Build TypeScript
npm run build

# Tests
npm run test
npm run test:watch
npm run test:coverage

# Linting
npm run lint
npm run lint:fix
```

---

## **Métricas de Performance Objetivo**

| Endpoint | Response Time | Throughput | Algoritmo |
|----------|---------------|------------|-----------|
| **POST /auth/register** | < 100ms | 50 req/s | Hash insert O(1) |
| **POST /auth/login** | < 50ms | 100 req/s | Hash lookup O(1) |
| **GET /auth/profile** | < 10ms | 500 req/s | JWT verify O(1) |
| **POST /auth/logout** | < 20ms | 200 req/s | Hash delete O(1) |

---

*Última actualización: Agosto 10, 2025*
*Estado: MVP Parcial - Core funcional, Repository pendiente*
- **Compression**: Algoritmos de compresión para respuestas
- **Caching**: LRU Cache implementation

### [`config/`](./config/) - Configuración de Estructuras de Datos
- **Pool de Conexiones**: Usando Queue structures
- **Cache Configuration**: Hash table sizing
- **Memory Management**: Configuración de estructuras optimizadas

## Métricas de Rendimiento Objetivo

- **Login**: O(1) average case con hash tables
- **Token Validation**: O(log n) con BST
- **Session Management**: O(1) con hash maps
- **Rate Limiting**: O(1) amortized con sliding window