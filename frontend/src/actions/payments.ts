"use server";

import { cookies } from "next/headers";
import { revalidatePath } from "next/cache";
import type {
  PagoResponse,
  PagoError,
  ProcesarPagoResult,
} from "@/lib/payments";

export async function procesarPagoAction(
  orderId: number,
  paymentMethodId: string,
): Promise<ProcesarPagoResult> {
  // Validar identificador de la orden
  if (!Number.isSafeInteger(orderId) || orderId <= 0) {
    return {
      success: false,
      error: "La orden no es válida.",
    };
  }

  // Permitir únicamente métodos de prueba definidos
  const metodosPermitidos = ["pm_card_visa", "pm_card_chargeDeclined"];

  if (!metodosPermitidos.includes(paymentMethodId)) {
    return {
      success: false,
      error: "Método de prueba no permitido.",
    };
  }

  const cookieStore = await cookies();
  const token = cookieStore.get("auth_token")?.value;

  if (!token) {
    return {
      success: false,
      error: "Debes iniciar sesión para continuar.",
    };
  }

  const API_URL = process.env.API_BASE_URL;

  if (!API_URL) {
    return {
      success: false,
      error: "La API no está configurada.",
    };
  }

  let response: Response;

  try {
    response = await fetch(`${API_URL}/orders/${orderId}/payments`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        payment_method_id: paymentMethodId,
      }),
      cache: "no-store",
    });
  } catch {
    return {
      success: false,
      error:
        "No se pudo confirmar el resultado del pago. Consulta el estado de tu orden antes de volver a intentarlo.",
    };
  }

  if (response.status === 401) {
    return {
      success: false,
      error: "Tu sesión expiró. Inicia sesión nuevamente.",
    };
  }

  if (response.status === 403 || response.status === 404) {
    return {
      success: false,
      error: "No tienes acceso a esta orden o no existe.",
    };
  }

  if (response.status === 409) {
    return {
      success: false,
      error: "La orden ya fue pagada o no puede procesarse nuevamente.",
    };
  }

  if (response.status === 422) {
    const data: PagoError = await response.json();

    return {
      success: false,
      error: data.error ?? data.message ?? "El pago fue rechazado.",
    };
  }

  if (response.status === 500) {
    return {
      success: false,
      error: "No se pudo procesar el pago en Stripe.",
    };
  }

  if (response.status !== 201 && response.status !== 202) {
    return {
      success: false,
      error: "Ocurrió un error al procesar el pago.",
    };
  }

  const resultado = (await response.json()) as PagoResponse;

  if (response.status === 202 || resultado.data?.status === "requires_action") {
    return {
      success: false,
      requiresAction: true,
      error:
        "El pago requiere autenticación adicional. Todavía no se ha completado.",
    };
  }

  if (resultado.data?.status !== "succeeded") {
    return {
      success: false,
      error:
        "El pago todavía no está confirmado. Consulta el estado de la orden.",
    };
  }

  // Actualizar las vistas relacionadas
  revalidatePath("/compras");
  revalidatePath(`/checkout/pago/${orderId}`);
  revalidatePath(`/checkout/confirmacion/${orderId}`);
  revalidatePath("/");

  return {
    success: true,
    orderId,
    status: "succeeded",
  };
}
