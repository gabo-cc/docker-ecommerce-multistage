import { Suspense } from "react";
import Link from "next/link";
import { redirect } from "next/navigation";
import { getOrdenes } from "@/lib/order-queries";

type Props = {
  searchParams: Promise<{ page?: string }>;
};

function getEstado(status: string) {
  switch (status) {
    case "paid":
      return {
        texto: "Pagada",
        clase: "bg-green-100 text-green-700",
      };

    case "pending":
      return {
        texto: "Pendiente",
        clase: "bg-yellow-100 text-yellow-700",
      };

    case "cancelled":
      return {
        texto: "Cancelada",
        clase: "bg-red-100 text-red-700",
      };

    default:
      return {
        texto: status,
        clase: "bg-gray-100 text-gray-700",
      };
  }
}

// Componente que consulta Laravel
async function HistorialContenido({ searchParams }: Props) {
  const { page } = await searchParams;
  const paginaSolicitada = Number(page);

  const pagina =
    Number.isSafeInteger(paginaSolicitada) && paginaSolicitada > 0
      ? paginaSolicitada
      : 1;

  const resultado = await getOrdenes(pagina);

  if (!resultado) {
    redirect("/login");
  }

  return (
    <main className="mx-auto min-h-[75vh] max-w-6xl px-6 py-12">
      <header className="mb-10">
        <h1 className="text-3xl font-bold text-gray-900">Mis compras</h1>

        <p className="mt-3 text-gray-500">
          Consulta el historial de tus órdenes.
        </p>
      </header>

      {resultado.data.length === 0 ? (
        <div className="rounded-2xl border border-gray-200 p-12 text-center">
          <h2 className="text-xl font-semibold">
            No tienes órdenes para mostrar
          </h2>

          <p className="mt-3 text-gray-500">
            Cuando realices una compra, aparecerá aquí.
          </p>

          <Link
            href="/"
            className="mt-6 inline-block rounded-lg bg-black px-6 py-3 text-white"
          >
            Explorar productos
          </Link>
        </div>
      ) : (
        <section className="space-y-4">
          {resultado.data.map((orden) => {
            const estado = getEstado(orden.status);

            return (
              <article
                key={orden.id}
                className="rounded-xl border border-gray-200 bg-white p-6 transition-shadow hover:shadow-sm"
              >
                <div className="flex flex-wrap items-start justify-between gap-5">
                  <div>
                    <h2 className="text-lg font-semibold text-gray-900">
                      Orden #{orden.id}
                    </h2>

                    <p className="mt-2 text-sm text-gray-500">
                      {new Date(orden.created_at).toLocaleDateString("es-SV", {
                        day: "2-digit",
                        month: "long",
                        year: "numeric",
                        timeZone: "UTC",
                      })}
                    </p>

                    <p className="mt-2 text-sm text-gray-500">
                      {orden.items.length} producto(s) diferentes
                    </p>
                  </div>

                  <span
                    className={`rounded-full px-3 py-1 text-xs font-medium ${estado.clase}`}
                  >
                    {estado.texto}
                  </span>
                </div>

                <div className="mt-6 flex flex-wrap items-center justify-between gap-4 border-t border-gray-100 pt-5">
                  <div>
                    <p className="text-sm text-gray-500">Total</p>

                    <p className="text-xl font-bold">
                      ${Number(orden.total).toFixed(2)}
                    </p>
                  </div>

                  <Link
                    href={`/compras/${orden.id}`}
                    className="rounded-lg bg-black px-5 py-3 text-sm font-medium text-white hover:bg-gray-800"
                  >
                    Ver detalle
                  </Link>
                </div>
              </article>
            );
          })}
        </section>
      )}

      {resultado.meta.last_page > 1 && (
        <nav className="mt-10 flex items-center justify-between">
          {pagina > 1 ? (
            <Link
              href={`/compras?page=${pagina - 1}`}
              className="text-sm font-medium hover:underline"
            >
              ← Anterior
            </Link>
          ) : (
            <span />
          )}

          <span className="text-sm text-gray-500">
            Página {resultado.meta.current_page} de {resultado.meta.last_page}
          </span>

          {pagina < resultado.meta.last_page ? (
            <Link
              href={`/compras?page=${pagina + 1}`}
              className="text-sm font-medium hover:underline"
            >
              Siguiente →
            </Link>
          ) : (
            <span />
          )}
        </nav>
      )}
    </main>
  );
}

// Página con Suspense para carga progresiva
export default function ComprasPage({ searchParams }: Props) {
  return (
    <Suspense
      fallback={
        <main className="mx-auto max-w-6xl px-6 py-12">
          <div className="h-10 w-64 animate-pulse rounded bg-gray-200" />

          <div className="mt-10 space-y-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <div
                key={i}
                className="h-40 animate-pulse rounded-xl bg-gray-100"
              />
            ))}
          </div>
        </main>
      }
    >
      <HistorialContenido searchParams={searchParams} />
    </Suspense>
  );
}
