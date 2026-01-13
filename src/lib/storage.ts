import { Invoice, UserSettings } from '@/types/invoice';

const INVOICES_KEY = 'invoicegen_invoices';
const SETTINGS_KEY = 'invoicegen_settings';
const PREMIUM_KEY = 'invoicegen_premium';

export const storage = {
  // Invoices
  getInvoices: (): Invoice[] => {
    if (typeof window === 'undefined') return [];
    const data = localStorage.getItem(INVOICES_KEY);
    return data ? JSON.parse(data) : [];
  },

  saveInvoice: (invoice: Invoice): void => {
    const invoices = storage.getInvoices();
    const existingIndex = invoices.findIndex((i) => i.id === invoice.id);
    if (existingIndex >= 0) {
      invoices[existingIndex] = invoice;
    } else {
      invoices.unshift(invoice);
    }
    localStorage.setItem(INVOICES_KEY, JSON.stringify(invoices));
  },

  deleteInvoice: (id: string): void => {
    const invoices = storage.getInvoices().filter((i) => i.id !== id);
    localStorage.setItem(INVOICES_KEY, JSON.stringify(invoices));
  },

  getInvoice: (id: string): Invoice | undefined => {
    return storage.getInvoices().find((i) => i.id === id);
  },

  // Settings
  getSettings: (): UserSettings => {
    if (typeof window === 'undefined') {
      return {
        isPremium: false,
        defaultFromName: '',
        defaultFromEmail: '',
        defaultFromAddress: '',
        defaultFromPhone: '',
        defaultCurrency: 'USD',
        defaultTaxRate: 0,
        defaultAccentColor: '#2563eb',
      };
    }
    const data = localStorage.getItem(SETTINGS_KEY);
    const premium = storage.isPremium();
    const settings = data
      ? JSON.parse(data)
      : {
          defaultFromName: '',
          defaultFromEmail: '',
          defaultFromAddress: '',
          defaultFromPhone: '',
          defaultCurrency: 'USD',
          defaultTaxRate: 0,
          defaultAccentColor: '#2563eb',
        };
    return { ...settings, isPremium: premium };
  },

  saveSettings: (settings: Partial<UserSettings>): void => {
    const current = storage.getSettings();
    const updated = { ...current, ...settings };
    localStorage.setItem(SETTINGS_KEY, JSON.stringify(updated));
  },

  // Premium
  isPremium: (): boolean => {
    if (typeof window === 'undefined') return false;
    const data = localStorage.getItem(PREMIUM_KEY);
    if (!data) return false;
    const { until } = JSON.parse(data);
    return new Date(until) > new Date();
  },

  setPremium: (until: string): void => {
    localStorage.setItem(PREMIUM_KEY, JSON.stringify({ until }));
  },

  // Generate next invoice number
  getNextInvoiceNumber: (): string => {
    const invoices = storage.getInvoices();
    const year = new Date().getFullYear();
    const prefix = `INV-${year}-`;
    const existingNumbers = invoices
      .filter((i) => i.invoiceNumber.startsWith(prefix))
      .map((i) => parseInt(i.invoiceNumber.replace(prefix, '')) || 0);
    const nextNum = existingNumbers.length > 0 ? Math.max(...existingNumbers) + 1 : 1;
    return `${prefix}${String(nextNum).padStart(4, '0')}`;
  },
};
