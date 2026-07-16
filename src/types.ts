export type Language = 'EN' | 'KH';

export type TransactionType = 'income' | 'expense';

export type Page = 'dashboard' | 'transactions' | 'invoices' | 'products' | 'profile';

export interface Profile {
  id: string;
  business_name: string | null;
  username: string | null;
  phone: string | null;
  is_locked: boolean | null;
  trial_started_at: string | null;
  created_at: string | null;
  qr_code_url: string | null;
}

export interface Transaction {
  id: string;
  user_id: string;
  type: TransactionType;
  transaction_date: string;
  description: string;
  quantity: number;
  unit: string | null;
  unit_price: number;
  amount: number | null;
  currency: string;
  created_at: string;
}

export interface Invoice {
  id: string;
  user_id: string;
  invoice_number: number;
  customer_name: string;
  customer_phone: string | null;
  invoice_date: string;
  due_date: string | null;
  subtotal: number;
  paid_amount: number;
  balance: number | null;
  currency: string;
  notes: string | null;
  status: string;
  created_at: string;
}

export interface InvoiceItem {
  id: string;
  invoice_id: string;
  description: string;
  quantity: number;
  unit_price: number;
  total: number | null;
  unit: string | null;
  product_id: string | null;
}

export interface InvoicePayment {
  id: string;
  invoice_id: string;
  amount: number;
  note: string | null;
  payment_date: string;
  created_at: string;
}

export interface Product {
  id: string;
  user_id: string;
  name: string;
  unit: string;
  quantity: number;
  cost_price: number;
  sell_price: number;
  low_stock_threshold: number;
  currency: string;
  is_active: boolean;
  created_at: string;
}

export interface StockMovement {
  id: string;
  product_id: string;
  user_id: string;
  type: string;
  quantity: number;
  note: string | null;
  movement_date: string;
  created_at: string;
}

export interface CustomUnit {
  id: string;
  user_id: string;
  name: string;
  created_at: string | null;
}
