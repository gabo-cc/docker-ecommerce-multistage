"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useCarrito } from "@/store/cart-store";

export default function CarritoPage() {
  const { items, incrementar, decrementar, quitarProducto, vaciarCarrito } =
    useCarrito();

  const [hidratado, setHidratado] = useState(false);

  useEffect(() => {
    async function cargarCarrito() {
      await useCarrito.persist.rehydrate();
      setHidratado(true);
    }

    void cargarCarrito();
  }, []);

  const total = items.reduce(
    (acumulado, item) => acumulado + item.producto.price * item.cantidad,
    0,
  );

  if (!hidratado) {
    return (
      <main className="mx-auto max-w-6xl px-6 py-12">
        <p className="text-gray-500">Cargando carrito...</p>
      </main>
    );
  }

  return (
    <main className="mx-auto min-h-[75vh] max-w-6xl px-6 py-12">
      <h1 className="mb-8 text-3xl font-bold text-gray-900">Mi carrito</h1>

      {items.length === 0 ? (
        <div className="rounded-2xl border border-gray-200 p-12 text-center">
          <h2 className="text-xl font-semibold">Tu carrito está vacío</h2>

          <p className="mt-3 text-gray-500">
            Explora nuestra tienda y agrega algunos productos.
          </p>

          <Link
            href="/"
            className="mt-6 inline-block rounded-lg bg-black px-6 py-3 text-white hover:bg-gray-800"
          >
            Explorar productos
          </Link>
        </div>
      ) : (
        <div className="grid gap-8 lg:grid-cols-3">
          {/* Lista de productos */}
          <section className="space-y-4 lg:col-span-2">
            {items.map(({ producto, cantidad }) => (
              <article
                key={producto.id}
                className="flex flex-col gap-5 rounded-xl border border-gray-200 p-5 sm:flex-row"
              >
                <div className="relative h-32 w-32 shrink-0 overflow-hidden rounded-lg bg-gray-50">
                  {producto.image_url ? (
                    <Image
                      src={producto.image_url}
                      alt={producto.name}
                      fill
                      sizes="128px"
                      className="object-contain p-3"
                    />
                  ) : (
                    <div className="flex h-full items-center justify-center text-xs text-gray-400">
                      Sin imagen
                    </div>
                  )}
                </div>

                <div className="flex flex-1 flex-col justify-between gap-4">
                  <div>
                    <Link
                      href={`/productos/${producto.id}`}
                      className="text-lg font-semibold hover:underline"
                    >
                      {producto.name}
                    </Link>

                    <p className="mt-2 text-gray-500">
                      {producto.formatted_price}
                    </p>
                  </div>

                  <div className="flex flex-wrap items-center justify-between gap-4">
                    <div className="flex items-center rounded-lg border border-gray-300">
                      <button
                        type="button"
                        onClick={() => decrementar(producto.id)}
                        aria-label={`Disminuir cantidad de ${producto.name}`}
                        className="px-4 py-2 hover:bg-gray-100"
                      >
                        −
                      </button>

                      <span className="min-w-8 text-center">{cantidad}</span>

                      <button
                        type="button"
                        onClick={() => incrementar(producto.id)}
                        disabled={cantidad >= producto.stock}
                        aria-label={`Aumentar cantidad de ${producto.name}`}
                        className="px-4 py-2 hover:bg-gray-100 disabled:opacity-30"
                      >
                        +
                      </button>
                    </div>

                    <button
                      type="button"
                      onClick={() => quitarProducto(producto.id)}
                      className="text-sm text-red-600 hover:underline"
                    >
                      Eliminar
                    </button>
                  </div>
                </div>
              </article>
            ))}

            <button
              type="button"
              onClick={vaciarCarrito}
              className="text-sm text-gray-500 underline hover:text-black"
            >
              Vaciar carrito
            </button>
          </section>

          {/* Resumen de compra */}
          <aside className="h-fit rounded-xl border border-gray-200 p-6">
            <h2 className="text-xl font-bold">Resumen de compra</h2>

            <div className="mt-6 flex justify-between text-gray-600">
              <span>Subtotal</span>
              <span>${total.toFixed(2)}</span>
            </div>

            <div className="mt-5 flex justify-between border-t border-gray-200 pt-5 text-xl font-bold">
              <span>Total estimado</span>
              <span>${total.toFixed(2)}</span>
            </div>

            <p className="mt-3 text-xs text-gray-500">
              El precio y las existencias se verificarán al crear la orden.
            </p>

            <Link
              href="/checkout"
              className="mt-6 block rounded-lg bg-black px-5 py-3 text-center font-medium text-white hover:bg-gray-800"
            >
              Continuar al pago
            </Link>

            <Link
              href="/"
              className="mt-4 block text-center text-sm text-gray-500 hover:text-black"
            >
              Seguir comprando
            </Link>
          </aside>
        </div>
      )}
    </main>
  );
}
