# Frontend - Next.js

Este es el frontend de la aplicación construido con [Next.js](https://nextjs.org).

## 🚀 Cómo lanzar el proyecto

### Con Docker (Recomendado)

Desde la raíz del proyecto, ejecuta:

```bash
docker-compose up -d
```

Esto levantará todos los servicios (MongoDB, Backend, Frontend y Mongo Express).

## 🌐 Acceder al Frontend

Una vez el proyecto esté en marcha, abre tu navegador en:

**<http://localhost:3000>**

## 🩺 Componente de Health Check

La página principal (`app/page.jsx`) incluye un **componente de verificación de estado** que:

- **Llama al endpoint `/health`** de la API de backend
- **Muestra si la API está funcionando** correctamente
- **Verifica la conexión con MongoDB** mediante la respuesta del endpoint

Este componente es útil para:

- ✅ Comprobar que el backend está activo
- ✅ Verificar que la base de datos MongoDB está conectada
- ✅ Confirmar que la comunicación entre frontend y backend funciona

Si todo funciona correctamente, verás un mensaje indicando que la API y la base de datos están operativas.
