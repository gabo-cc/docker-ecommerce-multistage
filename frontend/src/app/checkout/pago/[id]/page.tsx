import { Suspense } from "react";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { getUsuarioActual } from "@/lib/session";
import { getOrden } from "@/lib/order-queries";
import PagoFormulario from "@/components/PagoFormulario";

type Props = {
  params: Promise<{ id: string }>;
};

async function PagoContenido({ params }: Props) {
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

  return (
    <main className="mx-auto max-w-4xl px-6 py-12">
      <Link href="/carrito" className="text-sm text-gray-500 hover:text-black">
        ← Volver al carrito
      </Link>

      <h1 className="mt-8 text-3xl font-bold text-gray-900">
        Pago de la orden #{orden.id}
      </h1>

      <p className="mt-2 text-gray-500">
        Revisa tu orden antes de realizar el pago.
      </p>

      <section className="mt-8 rounded-2xl border border-gray-200 p-6">
        <h2 className="text-xl font-semibold">Resumen de la orden</h2>

        <div className="mt-6 space-y-4">
          {orden.items.map((item) => (
            <div key={item.id} className="flex justify-between gap-4">
              <div>
                <p className="font-medium">{item.product_name}</p>

                <p className="text-sm text-gray-500">
                  Cantidad: {item.quantity}
                </p>
              </div>

              <p className="font-medium">${Number(item.subtotal).toFixed(2)}</p>
            </div>
          ))}
        </div>

        <div className="mt-6 flex justify-between border-t border-gray-200 pt-5 text-xl font-bold">
          <span>Total</span>
          <span>
            ${Number(orden.total).toFixed(2)} {orden.currency}
          </span>
        </div>

        <p className="mt-4 text-sm text-gray-500">Estado: {orden.status}</p>
      </section>

      {orden.status === "pending" ? (
        <PagoFormulario orderId={orden.id} />
      ) : (
        <div className="mt-8 rounded-xl border border-gray-200 p-6">
          <p className="text-gray-700">Esta orden no está pendiente de pago.</p>

          <Link
            href="/cuenta"
            className="mt-4 inline-block text-sm font-medium underline"
          >
            Volver a mi cuenta
          </Link>
        </div>
      )}
    </main>
  );
}

export default function PagoPage({ params }: Props) {
  return (
    <Suspense
      fallback={
        <main className="mx-auto max-w-4xl px-6 py-12">
          <div className="h-10 w-72 animate-pulse rounded bg-gray-200" />
          <div className="mt-8 h-64 animate-pulse rounded-xl bg-gray-100" />
        </main>
      }
    >
      <PagoContenido params={params} />
    </Suspense>
  );
}
