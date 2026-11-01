<?php

namespace App\OpenApi;

use OpenApi\Attributes as OA;

#[OA\Schema(
    schema: 'User',
    required: ['id', 'name', 'email', 'role'],
    properties: [
        new OA\Property(property: 'id', type: 'integer', example: 2),
        new OA\Property(
            property: 'name',
            type: 'string',
            example: 'Cliente de Prueba'
        ),
        new OA\Property(
            property: 'email',
            type: 'string',
            format: 'email',
            example: 'cliente@ecommerce.com'
        ),
        new OA\Property(
            property: 'role',
            type: 'string',
            enum: ['admin', 'customer'],
            example: 'customer'
        ),
    ]
)]
#[OA\Schema(
    schema: 'TokenResponse',
    required: [
        'message',
        'access_token',
        'token_type',
        'expires_in',
    ],
    properties: [
        new OA\Property(
            property: 'message',
            type: 'string',
            example: 'Inicio de sesión correcto'
        ),
        new OA\Property(
            property: 'access_token',
            type: 'string',
            example: 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9...'
        ),
        new OA\Property(
            property: 'token_type',
            type: 'string',
            example: 'bearer'
        ),
        new OA\Property(
            property: 'expires_in',
            type: 'integer',
            example: 3600
        ),
    ]
)]
#[OA\Schema(
    schema: 'MessageResponse',
    required: ['message'],
    properties: [
        new OA\Property(
            property: 'message',
            type: 'string',
            example: 'Operación realizada correctamente'
        ),
    ]
)]
#[OA\Schema(
    schema: 'ValidationError',
    required: ['message', 'errors'],
    properties: [
        new OA\Property(
            property: 'message',
            type: 'string',
            example: 'Los datos proporcionados no son válidos.'
        ),
        new OA\Property(
            property: 'errors',
            type: 'object',
            example: [
                'email' => ['El correo electrónico ya está registrado.'],
            ]
        ),
    ]
)]
class Schemas
{
    //
}
