import { Suspense } from "react";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { getUsuarioActual } from "@/lib/session";
import { getOrden } from "@/lib/order-queries";

type Props = {
  params: Promise<{ id: string }>;
};

async function DetalleCompra({ params }: Props) {
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

  const estado =
    orden.status === "paid"
      ? "Pagada"
      : orden.status === "pending"
        ? "Pendiente"
        : orden.status === "cancelled"
          ? "Cancelada"
          : orden.status;

  return (
    <main className="mx-auto min-h-[75vh] max-w-5xl px-6 py-12">
      <Link href="/compras" className="text-sm text-gray-500 hover:text-black">
        ← Volver a mis compras
      </Link>

      <header className="mt-8">
        <h1 className="text-3xl font-bold text-gray-900">
          Detalle de la orden #{orden.id}
        </h1>

        <p className="mt-3 text-gray-500">
          Consulta los productos y la información de tu compra.
        </p>
      </header>

      <div className="mt-8 grid gap-8 lg:grid-cols-3">
        <section className="rounded-xl border border-gray-200 p-6 lg:col-span-2">
          <h2 className="text-xl font-semibold">Productos</h2>

          <div className="mt-6 divide-y divide-gray-100">
            {orden.items.map((item) => (
              <div key={item.id} className="flex justify-between gap-4 py-5">
                <div>
                  <h3 className="font-semibold">{item.product_name}</h3>

                  <p className="mt-2 text-sm text-gray-500">SKU: {item.sku}</p>

                  <p className="mt-1 text-sm text-gray-500">
                    Cantidad: {item.quantity}
                  </p>

                  <p className="mt-1 text-sm text-gray-500">
                    Precio unitario: ${Number(item.unit_price).toFixed(2)}
                  </p>
                </div>

                <p className="font-semibold">
                  ${Number(item.subtotal).toFixed(2)}
                </p>
              </div>
            ))}
          </div>
        </section>

        <aside className="h-fit rounded-xl border border-gray-200 p-6">
          <h2 className="text-xl font-semibold">Resumen</h2>

          <p className="mt-5 text-sm text-gray-500">Estado</p>

          <p className="font-medium">{estado}</p>

          <p className="mt-5 text-sm text-gray-500">Fecha</p>

          <p className="font-medium">
            {new Date(orden.created_at).toLocaleDateString("es-SV", {
              day: "2-digit",
              month: "long",
              year: "numeric",
              timeZone: "UTC",
            })}
          </p>

          <div className="mt-6 flex justify-between border-t border-gray-200 pt-5">
            <span className="font-semibold">Total</span>

            <span className="text-xl font-bold">
              ${Number(orden.total).toFixed(2)}
            </span>
          </div>

          {orden.status === "pending" && (
            <Link
              href={`/checkout/pago/${orden.id}`}
              className="mt-6 block rounded-lg bg-black px-5 py-3 text-center text-white hover:bg-gray-800"
            >
              Pagar orden
            </Link>
          )}
        </aside>
      </div>
    </main>
  );
}

export default function DetalleCompraPage({ params }: Props) {
  return (
    <Suspense
      fallback={
        <main className="mx-auto max-w-5xl px-6 py-12">
          <div className="h-10 w-72 animate-pulse rounded bg-gray-200" />
          <div className="mt-8 h-64 animate-pulse rounded-xl bg-gray-100" />
        </main>
      }
    >
      <DetalleCompra params={params} />
    </Suspense>
  );
}
