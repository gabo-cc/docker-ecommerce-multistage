import { Suspense } from "react";
import { redirect } from "next/navigation";
import { getUsuarioActual } from "@/lib/session";
import { logoutAction, renovarTokenAction } from "@/actions/auth";

async function CuentaContenido() {
  const usuario = await getUsuarioActual();

  if (!usuario) {
    redirect("/login");
  }

  return (
    <div className="mx-auto w-full max-w-2xl rounded-2xl border border-gray-200 bg-white p-8 shadow-sm">
      <h1 className="text-3xl font-bold text-gray-900">Mi cuenta</h1>

      <p className="mt-3 text-gray-500">Bienvenido, {usuario.name}.</p>

      <div className="mt-8 space-y-4">
        <p>
          <strong>Nombre:</strong> {usuario.name}
        </p>

        <p>
          <strong>Correo:</strong> {usuario.email}
        </p>

        <p>
          <strong>Rol:</strong> {usuario.role}
        </p>
      </div>

      <div className="mt-8 flex flex-wrap gap-3">
        <form action={renovarTokenAction}>
          <button
            type="submit"
            className="rounded-lg border border-gray-300 px-5 py-3 font-medium hover:bg-gray-50"
          >
            Renovar sesión
          </button>
        </form>

        <form action={logoutAction}>
          <button
            type="submit"
            className="rounded-lg bg-black px-5 py-3 font-medium text-white hover:bg-gray-800"
          >
            Cerrar sesión
          </button>
        </form>
      </div>
    </div>
  );
}

export default function CuentaPage() {
  return (
    <main className="min-h-[80vh] bg-gray-50 px-6 py-12">
      <Suspense
        fallback={
          <p className="text-center text-gray-500">Cargando tu cuenta...</p>
        }
      >
        <CuentaContenido />
      </Suspense>
    </main>
  );
}
