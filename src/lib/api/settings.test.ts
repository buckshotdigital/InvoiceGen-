/**
 * Test suite for user settings API
 * Tests custom sender email functionality and premium features
 */

import { getUserSettings, updateUserSettings, UserSettingsInput } from './settings';

// Mock Supabase client
const mockSingle = jest.fn();
const mockSelect = jest.fn();
const mockEq = jest.fn();
const mockUpdate = jest.fn();
const mockInsert = jest.fn();
const mockFrom = jest.fn();

jest.mock('@/lib/supabase/client', () => ({
  supabase: {
    from: (table: string) => {
      mockFrom(table);
      return {
        select: (fields?: string) => {
          mockSelect(fields);
          return {
            eq: (field: string, value: string) => {
              mockEq(field, value);
              return {
                single: () => mockSingle(),
              };
            },
          };
        },
        update: (data: any) => {
          mockUpdate(data);
          return {
            eq: (field: string, value: string) => {
              mockEq(field, value);
              return {
                select: () => ({
                  single: () => mockSingle(),
                }),
              };
            },
          };
        },
        insert: (data: any) => {
          mockInsert(data);
          return {
            select: () => ({
              single: () => mockSingle(),
            }),
          };
        },
      };
    },
  },
}));

describe('getUserSettings', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Custom Sender Email retrieval', () => {
    it('should return customSenderEmail when set', async () => {
      mockSingle.mockResolvedValueOnce({
        data: {
          user_id: 'user123',
          is_premium: true,
          custom_sender_email: 'invoices@mybusiness.com',
          default_from_name: 'My Business',
          default_from_email: 'contact@mybusiness.com',
          default_currency: 'USD',
          default_tax_rate: 10,
          default_accent_color: '#ff0000',
        },
        error: null,
      });

      const settings = await getUserSettings('user123');

      expect(settings.customSenderEmail).toBe('invoices@mybusiness.com');
      expect(settings.isPremium).toBe(true);
    });

    it('should return null/undefined customSenderEmail when not set', async () => {
      mockSingle.mockResolvedValueOnce({
        data: {
          user_id: 'user123',
          is_premium: false,
          custom_sender_email: null,
          default_from_name: 'My Business',
        },
        error: null,
      });

      const settings = await getUserSettings('user123');

      // customSenderEmail can be null or undefined when not set
      expect(settings.customSenderEmail).toBeFalsy();
    });

    it('should return default settings when no data found', async () => {
      mockSingle.mockResolvedValueOnce({
        data: null,
        error: { code: 'PGRST116', message: 'No rows found' },
      });

      const settings = await getUserSettings('user123');

      expect(settings.isPremium).toBe(false);
      expect(settings.customSenderEmail).toBeUndefined();
      expect(settings.defaultCurrency).toBe('USD');
    });
  });

  describe('Premium status retrieval', () => {
    it('should correctly return isPremium true', async () => {
      mockSingle.mockResolvedValueOnce({
        data: {
          is_premium: true,
          premium_until: '2025-12-31',
          stripe_customer_id: 'cus_123',
          stripe_subscription_id: 'sub_456',
        },
        error: null,
      });

      const settings = await getUserSettings('user123');

      expect(settings.isPremium).toBe(true);
      expect(settings.premiumUntil).toBe('2025-12-31');
      expect(settings.stripeCustomerId).toBe('cus_123');
      expect(settings.stripeSubscriptionId).toBe('sub_456');
    });

    it('should correctly return isPremium false', async () => {
      mockSingle.mockResolvedValueOnce({
        data: {
          is_premium: false,
          premium_until: null,
        },
        error: null,
      });

      const settings = await getUserSettings('user123');

      expect(settings.isPremium).toBe(false);
      // premiumUntil can be null or undefined when not set
      expect(settings.premiumUntil).toBeFalsy();
    });
  });
});

describe('updateUserSettings', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Custom Sender Email updates', () => {
    it('should save customSenderEmail when provided', async () => {
      // First call - check if settings exist
      mockSingle.mockResolvedValueOnce({
        data: { id: 'settings123' },
        error: null,
      });

      // Second call - update result
      mockSingle.mockResolvedValueOnce({
        data: {
          user_id: 'user123',
          custom_sender_email: 'invoices@newdomain.com',
          is_premium: true,
        },
        error: null,
      });

      const input: UserSettingsInput = {
        customSenderEmail: 'invoices@newdomain.com',
      };

      const result = await updateUserSettings('user123', input);

      expect(mockUpdate).toHaveBeenCalledWith(
        expect.objectContaining({
          custom_sender_email: 'invoices@newdomain.com',
        })
      );
      expect(result?.customSenderEmail).toBe('invoices@newdomain.com');
    });

    it('should clear customSenderEmail when set to empty string', async () => {
      mockSingle.mockResolvedValueOnce({
        data: { id: 'settings123' },
        error: null,
      });

      mockSingle.mockResolvedValueOnce({
        data: {
          user_id: 'user123',
          custom_sender_email: '',
        },
        error: null,
      });

      const input: UserSettingsInput = {
        customSenderEmail: '',
      };

      await updateUserSettings('user123', input);

      expect(mockUpdate).toHaveBeenCalledWith(
        expect.objectContaining({
          custom_sender_email: '',
        })
      );
    });

    it('should not update customSenderEmail when not provided', async () => {
      mockSingle.mockResolvedValueOnce({
        data: { id: 'settings123' },
        error: null,
      });

      mockSingle.mockResolvedValueOnce({
        data: {
          user_id: 'user123',
          default_from_name: 'Updated Name',
        },
        error: null,
      });

      const input: UserSettingsInput = {
        defaultFromName: 'Updated Name',
      };

      await updateUserSettings('user123', input);

      expect(mockUpdate).toHaveBeenCalledWith(
        expect.not.objectContaining({
          custom_sender_email: expect.anything(),
        })
      );
    });
  });

  describe('Creating new settings', () => {
    it('should create settings with customSenderEmail for new user', async () => {
      // First call - no existing settings
      mockSingle.mockResolvedValueOnce({
        data: null,
        error: null,
      });

      // Second call - insert result
      mockSingle.mockResolvedValueOnce({
        data: {
          user_id: 'newuser123',
          custom_sender_email: 'invoices@newbusiness.com',
          is_premium: true,
        },
        error: null,
      });

      const input: UserSettingsInput = {
        customSenderEmail: 'invoices@newbusiness.com',
        defaultFromName: 'New Business',
      };

      const result = await updateUserSettings('newuser123', input);

      expect(mockInsert).toHaveBeenCalled();
      expect(result?.customSenderEmail).toBe('invoices@newbusiness.com');
    });
  });
});

describe('Settings - Email Validation Scenarios', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should accept valid email format for customSenderEmail', async () => {
    mockSingle.mockResolvedValueOnce({
      data: { id: 'settings123' },
      error: null,
    });

    mockSingle.mockResolvedValueOnce({
      data: {
        custom_sender_email: 'invoices@company.com',
      },
      error: null,
    });

    const input: UserSettingsInput = {
      customSenderEmail: 'invoices@company.com',
    };

    const result = await updateUserSettings('user123', input);
    expect(result?.customSenderEmail).toBe('invoices@company.com');
  });

  it('should handle subdomain email addresses', async () => {
    mockSingle.mockResolvedValueOnce({
      data: { id: 'settings123' },
      error: null,
    });

    mockSingle.mockResolvedValueOnce({
      data: {
        custom_sender_email: 'billing@mail.company.co.uk',
      },
      error: null,
    });

    const input: UserSettingsInput = {
      customSenderEmail: 'billing@mail.company.co.uk',
    };

    const result = await updateUserSettings('user123', input);
    expect(result?.customSenderEmail).toBe('billing@mail.company.co.uk');
  });
});
