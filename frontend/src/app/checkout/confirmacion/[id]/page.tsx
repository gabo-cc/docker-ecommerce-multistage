import { Suspense } from "react";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { getUsuarioActual } from "@/lib/session";
import { getOrden } from "@/lib/order-queries";
import ConfirmarCompra from "@/components/ConfirmarCompra";

type Props = {
  params: Promise<{ id: string }>;
};

async function ConfirmacionContenido({ params }: Props) {
  const usuario = await getUsuarioActual();

  if (!usuario) {
    redirect("/login");
  }

  const { id } = await params;
  const orderId = Number(id);

  if (!Number.isSafeInteger(orderId) || orderId <= 0) {
    notFound();
  }

  const orden = await getOrden(orderId);

  if (!orden) {
    notFound();
  }

  // La orden debe estar pagada para mostrar confirmación.
  if (orden.status !== "paid") {
    return (
      <main className="mx-auto max-w-3xl px-6 py-12">
        <h1 className="text-3xl font-bold">Pago pendiente de confirmación</h1>

        <p className="mt-4 text-gray-600">
          La orden #{orden.id} todavía no aparece como pagada. No se modificará
          tu carrito.
        </p>

        <Link
          href={`/checkout/pago/${orden.id}`}
          className="mt-6 inline-block rounded-lg bg-black px-6 py-3 text-white"
        >
          Consultar pago
        </Link>
      </main>
    );
  }

  return (
    <main className="mx-auto max-w-3xl px-6 py-12">
      <div className="rounded-2xl border border-gray-200 bg-white p-8 text-center">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-green-100 text-3xl text-green-700">
          ✓
        </div>

        <h1 className="mt-6 text-3xl font-bold text-gray-900">
          ¡Compra realizada correctamente!
        </h1>

        <p className="mt-3 text-gray-600">
          Tu pago fue confirmado por Laravel y Stripe.
        </p>

        <div className="mt-8 rounded-xl bg-gray-50 p-6 text-left">
          <p className="text-sm text-gray-500">Número de orden</p>
          <p className="font-semibold">#{orden.id}</p>

          <p className="mt-4 text-sm text-gray-500">Total pagado</p>
          <p className="text-xl font-bold">
            ${Number(orden.total).toFixed(2)} {orden.currency}
          </p>

          <p className="mt-4 text-sm text-gray-500">Estado</p>
          <p className="font-semibold text-green-700">Pagada</p>
        </div>

        <ConfirmarCompra orderId={orden.id} />
      </div>
    </main>
  );
}

export default function ConfirmacionPage({ params }: Props) {
  return (
    <Suspense
      fallback={
        <main className="mx-auto max-w-3xl px-6 py-12">
          <div className="h-72 animate-pulse rounded-2xl bg-gray-100" />
        </main>
      }
    >
      <ConfirmacionContenido params={params} />
    </Suspense>
  );
}
