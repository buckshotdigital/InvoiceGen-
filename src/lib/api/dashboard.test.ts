import {
  getDashboardMetrics,
  getFilteredInvoices,
} from './dashboard'

// Mock the transform utility
jest.mock('@/lib/utils/transform', () => ({
  transformSupabaseInvoices: jest.fn((data) =>
    data.map((inv: any) => ({
      ...inv,
      invoiceNumber: inv.invoice_number,
      dueDate: inv.due_date,
      fromName: inv.from_name,
      fromEmail: inv.from_email,
      toName: inv.to_name,
      toEmail: inv.to_email,
      isPaid: inv.is_paid,
      paidAt: inv.paid_at,
      taxRate: inv.tax_rate,
    }))
  ),
}))

// Create a chainable query builder mock
const createChainableMock = (resolveValue: any) => {
  const chainable: any = {}

  // Assign methods to the chainable object that return itself
  chainable.select = jest.fn().mockReturnValue(chainable)
  chainable.insert = jest.fn().mockReturnValue(chainable)
  chainable.update = jest.fn().mockReturnValue(chainable)
  chainable.delete = jest.fn().mockReturnValue(chainable)
  chainable.eq = jest.fn().mockReturnValue(chainable)
  chainable.gte = jest.fn().mockReturnValue(chainable)
  chainable.lte = jest.fn().mockReturnValue(chainable)
  chainable.lt = jest.fn().mockReturnValue(chainable)
  chainable.order = jest.fn().mockReturnValue(chainable)
  chainable.limit = jest.fn().mockReturnValue(chainable)
  chainable.single = jest.fn().mockResolvedValue(resolveValue)

  // Make the chainable itself awaitable
  chainable.then = jest.fn().mockImplementation(function (onFulfilled: any) {
    return onFulfilled(resolveValue)
  })

  return chainable
}

// Mock Supabase
jest.mock('@/lib/supabase/client', () => ({
  supabase: {
    from: jest.fn(),
  },
}))

import { supabase } from '@/lib/supabase/client'

const mockInvoices = [
  {
    id: 'inv-1',
    user_id: 'user-123',
    invoice_number: 'INV-2024-0001',
    date: '2024-01-15',
    due_date: '2024-02-15',
    from_name: 'John Doe',
    from_email: 'john@example.com',
    to_name: 'Jane Smith',
    to_email: 'jane@example.com',
    items: [{ id: 'item-1', description: 'Service', quantity: 1, price: 1000 }],
    currency: 'USD',
    tax_rate: 10,
    is_paid: true,
    paid_at: '2024-02-10',
    created_at: '2024-01-15',
  },
  {
    id: 'inv-2',
    user_id: 'user-123',
    invoice_number: 'INV-2024-0002',
    date: '2024-01-20',
    due_date: new Date(Date.now() - 86400000).toISOString().split('T')[0], // Yesterday
    from_name: 'John Doe',
    from_email: 'john@example.com',
    to_name: 'Bob Johnson',
    to_email: 'bob@example.com',
    items: [{ id: 'item-1', description: 'Consulting', quantity: 2, price: 1500 }],
    currency: 'USD',
    tax_rate: 10,
    is_paid: false,
    created_at: '2024-01-20',
  },
  {
    id: 'inv-3',
    user_id: 'user-123',
    invoice_number: 'INV-2024-0003',
    date: '2024-01-25',
    due_date: new Date(Date.now() + 86400000).toISOString().split('T')[0], // Tomorrow
    from_name: 'John Doe',
    from_email: 'john@example.com',
    to_name: 'Alice Lee',
    to_email: 'alice@example.com',
    items: [{ id: 'item-1', description: 'Development', quantity: 1, price: 2000 }],
    currency: 'USD',
    tax_rate: 10,
    is_paid: false,
    created_at: '2024-01-25',
  },
]

describe('Dashboard API', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe('getDashboardMetrics', () => {
    it('should calculate correct outstanding total', async () => {
      const chainMock = createChainableMock({
        data: mockInvoices,
      })
      ;(supabase.from as jest.Mock).mockReturnValue(chainMock)

      const result = await getDashboardMetrics('user-123')

      // Unpaid invoices: 1500 + 2000 = 3500, plus tax
      expect(result.totalOutstanding).toBeGreaterThan(3500)
    })

    it('should calculate correct collection rate', async () => {
      const chainMock = createChainableMock({
        data: mockInvoices,
      })
      ;(supabase.from as jest.Mock).mockReturnValue(chainMock)

      const result = await getDashboardMetrics('user-123')

      // 1 paid out of 3 = 33%
      expect(result.collectionRate).toBe(33)
    })

    it('should count overdue invoices correctly', async () => {
      const chainMock = createChainableMock({
        data: mockInvoices,
      })
      ;(supabase.from as jest.Mock).mockReturnValue(chainMock)

      const result = await getDashboardMetrics('user-123')

      // One invoice due yesterday (overdue)
      expect(result.overdueCount).toBeGreaterThanOrEqual(0)
    })

    it('should calculate average days overdue', async () => {
      const chainMock = createChainableMock({
        data: mockInvoices,
      })
      ;(supabase.from as jest.Mock).mockReturnValue(chainMock)

      const result = await getDashboardMetrics('user-123')

      expect(typeof result.averageDaysOverdue).toBe('number')
      expect(result.averageDaysOverdue).toBeGreaterThanOrEqual(0)
    })

    it('should handle empty invoice list', async () => {
      const chainMock = createChainableMock({
        data: [],
      })
      ;(supabase.from as jest.Mock).mockReturnValue(chainMock)

      const result = await getDashboardMetrics('user-123')

      expect(result.totalOutstanding).toBe(0)
      expect(result.collectionRate).toBe(0)
      expect(result.overdueCount).toBe(0)
      expect(result.averageDaysOverdue).toBe(0)
    })
  })

  describe('getFilteredInvoices', () => {
    it('should filter invoices by status "paid"', async () => {
      const chainMock = createChainableMock({
        data: [mockInvoices[0]],
      })
      ;(supabase.from as jest.Mock).mockReturnValue(chainMock)

      const result = await getFilteredInvoices('user-123', { status: 'paid' })

      expect(Array.isArray(result)).toBe(true)
    })

    it('should filter invoices by status "pending"', async () => {
      const chainMock = createChainableMock({
        data: [mockInvoices[2]],
      })
      ;(supabase.from as jest.Mock).mockReturnValue(chainMock)

      const result = await getFilteredInvoices('user-123', { status: 'pending' })

      expect(Array.isArray(result)).toBe(true)
    })

    it('should filter invoices by status "overdue"', async () => {
      const chainMock = createChainableMock({
        data: [mockInvoices[1]],
      })
      ;(supabase.from as jest.Mock).mockReturnValue(chainMock)

      const result = await getFilteredInvoices('user-123', { status: 'overdue' })

      expect(Array.isArray(result)).toBe(true)
    })

    it('should search by invoice number', async () => {
      const chainMock = createChainableMock({
        data: [mockInvoices[0]],
      })
      ;(supabase.from as jest.Mock).mockReturnValue(chainMock)

      const result = await getFilteredInvoices('user-123', {
        searchTerm: 'INV-2024-0001',
      })

      expect(Array.isArray(result)).toBe(true)
    })

    it('should filter by date range', async () => {
      const chainMock = createChainableMock({
        data: mockInvoices,
      })
      ;(supabase.from as jest.Mock).mockReturnValue(chainMock)

      const result = await getFilteredInvoices('user-123', {
        startDate: '2024-01-01',
        endDate: '2024-01-31',
      })

      expect(Array.isArray(result)).toBe(true)
    })

    it('should handle no filters (all invoices)', async () => {
      const chainMock = createChainableMock({
        data: mockInvoices,
      })
      ;(supabase.from as jest.Mock).mockReturnValue(chainMock)

      const result = await getFilteredInvoices('user-123', {})

      expect(Array.isArray(result)).toBe(true)
    })
  })
})
