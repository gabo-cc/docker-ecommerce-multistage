"use client";

import { useEffect } from "react";
import Link from "next/link";

export default function ComprasError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Error al cargar las compras:", error);
  }, [error]);

  return (
    <main className="flex min-h-[70vh] flex-col items-center justify-center px-6 text-center">
      <h1 className="text-3xl font-bold text-gray-900">
        No pudimos cargar tus compras
      </h1>

      <p className="mt-4 max-w-md text-gray-500">
        Ocurrió un problema al consultar tus órdenes. Comprueba tu conexión e
        intenta nuevamente.
      </p>

      <div className="mt-8 flex flex-wrap justify-center gap-4">
        <button
          type="button"
          onClick={() => reset()}
          className="rounded-lg bg-black px-6 py-3 font-medium text-white hover:bg-gray-800"
        >
          Reintentar
        </button>

        <Link
          href="/"
          className="rounded-lg border border-gray-300 px-6 py-3 font-medium text-gray-700 hover:bg-gray-50"
        >
          Volver a la tienda
        </Link>
      </div>
    </main>
  );
}
