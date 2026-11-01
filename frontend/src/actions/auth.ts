"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { esAuthResponse, type AuthState, type AuthResponse } from "@/lib/auth";

const COOKIE_NAME = "auth_token";

function getApiUrl(): string {
  const url = process.env.API_BASE_URL;

  if (!url) {
    throw new Error("API_BASE_URL no configurada");
  }

  return url;
}

// Guardar el JWT en una cookie httpOnly
async function guardarToken(data: AuthResponse) {
  const cookieStore = await cookies();

  cookieStore.set(COOKIE_NAME, data.access_token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: data.expires_in,
  });
}

// LOGIN
export async function loginAction(
  _prevState: AuthState,
  formData: FormData,
): Promise<AuthState> {
  const email = formData.get("email");
  const password = formData.get("password");

  if (
    typeof email !== "string" ||
    typeof password !== "string" ||
    !email.trim() ||
    !password
  ) {
    return { error: "Ingresa tu correo y contraseña." };
  }

  let data: unknown;

  try {
    const response = await fetch(`${getApiUrl()}/auth/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify({
        email: email.trim(),
        password,
      }),
      cache: "no-store",
    });

    if (!response.ok) {
      return {
        error:
          response.status === 401
            ? "Correo o contraseña incorrectos."
            : response.status === 422
              ? "Verifica los datos ingresados."
              : "No se pudo iniciar sesión.",
      };
    }

    data = await response.json();
  } catch {
    return {
      error: "No se pudo conectar con Laravel.",
    };
  }

  if (!esAuthResponse(data)) {
    return {
      error: "La API devolvió una respuesta inválida.",
    };
  }

  await guardarToken(data);
  redirect("/");
}

// REGISTRO
export async function registroAction(
  _prevState: AuthState,
  formData: FormData,
): Promise<AuthState> {
  const name = formData.get("name");
  const email = formData.get("email");
  const password = formData.get("password");
  const confirmation = formData.get("password_confirmation");

  if (
    typeof name !== "string" ||
    typeof email !== "string" ||
    typeof password !== "string" ||
    typeof confirmation !== "string" ||
    !name.trim() ||
    !email.trim()
  ) {
    return { error: "Completa todos los campos." };
  }

  if (password.length < 8) {
    return {
      error: "La contraseña debe tener al menos 8 caracteres.",
    };
  }

  if (password !== confirmation) {
    return { error: "Las contraseñas no coinciden." };
  }

  let data: unknown;

  try {
    const response = await fetch(`${getApiUrl()}/auth/register`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify({
        name: name.trim(),
        email: email.trim(),
        password,
        password_confirmation: confirmation,
      }),
      cache: "no-store",
    });

    if (!response.ok) {
      return {
        error:
          response.status === 422
            ? "Datos inválidos o correo ya registrado."
            : "No se pudo completar el registro.",
      };
    }

    data = await response.json();
  } catch {
    return {
      error: "No se pudo conectar con Laravel.",
    };
  }

  if (!esAuthResponse(data)) {
    return {
      error: "La API devolvió una respuesta inválida.",
    };
  }

  await guardarToken(data);
  redirect("/cuenta");
}

// LOGOUT
export async function logoutAction() {
  const cookieStore = await cookies();
  const token = cookieStore.get(COOKIE_NAME)?.value;

  if (token) {
    try {
      await fetch(`${getApiUrl()}/auth/logout`, {
        method: "POST",
        headers: {
          Accept: "application/json",
          Authorization: `Bearer ${token}`,
        },
        cache: "no-store",
      });
    } catch {
      // Se elimina la sesión local aunque falle Laravel.
    }
  }

  cookieStore.delete(COOKIE_NAME);
  redirect("/login");
}

// RENOVAR JWT
export async function renovarTokenAction() {
  const cookieStore = await cookies();
  const token = cookieStore.get(COOKIE_NAME)?.value;

  if (!token) {
    redirect("/login");
  }

  let nuevoToken: unknown = null;

  try {
    const response = await fetch(`${getApiUrl()}/auth/refresh`, {
      method: "POST",
      headers: {
        Accept: "application/json",
        Authorization: `Bearer ${token}`,
      },
      cache: "no-store",
    });

    if (response.ok) {
      nuevoToken = await response.json();
    }
  } catch {
    // No se pudo renovar el token.
  }

  if (!esAuthResponse(nuevoToken)) {
    cookieStore.delete(COOKIE_NAME);
    redirect("/login");
  }

  await guardarToken(nuevoToken);
  redirect("/cuenta");
}
