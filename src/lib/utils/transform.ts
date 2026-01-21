import { Invoice } from '@/types/invoice';

/**
 * Convert Supabase snake_case response to camelCase Invoice
 */
export function transformSupabaseInvoice(data: any): Invoice {
  return {
    id: data.id,
    user_id: data.user_id,
    invoiceNumber: data.invoice_number,
    date: data.date,
    dueDate: data.due_date,
    fromName: data.from_name,
    fromEmail: data.from_email,
    fromAddress: data.from_address || '',
    fromPhone: data.from_phone || '',
    toName: data.to_name,
    toEmail: data.to_email,
    toAddress: data.to_address || '',
    items: data.items || [],
    notes: data.notes || '',
    currency: data.currency || 'USD',
    taxRate: data.tax_rate || 0,
    logo: data.logo_url,
    accentColor: data.accent_color || '#2563eb',
    createdAt: data.created_at,
    isPaid: data.is_paid || false,
    paidAt: data.paid_at,
    paymentMethod: data.payment_method,
    lastReminderSent: data.last_reminder_sent,
    reminderCount: data.reminder_count || 0,
  };
}

/**
 * Convert array of Supabase invoices to camelCase
 */
export function transformSupabaseInvoices(data: any[]): Invoice[] {
  return data.map(transformSupabaseInvoice);
}
