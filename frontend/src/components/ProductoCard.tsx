import Image from "next/image";
import Link from "next/link";
import type { Producto } from "@/lib/types";
import AgregarCarrito from "@/components/AgregarCarrito";

interface Props {
  producto: Producto;
  priority?: boolean;
}

export default function ProductoCard({ producto, priority = false }: Props) {
  return (
    <article className="flex h-full flex-col overflow-hidden rounded-2xl border border-gray-200 bg-white transition-all duration-200 hover:border-gray-300 hover:shadow-md">
      {/* Imagen del producto */}
      <Link
        href={`/productos/${producto.id}`}
        prefetch={false}
        className="block"
      >
        <div className="relative aspect-square bg-gray-50">
          {producto.image_url ? (
            <Image
              src={producto.image_url}
              alt={producto.name}
              fill
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
              preload={priority}
              fetchPriority={priority ? "high" : "auto"}
              className="object-contain p-6 transition-transform duration-300 hover:scale-105"
            />
          ) : (
            <div className="flex h-full items-center justify-center text-sm text-gray-400">
              Imagen no disponible
            </div>
          )}
        </div>
      </Link>

      {/* Información y acciones */}
      <div className="flex flex-1 flex-col p-5">
        <div>
          <h2 className="min-h-14 text-lg leading-7 font-semibold text-gray-900">
            {producto.name}
          </h2>

          <p className="mt-2 line-clamp-2 min-h-10 text-sm leading-5 text-gray-500">
            {producto.description}
          </p>

          <p className="mt-4 text-xl font-bold text-gray-900">
            {producto.formatted_price}
          </p>

          <p className="mt-2 text-sm text-gray-500">
            Disponibles: {producto.stock}
          </p>
        </div>

        {/* Botones alineados en la parte inferior */}
        <div className="mt-auto space-y-3 pt-6">
          <Link
            href={`/productos/${producto.id}`}
            prefetch={false}
            className="flex min-h-12 w-full items-center justify-center rounded-lg border border-gray-300 bg-white px-4 py-3 text-center text-sm font-medium text-gray-900 transition-colors hover:border-gray-900 hover:bg-gray-50"
          >
            Ver producto
          </Link>

          <AgregarCarrito producto={producto} />
        </div>
      </div>
    </article>
  );
}
