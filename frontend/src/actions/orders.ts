"use server";

import { cookies } from "next/headers";
import { revalidatePath } from "next/cache";
import type { CrearOrdenInput, OrdenResponse } from "@/lib/orders";

export type CrearOrdenResult =
  | {
      success: true;
      orderId: number;
    }
  | {
      success: false;
      error: string;
    };

export async function crearOrdenAction(
  input: CrearOrdenInput,
): Promise<CrearOrdenResult> {
  // Obtener el JWT guardado durante el login
  const cookieStore = await cookies();
  const token = cookieStore.get("auth_token")?.value;

  if (!token) {
    return {
      success: false,
      error: "Debes iniciar sesión para comprar.",
    };
  }

  // Validar los productos recibidos
  if (
    !input ||
    !Array.isArray(input.items) ||
    input.items.length === 0 ||
    input.items.some(
      (item) =>
        !Number.isSafeInteger(item.product_id) ||
        item.product_id <= 0 ||
        !Number.isSafeInteger(item.quantity) ||
        item.quantity <= 0,
    )
  ) {
    return {
      success: false,
      error: "El carrito contiene productos inválidos.",
    };
  }

  const API_URL = process.env.API_BASE_URL;

  if (!API_URL) {
    return {
      success: false,
      error: "La API no está configurada.",
    };
  }

  try {
    const response = await fetch(`${API_URL}/orders`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(input),
      cache: "no-store",
    });

    if (!response.ok) {
      if (response.status === 401) {
        return {
          success: false,
          error: "Tu sesión expiró. Inicia sesión nuevamente.",
        };
      }

      if (response.status === 422) {
        return {
          success: false,
          error:
            "Uno de los productos no tiene existencias suficientes o los datos no son válidos.",
        };
      }

      return {
        success: false,
        error: "No se pudo crear la orden.",
      };
    }

    const resultado = (await response.json()) as OrdenResponse;

    const orderId = resultado.data?.id;

    if (!Number.isSafeInteger(orderId) || orderId <= 0) {
      return {
        success: false,
        error:
          "La orden pudo haberse creado, pero no se recibió un identificador válido. Consulta tus órdenes antes de reintentar.",
      };
    }

    // Actualizar las vistas relacionadas con las órdenes
    revalidatePath("/compras");

    return {
      success: true,
      orderId,
    };
  } catch {
    return {
      success: false,
      error:
        "No se pudo confirmar la creación de la orden. Revisa tu historial antes de volver a intentarlo.",
    };
  }
}
