"use client";

import { useEffect, useRef, useState } from "react";
import type { Producto } from "@/lib/types";
import { useCarrito } from "@/store/cart-store";

interface Props {
  producto: Producto;
}

export default function AgregarCarrito({ producto }: Props) {
  const agregarProducto = useCarrito((state) => state.agregarProducto);

  const [agregado, setAgregado] = useState(false);
  const temporizador = useRef<ReturnType<typeof setTimeout> | null>(null);

  const sinStock = producto.stock <= 0;

  function handleAgregar() {
    if (sinStock) return;

    agregarProducto(producto);
    setAgregado(true);

    if (temporizador.current) {
      clearTimeout(temporizador.current);
    }

    temporizador.current = setTimeout(() => {
      setAgregado(false);
      temporizador.current = null;
    }, 1200);
  }

  useEffect(() => {
    return () => {
      if (temporizador.current) {
        clearTimeout(temporizador.current);
      }
    };
  }, []);

  return (
    <button
      type="button"
      onClick={handleAgregar}
      disabled={sinStock}
      className="flex min-h-12 w-full items-center justify-center gap-2 rounded-lg bg-gray-900 px-4 py-3 text-sm font-medium text-white transition-colors hover:bg-black disabled:cursor-not-allowed disabled:bg-gray-300 disabled:text-gray-500"
    >
      {agregado && !sinStock ? (
        <svg
          width="19"
          height="19"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <path d="m5 12 4 4L19 6" />
        </svg>
      ) : (
        <svg
          width="19"
          height="19"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <circle cx="8" cy="21" r="1" />
          <circle cx="19" cy="21" r="1" />
          <path d="M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.72a2 2 0 0 0 2-1.61L22 7H5.12" />
        </svg>
      )}

      <span>
        {sinStock
          ? "Agotado"
          : agregado
            ? "Producto agregado"
            : "Agregar al carrito"}
      </span>
    </button>
  );
}
