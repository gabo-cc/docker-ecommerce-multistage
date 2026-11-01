<?php

namespace App\OpenApi;

use OpenApi\Attributes as OA;

#[OA\Schema(
    schema: 'Product',
    required: [
        'id',
        'name',
        'sku',
        'price',
        'formatted_price',
        'stock',
        'is_active',
    ],
    properties: [
        new OA\Property(property: 'id', type: 'integer', example: 3),
        new OA\Property(
            property: 'name',
            type: 'string',
            example: 'Teclado mecánico'
        ),
        new OA\Property(
            property: 'sku',
            type: 'string',
            example: 'TEC-MEC-001'
        ),
        new OA\Property(
            property: 'description',
            type: 'string',
            nullable: true,
            example: 'Teclado mecánico con iluminación y conexión USB.'
        ),
        new OA\Property(
            property: 'price',
            type: 'number',
            format: 'float',
            example: 64.50
        ),
        new OA\Property(
            property: 'formatted_price',
            type: 'string',
            example: '$64.50'
        ),
        new OA\Property(property: 'stock', type: 'integer', example: 19),
        new OA\Property(
            property: 'image_url',
            type: 'string',
            format: 'uri',
            nullable: true,
            example: 'https://example.com/images/teclado-mecanico.jpg'
        ),
        new OA\Property(
            property: 'is_active',
            type: 'boolean',
            example: true
        ),
        new OA\Property(
            property: 'created_at',
            type: 'string',
            format: 'date-time'
        ),
        new OA\Property(
            property: 'updated_at',
            type: 'string',
            format: 'date-time'
        ),
    ]
)]
#[OA\Schema(
    schema: 'StoreProduct',
    required: ['name', 'sku', 'price', 'stock'],
    properties: [
        new OA\Property(
            property: 'name',
            type: 'string',
            example: 'Memoria USB 64 GB'
        ),
        new OA\Property(
            property: 'sku',
            type: 'string',
            example: 'USB-64-001'
        ),
        new OA\Property(
            property: 'description',
            type: 'string',
            nullable: true,
            example: 'Memoria USB de alta velocidad.'
        ),
        new OA\Property(
            property: 'price',
            type: 'number',
            format: 'float',
            minimum: 0,
            example: 15.99
        ),
        new OA\Property(
            property: 'stock',
            type: 'integer',
            minimum: 0,
            example: 25
        ),
        new OA\Property(
            property: 'image_url',
            type: 'string',
            format: 'uri',
            nullable: true,
            example: 'https://example.com/images/teclado-mecanico.jpg'
        ),
        new OA\Property(
            property: 'is_active',
            type: 'boolean',
            example: true
        ),
    ]
)]
#[OA\Schema(
    schema: 'UpdateProduct',
    properties: [
        new OA\Property(
            property: 'name',
            type: 'string',
            example: 'Memoria USB 64 GB actualizada'
        ),
        new OA\Property(
            property: 'sku',
            type: 'string',
            example: 'USB-64-001'
        ),
        new OA\Property(
            property: 'description',
            type: 'string',
            nullable: true
        ),
        new OA\Property(
            property: 'price',
            type: 'number',
            format: 'float',
            minimum: 0,
            example: 14.99
        ),
        new OA\Property(
            property: 'stock',
            type: 'integer',
            minimum: 0,
            example: 30
        ),
        new OA\Property(
            property: 'image_url',
            type: 'string',
            format: 'uri',
            nullable: true,
            example: 'https://example.com/images/teclado-mecanico.jpg'
        ),
        new OA\Property(
            property: 'is_active',
            type: 'boolean',
            example: true
        ),
    ]
)]
#[OA\Schema(
    schema: 'ProductResponse',
    required: ['message', 'data'],
    properties: [
        new OA\Property(
            property: 'message',
            type: 'string',
            example: 'Producto creado correctamente'
        ),
        new OA\Property(
            property: 'data',
            ref: '#/components/schemas/Product'
        ),
    ]
)]
class ProductSchemas
{
    //
}
