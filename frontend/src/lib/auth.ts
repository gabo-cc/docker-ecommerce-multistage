export interface AuthResponse {
  message: string;
  access_token: string;
  token_type: string;
  expires_in: number;
}

export interface AuthState {
  error: string | null;
}

export const initialAuthState: AuthState = {
  error: null,
};

export interface Usuario {
  id: number;
  name: string;
  email: string;
  role: string;
}

// Validar que Laravel devolvio un JWT valido en estructura
export function esAuthResponse(value: unknown): value is AuthResponse {
  if (typeof value !== "object" || value === null) {
    return false;
  }

  const data = value as Record<string, unknown>;

  return (
    typeof data.access_token === "string" &&
    data.access_token.length > 0 &&
    data.token_type === "bearer" &&
    typeof data.expires_in === "number" &&
    Number.isFinite(data.expires_in) &&
    data.expires_in > 0
  );
}
