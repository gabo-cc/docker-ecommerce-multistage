export interface Producto {
  id: number;
  name: string;
  sku: string;
  description: string | null;
  price: number;
  formatted_price: string;
  stock: number;
  image_url: string | null;
  is_active: boolean;
}

export interface RespuestaProductos {
  data: Producto[];
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
