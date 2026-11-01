import Link from "next/link";

export default function CompraNoEncontrada() {
  return (
    <main className="flex min-h-[75vh] flex-col items-center justify-center px-6 text-center">
      <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-gray-100">
        <span className="text-4xl">📦</span>
      </div>

      <h1 className="text-4xl font-bold text-gray-900">
        ¡Ups! No encontramos esa compra
      </h1>

      <p className="mt-4 max-w-md text-gray-500">
        La orden que intentas consultar no existe o no está disponible para tu
        cuenta.
      </p>

      <div className="mt-8 flex flex-wrap justify-center gap-4">
        <Link
          href="/compras"
          className="rounded-lg bg-black px-6 py-3 font-medium text-white transition hover:bg-gray-800"
        >
          Volver a mis compras
        </Link>

        <Link
          href="/"
          className="rounded-lg border border-gray-300 px-6 py-3 font-medium text-gray-700 transition hover:bg-gray-50"
        >
          Ir a la tienda
        </Link>
      </div>

      <span className="mt-8 text-sm text-gray-400">
        Error 404 · Compra no encontrada
      </span>
    </main>
  );
}
