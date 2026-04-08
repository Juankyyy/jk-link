# JK-Link

Acortador de enlaces

Convierte un link largo en uno corto y fácil de

## Stack

- Vue 3 + Vite
- Vue Router
- Pinia
- Tailwind CSS
- Bun (gestor de paquetes recomendado)

## Funcionalidades

- Inicio de sesión para administrador con clave privada.
- Listado de links existentes.
- Alta de nuevos links (nombre + URL destino).
- Edición de links existentes.
- Eliminación de links.
- Generación y apertura del link corto (`/{nombre}`) desde el panel.

## Requisitos

- Bun instalado.
- Backend del acortador corriendo (por defecto en `http://localhost:8787`).

## Variables de entorno

El proyecto usa variables de entorno con prefijo `VITE_`.

Archivo base: `.env.example`

- `VITE_ADMIN_ACCESS_KEY`: clave para ingresar al panel admin.
- `VITE_API_BASE_URL`: URL base del backend API.

Ejemplo rápido:

```env
VITE_ADMIN_ACCESS_KEY=tu-clave-privada
VITE_API_BASE_URL=http://localhost:8787
```

## Instalación

```bash
bun install
```

## Desarrollo

```bash
bun run dev
```

La app queda disponible en la URL local que indique Vite.

## Build de producción

```bash
bun run build
```

## Vista previa del build

```bash
bun run preview
```

## API esperada por el frontend

Base URL: `VITE_API_BASE_URL`

- `GET /api/links`
  - Retorna un arreglo de links.
- `POST /api/links`
  - Crea un link.
  - Body JSON: `{ "name": "mi-link", "url": "https://sitio.com" }`
- `PUT /api/links/:name`
  - Actualiza un link existente.
  - Si el backend no soporta `PUT`, el frontend hace fallback (`DELETE` + `POST`).
- `DELETE /api/links/:name`
  - Elimina un link.

## Rutas del frontend

- `/admin/login`: acceso administrador.
- `/admin`: panel de gestión de links.

## Estructura principal

- `src/router/index.js`: rutas y guard de autenticación.
- `src/stores/links.js`: estado y acciones de links.
- `src/lib/linksApi.js`: cliente HTTP para backend.
- `src/lib/adminAuth.js`: auth admin en `localStorage`.
- `src/views/AdminLoginView.vue`: pantalla de login.
- `src/views/AdminView.vue`: panel principal de administración.
