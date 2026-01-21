import { supabase } from '@/lib/supabase/client';
import { Invoice } from '@/types/invoice';

export interface CreateInvoiceInput {
  invoiceNumber: string;
  date: string;
  dueDate: string;
  fromName: string;
  fromEmail: string;
  fromAddress?: string;
  fromPhone?: string;
  toName: string;
  toEmail: string;
  toAddress?: string;
  items: Array<{
    id: string;
    description: string;
    quantity: number;
    price: number;
  }>;
  currency: string;
  taxRate: number;
  logo?: string;
  accentColor: string;
  notes?: string;
}

/**
 * Get all invoices for the current user
 */
export async function getInvoices(userId: string): Promise<Invoice[]> {
  try {
    const { data, error } = await supabase
      .from('invoices')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error('Error fetching invoices:', error);
    return [];
  }
}

/**
 * Get a single invoice by ID
 */
export async function getInvoiceById(userId: string, invoiceId: string): Promise<Invoice | null> {
  try {
    const { data, error } = await supabase
      .from('invoices')
      .select('*')
      .eq('id', invoiceId)
      .eq('user_id', userId)
      .single();

    if (error) throw error;
    return data || null;
  } catch (error) {
    console.error('Error fetching invoice:', error);
    return null;
  }
}

/**
 * Create a new invoice
 */
export async function createInvoice(userId: string, input: CreateInvoiceInput): Promise<Invoice | null> {
  try {
    const { data, error } = await supabase
      .from('invoices')
      .insert({
        user_id: userId,
        invoice_number: input.invoiceNumber,
        date: input.date,
        due_date: input.dueDate,
        from_name: input.fromName,
        from_email: input.fromEmail,
        from_address: input.fromAddress,
        from_phone: input.fromPhone,
        to_name: input.toName,
        to_email: input.toEmail,
        to_address: input.toAddress,
        items: input.items,
        currency: input.currency,
        tax_rate: input.taxRate,
        logo_url: input.logo,
        accent_color: input.accentColor,
        notes: input.notes,
      })
      .select()
      .single();

    if (error) throw error;
    return data || null;
  } catch (error) {
    console.error('Error creating invoice:', error);
    return null;
  }
}

/**
 * Update an invoice
 */
export async function updateInvoice(
  userId: string,
  invoiceId: string,
  input: Partial<CreateInvoiceInput>
): Promise<Invoice | null> {
  try {
    const updateData: any = {};

    // Map input fields to database fields
    if (input.invoiceNumber) updateData.invoice_number = input.invoiceNumber;
    if (input.date) updateData.date = input.date;
    if (input.dueDate) updateData.due_date = input.dueDate;
    if (input.fromName) updateData.from_name = input.fromName;
    if (input.fromEmail) updateData.from_email = input.fromEmail;
    if (input.fromAddress !== undefined) updateData.from_address = input.fromAddress;
    if (input.fromPhone !== undefined) updateData.from_phone = input.fromPhone;
    if (input.toName) updateData.to_name = input.toName;
    if (input.toEmail) updateData.to_email = input.toEmail;
    if (input.toAddress !== undefined) updateData.to_address = input.toAddress;
    if (input.items) updateData.items = input.items;
    if (input.currency) updateData.currency = input.currency;
    if (input.taxRate !== undefined) updateData.tax_rate = input.taxRate;
    if (input.logo !== undefined) updateData.logo_url = input.logo;
    if (input.accentColor) updateData.accent_color = input.accentColor;
    if (input.notes !== undefined) updateData.notes = input.notes;

    const { data, error } = await supabase
      .from('invoices')
      .update(updateData)
      .eq('id', invoiceId)
      .eq('user_id', userId)
      .select()
      .single();

    if (error) throw error;
    return data || null;
  } catch (error) {
    console.error('Error updating invoice:', error);
    return null;
  }
}

/**
 * Delete an invoice
 */
export async function deleteInvoice(userId: string, invoiceId: string): Promise<boolean> {
  try {
    const { error } = await supabase
      .from('invoices')
      .delete()
      .eq('id', invoiceId)
      .eq('user_id', userId);

    if (error) throw error;
    return true;
  } catch (error) {
    console.error('Error deleting invoice:', error);
    return false;
  }
}

/**
 * Mark an invoice as paid
 */
export async function markInvoiceAsPaid(userId: string, invoiceId: string): Promise<Invoice | null> {
  try {
    const { data, error } = await supabase
      .from('invoices')
      .update({
        is_paid: true,
        paid_at: new Date().toISOString(),
      })
      .eq('id', invoiceId)
      .eq('user_id', userId)
      .select()
      .single();

    if (error) throw error;
    return data || null;
  } catch (error) {
    console.error('Error marking invoice as paid:', error);
    return null;
  }
}

/**
 * Mark an invoice as unpaid
 */
export async function markInvoiceAsUnpaid(userId: string, invoiceId: string): Promise<Invoice | null> {
  try {
    const { data, error } = await supabase
      .from('invoices')
      .update({
        is_paid: false,
        paid_at: null,
      })
      .eq('id', invoiceId)
      .eq('user_id', userId)
      .select()
      .single();

    if (error) throw error;
    return data || null;
  } catch (error) {
    console.error('Error marking invoice as unpaid:', error);
    return null;
  }
}

/**
 * Get the next invoice number
 */
export async function getNextInvoiceNumber(userId: string): Promise<string> {
  try {
    const { data, error } = await supabase
      .from('invoices')
      .select('invoice_number')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .limit(1);

    if (error) throw error;

    const year = new Date().getFullYear();
    const prefix = `INV-${year}-`;

    if (!data || data.length === 0) {
      return `${prefix}0001`;
    }

    const lastInvoiceNumber = data[0].invoice_number;
    if (lastInvoiceNumber.startsWith(prefix)) {
      const lastNum = parseInt(lastInvoiceNumber.replace(prefix, '')) || 0;
      return `${prefix}${String(lastNum + 1).padStart(4, '0')}`;
    }

    return `${prefix}0001`;
  } catch (error) {
    console.error('Error getting next invoice number:', error);
    const year = new Date().getFullYear();
    return `INV-${year}-0001`;
  }
}
