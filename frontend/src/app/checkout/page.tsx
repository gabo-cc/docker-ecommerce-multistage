import { redirect } from "next/navigation";
import { Suspense } from "react";
import { getUsuarioActual } from "@/lib/session";
import CheckoutContenido from "@/components/CheckoutContenido";

async function CheckoutProtegido() {
  const usuario = await getUsuarioActual();

  if (!usuario) {
    redirect("/login");
  }

  return <CheckoutContenido />;
}

export default function CheckoutPage() {
  return (
    <Suspense
      fallback={
        <main className="mx-auto max-w-5xl px-6 py-12">
          <p className="text-gray-500">Preparando tu compra...</p>
        </main>
      }
    >
      <CheckoutProtegido />
    </Suspense>
  );
}
