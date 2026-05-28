# Módulo 2 · Feature 3 — SQL, Prisma, Supabase

**Sprint 9 · Node.js + Express · Persistencia con PostgreSQL**

---

## Objetivo

Dar el salto de datos en memoria a una base de datos real. La API del sprint anterior funcionaba con datos temporales que desaparecían al reiniciar el servidor. En este sprint se persisten datos usando **PostgreSQL en Supabase** y **Prisma ORM**.

Conceptos trabajados:

- Conectar una API Node.js + Express a una base de datos real.
- Usar Prisma ORM para interactuar con PostgreSQL.
- Definir el modelo de datos en `schema.prisma`.
- Gestionar credenciales con variables de entorno (`.env`).
- Centralizar el manejo de errores en Express con middlewares.

---

## Stack

| Tecnología   | Versión               |
|--------------|-----------------------|
| Node.js      | 20+ (LTS)             |
| Express      | 5.x                   |
| Prisma ORM   | 7.x                   |
| PostgreSQL   | Supabase              |
| ES Modules   | `"type": "module"`    |

---

## Estructura del proyecto

```
src/
├── config/
│   └── prismaClient.js       # Instancia única de PrismaClient
├── controllers/
│   └── products.controller.js
├── services/
│   └── products.service.js   # Lógica de negocio con Prisma
├── routes/
│   ├── index.routes.js
│   ├── health.routes.js
│   └── products.routes.js
├── middlewares/
│   ├── notFound.js           # Maneja rutas inexistentes
│   ├── errorHandler.js       # Maneja errores globales
│   └── validateProduct.js    # Valida body de productos
├── helpers/
│   └── controllers.response.js
├── app.js
└── server.js

prisma/
├── schema.prisma
└── seed.js                   # Script para poblar la BD con datos iniciales

.env
```

---

## Configuración

### Variables de entorno

Crea un archivo `.env` en la raíz:

```
DATABASE_URL="postgresql://postgres.[USER]:[PASSWORD]@[HOST]:6543/postgres?pgbouncer=true"
DIRECT_URL="postgresql://postgres.[USER]:[PASSWORD]@[HOST]:5432/postgres"
PORT=3000
```

- `DATABASE_URL` → Transaction Pooler (puerto 6543) — usado en runtime por PrismaClient.
- `DIRECT_URL` → Session Pooler (puerto 5432) — usado por los comandos CLI de Prisma.

> El archivo `.env` no debe subirse a GitHub.

### Arrancar el proyecto

```bash
npm install
npm start
```

### Comandos Prisma

```bash
npx prisma generate       # Regenera el cliente tras cambios en el schema
npx prisma db push        # Sincroniza el schema con Supabase
npx prisma db pull        # Introspección: lee el schema real de la BD
npx prisma studio         # Explorador visual de la BD
```

### Seed (datos iniciales)

```bash
node --env-file=.env prisma/seed.js
```

---

## Modelo de datos

```prisma
model Product {
  id          Int      @id @default(autoincrement())
  name        String
  description String?
  price       Float
  stock       Int
  imageUrl    String?
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt

  @@map("products")
}
```

---

## Endpoints

| Método | Ruta                  | Descripción              |
|--------|-----------------------|--------------------------|
| GET    | `/health`             | Estado del servidor      |
| GET    | `/api/products`       | Listar productos         |
| GET    | `/api/products/:id`   | Obtener producto por ID  |
| POST   | `/api/products`       | Crear producto           |
| PUT    | `/api/products/:id`   | Actualizar producto      |
| DELETE | `/api/products/:id`   | Eliminar producto        |

### Body POST / PUT

```json
{
  "name": "string (obligatorio)",
  "price": "number (obligatorio)",
  "description": "string (opcional)",
  "stock": "number (opcional)",
  "imageUrl": "string (opcional)"
}
```

---

## Flujo de errores

Los controladores usan `next(err)` para delegar al middleware `errorHandler`, que centraliza todas las respuestas de error. Express lo identifica por su firma de 4 parámetros: `(err, req, res, next)`.

```js
try {
  // ...
} catch (err) {
  next(err)
}
```

---

## Ejemplos cURL

```bash
# Listar productos
curl http://localhost:3000/api/products

# Crear producto
curl -X POST http://localhost:3000/api/products \
  -H "Content-Type: application/json" \
  -d '{"name":"Gorra Deportiva","price":14.99,"stock":100,"description":"Gorra ajustable"}'

# Actualizar producto
curl -X PUT http://localhost:3000/api/products/1 \
  -H "Content-Type: application/json" \
  -d '{"price":12.99}'

# Eliminar producto
curl -X DELETE http://localhost:3000/api/products/1
```

---

## Checks de autoevaluación

- [ ] `npm start` levanta el servidor sin errores
- [ ] Prisma conecta con Supabase
- [ ] `GET /api/products` devuelve datos de la BD
- [ ] `POST /api/products` crea registros en la BD
- [ ] `PUT /api/products/:id` actualiza registros
- [ ] `DELETE /api/products/:id` elimina registros
- [ ] Los errores se manejan con `errorHandler`

---

## Uso de IA

Durante el sprint usé la IA para:

- **Configuración de Prisma 7**: resolución del error de prepared statements con el pooler de Supabase y elección entre Transaction/Session pooler.
- **Revisión del schema**: definición del modelo `Product` y mapeo a la tabla `products`.
- **Seed**: creación del script para poblar la BD con los datos iniciales del proyecto anterior. El proceso fue: definir los datos en `prisma/seed.js` importando la instancia de `prismaClient.js`, usar `prisma.product.createMany()` con el array de productos (sin `id` ni `createdAt`, que los genera la BD), y ejecutarlo con `node --env-file=.env prisma/seed.js`.
- **README**: generado con ayuda de la IA a partir de las instrucciones del sprint.

Regla aplicada: nada de copiar código sin entenderlo. Cada sugerencia fue leída, ajustada y probada antes de quedar en el proyecto.
