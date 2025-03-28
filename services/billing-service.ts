import { apiClient } from "./api-client";
import { BillingParams, Invoice, Payment } from "./billing-types";

export async function getInvoices(params: BillingParams = {}): Promise<Invoice[]> {
  try {
    const response = await apiClient.get("/billing/invoices/", { params });
    return response.data;
  } catch (error) {
    console.error("Error fetching invoices:", error);
    return [
      {
        id: 1,
        invoice_number: "INV-2023-001",
        guest_name: "John Smith",
        reservation_id: 1,
        issue_date: "2023-01-15",
        due_date: "2023-01-20",
        total_amount: 750,
        status: "paid",
      },
      {
        id: 2,
        invoice_number: "INV-2023-002",
        guest_name: "Jane Doe",
        reservation_id: 2,
        issue_date: "2023-01-18",
        due_date: "2023-01-25",
        total_amount: 500,
        status: "pending",
      },
      {
        id: 3,
        invoice_number: "INV-2023-003",
        guest_name: "Robert Johnson",
        reservation_id: 3,
        issue_date: "2023-01-20",
        due_date: "2023-01-28",
        total_amount: 1200,
        status: "pending",
      },
      {
        id: 4,
        invoice_number: "INV-2023-004",
        guest_name: "Sarah Williams",
        reservation_id: 4,
        issue_date: "2023-01-22",
        due_date: "2023-02-05",
        total_amount: 900,
        status: "draft",
      },
      {
        id: 5,
        invoice_number: "INV-2023-005",
        guest_name: "Michael Brown",
        reservation_id: 5,
        issue_date: "2023-01-10",
        due_date: "2023-01-17",
        total_amount: 650,
        status: "overdue",
      },
    ];
  }
}

export async function getPayments(params: BillingParams = {}): Promise<Payment[]> {
  try {
    const response = await apiClient.get("/billing/payments/", { params });
    return response.data;
  } catch (error) {
    console.error("Error fetching payments:", error);
    return [
      {
        id: 1,
        transaction_id: "TXN-2023-001",
        guest_name: "John Smith",
        invoice_id: 1,
        payment_method: "credit_card",
        payment_date: "2023-01-18T14:30:00Z",
        amount: 750,
        status: "completed",
      },
      {
        id: 2,
        transaction_id: "TXN-2023-002",
        guest_name: "Michael Brown",
        invoice_id: 5,
        payment_method: "bank_transfer",
        payment_date: "2023-01-19T10:15:00Z",
        amount: 650,
        status: "processing",
      },
      {
        id: 3,
        transaction_id: "TXN-2023-003",
        guest_name: "Emily Davis",
        invoice_id: null,
        payment_method: "cash",
        payment_date: "2023-01-20T16:45:00Z",
        amount: 300,
        status: "completed",
      },
      {
        id: 4,
        transaction_id: "TXN-2023-004",
        guest_name: "David Wilson",
        invoice_id: null,
        payment_method: "mobile_money",
        payment_date: "2023-01-21T09:20:00Z",
        amount: 450,
        status: "failed",
      },
      {
        id: 5,
        transaction_id: "TXN-2023-005",
        guest_name: "Sarah Williams",
        invoice_id: 4,
        payment_method: "credit_card",
        payment_date: "2023-01-22T11:10:00Z",
        amount: 900,
        status: "refunded",
      },
    ];
  }
}

export async function getInvoiceById(id: number): Promise<Invoice | null> {
  try {
    const response = await apiClient.get(`/billing/invoices/${id}/`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching invoice ${id}:`, error);
    return null;
  }
}

export async function getPaymentById(id: number): Promise<Payment | null> {
  try {
    const response = await apiClient.get(`/billing/payments/${id}/`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching payment ${id}:`, error);
    return null;
  }
}

export async function createInvoice(invoiceData: Partial<Invoice>): Promise<Invoice> {
  try {
    const response = await apiClient.post("/billing/invoices/", invoiceData);
    return response.data;
  } catch (error) {
    console.error("Error creating invoice:", error);
    throw error;
  }
}

export async function createPayment(paymentData: Partial<Payment>): Promise<Payment> {
  try {
    const response = await apiClient.post("/billing/payments/", paymentData);
    return response.data;
  } catch (error) {
    console.error("Error creating payment:", error);
    throw error;
  }
}

export async function updateInvoice(id: number, invoiceData: Partial<Invoice>): Promise<Invoice> {
  try {
    const response = await apiClient.put(
      `/billing/invoices/${id}/`,
      invoiceData
    );
    return response.data;
  } catch (error) {
    console.error(`Error updating invoice ${id}:`, error);
    throw error;
  }
}

export async function updatePayment(id: number, paymentData: Partial<Payment>): Promise<Payment> {
  try {
    const response = await apiClient.put(
      `/billing/payments/${id}/`,
      paymentData
    );
    return response.data;
  } catch (error) {
    console.error(`Error updating payment ${id}:`, error);
    throw error;
  }
}
