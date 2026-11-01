<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\StorePaymentRequest;
use App\Http\Resources\PaymentResource;
use App\Models\Order;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\DB;
use OpenApi\Attributes as OA;
use Stripe\Exception\ApiErrorException;
use Stripe\StripeClient;

class PaymentController extends Controller
{
    /**
     * Process a payment for an order.
     */
    #[OA\Post(
        path: '/orders/{order}/payments',
        operationId: 'storePayment',
        summary: 'Procesar el pago de una orden',
        description: 'Procesa mediante Stripe el pago de una orden pendiente.',
        tags: ['Pagos'],
        security: [['bearerAuth' => []]],
        parameters: [
            new OA\Parameter(
                name: 'order',
                in: 'path',
                required: true,
                description: 'Identificador de la orden',
                schema: new OA\Schema(type: 'integer', example: 3)
            ),
        ],
        requestBody: new OA\RequestBody(
            required: true,
            content: new OA\JsonContent(
                ref: '#/components/schemas/StorePayment'
            )
        ),
        responses: [
            new OA\Response(
                response: 201,
                description: 'Pago procesado correctamente',
                content: new OA\JsonContent(
                    ref: '#/components/schemas/PaymentResponse'
                )
            ),
            new OA\Response(
                response: 202,
                description: 'El pago requiere una acción adicional',
                content: new OA\JsonContent(
                    ref: '#/components/schemas/PaymentResponse'
                )
            ),
            new OA\Response(
                response: 401,
                description: 'Token ausente, inválido o vencido'
            ),
            new OA\Response(
                response: 403,
                description: 'El usuario no puede pagar esta orden',
                content: new OA\JsonContent(
                    ref: '#/components/schemas/MessageResponse'
                )
            ),
            new OA\Response(
                response: 404,
                description: 'Orden no encontrada'
            ),
            new OA\Response(
                response: 409,
                description: 'La orden ya fue pagada o no puede procesarse',
                content: new OA\JsonContent(
                    ref: '#/components/schemas/MessageResponse'
                )
            ),
            new OA\Response(
                response: 422,
                description: 'Pago rechazado o error de validación',
                content: new OA\JsonContent(
                    ref: '#/components/schemas/PaymentError'
                )
            ),
            new OA\Response(
                response: 500,
                description: 'Stripe no está configurado correctamente',
                content: new OA\JsonContent(
                    ref: '#/components/schemas/MessageResponse'
                )
            ),
        ]
    )]
    public function store(
        StorePaymentRequest $request,
        Order $order
    ): JsonResponse {
        if (
            ! $request->user()->isAdmin()
            && $order->user_id !== $request->user()->id
        ) {
            return response()->json([
                'message' => 'No tienes permiso para pagar esta orden.',
            ], 403);
        }

        if ($order->status !== 'pending') {
            return response()->json([
                'message' => 'Esta orden ya fue pagada o no puede procesarse.',
            ], 409);
        }

        $stripeSecret = (string) config('services.stripe.secret');

        if ($stripeSecret === '') {
            return response()->json([
                'message' => 'Stripe no está configurado correctamente.',
            ], 500);
        }

        $payment = $order->payments()->create([
            'amount' => $order->total,
            'currency' => strtolower($order->currency),
            'status' => 'pending',
        ]);

        try {
            $stripe = new StripeClient($stripeSecret);

            $paymentIntent = $stripe->paymentIntents->create([
                'amount' => (int) round((float) $order->total * 100),
                'currency' => strtolower($order->currency),
                'payment_method' => $request->validated('payment_method_id'),
                'confirm' => true,
                'automatic_payment_methods' => [
                    'enabled' => true,
                    'allow_redirects' => 'never',
                ],
                'description' => "Pago de la orden #{$order->id}",
                'metadata' => [
                    'order_id' => (string) $order->id,
                    'user_id' => (string) $order->user_id,
                ],
            ]);

            DB::transaction(function () use (
                $payment,
                $paymentIntent,
                $order
            ): void {
                $payment->update([
                    'stripe_payment_intent_id' => $paymentIntent->id,
                    'status' => $paymentIntent->status,
                    'failure_message' => null,
                    'paid_at' => $paymentIntent->status === 'succeeded'
                        ? now()
                        : null,
                ]);

                if ($paymentIntent->status === 'succeeded') {
                    $order->update([
                        'status' => 'paid',
                    ]);
                }
            });

            return response()->json([
                'message' => $paymentIntent->status === 'succeeded'
                    ? 'Pago procesado correctamente'
                    : 'El pago requiere una acción adicional',
                'data' => new PaymentResource($payment->refresh()),
                'client_secret' => $paymentIntent->client_secret,
            ], $paymentIntent->status === 'succeeded' ? 201 : 202);
        } catch (ApiErrorException $exception) {
            $payment->update([
                'status' => 'failed',
                'failure_message' => $exception->getMessage(),
            ]);

            return response()->json([
                'message' => 'No fue posible procesar el pago.',
                'error' => $exception->getMessage(),
            ], 422);
        }
    }
}
