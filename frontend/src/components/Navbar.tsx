import Link from "next/link";
import CarritoContador from "@/components/CarritoContador";
import { getUsuarioActual } from "@/lib/session";
import { logoutAction } from "@/actions/auth";

export default async function Navbar() {
  const usuario = await getUsuarioActual();

  return (
    <header className="border-b border-gray-200 bg-white">
      <nav className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-4 px-6 py-4">
        <Link
          href="/"
          className="text-xl font-bold tracking-tight text-gray-900"
        >
          E-Commerce
        </Link>

        <div className="flex flex-wrap items-center gap-x-5 gap-y-3 text-sm font-medium text-gray-700">
          <Link href="/" className="hover:text-black">
            Productos
          </Link>

          <CarritoContador />

          {usuario ? (
            <>
              <Link href="/compras" className="hover:text-black">
                Mis compras
              </Link>

              <Link href="/cuenta" className="hover:text-black">
                Mi cuenta
              </Link>

              <form action={logoutAction}>
                <button
                  type="submit"
                  className="rounded-lg border border-gray-300 px-4 py-2.5 text-sm font-medium text-gray-900 transition hover:bg-gray-100"
                >
                  Cerrar sesión
                </button>
              </form>
            </>
          ) : (
            <Link
              href="/login"
              className="rounded-lg bg-gray-900 px-4 py-2.5 text-white transition hover:bg-black"
            >
              Ingresar
            </Link>
          )}
        </div>
      </nav>
    </header>
  );
}
