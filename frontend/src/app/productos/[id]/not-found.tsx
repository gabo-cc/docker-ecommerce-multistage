import Link from "next/link";

export default function ProductoNoEncontrado() {
  return (
    <main className="flex min-h-[70vh] flex-col items-center justify-center px-6 text-center">
      <h1 className="text-6xl font-bold text-gray-900">404</h1>

      <h2 className="mt-4 text-2xl font-semibold">Producto no encontrado</h2>

      <p className="mt-3 text-gray-500">
        El producto que buscas no existe o ya no está disponible.
      </p>

      <Link
        href="/"
        className="mt-8 rounded-lg bg-black px-6 py-3 text-white hover:bg-gray-800"
      >
        Volver al catálogo
      </Link>
    </main>
  );
}
