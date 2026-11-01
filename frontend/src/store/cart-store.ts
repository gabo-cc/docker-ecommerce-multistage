import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { Producto } from "@/lib/types";

export interface ItemCarrito {
  producto: Producto;
  cantidad: number;
}

interface CarritoState {
  items: ItemCarrito[];
  agregarProducto: (producto: Producto) => void;
  quitarProducto: (id: number) => void;
  incrementar: (id: number) => void;
  decrementar: (id: number) => void;
  vaciarCarrito: () => void;
}

export const useCarrito = create<CarritoState>()(
  persist(
    (set) => ({
      items: [],

      agregarProducto: (producto) =>
        set((state) => {
          if (producto.stock <= 0) return state;

          const existe = state.items.find(
            (item) => item.producto.id === producto.id,
          );

          if (existe) {
            return {
              items: state.items.map((item) =>
                item.producto.id === producto.id
                  ? {
                      ...item,
                      cantidad: Math.min(item.cantidad + 1, producto.stock),
                    }
                  : item,
              ),
            };
          }

          return {
            items: [...state.items, { producto, cantidad: 1 }],
          };
        }),

      quitarProducto: (id) =>
        set((state) => ({
          items: state.items.filter((item) => item.producto.id !== id),
        })),

      incrementar: (id) =>
        set((state) => ({
          items: state.items.map((item) =>
            item.producto.id === id
              ? {
                  ...item,
                  cantidad: Math.min(item.cantidad + 1, item.producto.stock),
                }
              : item,
          ),
        })),

      decrementar: (id) =>
        set((state) => ({
          items: state.items
            .map((item) =>
              item.producto.id === id
                ? { ...item, cantidad: item.cantidad - 1 }
                : item,
            )
            .filter((item) => item.cantidad > 0),
        })),

      vaciarCarrito: () => set({ items: [] }),
    }),
    {
      name: "ecommerce-carrito",
    },
  ),
);
