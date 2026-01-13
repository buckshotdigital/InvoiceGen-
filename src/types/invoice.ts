export interface InvoiceItem {
  id: string;
  description: string;
  quantity: number;
  price: number;
}

export interface Invoice {
  id: string;
  invoiceNumber: string;
  date: string;
  dueDate: string;

  // From (Your business)
  fromName: string;
  fromEmail: string;
  fromAddress: string;
  fromPhone: string;

  // To (Client)
  toName: string;
  toEmail: string;
  toAddress: string;

  // Items
  items: InvoiceItem[];

  // Additional
  notes: string;
  currency: string;
  taxRate: number;

  // Branding (Premium)
  logo?: string;
  accentColor: string;

  // Meta
  createdAt: string;
  isPaid: boolean;
}

export interface UserSettings {
  isPremium: boolean;
  premiumUntil?: string;
  defaultFromName: string;
  defaultFromEmail: string;
  defaultFromAddress: string;
  defaultFromPhone: string;
  defaultCurrency: string;
  defaultTaxRate: number;
  defaultAccentColor: string;
  logo?: string;
}

export const DEFAULT_INVOICE: Omit<Invoice, 'id' | 'createdAt'> = {
  invoiceNumber: '',
  date: new Date().toISOString().split('T')[0],
  dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
  fromName: '',
  fromEmail: '',
  fromAddress: '',
  fromPhone: '',
  toName: '',
  toEmail: '',
  toAddress: '',
  items: [{ id: '1', description: '', quantity: 1, price: 0 }],
  notes: '',
  currency: 'USD',
  taxRate: 0,
  accentColor: '#2563eb',
  isPaid: false,
};

export const CURRENCIES = [
  { code: 'USD', symbol: '$', name: 'US Dollar' },
  { code: 'EUR', symbol: '€', name: 'Euro' },
  { code: 'GBP', symbol: '£', name: 'British Pound' },
  { code: 'CAD', symbol: 'C$', name: 'Canadian Dollar' },
  { code: 'AUD', symbol: 'A$', name: 'Australian Dollar' },
  { code: 'INR', symbol: '₹', name: 'Indian Rupee' },
  { code: 'JPY', symbol: '¥', name: 'Japanese Yen' },
];
