# E-commerce Frontend

Aplicación de comercio electrónico desarrollada con **Next.js 16**, **React**, **TypeScript** y **Tailwind CSS**. Consume una API REST construida con Laravel 12 para gestionar productos, autenticación, órdenes y pagos de prueba con Stripe.

Las imágenes del catálogo se almacenan en **Supabase Storage** y se muestran mediante `next/image`.

## Funcionalidades

- Catálogo público de productos con paginación y páginas de detalle.
- Imágenes optimizadas y metadatos SEO.
- Registro, inicio de sesión, consulta de cuenta y cierre de sesión.
- Autenticación JWT mediante cookies `httpOnly` administradas en el servidor.
- Carrito de compras con Zustand y persistencia local.
- Checkout protegido y creación de órdenes mediante Server Actions.
- Pagos de prueba con Stripe a través de la API Laravel.
- Confirmación de compras e historial de órdenes con paginación.
- Detalle de órdenes y acceso a pagos pendientes.
- Estados de carga con Suspense, páginas de error y mensajes 404 personalizados.

## Tecnologías

| Tecnología | Uso |
| --- | --- |
| Next.js 16 (App Router) | Interfaz, navegación y renderizado del servidor |
| React y TypeScript | Componentes e interfaces tipadas |
| Tailwind CSS | Estilos y diseño adaptable |
| Zustand | Estado y persistencia del carrito |
| Server Actions | Autenticación, órdenes y pagos |
| Laravel 12 | API REST y lógica de negocio |
| MySQL | Base de datos administrada por Laravel |
| Stripe (modo de prueba) | Procesamiento de pagos mediante Laravel |
| Supabase Storage | Imágenes públicas de productos |

## Requisitos

- Node.js compatible con Next.js 16 (mínimo 20.9).
- pnpm.
- API de Laravel configurada y en ejecución.
- Acceso a internet para cargar las imágenes públicas de Supabase Storage.

## Instalación

Clonar el frontend:

```bash
git clone https://github.com/gabo-cc/ecommerce-frontend.git
cd ecommerce-frontend
```

Instalar dependencias:

```bash
pnpm install
```

Crear el archivo de entorno desde el ejemplo. En Windows PowerShell:

```powershell
Copy-Item .env.example .env.local
```

En Linux o macOS:

```bash
cp .env.example .env.local
```

Configurar la URL de la API en `.env.local`:

```env
API_BASE_URL=http://127.0.0.1:8000/api
```

Ejecutar el servidor de desarrollo:

```bash
pnpm dev
```

Abrir **http://localhost:3000**.

### Ejecutar en modo producción local

```bash
pnpm build
pnpm start
```

Mantener la API de Laravel disponible mientras se usa el frontend.

## Backend

Repositorio: [API de E-commerce](https://github.com/gabo-cc/API-de-E-commerce)

El backend está desarrollado con Laravel 12 y proporciona los endpoints de autenticación, productos, órdenes y pagos. Su README contiene las instrucciones para configurar PHP, Composer, MySQL, JWT y Stripe.

Para ejecutarlo localmente, una vez configurado:

```bash
php artisan serve
```

Documentación Swagger de la API local: **http://127.0.0.1:8000/api/documentation**.

## Variables de entorno

| Variable | Descripción |
| --- | --- |
| `API_BASE_URL` | URL base de la API de Laravel, incluyendo `/api` |

El frontend no necesita las claves privadas de Stripe ni una clave de servicio de Supabase. El procesamiento de pagos y la gestión de credenciales sensibles se realizan en el backend.

## Imágenes de productos

Las imágenes públicas se alojan en el bucket `productos` de Supabase Storage. Laravel guarda y devuelve su URL mediante el campo `image_url`; Next.js las muestra con `next/image`.

El dominio y la ruta del bucket están autorizados en `next.config.ts`. No es necesario instalar un cliente de Supabase en el frontend para consultar estas imágenes públicas.

## Rutas principales

| Ruta | Descripción |
| --- | --- |
| `/` | Catálogo público |
| `/productos/[id]` | Detalle del producto |
| `/registro` | Registro de usuario |
| `/login` | Inicio de sesión |
| `/cuenta` | Información de la cuenta |
| `/carrito` | Carrito de compras |
| `/checkout` | Inicio del proceso de compra |
| `/checkout/pago/[id]` | Pago de la orden |
| `/checkout/confirmacion/[id]` | Confirmación del pago |
| `/compras` | Historial de compras |
| `/compras/[id]` | Detalle de una compra |

## Flujo de compra

1. El usuario consulta productos y los agrega al carrito.
2. Inicia sesión para continuar con el checkout.
3. Next.js envía la solicitud de creación de la orden a Laravel mediante una Server Action.
4. Laravel verifica la orden y calcula el total correspondiente.
5. El usuario inicia un pago de prueba; Laravel procesa la operación con Stripe.
6. El frontend muestra el estado del pago y permite consultar la orden en el historial.

### Métodos de pago para pruebas

La API utiliza identificadores de métodos de pago de prueba de Stripe:

- `pm_card_visa`: pago de prueba aprobado.
- `pm_card_chargeDeclined`: pago de prueba rechazado.

**No se realizan cargos reales.**

## Validación y calidad

Comprobar tipos:

```bash
pnpm exec tsc --noEmit
```

Generar la compilación de producción:

```bash
pnpm build
```

Se realizó una auditoría Lighthouse Mobile en modo producción local con una medición de **93/100 en Performance**, **100/100 en Accessibility**, **100/100 en Best Practices** y **100/100 en SEO**. Este resultado corresponde a la medición registrada antes de finalizar la migración de imágenes a Supabase; debe volver a comprobarse con la configuración final.

## Repositorios

- [Frontend — Next.js](https://github.com/gabo-cc/ecommerce-frontend)
- [Backend — Laravel](https://github.com/gabo-cc/API-de-E-commerce)
