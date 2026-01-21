import { determineReminderType, generateEmailTemplate } from './templates'
import { Invoice } from '@/types/invoice'

const mockInvoice: Invoice = {
  id: 'inv-123',
  userId: 'user-123',
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
  items: [
    {
      id: 'item-1',
      description: 'Web Development',
      quantity: 1,
      price: 2500,
    },
  ],
  currency: 'USD',
  taxRate: 10,
  accentColor: '#2563eb',
  isPaid: false,
  createdAt: '2024-01-15',
}

describe('Email Templates', () => {
  describe('determineReminderType', () => {
    it('should return "due_soon" when due date is 3 days away', () => {
      const threeDaysFromNow = new Date()
      threeDaysFromNow.setDate(threeDaysFromNow.getDate() + 3)
      const invoiceData = { ...mockInvoice, dueDate: threeDaysFromNow.toISOString().split('T')[0] }

      const result = determineReminderType(invoiceData, 'Business Name')
      expect(result).toBe('due_soon')
    })

    it('should return "overdue_1_7" when overdue for 5 days', () => {
      const fiveDaysAgo = new Date()
      fiveDaysAgo.setDate(fiveDaysAgo.getDate() - 5)
      const invoiceData = { ...mockInvoice, dueDate: fiveDaysAgo.toISOString().split('T')[0] }

      const result = determineReminderType(invoiceData, 'Business Name')
      expect(result).toBe('overdue_1_7')
    })

    it('should return "overdue_8_30" when overdue for 20 days', () => {
      const twentyDaysAgo = new Date()
      twentyDaysAgo.setDate(twentyDaysAgo.getDate() - 20)
      const invoiceData = { ...mockInvoice, dueDate: twentyDaysAgo.toISOString().split('T')[0] }

      const result = determineReminderType(invoiceData, 'Business Name')
      expect(result).toBe('overdue_8_30')
    })

    it('should return "final_notice" when overdue for 35 days', () => {
      const thirtyFiveDaysAgo = new Date()
      thirtyFiveDaysAgo.setDate(thirtyFiveDaysAgo.getDate() - 35)
      const invoiceData = { ...mockInvoice, dueDate: thirtyFiveDaysAgo.toISOString().split('T')[0] }

      const result = determineReminderType(invoiceData, 'Business Name')
      expect(result).toBe('final_notice')
    })

    it('should return null for paid invoices', () => {
      const paidInvoice = { ...mockInvoice, isPaid: true }
      const result = determineReminderType(paidInvoice, 'Business Name')
      expect(result).toBeNull()
    })

    it('should return null for future due dates', () => {
      const futureDate = new Date()
      futureDate.setDate(futureDate.getDate() + 10)
      const invoiceData = { ...mockInvoice, dueDate: futureDate.toISOString().split('T')[0] }

      const result = determineReminderType(invoiceData, 'Business Name')
      expect(result).toBeNull()
    })
  })

  describe('generateEmailTemplate', () => {
    it('should generate due_soon template with correct content', () => {
      const result = generateEmailTemplate(
        mockInvoice,
        'due_soon',
        'Test Business',
        'test@example.com'
      )

      expect(result.subject).toContain('INV-2024-0001')
      expect(result.subject).toContain('Due Soon')
      expect(result.html).toContain('Jane Smith')
      expect(result.html).toContain('INV-2024-0001')
      expect(result.html).toContain('$2750.00')
    })

    it('should generate overdue_1_7 template with professional tone', () => {
      const result = generateEmailTemplate(
        mockInvoice,
        'overdue_1_7',
        'Test Business',
        'test@example.com'
      )

      expect(result.subject).toContain('Payment')
      expect(result.subject).toContain('Overdue')
      expect(result.html).toContain('Jane Smith')
      expect(result.html.length).toBeGreaterThan(100)
    })

    it('should generate overdue_8_30 template with firm notice', () => {
      const result = generateEmailTemplate(
        mockInvoice,
        'overdue_8_30',
        'Test Business',
        'test@example.com'
      )

      expect(result.subject).toContain('Seriously')
      expect(result.html).toContain('Immediate payment is required')
    })

    it('should generate final_notice template with serious tone', () => {
      const result = generateEmailTemplate(
        mockInvoice,
        'final_notice',
        'Test Business',
        'test@example.com'
      )

      expect(result.subject).toContain('Final')
      expect(result.html).toContain('FINAL NOTICE')
    })

    it('should include correct business details in email', () => {
      const result = generateEmailTemplate(
        mockInvoice,
        'due_soon',
        'Acme Corp',
        'acme@example.com'
      )

      expect(result.html).toContain('Acme Corp')
      expect(result.html).toContain('acme@example.com')
    })

    it('should include correct client details in email', () => {
      const result = generateEmailTemplate(
        mockInvoice,
        'due_soon',
        'Test Business',
        'test@example.com'
      )

      expect(result.html).toContain('Jane Smith')
      expect(result.html).toContain('Hi Jane Smith')
    })

    it('should format invoice details correctly', () => {
      const result = generateEmailTemplate(
        mockInvoice,
        'due_soon',
        'Test Business',
        'test@example.com'
      )

      expect(result.html).toContain('INV-2024-0001')
      expect(result.html).toContain('February 14, 2024')
      expect(result.html).toContain('$2750.00')
    })
  })
})
