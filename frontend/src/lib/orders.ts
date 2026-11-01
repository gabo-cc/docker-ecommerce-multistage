export interface OrdenItemInput {
  product_id: number;
  quantity: number;
}

export interface CrearOrdenInput {
  items: OrdenItemInput[];
}

export interface OrdenUsuario {
  id: number;
  name: string;
  email: string;
  role: string;
}

export interface OrdenItem {
  id: number;
  product_id: number;
  product_name: string;
  sku: string;
  quantity: number;
  unit_price: number;
  subtotal: number;
}

export interface Orden {
  id: number;
  user: OrdenUsuario;
  items: OrdenItem[];
  total: number;
  currency: string;
  status: string;
  created_at: string;
  updated_at: string;
}

export interface OrdenResponse {
  message: string;
  data: Orden;
}

export interface ApiError {
  message: string;
  errors?: Record<string, string[]>;
}
