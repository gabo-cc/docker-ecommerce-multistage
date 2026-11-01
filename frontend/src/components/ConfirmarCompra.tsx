"use client";

import { useEffect } from "react";
import Link from "next/link";
import { useCarrito } from "@/store/cart-store";

interface Props {
  orderId: number;
}

export default function ConfirmarCompra({ orderId }: Props) {
  useEffect(() => {
    const ordenGuardada = sessionStorage.getItem("checkout_order_id");

    // No vaciar el carrito al visitar compras anteriores
    if (ordenGuardada !== String(orderId)) {
      return;
    }

    function limpiarCarrito() {
      useCarrito.getState().vaciarCarrito();
      sessionStorage.removeItem("checkout_order_id");
    }

    if (useCarrito.persist.hasHydrated()) {
      limpiarCarrito();
      return;
    }

    const unsubscribe = useCarrito.persist.onFinishHydration(limpiarCarrito);

    return unsubscribe;
  }, [orderId]);

  return (
    <div className="mt-8">
      <Link
        href="/"
        className="inline-block rounded-lg bg-black px-6 py-3 font-medium text-white hover:bg-gray-800"
      >
        Seguir comprando
      </Link>
    </div>
  );
}
