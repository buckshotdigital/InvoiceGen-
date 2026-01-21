export interface InvoiceItem {
  id: string;
  description: string;
  quantity: number;
  price: number;
}

export interface Invoice {
  id: string;
  user_id?: string; // From Supabase
  invoiceNumber: string;
  invoice_number?: string; // From Supabase (snake_case)
  date: string;
  dueDate: string;
  due_date?: string; // From Supabase (snake_case)

  // From (Your business)
  fromName: string;
  from_name?: string; // From Supabase (snake_case)
  fromEmail: string;
  from_email?: string; // From Supabase (snake_case)
  fromAddress: string;
  from_address?: string; // From Supabase (snake_case)
  fromPhone: string;
  from_phone?: string; // From Supabase (snake_case)

  // To (Client)
  toName: string;
  to_name?: string; // From Supabase (snake_case)
  toEmail: string;
  to_email?: string; // From Supabase (snake_case)
  toAddress: string;
  to_address?: string; // From Supabase (snake_case)

  // Items
  items: InvoiceItem[];

  // Additional
  notes: string;
  currency: string;
  taxRate: number;
  tax_rate?: number; // From Supabase (snake_case)

  // Branding (Premium)
  logo?: string;
  logo_url?: string; // From Supabase (snake_case)
  accentColor: string;
  accent_color?: string; // From Supabase (snake_case)

  // Meta
  createdAt?: string;
  created_at?: string; // From Supabase (snake_case)
  isPaid: boolean;
  is_paid?: boolean; // From Supabase (snake_case)
  paidAt?: string;
  paid_at?: string; // From Supabase (snake_case)
  paymentMethod?: string;
  payment_method?: string; // From Supabase (snake_case)

  // Reminder tracking
  lastReminderSent?: string;
  last_reminder_sent?: string; // From Supabase (snake_case)
  reminderCount?: number;
  reminder_count?: number; // From Supabase (snake_case)
}

export interface UserSettings {
  isPremium: boolean;
  premiumUntil?: string;
  stripeCustomerId?: string;
  stripeSubscriptionId?: string;
  defaultFromName: string;
  defaultFromEmail: string;
  defaultFromAddress: string;
  defaultFromPhone: string;
  defaultCurrency: string;
  defaultTaxRate: number;
  defaultAccentColor: string;
  logo?: string;
  customSenderEmail?: string; // User's own verified Resend domain email
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
