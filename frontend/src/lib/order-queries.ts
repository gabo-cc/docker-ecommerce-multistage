import "server-only";

import { cookies } from "next/headers";
import type { Orden, OrdenResponse } from "@/lib/orders";

const API_URL = process.env.API_BASE_URL;

export interface RespuestaOrdenes {
  data: Orden[];
  links: {
    first: string | null;
    last: string | null;
    prev: string | null;
    next: string | null;
  };
  meta: {
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
  };
}

// Obtener el token JWT del usuario
async function getToken(): Promise<string | null> {
  const cookieStore = await cookies();
  return cookieStore.get("auth_token")?.value ?? null;
}

// Consultar el historial de compras
export async function getOrdenes(page = 1): Promise<RespuestaOrdenes | null> {
  if (!API_URL) {
    throw new Error("API_BASE_URL no configurada");
  }

  const token = await getToken();

  if (!token) {
    return null;
  }

  const response = await fetch(`${API_URL}/orders?page=${page}`, {
    headers: {
      Accept: "application/json",
      Authorization: `Bearer ${token}`,
    },
    cache: "no-store",
  });

  if (response.status === 401) {
    return null;
  }

  if (!response.ok) {
    throw new Error("No se pudo cargar el historial.");
  }

  return (await response.json()) as RespuestaOrdenes;
}

// Consultar el detalle de una orden
export async function getOrden(orderId: number): Promise<Orden | null> {
  if (!Number.isSafeInteger(orderId) || orderId <= 0) {
    return null;
  }

  if (!API_URL) {
    throw new Error("API_BASE_URL no configurada");
  }

  const token = await getToken();

  if (!token) {
    return null;
  }

  const response = await fetch(`${API_URL}/orders/${orderId}`, {
    headers: {
      Accept: "application/json",
      Authorization: `Bearer ${token}`,
    },
    cache: "no-store",
  });

  if (
    response.status === 401 ||
    response.status === 403 ||
    response.status === 404
  ) {
    return null;
  }

  if (!response.ok) {
    throw new Error("No se pudo consultar la orden.");
  }

  const resultado = (await response.json()) as OrdenResponse;

  return resultado.data;
}
