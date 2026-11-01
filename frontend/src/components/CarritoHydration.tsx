"use client";

import { useEffect } from "react";
import { useCarrito } from "@/store/cart-store";

export default function CarritoHydration() {
  useEffect(() => {
    void useCarrito.persist.rehydrate();
  }, []);

  return null;
}
