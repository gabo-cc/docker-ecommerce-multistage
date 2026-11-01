# API de E-commerce Segura

API RESTful desarrollada con Laravel 12 para gestionar clientes, productos, órdenes de compra y pagos mediante Stripe. Incluye autenticación JWT, control de acceso por roles y documentación interactiva con Swagger/OpenAPI.

## Funcionalidades

- Registro e inicio de sesión de clientes.
- Autenticación mediante tokens JWT.
- Roles de administrador y cliente.
- Catálogo público de productos disponibles.
- CRUD de productos protegido para administradores.
- Creación y consulta de órdenes.
- Cálculo automático del total de compra.
- Control y descuento de inventario.
- Procesamiento de pagos mediante Stripe.
- Recepción y validación de webhooks de Stripe.
- Validaciones mediante Form Requests.
- Respuestas de error en formato JSON.
- Documentación completa mediante Swagger UI.
- Datos iniciales mediante factories y seeders.

## Tecnologías utilizadas

- PHP 8.2 o superior.
- Laravel 12.
- MySQL.
- JWT Auth.
- Stripe PHP SDK.
- L5-Swagger.
- OpenAPI.
- Composer.

## Requisitos

- PHP 8.2 o superior.
- Composer.
- MySQL.
- Git.
- Stripe CLI, únicamente para probar webhooks localmente.
- Una cuenta de Stripe en modo de prueba.

## Instalación

Clonar el repositorio:

```bash
git clone https://github.com/gabo-cc/API-de-E-commerce.git
```

Entrar en la carpeta:

```bash
cd API-de-E-commerce
```

Instalar las dependencias:

```bash
composer install
```

Crear el archivo de entorno en Windows PowerShell:

```powershell
Copy-Item .env.example .env
```

En Linux o macOS:

```bash
cp .env.example .env
```

Generar la clave de Laravel y el secreto JWT:

```bash
php artisan key:generate
php artisan jwt:secret
```

## Configuración de la base de datos

Crear una base de datos MySQL:

```sql
CREATE DATABASE ecommerce_api;
```

Configurar estas variables en `.env`:

```env
DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=ecommerce_api
DB_USERNAME=root
DB_PASSWORD=
```

Ejecutar las migraciones y seeders:

```bash
php artisan migrate --seed
```

Se crearán las tablas `users`, `products`, `orders`, `order_items` y `payments`, junto con usuarios y productos de ejemplo.

## Usuarios de prueba

| Rol | Correo | Contraseña |
|---|---|---|
| Administrador | `admin@ecommerce.com` | `Admin123*` |
| Cliente | `cliente@ecommerce.com` | `Cliente123*` |

Estas credenciales son únicamente para desarrollo y pruebas.

## Configuración de Stripe

Utilizar claves del modo de prueba de Stripe y colocarlas en `.env`:

```env
STRIPE_KEY=pk_test_clave_publica
STRIPE_SECRET=sk_test_clave_secreta
STRIPE_WEBHOOK_SECRET=whsec_secreto_del_webhook
```

No se deben subir claves reales al repositorio. Después de modificar las variables, ejecutar:

```bash
php artisan config:clear
```

Para recibir eventos de Stripe localmente:

```bash
stripe login
stripe listen --events payment_intent.succeeded,payment_intent.payment_failed --forward-to http://127.0.0.1:8000/api/stripe/webhook
```

El listener mostrará un secreto que comienza con `whsec_`. Ese valor debe colocarse en `STRIPE_WEBHOOK_SECRET`.

Pago aprobado de prueba:

```json
{
    "payment_method_id": "pm_card_visa"
}
```

Pago rechazado de prueba:

```json
{
    "payment_method_id": "pm_card_chargeDeclined"
}
```

Estas operaciones utilizan el modo de prueba y no generan cobros reales.

## Ejecutar el proyecto

```bash
php artisan serve
```

La API estará disponible en `http://127.0.0.1:8000`.

## Documentación Swagger

Generar la documentación:

```bash
php artisan l5-swagger:generate
```

Iniciar el servidor y abrir:

```text
http://127.0.0.1:8000/api/documentation
```

Para utilizar rutas protegidas desde Swagger:

1. Ejecutar `POST /auth/login`.
2. Copiar el valor de `access_token`.
3. Presionar **Authorize**.
4. Introducir el token JWT.
5. Ejecutar las rutas protegidas.

## Endpoints

### Autenticación

| Método | Endpoint | Descripción | Acceso |
|---|---|---|---|
| POST | `/api/auth/register` | Registrar un cliente | Público |
| POST | `/api/auth/login` | Iniciar sesión | Público |
| GET | `/api/auth/me` | Consultar usuario autenticado | JWT |
| POST | `/api/auth/logout` | Cerrar sesión | JWT |
| POST | `/api/auth/refresh` | Renovar token | JWT |

### Productos

| Método | Endpoint | Descripción | Acceso |
|---|---|---|---|
| GET | `/api/products` | Listar productos disponibles | Público |
| GET | `/api/products/{product}` | Consultar un producto | Público |
| POST | `/api/products` | Crear un producto | Administrador |
| PUT | `/api/products/{product}` | Actualizar un producto | Administrador |
| PATCH | `/api/products/{product}` | Actualizar parcialmente un producto | Administrador |
| DELETE | `/api/products/{product}` | Eliminar un producto | Administrador |

### Órdenes

| Método | Endpoint | Descripción | Acceso |
|---|---|---|---|
| GET | `/api/orders` | Consultar historial de compras | JWT |
| POST | `/api/orders` | Crear una orden | JWT |
| GET | `/api/orders/{order}` | Consultar una orden | Propietario o administrador |

Ejemplo para crear una orden:

```json
{
    "items": [
        {
            "product_id": 1,
            "quantity": 2
        }
    ]
}
```

### Pagos

| Método | Endpoint | Descripción | Acceso |
|---|---|---|---|
| POST | `/api/orders/{order}/payments` | Procesar un pago | Propietario o administrador |
| POST | `/api/stripe/webhook` | Recibir eventos de Stripe | Stripe |

## Autenticación

Las rutas protegidas utilizan la cabecera:

```http
Authorization: Bearer TOKEN_JWT
```

## Roles

- `customer`: consulta productos, crea órdenes y paga sus propias compras.
- `admin`: administra productos y puede consultar todas las órdenes.

## Seguridad

- Contraseñas almacenadas mediante hash.
- Tokens JWT.
- Validación mediante Form Requests.
- Middleware de autenticación y autorización.
- Restricción de operaciones administrativas.
- Transacciones de base de datos al crear órdenes.
- Bloqueo de productos durante la actualización del inventario.
- Validación de propiedad de las órdenes.
- Verificación de firmas de webhooks.
- Variables sensibles almacenadas en `.env`.
- Eliminación lógica de productos.

## Códigos de respuesta principales

| Código | Significado |
|---|---|
| 200 | Operación exitosa |
| 201 | Recurso creado |
| 202 | Pago que requiere una acción adicional |
| 401 | Usuario no autenticado |
| 403 | Acceso prohibido |
| 404 | Recurso no encontrado |
| 409 | Conflicto con el estado del recurso |
| 422 | Error de validación o pago rechazado |
| 500 | Error interno o configuración incompleta |

## Pruebas

Ejecutar las pruebas incluidas por Laravel:

```bash
php artisan test
```

Los endpoints también pueden probarse mediante Swagger UI o Postman.


