export interface BillingParams {
  status?: string;
  date_filter?: string;
  search?: string;
}

export interface Invoice {
  id: number;
  invoice_number: string;
  guest_name: string;
  reservation_id: number;
  issue_date: string;
  due_date: string;
  total_amount: number;
  status: 'draft' | 'pending' | 'paid' | 'overdue' | 'cancelled';
}

export interface Payment {
  id: number;
  transaction_id: string;
  guest_name: string;
  invoice_id: number | null;
  payment_method: 'credit_card' | 'bank_transfer' | 'cash' | 'mobile_money';
  payment_date: string;
  amount: number;
  status: 'completed' | 'processing' | 'failed' | 'refunded';
} 