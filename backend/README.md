# Backend API - Práctica React/Next.js

## 📋 ¿Qué es este proyecto?

Este es un **backend REST API** diseñado para ser consumido desde una aplicación **React o Next.js**. Proporciona un servidor completo con autenticación JWT para gestionar usuarios y vuelos.

**🎯 Propósito:**

- Backend para tu práctica de frontend (React/Next.js)
- API REST lista para usar con `fetch()`
- Incluye autenticación con JWT
- Base de datos MongoDB
- Todo containerizado con Docker

**💻 Tecnologías:**

- **Express.js** - Framework web
- **TypeScript** - Tipado estático
- **MongoDB** - Base de datos NoSQL
- **Docker** - Containerización

---

## 🚀 Cómo Poner en Marcha el Backend

### Requisitos Previos

- **Docker Desktop** instalado ([Descargar aquí](https://www.docker.com/products/docker-desktop/))
- Git (para clonar el repositorio)

### Pasos de Instalación

#### 1️⃣ Clonar el Repositorio

```bash
git clone <url-del-repositorio>
cd <nombre-del-proyecto>
```

#### 2️⃣ Iniciar los Contenedores con Docker

Desde la raíz del proyecto, ejecuta:

```bash
docker-compose up -d
```

Este comando iniciará:

- 🗄️ **MongoDB** - Base de datos (puerto 27017)
- 🚀 **Backend API** - Servidor Express (puerto 4000)
- 🌐 **Mongo Express** - Interfaz web para ver la BD (puerto 8081)
- ⚛️ **Frontend** - Tu aplicación Next.js (puerto 3000)

#### 3️⃣ Verificar que el Backend Está Funcionando

Abre tu navegador y ve a:

```text
http://localhost:4000/health
```

✅ **Si funciona verás:**

```json
{
  "status": "ok",
  "uptime": 123.45,
  "db": {
    "connected": true
  }
}
```

#### 4️⃣ (Opcional) Ver la Base de Datos

Puedes ver el contenido de MongoDB en:

```text
http://localhost:8081
```

---

## 💻 URLs de la API

### 🌐 Desde el Navegador o Herramientas de Prueba (Postman/Thunder Client)

Cuando pruebes la API desde tu navegador o herramientas como Postman/Thunder Client, usa:

```text
http://localhost:4000
```

**Ejemplo:**

```text
http://localhost:4000/api/v1/auth/register
http://localhost:4000/api/v1/flights
```

### ⚛️ Desde tu Aplicación React/Next.js (Docker)

Cuando tu frontend corre en Docker y necesita comunicarse con el backend (también en Docker), debes usar:

```text
http://host.docker.internal:4000
```

**💡 Esto está configurado en tu archivo `.env.local`:**

```bash
API_BASE_URL=http://host.docker.internal:4000
```

**¿Por qué `host.docker.internal`?**

- `localhost` dentro de un contenedor Docker se refiere al propio contenedor
- `host.docker.internal` es una URL especial que permite que un contenedor acceda a servicios en el host (tu máquina)
- Así el frontend (puerto 3000) puede comunicarse con el backend (puerto 4000)

### 📝 Cómo Usar la Variable de Entorno

En tu código React/Next.js:

```javascript
// Lee la variable de entorno
const API_BASE_URL = process.env.API_BASE_URL || 'http://localhost:4000';

// Úsala en tus peticiones
const response = await fetch(`${API_BASE_URL}/api/v1/auth/register`, {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({ email, password }),
});
```

**🔧 Resumen:**

- **Desde el navegador/Postman**: `http://localhost:4000`
- **Desde código React/Next.js en Docker**: `http://host.docker.internal:4000` (definido en `.env.local`)

---

## 💻 Cómo Consumir la API desde React/Next.js

### Configuración Inicial

En tu aplicación frontend, crea una constante para la URL base:

```javascript
// utils/api.js o config/api.js
export const API_BASE_URL = process.env.API_BASE_URL || 'http://localhost:4000';
```

### Ejemplo con `fetch()` y Context API

```javascript
// Registrar un usuario
const registrarUsuario = async (email, password) => {
  const response = await fetch(`${API_BASE_URL}/api/v1/auth/register`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ email, password }),
  });

  const data = await response.json();
  return data;
};
```

### Gestión de Token JWT

**📌 Nota sobre almacenamiento del token:**

Lo más óptimo en producción es usar una **combinación** de:

- **localStorage/sessionStorage**: Para persistir el token entre recargas de página
- **Context API**: Para gestionar el estado global y compartirlo entre componentes

Sin embargo, para simplificar esta práctica, **usaremos únicamente Context API** para almacenar y gestionar el token en el estado de la aplicación.

---

## 🧪 Herramientas para Probar la API (Opcional)

Antes de integrar la API en tu aplicación React/Next.js, puedes probarla con estas herramientas:

- **[Thunder Client](https://www.thunderclient.com/)** - Extensión de VS Code (recomendado)
- **[Postman](https://www.postman.com/downloads/)** - Aplicación de escritorio
- **[Insomnia](https://insomnia.rest/download)** - Aplicación de escritorio
- **curl** - Desde la terminal

> 💡 **Ver más detalles:** Para información detallada sobre cómo usar estas herramientas, consulta la sección [Opciones Herramientas para Probar la API](#-opciones-herramientas-para-probar-la-api-opcional).

Estas herramientas te permiten hacer peticiones HTTP sin escribir código, útil para:

- ✅ Verificar que la API funciona correctamente
- ✅ Probar endpoints antes de implementarlos en el frontend
- ✅ Debuggear problemas de autenticación o datos

**💡 Nota:** Una vez que compruebes que la API funciona, todas las peticiones las harás desde tu código JavaScript/TypeScript.

---

## 🚀 Estado Inicial de la Base de Datos

**⚠️ IMPORTANTE**: La base de datos está **completamente vacía al inicio**.

Esto significa:

- ❌ No hay usuarios registrados
- ❌ No hay vuelos en el sistema
- ✅ Debes **crear todo desde cero** usando la API

**Primer paso obligatorio:** Registrar un usuario antes de hacer cualquier otra cosa (desde tu aplicación React/Next.js o con una herramienta de prueba).

---

## 📚 Conceptos Básicos para el Frontend

### 🌐 Peticiones HTTP desde JavaScript

Las peticiones HTTP son la forma en que tu aplicación React/Next.js se comunica con este backend.

Es como enviar una carta con instrucciones al servidor. Tiene partes:

1. **Método/Verbo** - Qué quieres hacer:
   - `GET` = Ver/Obtener información (como leer)
   - `POST` = Crear algo nuevo (como escribir)
   - `PUT` = Actualizar algo existente (como editar)
   - `DELETE` = Eliminar algo (como borrar)

2. **URL** - La dirección del endpoint
   - Ejemplo: `http://localhost:4000/api/v1/users`

3. **Headers** - Información extra sobre la petición
   - Ejemplo: `Content-Type: application/json`
   - Para rutas protegidas: `Authorization: Bearer <token>`

4. **Body** - Los datos que envías (solo en POST y PUT)
   - Ejemplo: `{ "email": "test@example.com", "password": "Pass123!" }`

### 🔑 Token JWT en tu Aplicación

El token JWT es como un **ticket de acceso** que obtienes al hacer login:

- Lo guardas en el **Context API** de React (estado global)
- Lo incluyes en el header `Authorization` para rutas protegidas
- Expira después de un tiempo (debes manejar esto en tu app)

### 📦 ¿Qué es JSON?

Es un formato para organizar datos, como una lista de compras estructurada:

```json
{
  "nombre": "Juan",
  "edad": 25,
  "activo": true
}
```

**Reglas importantes:**

- Usa comillas dobles `"` (no simples `'`)
- Los pares son `"clave": "valor"`
- Separa con comas `,`
- Números y booleanos (true/false) van sin comillas

---

## 🛣️ URLs del Backend

### Servidor Local (Backend API)

```text
http://localhost:4000
```

**Puerto 4000** - Tu aplicación React/Next.js hará peticiones a esta URL.

### Base URL para todos los Endpoints

```text
http://localhost:4000/api/v1
```

Todos los endpoints de la API empiezan con esta base.

### Otros Servicios Docker

- **Frontend (Next.js)**: `http://localhost:3000`
- **Mongo Express** (ver BD): `http://localhost:8081`
- **MongoDB**: `localhost:27017` (solo accesible desde los contenedores)

---

## � Referencia Completa de Endpoints

### 1. Registrar Usuario

**`POST /api/v1/auth/register`**

Crea un nuevo usuario en el sistema.

**Headers:**

```json
{
  "Content-Type": "application/json"
}
```

**Body (JSON):**

```json
{
  "name": "Juan Pérez",
  "email": "juan@example.com",
  "password": "Password123!",
  "birthday": "1990-05-15T00:00:00Z"
}
```

**Validaciones:**

- `name`:
  - Requerido
  - String alfanumérico
  - Longitud: mínimo 3, máximo 30 caracteres
- `email`:
  - Requerido
  - Debe ser un email válido
  - Debe ser único (no puede existir en la BD)
- `password`:
  - Requerido
  - Mínimo 8 caracteres
  - Debe contener al menos una mayúscula, una minúscula, un número y un carácter especial (!@#$%^&\*)
- `birthday`:
  - Requerido
  - Fecha en formato ISO 8601 (`YYYY-MM-DDTHH:MM:SSZ`)

**Respuesta Exitosa (201):**

```json
{
  "id": "673a1b2c3d4e5f6g7h8i9j0k",
  "name": "Juan Pérez",
  "email": "juan@example.com",
  "birthday": "1990-05-15T00:00:00.000Z",
  "isBlocked": false
}
```

**Errores Posibles:**

- `400`: Datos inválidos, email ya registrado, o validaciones no cumplidas
- `500`: Error interno del servidor

---

### 2. Iniciar Sesión

**`POST /api/v1/auth/login`**

Autentica un usuario y devuelve un token JWT.

**Headers:**

```json
{
  "Content-Type": "application/json"
}
```

**Body (JSON):**

```json
{
  "email": "usuario@example.com",
  "password": "Password123!"
}
```

**Validaciones:**

- `email`: Requerido, formato de email válido
- `password`: Requerido

**Respuesta Exitosa (200):**

```json
{
  "id": "673a1b2c3d4e5f6g7h8i9j0k",
  "email": "usuario@example.com",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**Errores Posibles:**

- `401`: Credenciales inválidas
- `400`: Datos faltantes o inválidos
- `500`: Error interno del servidor

---

## 👥 Usuarios

### 3. Obtener Todos los Usuarios

**`GET /api/v1/users`**

Obtiene una lista de usuarios con paginación.

**🔓 Acceso**: Público (no requiere autenticación)

**Query Parameters opcionales:**

| Parámetro | Tipo   | Requerido | Descripción         | Valor por defecto |
| --------- | ------ | --------- | ------------------- | ----------------- |
| `page`    | number | No        | Número de página    | `1`               |
| `limit`   | number | No        | Usuarios por página | `10`              |

**Validaciones:**

- `page`: Debe ser un número entero positivo mayor que 0
- `limit`: Debe ser un número entero positivo, máximo 100

**Ejemplo de Request:**

```text
GET /api/v1/users?page=1&limit=10
```

**Respuesta Exitosa (200):**

```json
[
  {
    "id": "673a1b2c3d4e5f6g7h8i9j0k",
    "email": "usuario@example.com"
  },
  {
    "id": "673a1b2c3d4e5f6g7h8i9j0l",
    "email": "otro@example.com"
  }
]
```

**Errores Posibles:**

- `404`: No se encontraron usuarios
- `400`: Parámetros de paginación inválidos
- `500`: Error interno del servidor

---

### 4. Obtener Usuario por ID

**`GET /api/v1/users/:id`**

Obtiene los detalles de un usuario específico.

**🔓 Acceso**: Público (no requiere autenticación)

**Parámetros de URL:**

| Parámetro | Tipo   | Descripción                                  |
| --------- | ------ | -------------------------------------------- |
| `id`      | string | ID del usuario (24 caracteres hexadecimales) |

**Validaciones:**

- `id`: Debe ser un ObjectId válido de MongoDB (24 caracteres hexadecimales)

**Ejemplo de Request:**

```text
GET /api/v1/users/673a1b2c3d4e5f6g7h8i9j0k
```

**Respuesta Exitosa (200):**

```json
{
  "id": "673a1b2c3d4e5f6g7h8i9j0k",
  "email": "usuario@example.com"
}
```

**Errores Posibles:**

- `404`: Usuario no encontrado
- `400`: ID inválido
- `500`: Error interno del servidor

---

### 5. Crear Usuario

**`POST /api/v1/users`**

Crea un nuevo usuario (similar a register pero sin devolver token).

**🔓 Acceso**: Público (no requiere autenticación)

**Headers:**

```json
{
  "Content-Type": "application/json"
}
```

**Body (JSON):**

```json
{
  "name": "MariaGarcia",
  "email": "maria@example.com",
  "password": "SecurePass99!",
  "birthday": "1995-08-20T00:00:00Z"
}
```

**Validaciones:**

- `name`:
  - Requerido
  - String alfanumérico (ni espacios, ni acentos)
  - Longitud: mínimo 3, máximo 30 caracteres
- `email`:
  - Requerido
  - Debe ser un email válido
  - Debe ser único (no puede existir en la BD)
- `password`:
  - Requerido
  - Mínimo 8 caracteres
  - Debe contener al menos una mayúscula, una minúscula, un número y un carácter especial
- `birthday`:
  - Requerido
  - Fecha en formato ISO 8601

**Respuesta Exitosa (201):**

```json
{
  "id": "673a1b2c3d4e5f6g7h8i9j0m",
  "name": "María García",
  "email": "maria@example.com",
  "birthday": "1995-08-20T00:00:00.000Z",
  "isBlocked": false
}
```

---

### 6. Actualizar Usuario

**`PUT /api/v1/users/:id`**

Actualiza la información de un usuario existente.

**🔓 Acceso**: Público (no requiere autenticación)

**Parámetros de URL:**

| Parámetro | Tipo   | Descripción                 |
| --------- | ------ | --------------------------- |
| `id`      | string | ID del usuario a actualizar |

**Headers:**

```json
{
  "Content-Type": "application/json"
}
```

**Body (JSON):**

Todos los campos son opcionales, envía solo los que quieres actualizar:

```json
{
  "name": "JuanCarlos",
  "email": "juan.carlos@example.com",
  "password": "NewSecurePass123!",
  "birthday": "1990-05-15T00:00:00Z",
  "isBlocked": false
}
```

**Validaciones:**

- `name`: Opcional, debe ser string alfanumérico de 3-30 caracteres
- `email`: Opcional, debe ser email válido si se proporciona
- `password`: Opcional, debe cumplir requisitos de contraseña si se proporciona (mínimo 8 caracteres, mayúscula, minúscula, número y carácter especial)
- `birthday`: Opcional, debe ser fecha en formato ISO 8601
- `isBlocked`: Opcional, booleano

**Respuesta Exitosa (200):**

```json
{
  "id": "673a1b2c3d4e5f6g7h8i9j0k",
  "name": "Juan Carlos",
  "email": "juan.carlos@example.com",
  "birthday": "1990-05-15T00:00:00.000Z",
  "isBlocked": false
}
```

**Errores Posibles:**

- `404`: Usuario no encontrado
- `400`: Datos inválidos o ID inválido
- `500`: Error interno del servidor

---

### 7. Eliminar Usuario

**`DELETE /api/v1/users/:id`**

Elimina un usuario del sistema.

**🔒 Acceso**: Requiere autenticación (Token JWT)

**Parámetros de URL:**

| Parámetro | Tipo   | Descripción               |
| --------- | ------ | ------------------------- |
| `id`      | string | ID del usuario a eliminar |

**Headers:**

```json
{
  "Authorization": "Bearer <token>",
  "Content-Type": "application/json"
}
```

**Validaciones:**

- `id`: Debe ser un ObjectId válido de MongoDB
- **Token JWT**: Debe ser válido y no estar expirado

**Respuesta Exitosa (200):**

```json
{
  "id": "673a1b2c3d4e5f6g7h8i9j0k",
  "email": "usuario@example.com"
}
```

**Errores Posibles:**

- `401`: Token no proporcionado o inválido
- `404`: Usuario no encontrado
- `400`: ID inválido
- `500`: Error interno del servidor

---

## ✈️ Vuelos

### 8. Obtener Todos los Vuelos

**`GET /api/v1/flights`**

Obtiene una lista de vuelos con paginación.

**🔓 Acceso**: Público (no requiere autenticación)

**Query Parameters:**

| Parámetro | Tipo   | Requerido | Descripción       | Valor por defecto |
| --------- | ------ | --------- | ----------------- | ----------------- |
| `page`    | number | No        | Número de página  | `1`               |
| `limit`   | number | No        | Vuelos por página | `10`              |

**Validaciones:**

- `page`: Debe ser un número entero positivo mayor que 0
- `limit`: Debe ser un número entero positivo, máximo 100

**Ejemplo de Request:**

```text
GET /api/v1/flights?page=1&limit=10
```

**Respuesta Exitosa (200):**

```json
[
  {
    "id": "673a1b2c3d4e5f6g7h8i9j0n",
    "origin": "MAD",
    "destination": "BCN",
    "time_departure": "2025-12-01T10:00:00Z",
    "status": "on_time"
  }
]
```

**Errores Posibles:**

- `404`: No se encontraron vuelos
- `400`: Parámetros de paginación inválidos
- `500`: Error interno del servidor

---

### 9. Obtener Vuelo por ID

**`GET /api/v1/flights/:id`**

Obtiene los detalles de un vuelo específico.

**🔓 Acceso**: Público (no requiere autenticación)

**Parámetros de URL:**

| Parámetro | Tipo   | Descripción                                |
| --------- | ------ | ------------------------------------------ |
| `id`      | string | ID del vuelo (24 caracteres hexadecimales) |

**Validaciones:**

- `id`: Debe ser un ObjectId válido de MongoDB

**Ejemplo de Request:**

```text
GET /api/v1/flights/673a1b2c3d4e5f6g7h8i9j0n
```

**Respuesta Exitosa (200):**

```json
{
  "id": "673a1b2c3d4e5f6g7h8i9j0n",
  "origin": "MAD",
  "destination": "BCN",
  "time_departure": "2025-12-01T10:00:00Z",
  "status": "on_time"
}
```

**Errores Posibles:**

- `404`: Vuelo no encontrado
- `400`: ID inválido
- `500`: Error interno del servidor

---

### 10. Crear Vuelo

**`POST /api/v1/flights`**

Crea un nuevo vuelo en el sistema.

**🔒 Acceso**: Requiere autenticación (Token JWT)

**Headers:**

```json
{
  "Authorization": "Bearer <token>",
  "Content-Type": "application/json"
}
```

**Body (JSON):**

```json
{
  "origin": "MAD",
  "destination": "BCN",
  "time_departure": "2025-12-01T10:00:00Z",
  "status": "on_time"
}
```

**Validaciones:**

- `origin`:
  - Requerido
  - String, longitud mínima 3 caracteres
  - Código IATA del aeropuerto de origen
- `destination`:
  - Requerido
  - String, longitud mínima 3 caracteres
  - Código IATA del aeropuerto de destino
  - Debe ser diferente de `origin`
- `time_departure`:
  - Requerido
  - Fecha y hora en formato ISO 8601
  - Debe ser una fecha futura
- `status`:
  - Requerido
  - Enum: `"on_time"`, `"delayed"`, `"cancelled"`, `"boarding"`, `"departed"`

**Respuesta Exitosa (201):**

```json
{
  "id": "673a1b2c3d4e5f6g7h8i9j0n",
  "origin": "MAD",
  "destination": "BCN",
  "time_departure": "2025-12-01T10:00:00Z",
  "status": "on_time"
}
```

**Errores Posibles:**

- `401`: Token no proporcionado o inválido
- `400`: Datos inválidos o faltantes
- `500`: Error interno del servidor

---

### 11. Actualizar Vuelo

**`PUT /api/v1/flights/:id`**

Actualiza la información de un vuelo existente.

**🔒 Acceso**: Requiere autenticación (Token JWT)

**Parámetros de URL:**

| Parámetro | Tipo   | Descripción               |
| --------- | ------ | ------------------------- |
| `id`      | string | ID del vuelo a actualizar |

**Headers:**

```json
{
  "Authorization": "Bearer <token>",
  "Content-Type": "application/json"
}
```

**Body (JSON):**

```json
{
  "origin": "MAD",
  "destination": "VLC",
  "time_departure": "2025-12-01T11:00:00Z",
  "status": "delayed"
}
```

**Validaciones:**

- Todos los campos son opcionales pero deben cumplir las mismas validaciones que en crear vuelo
- Al menos un campo debe ser proporcionado

**Respuesta Exitosa (200):**

```json
{
  "id": "673a1b2c3d4e5f6g7h8i9j0n",
  "origin": "MAD",
  "destination": "VLC",
  "time_departure": "2025-12-01T11:00:00Z",
  "status": "delayed"
}
```

**Errores Posibles:**

- `401`: Token no proporcionado o inválido
- `404`: Vuelo no encontrado
- `400`: Datos inválidos o ID inválido
- `500`: Error interno del servidor

---

### 12. Eliminar Vuelo

**`DELETE /api/v1/flights/:id`**

Elimina un vuelo del sistema.

**🔒 Acceso**: Requiere autenticación (Token JWT)

**Parámetros de URL:**

| Parámetro | Tipo   | Descripción             |
| --------- | ------ | ----------------------- |
| `id`      | string | ID del vuelo a eliminar |

**Headers:**

```json
{
  "Authorization": "Bearer <token>",
  "Content-Type": "application/json"
}
```

**Validaciones:**

- `id`: Debe ser un ObjectId válido de MongoDB
- **Token JWT**: Debe ser válido y no estar expirado

**Respuesta Exitosa (200):**

```json
{
  "id": "673a1b2c3d4e5f6g7h8i9j0n",
  "origin": "MAD",
  "destination": "BCN",
  "time_departure": "2025-12-01T10:00:00Z",
  "status": "on_time"
}
```

**Errores Posibles:**

- `401`: Token no proporcionado o inválido
- `404`: Vuelo no encontrado
- `400`: ID inválido
- `500`: Error interno del servidor

---

## 🏥 Health Check

### Health Check Endpoint

**`GET /health`**

Verifica el estado del servidor y la conexión a la base de datos.

**🔓 Acceso**: Público

**Respuesta Exitosa (200):**

```json
{
  "status": "ok",
  "uptime": 3600.5,
  "db": {
    "connected": true
  }
}
```

**Respuesta Error (500):**

```json
{
  "status": "error",
  "uptime": 3600.5,
  "db": {
    "connected": false
  }
}
```

---

## 🔑 Autenticación con JWT

### Cómo Obtener el Token

1. Registra un usuario: `POST /api/v1/auth/register`
2. Inicia sesión: `POST /api/v1/auth/login`
3. Copia el `token` de la respuesta

### Cómo Usar el Token

Incluye el token en el header `Authorization` de tus peticiones:

```text
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

### Rutas que Requieren Token

- ❌ `PUT /api/v1/users/:id`
- ❌ `DELETE /api/v1/users/:id`
- ❌ `POST /api/v1/flights`
- ❌ `PUT /api/v1/flights/:id`
- ❌ `DELETE /api/v1/flights/:id`

---

## 📝 Códigos de Estado HTTP

| Código | Significado                                      |
| ------ | ------------------------------------------------ |
| `200`  | OK - Operación exitosa                           |
| `201`  | Created - Recurso creado exitosamente            |
| `400`  | Bad Request - Datos inválidos o faltantes        |
| `401`  | Unauthorized - Token no proporcionado o inválido |
| `404`  | Not Found - Recurso no encontrado                |
| `500`  | Internal Server Error - Error del servidor       |

---

## 🧪 Ejemplo de Flujo de Trabajo

### 1. Registrar un Usuario

```bash
curl -X POST http://localhost:4000/api/v1/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"Test1234!"}'
```

### 2. Iniciar Sesión y Obtener Token

```bash
curl -X POST http://localhost:4000/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"Test1234!"}'
```

Respuesta:

```json
{
  "id": "673a1b2c3d4e5f6g7h8i9j0k",
  "email": "test@example.com",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

### 3. Crear un Vuelo (con Token)

```bash
curl -X POST http://localhost:4000/api/v1/flights \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..." \
  -d '{
    "origin":"MAD",
    "destination":"BCN",
    "time_departure":"2025-12-01T10:00:00Z",
    "status":"on_time"
  }'
```

### 4. Obtener Todos los Vuelos

```bash
curl -X GET http://localhost:4000/api/v1/flights?page=1&limit=10
```

### 5. Eliminar un Vuelo (con Token)

```bash
curl -X DELETE http://localhost:4000/api/v1/flights/673a1b2c3d4e5f6g7h8i9j0n \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
```

---

## 🏗️ Arquitectura

La aplicación sigue una arquitectura en capas:

```text
┌─────────────────┐
│   Controllers   │ ← Maneja peticiones HTTP
├─────────────────┤
│    Services     │ ← Lógica de negocio
├─────────────────┤
│  Repositories   │ ← Acceso a datos
├─────────────────┤
│   Models/DB     │ ← MongoDB
└─────────────────┘
```

**Middlewares:**

- `auth.middleware.ts`: Verifica tokens JWT
- `validate.middleware.ts`: Valida datos de entrada
- `error.middleware.ts`: Maneja errores globalmente

**Validators:**

- `user.validator.ts`: Schemas de validación para usuarios
- `auth.validator.ts`: Schemas de validación para autenticación
- `flight.validator.ts`: Schemas de validación para vuelos

---

## 🧪 Opciones Herramientas para Probar la API (opcional)

### Opciones de Herramientas

#### 🔷 Thunder Client (Recomendado - Integrado en VS Code)

1. Abre VS Code
2. Ve a Extensions (Ctrl/Cmd + Shift + X)
3. Busca "Thunder Client"
4. Haz clic en Install

**Ventajas:** No necesitas salir del editor, rápido y ligero.

#### 🔷 Postman (Aplicación de Escritorio)

1. Ve a [postman.com/downloads](https://www.postman.com/downloads/)
2. Descarga e instala
3. Crea cuenta gratuita (opcional)

**Ventajas:** Más features, colecciones, documentación automática.

#### 🔷 Insomnia (Aplicación de Escritorio)

1. Ve a [insomnia.rest/download](https://insomnia.rest/download)
2. Descarga e instala

**Ventajas:** Interfaz simple, diseño limpio.

#### 🔷 curl (Terminal)

Ya viene instalado en Mac/Linux. En Windows usa PowerShell o Git Bash.

**Ventajas:** Rápido, scriptable, no requiere instalación.

### Guía Rápida con Postman/Thunder Client

#### 1️⃣ Crear una Petición

1. Haz clic en **"New Request"** o **"+"**
2. Selecciona el método HTTP (GET, POST, PUT, DELETE)
3. Escribe la URL: `http://localhost:4000/api/v1/...`

#### 2️⃣ Agregar Headers (si es necesario)

Para peticiones con datos JSON:

```text
Content-Type: application/json
```

Para peticiones protegidas (después de login):

```text
Authorization: Bearer TU_TOKEN_AQUI
```

#### 3️⃣ Agregar Body (para POST/PUT)

1. Selecciona pestaña **"Body"**
2. Elige **"raw"** y **"JSON"**
3. Escribe tu JSON:

```json
{
  "email": "test@example.com",
  "password": "Password123!"
}
```

#### 4️⃣ Enviar y Ver Respuesta

1. Haz clic en **"Send"**
2. La respuesta aparecerá abajo con:
   - **Status**: 200, 201, 400, 401, 404, etc.
   - **Body**: Los datos devueltos en JSON
   - **Time**: Tiempo de respuesta

**💡 Una vez que verifiques que la API funciona, implementa las peticiones en tu código JavaScript/TypeScript como se muestra en los ejemplos anteriores.**

---

## ❓ Preguntas Frecuentes (FAQ)

### ❓ ¿Por qué me da error 401 "Unauthorized"?

**Respuesta:** Tienes 3 posibles problemas:

1. **No incluiste el token** en el header `Authorization`
2. **El token está mal formateado**. Debe ser: `Bearer TOKEN_COMPLETO` (con espacio después de Bearer)
3. **El token expiró**. Solución: Haz login de nuevo para obtener un token nuevo

**✅ Ejemplo correcto:**

```text
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2NzNh...
```

**❌ Ejemplos incorrectos:**

```text
Authorization: eyJhbGciOiJIUzI1NiIsInR5cCI...  ← Falta "Bearer "
Authorization: BearereyJhbGciOiJIUzI1NiIsInR5cCI...  ← Falta el espacio
Authorization: bearer eyJhbGciOiJIUzI1NiIsInR5cCI...  ← "Bearer" debe ir con B mayúscula
```

---

### ❓ ¿Por qué me da error 400 "Bad Request"?

**Respuesta:** Tus datos tienen algún problema. Revisa:

1. **JSON mal formado**
   - ❌ `{email: "test@example.com"}` → Falta comillas en la clave
   - ✅ `{"email": "test@example.com"}` → Correcto

2. **Contraseña no cumple requisitos**
   - Debe tener mínimo 8 caracteres
   - Al menos 1 mayúscula
   - Al menos 1 minúscula
   - Al menos 1 número
   - Al menos 1 carácter especial (!@#$%^&\*)

3. **Email inválido**
   - ❌ `test` → Falta @
   - ❌ `test@` → Falta dominio
   - ✅ `test@example.com` → Correcto

4. **Fecha inválida**
   - ❌ `01/12/2025` → Formato incorrecto
   - ✅ `2025-12-01T10:00:00Z` → Formato ISO 8601 correcto

---

### ❓ ¿Por qué me da error 404 "Not Found"?

**Respuestas posibles:**

1. **La URL está mal escrita**
   - ❌ `http://localhost:4000/api/v1/user` → Falta la 's'
   - ✅ `http://localhost:4000/api/v1/users` → Correcto

2. **El ID no existe en la base de datos**
   - Verifica que el ID sea correcto
   - Usa la ruta GET para ver todos los IDs disponibles primero

3. **El servidor no está corriendo**
   - Revisa que Docker esté ejecutándose
   - Verifica en el navegador: `http://localhost:4000/health`

---

### ❓ ¿Cómo sé si el servidor está funcionando?

**Respuesta:** Abre tu navegador y ve a:

```text
http://localhost:4000/health
```

**✅ Si funciona verás:**

```json
{
  "status": "ok",
  "uptime": 123.45,
  "db": {
    "connected": true
  }
}
```

**❌ Si no funciona:**

- El navegador dirá "No se puede conectar" o similar
- Solución: Inicia el servidor con Docker

---

### ❓ ¿Qué hago si olvido mi contraseña?

**Respuesta:** Esta API **no tiene recuperación de contraseña**. Opciones:

1. **Si recuerdas el email**: No hay forma de recuperarla (tendrías que implementar esa funcionalidad)
2. **Solución práctica**: Crea un nuevo usuario con otro email

---

### ❓ ¿Cómo creo fechas en formato ISO 8601?

**Respuesta:** Usa este formato: `YYYY-MM-DDTHH:MM:SSZ`

**Ejemplos:**

- `2025-12-25T10:00:00Z` → 25 dic 2025, 10:00 AM
- `2025-01-01T00:00:00Z` → 1 ene 2025, medianoche
- `2025-06-15T14:30:00Z` → 15 jun 2025, 2:30 PM

**🛠️ Herramienta online:**

- Ve a [timestamp-converter.com](https://timestamp-converter.com)
- Selecciona fecha y hora
- Copia el formato ISO 8601

---

### ❓ ¿Qué son esos códigos raros como "MAD" o "BCN"?

**Respuesta:** Son **códigos IATA** de aeropuertos (3 letras).

**Ejemplos comunes:**

- **España**: MAD (Madrid), BCN (Barcelona), VLC (Valencia), SVQ (Sevilla)
- **Europa**: LHR (Londres), CDG (París), FCO (Roma), AMS (Ámsterdam)
- **América**: JFK (Nueva York), LAX (Los Ángeles), MIA (Miami)
- **Mundial**: DXB (Dubai), HKG (Hong Kong), SYD (Sydney)

Puedes inventar códigos para pruebas: `XXX`, `YYY`, `ZZZ`

---

### ❓ ¿Cuánto tiempo dura el token JWT?

**Respuesta:** Depende de la configuración del servidor, usualmente entre 1 hora y 7 días, en esta API dura 1h.

**Cuando expira:**

- Te dará error 401
- Debes hacer login de nuevo para obtener un token nuevo

---

### ❓ ¿Puedo tener múltiples usuarios?

**Respuesta:** ✅ Sí, puedes crear tantos usuarios como quieras.

Cada uno debe tener un **email único**.

---

### ❓ ¿Los vuelos se eliminan automáticamente después de la fecha?

**Respuesta:** ❌ No. Los vuelos permanecen en la base de datos hasta que los elimines manualmente.

---

## 🔧 Solución de Problemas Comunes

### 🔴 Error: "Cannot GET /api/v1/..."

**Problema:** El servidor no encuentra la ruta.

**Soluciones:**

1. Verifica que la URL esté correcta (revisa mayúsculas/minúsculas)
2. Asegúrate de incluir `/api/v1/` en la URL
3. Verifica que el servidor esté corriendo

---

### 🔴 Error: "Connection refused" o "ECONNREFUSED"

**Problema:** El servidor no está ejecutándose.

**Solución:**

```bash
# Inicia Docker Compose
docker-compose up -d
```

---

### 🔴 Error: "Invalid JSON"

**Problema:** Tu JSON tiene errores de sintaxis.

**Soluciones:**

1. Usa una herramienta para validar JSON: [jsonlint.com](https://jsonlint.com)
2. Revisa:
   - ¿Todas las comillas son dobles `"`?
   - ¿Hay comas entre elementos?
   - ¿Los números y booleanos están sin comillas?

**❌ Incorrecto:**

```json
{
  "email": "test@example.com",  ← Coma extra antes del cierre
}
```

**✅ Correcto:**

```json
{
  "email": "test@example.com"
}
```

---

### � Mi contraseña no es aceptada

**Problema:** No cumple los requisitos de seguridad.

**Requisitos:**

- ✅ Mínimo 8 caracteres
- ✅ Al menos 1 letra MAYÚSCULA
- ✅ Al menos 1 letra minúscula
- ✅ Al menos 1 número (0-9)
- ✅ Al menos 1 carácter especial (!@#$%^&\*()\_+-=[]{}|;:,.<>?)

**Ejemplos válidos:**

- `Password123!`
- `MyP@ss2025`
- `Secure#Pass99`

**Ejemplos inválidos:**

- `password` → Falta mayúscula, número y especial
- `Password` → Falta número y especial
- `Pass123` → Falta especial y es muy corta

---

## �🔒 Seguridad

- Las contraseñas se hashean con **bcrypt** antes de almacenarse
- Se usa **JWT** para autenticación stateless
- Las validaciones se realizan con **Joi**
- CORS configurado para desarrollo y producción
- Headers de seguridad configurados

---

## 📦 Tecnologías Utilizadas

- **Node.js** v20
- **Express.js** v5
- **TypeScript** v5
- **MongoDB** v7 con **Mongoose** v8
- **JWT** (jsonwebtoken)
- **Bcrypt** para hashing de contraseñas
- **Joi** para validaciones
- **Pino** para logging
- **Docker** para containerización

---

## 🚨 Notas Importantes

1. **Base de Datos Vacía**: No hay datos precargados. Debes crear usuarios y vuelos mediante la API.
2. **Tokens JWT**: Expiran después de un tiempo configurado. Deberás volver a iniciar sesión si el token expira.
3. **Validaciones Estrictas**: Todos los datos de entrada son validados. Revisa los mensajes de error para corregir problemas.
4. **IDs de MongoDB**: Deben ser ObjectIds válidos (24 caracteres hexadecimales).
5. **Fechas**: Usa formato ISO 8601 para las fechas (`2025-12-01T10:00:00Z`).

---

## 📚 Recursos Adicionales

### Para Aprender Más

- **APIs REST**: [https://www.redhat.com/es/topics/api/what-is-a-rest-api](https://www.redhat.com/es/topics/api/what-is-a-rest-api)
- **JSON**: [https://www.json.org/json-es.html](https://www.json.org/json-es.html)
- **HTTP Status Codes**: [https://httpstatuses.com/](https://httpstatuses.com/)
- **Postman Learning**: [https://learning.postman.com/](https://learning.postman.com/)

### Herramientas Útiles

- **Validador JSON**: [https://jsonlint.com/](https://jsonlint.com/)
- **Generador de fechas ISO**: [https://timestamp-converter.com/](https://timestamp-converter.com/)
- **Códigos IATA**: [https://www.iata.org/en/publications/directories/code-search/](https://www.iata.org/en/publications/directories/code-search/)

---

## 📧 Contacto y Soporte

Para más información sobre la API, consulta el código fuente en los directorios:

- `src/routes/` - Definición de rutas
- `src/validators/` - Schemas de validación
- `src/controllers/` - Lógica de controladores
- `src/services/` - Lógica de negocio
