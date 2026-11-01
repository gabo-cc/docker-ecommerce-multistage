<?php

namespace App\OpenApi;

use OpenApi\Attributes as OA;

#[OA\Info(
    version: '1.0.0',
    title: 'API de E-commerce',
    description: 'API segura para administrar usuarios, productos, órdenes y pagos mediante Stripe.'
)]
#[OA\Server(
    url: 'http://127.0.0.1:8000/api',
    description: 'Servidor local'
)]
#[OA\SecurityScheme(
    securityScheme: 'bearerAuth',
    type: 'http',
    description: 'Introduce el token JWT obtenido al iniciar sesión.',
    scheme: 'bearer',
    bearerFormat: 'JWT'
)]
class ApiDocumentation
{
    //
}
