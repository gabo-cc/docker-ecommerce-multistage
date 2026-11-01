# E-commerce con Docker Multi-Stage

Proyecto de contenedorización de una plataforma de comercio electrónico utilizando Next.js, Laravel, MySQL y Nginx.

## Objetivo

Implementar una arquitectura de contenedores optimizada mediante construcciones multi-stage, aplicando buenas prácticas de Docker y utilizando Docker Compose para orquestar los servicios.

## Arquitectura

```text
Navegador
   |
   v
Next.js (puerto 3001)
   |
   | API_BASE_URL=http://nginx/api
   v
Nginx (puerto 8000 en el host)
   |
   | FastCGI
   v
Laravel / PHP-FPM (puerto 9000 interno)
   |
   v
MySQL 8 (puerto 3306 interno)
```

Next.js se comunica con Nginx utilizando la red interna de Docker. Nginx procesa las solicitudes HTTP y las transmite a Laravel mediante FastCGI. Laravel utiliza MySQL para almacenar y consultar la información.

## Tecnologías

- Next.js y React
- Node.js 20 Alpine
- Laravel 12
- PHP 8.4 FPM Alpine
- MySQL 8.0
- Nginx Alpine
- Docker y Docker Compose

## Estructura del proyecto

```text
docker-ecommerce/
├── backend/
│   ├── Dockerfile
│   └── .dockerignore
├── frontend/
│   ├── Dockerfile
│   └── .dockerignore
├── docker/
│   └── nginx/
│       ├── Dockerfile
│       └── default.conf
├── docker-compose.yml
├── .env.example
├── .gitignore
└── README.md
```

## Optimizaciones Docker

### Frontend: Next.js

El Dockerfile utiliza tres etapas:

1. `deps`: instala dependencias con pnpm.
2. `builder`: compila la aplicación Next.js.
3. `runner`: ejecuta únicamente los archivos necesarios para producción.

Se utiliza `output: "standalone"` para reducir el contenido de la imagen final. También se ejecuta la aplicación mediante un usuario no privilegiado.

Tamaño de imagen obtenido: **175 MB**.

### Backend: Laravel

El Dockerfile separa la instalación de dependencias del entorno final de ejecución.

La etapa de construcción utiliza Composer para instalar las dependencias necesarias en producción. La imagen final utiliza PHP-FPM basado en Alpine y no incorpora Composer.

Tamaño de imagen obtenido: **135 MB**.

### Nginx

Nginx se configura como servidor HTTP para Laravel y comunica las solicitudes PHP mediante FastCGI.

Tamaño de imagen obtenido: **63 MB**.

### Caché y archivos excluidos

Los archivos `.dockerignore` evitan incluir dependencias locales, compilaciones anteriores, repositorios Git y otros archivos innecesarios en el contexto de construcción.

El orden de las instrucciones `COPY` permite aprovechar la caché de Docker al instalar dependencias antes de incorporar el resto del código.

## Configuración inicial

### Requisitos

- Docker Desktop
- Docker Compose
- Git

### Variables de entorno

Crear el archivo `.env` a partir de `.env.example`.

En PowerShell:

```powershell
Copy-Item .env.example .env
```

Editar el archivo `.env` y sustituir todos los valores que comienzan con `REEMPLAZAR_`.

Se deben configurar:

- `APP_KEY`: clave de Laravel en formato `base64:`.
- `JWT_SECRET`: secreto para autenticación JWT.
- `MYSQL_ROOT_PASSWORD`: contraseña del usuario root de MySQL.
- `MYSQL_PASSWORD`: contraseña del usuario de la aplicación.

Para generar valores aleatorios con PowerShell:

```powershell
$bytes = New-Object byte[] 32
$rng = [System.Security.Cryptography.RandomNumberGenerator]::Create()
$rng.GetBytes($bytes)
"base64:" + [Convert]::ToBase64String($bytes)
$rng.Dispose()
```

El resultado puede utilizarse como `APP_KEY`.

Para `JWT_SECRET`, generar otro valor aleatorio independiente y utilizarlo como secreto.

No publicar el archivo `.env` ni compartir contraseñas reales.

## Ejecución

Construir y ejecutar los servicios:

```powershell
docker compose up --build -d
```

Verificar su estado:

```powershell
docker compose ps
```

Ejecutar las migraciones:

```powershell
docker compose exec backend php artisan migrate --force
```

Cargar productos de ejemplo, si se desea:

```powershell
docker compose exec backend php artisan db:seed --class=ProductSeeder --force
```

## Accesos

| Servicio | Dirección |
|---|---|
| Frontend Next.js | http://localhost:3001 |
| API Laravel | http://localhost:8000/api/products |

Consultar la API desde PowerShell:

```powershell
curl.exe -i http://localhost:8000/api/products
```

Una respuesta `HTTP/1.1 200 OK` con contenido JSON indica que el endpoint responde correctamente.

## Docker Compose

La configuración incluye cuatro servicios:

- `frontend`: aplicación Next.js.
- `nginx`: servidor HTTP y puerta de entrada al backend.
- `backend`: aplicación Laravel mediante PHP-FPM.
- `mysql`: base de datos MySQL.

### Redes

- `app_net`: comunicación entre frontend, Nginx y backend.
- `database_net`: comunicación interna entre backend y MySQL.

La base de datos no publica su puerto en el equipo anfitrión.

### Persistencia

El volumen `mysql_data` conserva los datos de MySQL aunque los contenedores sean recreados.

### Healthchecks y dependencias

MySQL cuenta con un healthcheck para validar su disponibilidad.

Laravel dispone de una comprobación de configuración PHP-FPM.

Docker Compose espera a que MySQL esté saludable antes de iniciar el backend.

## Resultados de las pruebas

Durante las pruebas locales se verificó:

- Construcción de las imágenes optimizadas.
- Ejecución simultánea de cuatro servicios.
- Estado saludable de MySQL y Laravel.
- Ejecución correcta de ocho migraciones.
- Respuesta HTTP 200 del endpoint `/api/products`.
- Carga de la interfaz de Next.js.

La visualización de productos en el frontend debe comprobarse después de ejecutar el seeder.

## Comandos útiles

Consultar los registros:

```powershell
docker compose logs --tail=100
```

Detener los servicios:

```powershell
docker compose down
```

Reconstruir los servicios:

```powershell
docker compose up --build -d
```

**Advertencia:** `docker compose down -v` elimina también los volúmenes declarados, incluido el almacenamiento persistente de MySQL.
