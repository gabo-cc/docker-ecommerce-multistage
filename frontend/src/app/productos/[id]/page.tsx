import { Suspense } from "react";
import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { getProducto } from "@/lib/products";
import AgregarCarrito from "@/components/AgregarCarrito";

type Props = {
  params: Promise<{ id: string }>;
};

// Generar metadata SEO dinámica
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const productoId = Number(id);

  if (!Number.isSafeInteger(productoId) || productoId <= 0) {
    return { title: "Producto no encontrado" };
  }

  const producto = await getProducto(productoId);

  return {
    title: `${producto.name} | E-Commerce`,
    description:
      producto.description ?? `Compra ${producto.name} en nuestra tienda.`,
  };
}

// Obtener y mostrar el detalle desde Laravel
async function ProductoDetalle({ params }: Props) {
  const { id } = await params;
  const productoId = Number(id);

  if (!Number.isSafeInteger(productoId) || productoId <= 0) {
    notFound();
  }

  const producto = await getProducto(productoId);

  return (
    <main className="mx-auto max-w-5xl px-6 py-12">
      <Link href="/" className="text-sm text-gray-500 hover:text-black">
        ← Volver al catálogo
      </Link>

      <div className="mt-10 grid gap-10 rounded-2xl border border-gray-200 p-8 md:grid-cols-2">
        {/* Imagen optimizada del producto */}
        <div className="relative aspect-square overflow-hidden rounded-xl bg-gray-50">
          {producto.image_url ? (
            <Image
              src={producto.image_url}
              alt={producto.name}
              fill
              sizes="(max-width: 768px) 100vw, 50vw"
              className="object-contain p-6"
            />
          ) : (
            <div className="flex h-full items-center justify-center text-gray-400">
              Imagen no disponible
            </div>
          )}
        </div>

        {/* Información del producto */}
        <div className="flex flex-col justify-center">
          <h1 className="text-3xl font-bold text-gray-900">{producto.name}</h1>

          <p className="mt-4 text-gray-600">{producto.description}</p>

          <p className="mt-6 text-3xl font-semibold text-gray-900">
            {producto.formatted_price}
          </p>

          <p className="mt-4 text-sm text-gray-500">
            Disponibles: {producto.stock}
          </p>

          <p className="mt-2 text-sm text-gray-500">SKU: {producto.sku}</p>

          {/* Botón para agregar al carrito */}
          <div className="mt-8 max-w-xs">
            <AgregarCarrito producto={producto} />
          </div>
        </div>
      </div>
    </main>
  );
}

// Página principal con Suspense
export default function ProductoPage({ params }: Props) {
  return (
    <Suspense fallback={<ProductoSkeleton />}>
      <ProductoDetalle params={params} />
    </Suspense>
  );
}

// Skeleton mientras carga el detalle
function ProductoSkeleton() {
  return (
    <main className="mx-auto max-w-5xl px-6 py-12">
      <div className="h-5 w-40 animate-pulse rounded bg-gray-200" />

      <div className="mt-10 grid gap-10 rounded-2xl border border-gray-200 p-8 md:grid-cols-2">
        {/* Skeleton de la imagen */}
        <div className="aspect-square animate-pulse rounded-xl bg-gray-200" />

        {/* Skeleton de la información */}
        <div className="flex flex-col justify-center space-y-5">
          <div className="h-10 w-3/4 animate-pulse rounded bg-gray-200" />
          <div className="h-5 w-full animate-pulse rounded bg-gray-200" />
          <div className="h-5 w-2/3 animate-pulse rounded bg-gray-200" />
          <div className="h-8 w-32 animate-pulse rounded bg-gray-200" />
          <div className="h-5 w-24 animate-pulse rounded bg-gray-200" />
          <div className="h-12 w-48 animate-pulse rounded-lg bg-gray-200" />
        </div>
      </div>
    </main>
  );
}
