"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { procesarPagoAction } from "@/actions/payments";

interface Props {
  orderId: number;
}

export default function PagoFormulario({ orderId }: Props) {
  const router = useRouter();

  const [procesando, setProcesando] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handlePagar(paymentMethodId: string) {
    if (procesando) return;

    setProcesando(true);
    setError(null);

    try {
      const resultado = await procesarPagoAction(orderId, paymentMethodId);

      if (!resultado.success) {
        setError(resultado.error);
        return;
      }

      router.push(`/checkout/confirmacion/${orderId}`);
    } catch {
      setError(
        "No se pudo confirmar el resultado del pago. Consulta tu orden antes de reintentar.",
      );
    } finally {
      setProcesando(false);
    }
  }

  return (
    <section className="mt-8 rounded-2xl border border-gray-200 bg-white p-6">
      <h2 className="text-xl font-semibold text-gray-900">Pago con Stripe</h2>

      <p className="mt-2 text-sm text-gray-500">
        Esta tienda utiliza Stripe en modo de pruebas. No se realizarán cargos
        reales.
      </p>

      {error && (
        <p
          role="alert"
          className="mt-5 rounded-lg bg-red-50 p-4 text-sm text-red-700"
        >
          {error}
        </p>
      )}

      <div className="mt-6 space-y-3">
        <button
          type="button"
          disabled={procesando}
          onClick={() => handlePagar("pm_card_visa")}
          className="w-full rounded-lg bg-black px-6 py-3 font-medium text-white hover:bg-gray-800 disabled:opacity-50"
        >
          {procesando ? "Procesando pago..." : "Pagar con tarjeta de prueba"}
        </button>

        <button
          type="button"
          disabled={procesando}
          onClick={() => handlePagar("pm_card_chargeDeclined")}
          className="w-full rounded-lg border border-gray-300 px-6 py-3 font-medium text-gray-800 hover:bg-gray-50 disabled:opacity-50"
        >
          Simular pago rechazado
        </button>
      </div>

      <p className="mt-5 text-xs text-gray-500">
        No cierres ni actualices la página mientras se procesa el pago.
      </p>
    </section>
  );
}
