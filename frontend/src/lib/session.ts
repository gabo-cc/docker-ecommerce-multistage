import "server-only";

import { cookies } from "next/headers";
import type { Usuario } from "@/lib/auth";

interface UsuarioResponse {
  user: Usuario;
}

export async function getUsuarioActual(): Promise<Usuario | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get("auth_token")?.value;

  if (!token) {
    return null;
  }

  const apiUrl = process.env.API_BASE_URL;

  if (!apiUrl) {
    throw new Error("API_BASE_URL no configurada");
  }

  let response: Response;

  try {
    response = await fetch(`${apiUrl}/auth/me`, {
      headers: {
        Accept: "application/json",
        Authorization: `Bearer ${token}`,
      },
      cache: "no-store",
    });
  } catch {
    throw new Error("No se pudo consultar la sesión en Laravel.");
  }

  if (response.status === 401) {
    return null;
  }

  if (!response.ok) {
    throw new Error("Error al consultar la sesión.");
  }

  const data = (await response.json()) as UsuarioResponse;

  if (
    !data.user ||
    typeof data.user.id !== "number" ||
    typeof data.user.email !== "string"
  ) {
    throw new Error("Respuesta de usuario inválida.");
  }

  return data.user;
}
