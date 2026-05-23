# Módulo 2 · Feature 2 — Controladores, Servicios y CRUD completo

**Sprint 8 · Node.js + Express · Arquitectura por capas**

---

> **Nota sobre IDs:** El enunciado define los IDs de producto como `string` (`id: '1'`). En este proyecto se usa `number` (`id: 1`) por coherencia con las operaciones numéricas (comparaciones, generación de siguiente ID) y porque es el tipo más habitual antes de introducir una base de datos real.

---

## Objetivo

Evolucionar la API del sprint anterior incorporando una arquitectura profesional basada en capas:

- Separar responsabilidades entre rutas, controladores y servicios.
- Implementar el CRUD completo para el recurso `products`.
- Gestionar validaciones básicas y errores HTTP correctamente.
- Mantener el formato de respuesta estándar en JSON.

---

## Stack

| Tecnología | Versión |
|------------|---------|
| Node.js    | 20+ (LTS) |
| Express    | 5.x     |
| ES Modules | `"type": "module"` en `package.json` |

---

## Estructura del proyecto

```
src/
├── controllers/
│   └── products.controller.js   # Valida entrada, llama al servicio, devuelve respuesta
├── services/
│   └── products.service.js      # Lógica de negocio y manipulación de datos
├── db/
│   └── products.js              # Datos en memoria (mock data)
├── helpers/
│   └── response.js              # Helpers ok() y fail() para respuestas estándar
├── routes/
│   ├── index.routes.js          # Punto de entrada de rutas + 404/500 global
│   ├── health.routes.js         # Ruta de diagnóstico del servidor
│   └── products.routes.js       # Endpoints de productos → conecta con controller
├── app.js                       # Configuración de Express (middlewares + rutas)
└── server.js                    # Arranque del servidor (listen)
```

**Separación de responsabilidades:**

- `routes/` define los endpoints. Sin lógica de negocio.
- `controllers/` valida la entrada y coordina la respuesta.
- `services/` contiene toda la lógica de negocio.

---

## Arrancar el proyecto

```bash
npm install
npm start
```

El servidor arranca en `http://localhost:3000` con recarga automática (`--watch`).

---

## Endpoints

| Método | Ruta                  | Descripción                        |
|--------|-----------------------|------------------------------------|
| GET    | `/health`             | Estado del servidor                |
| GET    | `/api/products`       | Listar todos los productos         |
| GET    | `/api/products/:id`   | Obtener un producto por ID         |
| POST   | `/api/products`       | Crear un producto                  |
| PUT    | `/api/products/:id`   | Actualizar un producto             |
| DELETE | `/api/products/:id`   | Eliminar un producto               |
| —      | cualquier otra ruta   | 404 en formato JSON estándar       |

### Body POST / PUT

```json
{
  "name": "string (obligatorio)",
  "price": "number (obligatorio, >= 0)",
  "description": "string (opcional)",
  "stock": "number (opcional)",
  "imageUrl": "string (opcional)"
}
```

### Códigos HTTP

| Caso                  | Código |
|-----------------------|--------|
| Producto creado       | 201    |
| Datos inválidos       | 400    |
| Producto no encontrado | 404   |

---

## Formato de respuesta estándar

**Éxito**
```json
{ "ok": true, "data": { ... } }
```

**Error**
```json
{ "ok": false, "error": { "message": "..." } }
```

---

## Ejemplos cURL

**Health check**
```bash
curl http://localhost:3000/health
```

**Listar productos**
```bash
curl http://localhost:3000/api/products
```

**Obtener producto por ID**
```bash
curl http://localhost:3000/api/products/1
```

**Producto no encontrado (404)**
```bash
curl http://localhost:3000/api/products/999
```

**Crear producto**
```bash
curl -X POST http://localhost:3000/api/products \
  -H "Content-Type: application/json" \
  -d '{"name":"Gorra Deportiva","price":14.99}'
```

**Actualizar producto**
```bash
curl -X PUT http://localhost:3000/api/products/1 \
  -H "Content-Type: application/json" \
  -d '{"name":"Camiseta Premium","price":24.99}'
```

**Eliminar producto**
```bash
curl -X DELETE http://localhost:3000/api/products/1
```

**Validación fallida (400)**
```bash
curl -X POST http://localhost:3000/api/products \
  -H "Content-Type: application/json" \
  -d '{"description":"Sin nombre ni precio"}'
```

---

## Checks de autoevaluación

- [ ] `npm start` levanta el servidor sin errores
- [ ] `GET /health` → `{ ok: true, data: { ... } }`
- [ ] `GET /api/products` → `{ ok: true, data: [ ... ] }`
- [ ] `GET /api/products/1` → `{ ok: true, data: { ... } }`
- [ ] `GET /api/products/999` → 404 con `{ ok: false, error: { message: "..." } }`
- [ ] `POST /api/products` con body válido → 201 con producto creado
- [ ] `POST /api/products` sin `name` o `price` → 400
- [ ] `PUT /api/products/1` actualiza el producto
- [ ] `DELETE /api/products/1` elimina el producto
- [ ] Ruta inexistente → 404 en JSON estándar

---

## Uso de IA

Durante el sprint usé la IA para:

- **Revisión de arquitectura**: consulté las responsabilidades de cada capa (routes / controllers / services) y qué errores evitar.
- **Revisión de validaciones**: revisé qué casos de error cubrir en POST y PUT.
- **Readme (`README.md`)**: generado con ayuda de la IA a partir de las instrucciones del sprint.

Regla aplicada: nada de copiar código sin entenderlo. Cada sugerencia fue leída, ajustada y probada antes de quedar en el proyecto.
