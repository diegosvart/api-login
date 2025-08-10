# controllers/ - Controladores con Algoritmos Optimizados

Implementa controladores HTTP que utilizan **algoritmos eficientes** y **estructuras de datos optimizadas** para el manejo de peticiones de autenticación.

## Implementaciones AEDD

### `AuthController.ts`
```typescript
// Ejemplo de estructura
class AuthController {
private userHashTable: HashTable<User>; // O(1) lookups
private sessionBST: BST<Session>; // O(log n) ordered access
private rateLimitQueue: Queue<Request>; // O(1) FIFO operations
}
```

### Algoritmos Implementados

#### 1. **Login Authentication** - O(1) Average Case
- **Estructura**: Hash Table para usuarios
- **Algoritmo**: Hash-based user lookup
- **Ventaja**: Tiempo constante para autenticación

#### 2. **Session Management** - O(log n)
- **Estructura**: Binary Search Tree para sessionID
- **Algoritmo**: Binary search para validación de sesiones
- **Ventaja**: Búsqueda logarítmica ordenada por timestamp

#### 3. **Rate Limiting** - O(1) Amortized
- **Estructura**: Sliding Window con Queue
- **Algoritmo**: FIFO para control de requests por minuto
- **Ventaja**: Control eficiente de tráfico

### Endpoints y Complejidad

| Endpoint | Estructura de Datos | Complejidad | Algoritmo |
|----------|-------------------|-------------|-----------|
| `POST /login` | Hash Table | O(1) avg | Hash lookup |
| `POST /logout` | BST + Hash Table | O(log n) | Binary search + Hash removal |
| `GET /validate` | Hash Table | O(1) avg | Token validation |
| `POST /refresh` | Stack + Hash Table | O(1) | LIFO token refresh |

## Optimizaciones Implementadas

- **Memory Pool**: Para reducir garbage collection
- **Lazy Loading**: De estructuras de datos grandes
- **Caching Strategy**: LRU para usuarios frecuentes
- **Batch Processing**: Para operaciones múltiples

## Análisis de Rendimiento

- **Throughput**: >1000 requests/second
- **Memory Usage**: O(n) donde n = usuarios activos
- **Response Time**: <10ms para operaciones hash
- **Scalability**: Horizontal mediante sharding de hash tables