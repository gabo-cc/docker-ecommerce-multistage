import { notFound } from "next/navigation";
import type { Producto, RespuestaProductos } from "./types";

const API_URL = process.env.API_BASE_URL;

export async function getProductos(page = 1): Promise<RespuestaProductos> {
  if (!API_URL) {
    throw new Error("API_BASE_URL no configurada");
  }

  const response = await fetch(`${API_URL}/products?page=${page}`, {
    next: { revalidate: 60 },
  });

  if (!response.ok) {
    throw new Error("Error al obtener productos");
  }

  return (await response.json()) as RespuestaProductos;
}

export async function getProducto(id: number): Promise<Producto> {
  if (!API_URL) {
    throw new Error("API_BASE_URL no configurada");
  }

  const response = await fetch(`${API_URL}/products/${id}`, {
    next: { revalidate: 60 },
  });

  // Producto inexistente en Laravel
  if (response.status === 404) {
    notFound();
  }

  if (!response.ok) {
    throw new Error("Error al obtener el producto");
  }

  const resultado = (await response.json()) as {
    data: Producto;
  };

  return resultado.data;
}
