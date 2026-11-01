"use client";

import { useActionState } from "react";
import Link from "next/link";
import { loginAction } from "@/actions/auth";
import { initialAuthState } from "@/lib/auth";

export default function LoginPage() {
  const [state, formAction, pending] = useActionState(
    loginAction,
    initialAuthState,
  );

  return (
    <main className="flex min-h-[85vh] items-center justify-center bg-gray-50 px-5 py-12">
      <div className="w-full max-w-md rounded-2xl border border-gray-200 bg-white px-7 py-10 shadow-sm sm:px-10">
        {/* Identidad visual del e-commerce */}
        <div className="mb-7 flex justify-center">
          <div className="flex h-20 w-20 items-center justify-center rounded-2xl border border-gray-200 bg-gray-50">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="38"
              height="38"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="text-gray-900"
              aria-hidden="true"
            >
              <circle cx="8" cy="21" r="1" />
              <circle cx="19" cy="21" r="1" />
              <path d="M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.72a2 2 0 0 0 2-1.61L22 7H5.12" />
            </svg>
          </div>
        </div>

        <header className="text-center">
          <h1 className="text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl">
            Bienvenido de nuevo
          </h1>

          <p className="mt-3 text-sm text-gray-500">
            Inicia sesión para continuar con tus compras.
          </p>
        </header>

        <form action={formAction} className="mt-9 space-y-5">
          <div>
            <label
              htmlFor="email"
              className="mb-2 block text-sm font-medium text-gray-700"
            >
              Correo electrónico
            </label>

            <input
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              placeholder="correo@ejemplo.com"
              required
              className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-gray-900 outline-none transition placeholder:text-gray-400 focus:border-gray-900 focus:ring-1 focus:ring-gray-900"
            />
          </div>

          <div>
            <label
              htmlFor="password"
              className="mb-2 block text-sm font-medium text-gray-700"
            >
              Contraseña
            </label>

            <input
              id="password"
              name="password"
              type="password"
              autoComplete="current-password"
              placeholder="Ingresa tu contraseña"
              required
              className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-gray-900 outline-none transition placeholder:text-gray-400 focus:border-gray-900 focus:ring-1 focus:ring-gray-900"
            />
          </div>

          {state.error && (
            <p
              role="alert"
              className="rounded-lg bg-red-50 p-3 text-sm text-red-600"
            >
              {state.error}
            </p>
          )}

          <button
            type="submit"
            disabled={pending}
            className="w-full rounded-lg bg-gray-900 px-6 py-3.5 font-medium text-white transition hover:bg-black focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gray-900 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {pending ? "Iniciando sesión..." : "Iniciar sesión"}
          </button>
        </form>

        <p className="mt-7 text-center text-sm text-gray-500">
          ¿No tienes una cuenta?{" "}
          <Link
            href="/registro"
            className="font-semibold text-gray-900 underline underline-offset-4 hover:text-gray-600"
          >
            Regístrate
          </Link>
        </p>
      </div>
    </main>
  );
}
