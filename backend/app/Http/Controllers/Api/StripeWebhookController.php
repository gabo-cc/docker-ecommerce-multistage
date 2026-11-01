<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Payment;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Stripe\Exception\SignatureVerificationException;
use Stripe\Webhook;
use UnexpectedValueException;

class StripeWebhookController extends Controller
{
    public function handle(Request $request): JsonResponse
    {
        try {
            $event = Webhook::constructEvent(
                $request->getContent(),
                $request->header('Stripe-Signature'),
                config('services.stripe.webhook_secret')
            );
        } catch (UnexpectedValueException|SignatureVerificationException) {
            return response()->json([
                'message' => 'Firma del webhook no válida.',
            ], 400);
        }

        if ($event->type === 'payment_intent.succeeded') {
            $this->handlePaymentSucceeded($event->data->object);
        }

        if ($event->type === 'payment_intent.payment_failed') {
            $this->handlePaymentFailed($event->data->object);
        }

        return response()->json([
            'message' => 'Evento recibido correctamente.',
        ]);
    }

    private function handlePaymentSucceeded(object $paymentIntent): void
    {
        $payment = Payment::where(
            'stripe_payment_intent_id',
            $paymentIntent->id
        )->first();

        if (! $payment) {
            return;
        }

        $payment->update([
            'status' => 'succeeded',
            'failure_message' => null,
            'paid_at' => now(),
        ]);

        $payment->order()->update([
            'status' => 'paid',
        ]);
    }

    private function handlePaymentFailed(object $paymentIntent): void
    {
        $payment = Payment::where(
            'stripe_payment_intent_id',
            $paymentIntent->id
        )->first();

        if (! $payment) {
            return;
        }

        $payment->update([
            'status' => 'failed',
            'failure_message' => $paymentIntent->last_payment_error?->message
                ?? 'El pago fue rechazado.',
        ]);
    }
}
