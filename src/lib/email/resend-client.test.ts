/**
 * Test suite for Resend email client
 * Tests custom email domain functionality
 */

// Store original env
const originalEnv = process.env;

describe('sendReminderEmail', () => {
  let mockSend: jest.Mock;
  let sendReminderEmail: any;

  beforeEach(async () => {
    // Reset modules and mocks
    jest.resetModules();
    mockSend = jest.fn().mockResolvedValue({
      data: { id: 'msg_123' },
      error: null,
    });

    // Set env var before importing
    process.env = { ...originalEnv, RESEND_API_KEY: 'test_api_key' };

    // Mock Resend before importing the module
    jest.doMock('resend', () => ({
      Resend: jest.fn().mockImplementation(() => ({
        emails: {
          send: mockSend,
        },
      })),
    }));

    // Import after mocking
    const module = await import('./resend-client');
    sendReminderEmail = module.sendReminderEmail;
  });

  afterEach(() => {
    process.env = originalEnv;
    jest.clearAllMocks();
  });

  describe('Default email domain (no custom email)', () => {
    it('should send from default domain when no custom email provided', async () => {
      await sendReminderEmail(
        'client@example.com',
        'John Client',
        'Invoice Payment Reminder',
        '<p>Please pay your invoice</p>',
        'business@mybusiness.com',
        'My Business'
      );

      expect(mockSend).toHaveBeenCalledWith(
        expect.objectContaining({
          from: 'My Business <invoices@bdsalesinc.ca>',
          to: 'client@example.com',
          replyTo: 'business@mybusiness.com',
          subject: 'Invoice Payment Reminder',
        })
      );
    });

    it('should set reply-to as user email when using default domain', async () => {
      await sendReminderEmail(
        'client@example.com',
        'John Client',
        'Reminder',
        '<p>Content</p>',
        'owner@mybusiness.com',
        'My Business'
      );

      expect(mockSend).toHaveBeenCalledWith(
        expect.objectContaining({
          replyTo: 'owner@mybusiness.com',
        })
      );
    });
  });

  describe('Custom email domain (premium feature)', () => {
    it('should send from custom domain when provided', async () => {
      await sendReminderEmail(
        'client@example.com',
        'John Client',
        'Invoice Payment Reminder',
        '<p>Please pay your invoice</p>',
        'business@mybusiness.com',
        'Premium Business',
        'invoices@premiumdomain.com' // Custom from email
      );

      expect(mockSend).toHaveBeenCalledWith(
        expect.objectContaining({
          from: 'Premium Business <invoices@premiumdomain.com>',
          to: 'client@example.com',
          subject: 'Invoice Payment Reminder',
        })
      );
    });

    it('should NOT include reply-to when using custom domain', async () => {
      await sendReminderEmail(
        'client@example.com',
        'John Client',
        'Reminder',
        '<p>Content</p>',
        'business@mybusiness.com',
        'Premium Business',
        'invoices@premiumdomain.com'
      );

      // When using custom domain, the call should not include replyTo
      const callArgs = mockSend.mock.calls[0][0];
      expect(callArgs.replyTo).toBeUndefined();
    });
  });

  describe('Return values', () => {
    it('should return success with messageId on successful send', async () => {
      mockSend.mockResolvedValueOnce({
        data: { id: 'msg_success_123' },
        error: null,
      });

      const result = await sendReminderEmail(
        'client@example.com',
        'John',
        'Subject',
        '<p>Body</p>'
      );

      expect(result.success).toBe(true);
      expect(result.messageId).toBe('msg_success_123');
      expect(result.error).toBeUndefined();
    });

    it('should return error when Resend API fails', async () => {
      mockSend.mockResolvedValueOnce({
        data: null,
        error: { message: 'Domain not verified' },
      });

      const result = await sendReminderEmail(
        'client@example.com',
        'John',
        'Subject',
        '<p>Body</p>',
        undefined,
        'Business',
        'invoices@unverified.com'
      );

      expect(result.success).toBe(false);
      expect(result.error).toBe('Domain not verified');
    });

    it('should handle thrown exceptions', async () => {
      mockSend.mockRejectedValueOnce(new Error('Network error'));

      const result = await sendReminderEmail(
        'client@example.com',
        'John',
        'Subject',
        '<p>Body</p>'
      );

      expect(result.success).toBe(false);
      expect(result.error).toBe('Network error');
    });
  });

  describe('Email content handling', () => {
    it('should pass HTML content correctly', async () => {
      const htmlContent = '<div><h1>Invoice</h1></div>';

      await sendReminderEmail(
        'client@example.com',
        'John',
        'Invoice Reminder',
        htmlContent
      );

      expect(mockSend).toHaveBeenCalledWith(
        expect.objectContaining({
          html: htmlContent,
        })
      );
    });
  });

  describe('Business name defaults', () => {
    it('should use default business name when not provided', async () => {
      await sendReminderEmail(
        'client@example.com',
        'John',
        'Subject',
        '<p>Body</p>'
      );

      expect(mockSend).toHaveBeenCalledWith(
        expect.objectContaining({
          from: expect.stringContaining('InvoiceGen'),
        })
      );
    });
  });

  describe('Edge Cases', () => {
    it('should handle empty custom email (falsy) by using default', async () => {
      await sendReminderEmail(
        'client@example.com',
        'John',
        'Subject',
        '<p>Body</p>',
        'reply@business.com',
        'Business',
        '' // Empty string should be treated as no custom email
      );

      // Should use default domain
      expect(mockSend).toHaveBeenCalledWith(
        expect.objectContaining({
          from: 'Business <invoices@bdsalesinc.ca>',
          replyTo: 'reply@business.com',
        })
      );
    });
  });
});

describe('sendReminderEmail - No API Key', () => {
  it('should return error when Resend API key is not configured', async () => {
    jest.resetModules();

    // Clear the API key
    process.env = { ...originalEnv };
    delete process.env.RESEND_API_KEY;

    // Import without API key
    const { sendReminderEmail } = await import('./resend-client');

    const result = await sendReminderEmail(
      'client@example.com',
      'John',
      'Subject',
      '<p>Body</p>'
    );

    expect(result.success).toBe(false);
    expect(result.error).toContain('Resend is not configured');
  });
});
