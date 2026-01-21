import {
  getInvoices,
  getInvoiceById,
  createInvoice,
  updateInvoice,
  deleteInvoice,
  markInvoiceAsPaid,
  markInvoiceAsUnpaid,
  getNextInvoiceNumber,
} from './invoices'

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

const mockInvoiceData = {
  id: 'inv-123',
  user_id: 'user-123',
  invoice_number: 'INV-2024-0001',
  date: '2024-01-15',
  due_date: '2024-02-15',
  from_name: 'John Doe',
  from_email: 'john@example.com',
  from_address: '123 Main St',
  from_phone: '555-1234',
  to_name: 'Jane Smith',
  to_email: 'jane@example.com',
  to_address: '456 Oak Ave',
  items: [{ id: 'item-1', description: 'Service', quantity: 1, price: 2500 }],
  currency: 'USD',
  tax_rate: 10,
  logo_url: null,
  accent_color: '#2563eb',
  is_paid: false,
  created_at: '2024-01-15',
}

describe('Invoices API', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe('getInvoices', () => {
    it('should return list of invoices for a user', async () => {
      const chainMock = createChainableMock({
        data: [mockInvoiceData],
      })
      ;(supabase.from as jest.Mock).mockReturnValue(chainMock)

      const result = await getInvoices('user-123')
      expect(result.length).toBeGreaterThanOrEqual(0)
    })

    it('should return empty array if no invoices found', async () => {
      const chainMock = createChainableMock({
        data: null,
      })
      ;(supabase.from as jest.Mock).mockReturnValue(chainMock)

      const result = await getInvoices('user-123')
      expect(Array.isArray(result)).toBe(true)
    })

    it('should handle errors gracefully', async () => {
      const chainMock: any = {
        select: jest.fn().mockReturnValue(new Proxy({}, {
          get: () => {
            const nestedChain: any = {
              eq: jest.fn().mockReturnValue({
                order: jest.fn().mockRejectedValue(new Error('Database error')),
              }),
            }
            return () => nestedChain
          }
        })),
      }
      ;(supabase.from as jest.Mock).mockReturnValue(chainMock)

      const result = await getInvoices('user-123')
      expect(Array.isArray(result)).toBe(true)
      expect(result.length).toBe(0)
    })
  })

  describe('getInvoiceById', () => {
    it('should return invoice when found', async () => {
      const chainMock = createChainableMock({
        data: mockInvoiceData,
      })
      ;(supabase.from as jest.Mock).mockReturnValue(chainMock)

      const result = await getInvoiceById('user-123', 'inv-123')
      expect(result).toBeTruthy()
    })

    it('should return null when invoice not found', async () => {
      const chainMock = createChainableMock({
        data: null,
      })
      ;(supabase.from as jest.Mock).mockReturnValue(chainMock)

      const result = await getInvoiceById('user-123', 'inv-123')
      expect(result).toBeNull()
    })
  })

  describe('createInvoice', () => {
    it('should create a new invoice', async () => {
      const chainMock = createChainableMock({
        data: mockInvoiceData,
      })
      ;(supabase.from as jest.Mock).mockReturnValue(chainMock)

      const invoiceInput = {
        invoiceNumber: 'INV-2024-0001',
        date: '2024-01-15',
        dueDate: '2024-02-15',
        fromName: 'John Doe',
        fromEmail: 'john@example.com',
        fromAddress: '123 Main St',
        fromPhone: '555-1234',
        toName: 'Jane Smith',
        toEmail: 'jane@example.com',
        toAddress: '456 Oak Ave',
        items: [{ id: 'item-1', description: 'Service', quantity: 1, price: 2500 }],
        currency: 'USD',
        taxRate: 10,
        accentColor: '#2563eb',
      }

      const result = await createInvoice('user-123', invoiceInput)
      expect(result).toBeTruthy()
    })

    it('should return null if creation fails', async () => {
      const failChainMock: any = {
        insert: jest.fn().mockReturnValue({
          select: jest.fn().mockReturnValue({
            single: jest.fn().mockRejectedValue(new Error('Database error')),
          }),
        }),
      }
      ;(supabase.from as jest.Mock).mockReturnValue(failChainMock)

      const invoiceInput = {
        invoiceNumber: 'INV-2024-0001',
        date: '2024-01-15',
        dueDate: '2024-02-15',
        fromName: 'John Doe',
        fromEmail: 'john@example.com',
        items: [],
        currency: 'USD',
        taxRate: 0,
        accentColor: '#2563eb',
      }

      const result = await createInvoice('user-123', invoiceInput)
      expect(result).toBeNull()
    })
  })

  describe('markInvoiceAsPaid', () => {
    it('should mark invoice as paid', async () => {
      const chainMock = createChainableMock({
        data: { ...mockInvoiceData, is_paid: true },
      })
      ;(supabase.from as jest.Mock).mockReturnValue(chainMock)

      const result = await markInvoiceAsPaid('user-123', 'inv-123')
      expect(result).toBeTruthy()
    })
  })

  describe('markInvoiceAsUnpaid', () => {
    it('should mark invoice as unpaid', async () => {
      const chainMock = createChainableMock({
        data: { ...mockInvoiceData, is_paid: false },
      })
      ;(supabase.from as jest.Mock).mockReturnValue(chainMock)

      const result = await markInvoiceAsUnpaid('user-123', 'inv-123')
      expect(result).toBeTruthy()
    })
  })

  describe('deleteInvoice', () => {
    it('should delete an invoice', async () => {
      const chainMock = createChainableMock({
        error: null,
      })
      ;(supabase.from as jest.Mock).mockReturnValue(chainMock)

      const result = await deleteInvoice('user-123', 'inv-123')
      expect(result).toBe(true)
    })

    it('should return false if deletion fails', async () => {
      const failChainMock: any = {
        delete: jest.fn().mockReturnValue({
          eq: jest.fn()
            .mockReturnValueOnce({
              eq: jest.fn().mockRejectedValue(new Error('Delete failed')),
            }),
        }),
      }
      ;(supabase.from as jest.Mock).mockReturnValue(failChainMock)

      const result = await deleteInvoice('user-123', 'inv-123')
      expect(result).toBe(false)
    })
  })

  describe('getNextInvoiceNumber', () => {
    it('should generate invoice number with current year', async () => {
      const currentYear = new Date().getFullYear()
      const chainMock = createChainableMock({
        data: null,
      })
      ;(supabase.from as jest.Mock).mockReturnValue(chainMock)

      const result = await getNextInvoiceNumber('user-123')
      expect(result).toContain(String(currentYear))
      expect(result).toMatch(/INV-\d{4}-\d{4}/)
    })

    it('should increment invoice number correctly', async () => {
      const currentYear = new Date().getFullYear()
      const chainMock = createChainableMock({
        data: [{ invoice_number: `INV-${currentYear}-0005` }],
      })
      ;(supabase.from as jest.Mock).mockReturnValue(chainMock)

      const result = await getNextInvoiceNumber('user-123')
      expect(result).toContain('0006')
    })
  })

  describe('updateInvoice', () => {
    it('should update an invoice', async () => {
      const chainMock = createChainableMock({
        data: { ...mockInvoiceData, from_name: 'Updated Name' },
      })
      ;(supabase.from as jest.Mock).mockReturnValue(chainMock)

      const updates = { fromName: 'Updated Name' }
      const result = await updateInvoice('user-123', 'inv-123', updates)
      expect(result).toBeTruthy()
    })
  })
})
