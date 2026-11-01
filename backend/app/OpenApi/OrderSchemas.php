<?php

namespace App\OpenApi;

use OpenApi\Attributes as OA;

#[OA\Schema(
    schema: 'StoreOrderItem',
    required: ['product_id', 'quantity'],
    properties: [
        new OA\Property(
            property: 'product_id',
            type: 'integer',
            example: 3
        ),
        new OA\Property(
            property: 'quantity',
            type: 'integer',
            minimum: 1,
            example: 2
        ),
    ]
)]
#[OA\Schema(
    schema: 'StoreOrder',
    required: ['items'],
    properties: [
        new OA\Property(
            property: 'items',
            type: 'array',
            minItems: 1,
            items: new OA\Items(
                ref: '#/components/schemas/StoreOrderItem'
            )
        ),
    ]
)]
#[OA\Schema(
    schema: 'OrderItem',
    required: [
        'id',
        'product_id',
        'product_name',
        'sku',
        'quantity',
        'unit_price',
        'subtotal',
    ],
    properties: [
        new OA\Property(property: 'id', type: 'integer', example: 4),
        new OA\Property(
            property: 'product_id',
            type: 'integer',
            example: 3
        ),
        new OA\Property(
            property: 'product_name',
            type: 'string',
            example: 'Teclado mecánico'
        ),
        new OA\Property(
            property: 'sku',
            type: 'string',
            example: 'TEC-MEC-001'
        ),
        new OA\Property(
            property: 'quantity',
            type: 'integer',
            example: 1
        ),
        new OA\Property(
            property: 'unit_price',
            type: 'number',
            format: 'float',
            example: 64.50
        ),
        new OA\Property(
            property: 'subtotal',
            type: 'number',
            format: 'float',
            example: 64.50
        ),
    ]
)]
#[OA\Schema(
    schema: 'Order',
    required: [
        'id',
        'user',
        'items',
        'total',
        'currency',
        'status',
        'created_at',
        'updated_at',
    ],
    properties: [
        new OA\Property(property: 'id', type: 'integer', example: 3),
        new OA\Property(
            property: 'user',
            ref: '#/components/schemas/User'
        ),
        new OA\Property(
            property: 'items',
            type: 'array',
            items: new OA\Items(
                ref: '#/components/schemas/OrderItem'
            )
        ),
        new OA\Property(
            property: 'total',
            type: 'number',
            format: 'float',
            example: 64.50
        ),
        new OA\Property(
            property: 'currency',
            type: 'string',
            example: 'USD'
        ),
        new OA\Property(
            property: 'status',
            type: 'string',
            enum: ['pending', 'paid'],
            example: 'pending'
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
    schema: 'OrderResponse',
    required: ['message', 'data'],
    properties: [
        new OA\Property(
            property: 'message',
            type: 'string',
            example: 'Orden creada correctamente'
        ),
        new OA\Property(
            property: 'data',
            ref: '#/components/schemas/Order'
        ),
    ]
)]
class OrderSchemas
{
    //
}
