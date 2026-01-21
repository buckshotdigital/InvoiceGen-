import { supabaseAdmin, supabase } from '@/lib/supabase/client';
import { Invoice } from '@/types/invoice';
import { transformSupabaseInvoices } from '@/lib/utils/transform';

export interface DashboardMetrics {
  totalInvoices: number;
  totalOutstanding: number;
  totalPaid: number;
  paidCount: number;
  unpaidCount: number;
  overdueCount: number;
  collectionRate: number;
  averageDaysOverdue: number;
  averagePaymentTime: number;
}

export interface FilterOptions {
  status?: 'all' | 'paid' | 'pending' | 'overdue';
  startDate?: string;
  endDate?: string;
  searchTerm?: string;
  sortBy?: 'dueDate' | 'amount' | 'clientName' | 'createdDate';
  sortOrder?: 'asc' | 'desc';
}

/**
 * Get dashboard metrics for a user
 */
export async function getDashboardMetrics(userId: string): Promise<DashboardMetrics> {
  try {
    const { data, error } = await supabase
      .from('invoices')
      .select('*')
      .eq('user_id', userId);

    if (error) throw error;

    const invoices = transformSupabaseInvoices(data || []);
    const now = new Date();

    // Calculate metrics
    const totalInvoices = invoices.length;
    const paidInvoices = invoices.filter((i) => i.isPaid);
    const unpaidInvoices = invoices.filter((i) => !i.isPaid);
    const overdueInvoices = unpaidInvoices.filter(
      (i) => new Date(i.dueDate) < now
    );

    // Calculate totals
    const totalPaid = paidInvoices.reduce((sum, inv) => {
      const items = inv.items || [];
      const subtotal = items.reduce((s, item) => s + item.quantity * item.price, 0);
      const taxRate = (inv.taxRate || 0) / 100;
      return sum + subtotal * (1 + taxRate);
    }, 0);

    const totalOutstanding = unpaidInvoices.reduce((sum, inv) => {
      const items = inv.items || [];
      const subtotal = items.reduce((s, item) => s + item.quantity * item.price, 0);
      const taxRate = (inv.taxRate || 0) / 100;
      return sum + subtotal * (1 + taxRate);
    }, 0);

    // Calculate average days overdue
    let averageDaysOverdue = 0;
    if (overdueInvoices.length > 0) {
      const totalDaysOverdue = overdueInvoices.reduce((sum, inv) => {
        const dueDate = new Date(inv.dueDate);
        const daysOverdue = Math.floor(
          (now.getTime() - dueDate.getTime()) / (1000 * 60 * 60 * 24)
        );
        return sum + Math.max(0, daysOverdue);
      }, 0);
      averageDaysOverdue = Math.round(totalDaysOverdue / overdueInvoices.length);
    }

    // Calculate collection rate
    const collectionRate = totalInvoices > 0
      ? Math.round((paidInvoices.length / totalInvoices) * 100)
      : 0;

    // Calculate average payment time (days between invoice date and paid date)
    let averagePaymentTime = 0;
    const paidWithDates = paidInvoices.filter((i) => i.paidAt);
    if (paidWithDates.length > 0) {
      const totalPaymentDays = paidWithDates.reduce((sum, inv) => {
        const invoiceDate = new Date(inv.date);
        const paidDate = new Date(inv.paidAt!);
        const days = Math.floor(
          (paidDate.getTime() - invoiceDate.getTime()) / (1000 * 60 * 60 * 24)
        );
        return sum + Math.max(0, days);
      }, 0);
      averagePaymentTime = Math.round(totalPaymentDays / paidWithDates.length);
    }

    return {
      totalInvoices,
      totalOutstanding,
      totalPaid,
      paidCount: paidInvoices.length,
      unpaidCount: unpaidInvoices.length,
      overdueCount: overdueInvoices.length,
      collectionRate,
      averageDaysOverdue,
      averagePaymentTime,
    };
  } catch (error) {
    console.error('Error getting dashboard metrics:', error);
    throw error;
  }
}

/**
 * Get filtered invoices for dashboard
 */
export async function getFilteredInvoices(
  userId: string,
  filters: FilterOptions = {}
): Promise<Invoice[]> {
  try {
    let query = supabase
      .from('invoices')
      .select('*')
      .eq('user_id', userId);

    // Apply status filter
    if (filters.status && filters.status !== 'all') {
      if (filters.status === 'overdue') {
        // Will filter client-side since we need date comparison
      } else {
        const isPaid = filters.status === 'paid';
        query = query.eq('is_paid', isPaid);
      }
    }

    // Apply date range filter
    if (filters.startDate) {
      query = query.gte('due_date', filters.startDate);
    }
    if (filters.endDate) {
      query = query.lte('due_date', filters.endDate);
    }

    // Apply sorting
    const sortBy = filters.sortBy || 'dueDate';
    const sortOrder = filters.sortOrder || 'asc';
    const sortMap: Record<string, string> = {
      dueDate: 'due_date',
      amount: 'created_at', // Sort by created_at as proxy
      clientName: 'to_name',
      createdDate: 'created_at',
    };

    query = query.order(sortMap[sortBy] || 'due_date', {
      ascending: sortOrder === 'asc',
    });

    const { data, error } = await query;
    if (error) throw error;

    let invoices = transformSupabaseInvoices(data || []);

    // Apply client-side filters
    const now = new Date();

    // Status filter
    if (filters.status === 'overdue') {
      invoices = invoices.filter(
        (i) => !i.isPaid && new Date(i.dueDate) < now
      );
    }

    // Search filter
    if (filters.searchTerm) {
      const term = filters.searchTerm.toLowerCase();
      invoices = invoices.filter(
        (i) =>
          i.invoiceNumber.toLowerCase().includes(term) ||
          i.toName.toLowerCase().includes(term) ||
          i.toEmail.toLowerCase().includes(term)
      );
    }

    return invoices;
  } catch (error) {
    console.error('Error getting filtered invoices:', error);
    throw error;
  }
}

/**
 * Get invoices that are overdue
 */
export async function getOverdueInvoices(userId: string): Promise<Invoice[]> {
  try {
    const { data, error } = await supabase
      .from('invoices')
      .select('*')
      .eq('user_id', userId)
      .eq('is_paid', false)
      .lt('due_date', new Date().toISOString().split('T')[0]);

    if (error) throw error;

    return transformSupabaseInvoices(data || []);
  } catch (error) {
    console.error('Error getting overdue invoices:', error);
    throw error;
  }
}

/**
 * Get invoice statistics by status
 */
export async function getInvoicesByStatus(userId: string) {
  try {
    const { data, error } = await supabase
      .from('invoices')
      .select('id, is_paid, due_date')
      .eq('user_id', userId);

    if (error) throw error;

    const invoices = data || [];
    const now = new Date();

    return {
      total: invoices.length,
      paid: invoices.filter((i) => i.is_paid).length,
      pending: invoices.filter((i) => !i.is_paid && new Date(i.due_date) >= now).length,
      overdue: invoices.filter((i) => !i.is_paid && new Date(i.due_date) < now).length,
    };
  } catch (error) {
    console.error('Error getting invoice stats:', error);
    throw error;
  }
}
