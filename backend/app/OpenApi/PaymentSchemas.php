<?php

namespace App\OpenApi;

use OpenApi\Attributes as OA;

#[OA\Schema(
    schema: 'StorePayment',
    required: ['payment_method_id'],
    properties: [
        new OA\Property(
            property: 'payment_method_id',
            type: 'string',
            example: 'pm_card_visa',
            description: 'Identificador del método de pago de Stripe.'
        ),
    ]
)]
#[OA\Schema(
    schema: 'Payment',
    required: [
        'id',
        'order_id',
        'amount',
        'currency',
        'status',
        'created_at',
    ],
    properties: [
        new OA\Property(property: 'id', type: 'integer', example: 2),
        new OA\Property(
            property: 'order_id',
            type: 'integer',
            example: 3
        ),
        new OA\Property(
            property: 'stripe_payment_intent_id',
            type: 'string',
            nullable: true,
            example: 'pi_3UFGj7QmpqU0ynSo0KaaX9vG'
        ),
        new OA\Property(
            property: 'amount',
            type: 'number',
            format: 'float',
            example: 64.50
        ),
        new OA\Property(
            property: 'currency',
            type: 'string',
            example: 'usd'
        ),
        new OA\Property(
            property: 'status',
            type: 'string',
            enum: ['pending', 'succeeded', 'failed'],
            example: 'succeeded'
        ),
        new OA\Property(
            property: 'failure_message',
            type: 'string',
            nullable: true
        ),
        new OA\Property(
            property: 'paid_at',
            type: 'string',
            format: 'date-time',
            nullable: true
        ),
        new OA\Property(
            property: 'created_at',
            type: 'string',
            format: 'date-time'
        ),
    ]
)]
#[OA\Schema(
    schema: 'PaymentResponse',
    required: ['message', 'data'],
    properties: [
        new OA\Property(
            property: 'message',
            type: 'string',
            example: 'Pago procesado correctamente'
        ),
        new OA\Property(
            property: 'data',
            ref: '#/components/schemas/Payment'
        ),
        new OA\Property(
            property: 'client_secret',
            type: 'string',
            nullable: true,
            description: 'Secreto utilizado por Stripe.js cuando el pago requiere una acción adicional.'
        ),
    ]
)]
#[OA\Schema(
    schema: 'PaymentError',
    required: ['message', 'error'],
    properties: [
        new OA\Property(
            property: 'message',
            type: 'string',
            example: 'No fue posible procesar el pago.'
        ),
        new OA\Property(
            property: 'error',
            type: 'string',
            example: 'Your card was declined.'
        ),
    ]
)]
class PaymentSchemas
{
    //
}
