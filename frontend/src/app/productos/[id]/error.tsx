"use client";

import { useEffect } from "react";
import Link from "next/link";

export default function ProductoError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Error al cargar el producto:", error);
  }, [error]);

  return (
    <main className="flex min-h-[70vh] flex-col items-center justify-center px-6 text-center">
      <h1 className="text-3xl font-bold">No pudimos cargar el producto</h1>

      <p className="mt-4 text-gray-500">
        Ocurrió un error al obtener la información.
      </p>

      <div className="mt-8 flex gap-4">
        <button
          onClick={() => reset()}
          className="rounded-lg bg-black px-6 py-3 text-white"
        >
          Reintentar
        </button>

        <Link href="/" className="rounded-lg border border-gray-300 px-6 py-3">
          Volver al catálogo
        </Link>
      </div>
    </main>
  );
}
