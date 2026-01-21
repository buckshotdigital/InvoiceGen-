'use client';

import { useCallback, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import {
  getInvoices,
  getInvoiceById,
  createInvoice,
  updateInvoice,
  deleteInvoice,
  markInvoiceAsPaid,
  markInvoiceAsUnpaid,
  getNextInvoiceNumber,
  CreateInvoiceInput,
} from '@/lib/api/invoices';
import { transformSupabaseInvoices, transformSupabaseInvoice } from '@/lib/utils/transform';
import { Invoice } from '@/types/invoice';

export function useInvoices() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchInvoices = useCallback(async (): Promise<Invoice[]> => {
    if (!user) return [];
    setLoading(true);
    setError(null);
    try {
      const data = await getInvoices(user.id);
      return transformSupabaseInvoices(data);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to fetch invoices';
      setError(message);
      return [];
    } finally {
      setLoading(false);
    }
  }, [user]);

  const fetchInvoiceById = useCallback(
    async (invoiceId: string): Promise<Invoice | null> => {
      if (!user) return null;
      setLoading(true);
      setError(null);
      try {
        const data = await getInvoiceById(user.id, invoiceId);
        return data ? transformSupabaseInvoice(data) : null;
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Failed to fetch invoice';
        setError(message);
        return null;
      } finally {
        setLoading(false);
      }
    },
    [user]
  );

  const addInvoice = useCallback(
    async (input: CreateInvoiceInput): Promise<Invoice | null> => {
      if (!user) return null;
      setLoading(true);
      setError(null);
      try {
        const data = await createInvoice(user.id, input);
        return data ? transformSupabaseInvoice(data) : null;
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Failed to create invoice';
        setError(message);
        return null;
      } finally {
        setLoading(false);
      }
    },
    [user]
  );

  const editInvoice = useCallback(
    async (invoiceId: string, input: Partial<CreateInvoiceInput>): Promise<Invoice | null> => {
      if (!user) return null;
      setLoading(true);
      setError(null);
      try {
        const data = await updateInvoice(user.id, invoiceId, input);
        return data ? transformSupabaseInvoice(data) : null;
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Failed to update invoice';
        setError(message);
        return null;
      } finally {
        setLoading(false);
      }
    },
    [user]
  );

  const removeInvoice = useCallback(
    async (invoiceId: string): Promise<boolean> => {
      if (!user) return false;
      setLoading(true);
      setError(null);
      try {
        return await deleteInvoice(user.id, invoiceId);
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Failed to delete invoice';
        setError(message);
        return false;
      } finally {
        setLoading(false);
      }
    },
    [user]
  );

  const markPaid = useCallback(
    async (invoiceId: string): Promise<Invoice | null> => {
      if (!user) return null;
      setLoading(true);
      setError(null);
      try {
        const data = await markInvoiceAsPaid(user.id, invoiceId);
        return data ? transformSupabaseInvoice(data) : null;
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Failed to mark invoice as paid';
        setError(message);
        return null;
      } finally {
        setLoading(false);
      }
    },
    [user]
  );

  const markUnpaid = useCallback(
    async (invoiceId: string): Promise<Invoice | null> => {
      if (!user) return null;
      setLoading(true);
      setError(null);
      try {
        const data = await markInvoiceAsUnpaid(user.id, invoiceId);
        return data ? transformSupabaseInvoice(data) : null;
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Failed to mark invoice as unpaid';
        setError(message);
        return null;
      } finally {
        setLoading(false);
      }
    },
    [user]
  );

  const getNextNumber = useCallback(async (): Promise<string> => {
    if (!user) return 'INV-2026-0001';
    try {
      return await getNextInvoiceNumber(user.id);
    } catch (err) {
      console.error('Failed to get next invoice number:', err);
      const year = new Date().getFullYear();
      return `INV-${year}-0001`;
    }
  }, [user]);

  return {
    loading,
    error,
    fetchInvoices,
    fetchInvoiceById,
    addInvoice,
    editInvoice,
    removeInvoice,
    markPaid,
    markUnpaid,
    getNextNumber,
  };
}
