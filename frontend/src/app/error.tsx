"use client";

import { useEffect } from "react";

export default function ErrorPage({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Error en el catálogo:", error);
  }, [error]);

  return (
    <main className="flex min-h-[70vh] flex-col items-center justify-center px-6 text-center">
      <h1 className="text-3xl font-bold text-gray-900">
        No pudimos cargar los productos
      </h1>

      <p className="mt-4 max-w-md text-gray-500">
        Ocurrió un problema al conectar con la tienda. Intenta nuevamente en
        unos momentos.
      </p>

      <button
        onClick={() => reset()}
        className="mt-8 rounded-lg bg-black px-6 py-3 text-white hover:bg-gray-800"
      >
        Reintentar
      </button>
    </main>
  );
}
