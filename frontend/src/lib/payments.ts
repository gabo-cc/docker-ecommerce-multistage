export interface Pago {
  id: number;
  order_id: number;
  stripe_payment_intent_id: string;
  amount: number;
  currency: string;
  status: string;
  failure_message: string | null;
  paid_at: string | null;
  created_at: string;
}

export interface PagoResponse {
  message: string;
  data: Pago;
  client_secret?: string | null;
}

export interface PagoError {
  message: string;
  error?: string;
  errors?: Record<string, string[]>;
}

export type ProcesarPagoResult =
  | {
      success: true;
      orderId: number;
      status: "succeeded";
    }
  | {
      success: false;
      requiresAction?: boolean;
      error: string;
    };
