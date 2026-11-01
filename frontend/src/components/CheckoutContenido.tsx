"use client";

import { useState, useSyncExternalStore } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCarrito } from "@/store/cart-store";
import { crearOrdenAction } from "@/actions/orders";

const subscribe = (callback: () => void) =>
  useCarrito.persist.onFinishHydration(callback);

const getSnapshot = () => useCarrito.persist.hasHydrated();

const getServerSnapshot = () => false;

export default function CheckoutContenido() {
  const router = useRouter();

  const items = useCarrito((state) => state.items);
  const hidratado = useSyncExternalStore(
    subscribe,
    getSnapshot,
    getServerSnapshot,
  );

  const [procesando, setProcesando] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const total = items.reduce(
    (acumulado, item) => acumulado + item.producto.price * item.cantidad,
    0,
  );

  async function handleCrearOrden() {
    if (procesando || items.length === 0) return;

    setProcesando(true);
    setError(null);

    try {
      const resultado = await crearOrdenAction({
        items: items.map(({ producto, cantidad }) => ({
          product_id: producto.id,
          quantity: cantidad,
        })),
      });

      if (!resultado.success) {
        setError(resultado.error);
        return;
      }

      sessionStorage.setItem("checkout_order_id", String(resultado.orderId));

      router.push(`/checkout/pago/${resultado.orderId}`);
      setError(
        "No se pudo confirmar la orden. Revisa tus compras antes de intentarlo nuevamente.",
      );
    } finally {
      setProcesando(false);
    }
  }

  if (!hidratado) {
    return (
      <main className="mx-auto max-w-5xl px-6 py-12">
        <p className="text-gray-500">Recuperando tu carrito...</p>
      </main>
    );
  }

  if (items.length === 0) {
    return (
      <main className="mx-auto max-w-5xl px-6 py-12 text-center">
        <h1 className="text-3xl font-bold">Tu carrito está vacío</h1>

        <Link
          href="/"
          className="mt-6 inline-block rounded-lg bg-black px-6 py-3 text-white"
        >
          Explorar productos
        </Link>
      </main>
    );
  }

  return (
    <main className="mx-auto max-w-5xl px-6 py-12">
      <h1 className="text-3xl font-bold">Finalizar compra</h1>

      <p className="mt-2 text-gray-500">
        Revisa tu pedido antes de crear la orden.
      </p>

      <div className="mt-10 grid gap-8 lg:grid-cols-3">
        <section className="space-y-4 lg:col-span-2">
          {items.map(({ producto, cantidad }) => (
            <article
              key={producto.id}
              className="flex justify-between gap-4 rounded-xl border border-gray-200 p-5"
            >
              <div>
                <h2 className="font-semibold">{producto.name}</h2>

                <p className="mt-2 text-sm text-gray-500">
                  Cantidad: {cantidad}
                </p>
              </div>

              <p className="font-semibold">
                ${(producto.price * cantidad).toFixed(2)}
              </p>
            </article>
          ))}
        </section>

        <aside className="h-fit rounded-xl border border-gray-200 p-6">
          <h2 className="text-xl font-bold">Resumen del pedido</h2>

          <div className="mt-6 flex justify-between">
            <span>Total estimado</span>
            <strong>${total.toFixed(2)}</strong>
          </div>

          <p className="mt-3 text-xs text-gray-500">
            Laravel verificará los precios y las existencias al crear la orden.
          </p>

          {error && (
            <p
              role="alert"
              className="mt-5 rounded-lg bg-red-50 p-3 text-sm text-red-600"
            >
              {error}
            </p>
          )}

          <button
            type="button"
            onClick={handleCrearOrden}
            disabled={procesando}
            className="mt-6 w-full rounded-lg bg-black px-5 py-3 font-medium text-white hover:bg-gray-800 disabled:opacity-50"
          >
            {procesando ? "Creando orden..." : "Crear orden y continuar"}
          </button>

          <Link
            href="/carrito"
            className="mt-4 block text-center text-sm text-gray-500 hover:text-black"
          >
            Volver al carrito
          </Link>
        </aside>
      </div>
    </main>
  );
}
