"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useCarrito } from "@/store/cart-store";

export default function CarritoContador() {
  const items = useCarrito((state) => state.items);
  const [hidratado, setHidratado] = useState(false);

  useEffect(() => {
    const actualizar = () => setHidratado(true);

    if (useCarrito.persist.hasHydrated()) {
      actualizar();
    }

    const unsubscribe = useCarrito.persist.onFinishHydration(actualizar);

    return unsubscribe;
  }, []);

  const cantidad = hidratado
    ? items.reduce((total, item) => total + item.cantidad, 0)
    : 0;

  return (
    <Link
      href="/carrito"
      className="relative inline-flex items-center gap-2 hover:text-black"
    >
      <span>Carrito</span>

      {cantidad > 0 && (
        <span className="flex min-w-5 items-center justify-center rounded-full bg-black px-1.5 py-0.5 text-xs text-white">
          {cantidad}
        </span>
      )}
    </Link>
  );
}
