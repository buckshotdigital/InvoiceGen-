/**
 * Test suite for Settings page auto-population logic
 * Tests business name and email auto-fill from user profile
 */

describe('Settings Auto-Population Logic', () => {
  /**
   * Replicates the auto-population logic from settings page:
   * const defaultBusinessName = settings.defaultFromName ||
   *   user?.user_metadata?.full_name ||
   *   user?.user_metadata?.name ||
   *   (user?.email ? user.email.split('@')[0] : '');
   */
  const getDefaultBusinessName = (
    savedName: string | null | undefined,
    user: { user_metadata?: { full_name?: string; name?: string }; email?: string } | null
  ): string => {
    return (
      savedName ||
      user?.user_metadata?.full_name ||
      user?.user_metadata?.name ||
      (user?.email ? user.email.split('@')[0] : '')
    );
  };

  const getDefaultEmail = (
    savedEmail: string | null | undefined,
    user: { email?: string } | null
  ): string => {
    return savedEmail || user?.email || '';
  };

  describe('Business Name Auto-Population', () => {
    describe('Priority order', () => {
      it('should use saved name first if available', () => {
        const user = {
          user_metadata: { full_name: 'John Doe', name: 'Johnny' },
          email: 'john@example.com',
        };
        const result = getDefaultBusinessName('My Saved Business', user);
        expect(result).toBe('My Saved Business');
      });

      it('should use full_name from Google OAuth if no saved name', () => {
        const user = {
          user_metadata: { full_name: 'John Doe', name: 'Johnny' },
          email: 'john@example.com',
        };
        const result = getDefaultBusinessName(null, user);
        expect(result).toBe('John Doe');
      });

      it('should use name from user_metadata if no full_name', () => {
        const user = {
          user_metadata: { name: 'Johnny' },
          email: 'john@example.com',
        };
        const result = getDefaultBusinessName(null, user);
        expect(result).toBe('Johnny');
      });

      it('should extract name from email if no metadata names', () => {
        const user = {
          user_metadata: {},
          email: 'john.doe@example.com',
        };
        const result = getDefaultBusinessName(null, user);
        expect(result).toBe('john.doe');
      });

      it('should return empty string if no user data available', () => {
        const result = getDefaultBusinessName(null, null);
        expect(result).toBe('');
      });
    });

    describe('Email extraction from different formats', () => {
      it('should extract simple username from email', () => {
        const user = { email: 'john@gmail.com' };
        const result = getDefaultBusinessName(null, user);
        expect(result).toBe('john');
      });

      it('should extract username with dots', () => {
        const user = { email: 'john.doe.smith@company.com' };
        const result = getDefaultBusinessName(null, user);
        expect(result).toBe('john.doe.smith');
      });

      it('should extract username with numbers', () => {
        const user = { email: 'john123@example.com' };
        const result = getDefaultBusinessName(null, user);
        expect(result).toBe('john123');
      });

      it('should extract username with underscores', () => {
        const user = { email: 'john_doe@example.com' };
        const result = getDefaultBusinessName(null, user);
        expect(result).toBe('john_doe');
      });

      it('should extract username with plus sign', () => {
        const user = { email: 'john+invoices@example.com' };
        const result = getDefaultBusinessName(null, user);
        expect(result).toBe('john+invoices');
      });
    });

    describe('Edge cases', () => {
      it('should handle empty saved name as falsy', () => {
        const user = { user_metadata: { full_name: 'John Doe' } };
        const result = getDefaultBusinessName('', user);
        expect(result).toBe('John Doe');
      });

      it('should handle undefined user_metadata', () => {
        const user = { email: 'test@example.com' };
        const result = getDefaultBusinessName(null, user);
        expect(result).toBe('test');
      });

      it('should handle user with no email', () => {
        const user = { user_metadata: {} };
        const result = getDefaultBusinessName(null, user);
        expect(result).toBe('');
      });
    });
  });

  describe('Email Auto-Population', () => {
    it('should use saved email first if available', () => {
      const user = { email: 'user@gmail.com' };
      const result = getDefaultEmail('saved@business.com', user);
      expect(result).toBe('saved@business.com');
    });

    it('should use user email if no saved email', () => {
      const user = { email: 'user@gmail.com' };
      const result = getDefaultEmail(null, user);
      expect(result).toBe('user@gmail.com');
    });

    it('should use user email if saved email is empty', () => {
      const user = { email: 'user@gmail.com' };
      const result = getDefaultEmail('', user);
      expect(result).toBe('user@gmail.com');
    });

    it('should return empty string if no email available', () => {
      const result = getDefaultEmail(null, null);
      expect(result).toBe('');
    });

    it('should return empty string if user has no email', () => {
      const user = {};
      const result = getDefaultEmail(null, user);
      expect(result).toBe('');
    });
  });
});

describe('Settings Form Data Structure', () => {
  interface FormData {
    defaultFromName: string;
    defaultFromEmail: string;
    defaultFromAddress: string;
    defaultFromPhone: string;
    defaultCurrency: string;
    defaultTaxRate: number;
    defaultAccentColor: string;
    customSenderEmail: string;
  }

  const defaultFormData: FormData = {
    defaultFromName: '',
    defaultFromEmail: '',
    defaultFromAddress: '',
    defaultFromPhone: '',
    defaultCurrency: 'USD',
    defaultTaxRate: 0,
    defaultAccentColor: '#2563eb',
    customSenderEmail: '',
  };

  it('should have correct default values', () => {
    expect(defaultFormData.defaultCurrency).toBe('USD');
    expect(defaultFormData.defaultTaxRate).toBe(0);
    expect(defaultFormData.defaultAccentColor).toBe('#2563eb');
  });

  it('should allow all fields to be updated', () => {
    const updatedData: FormData = {
      ...defaultFormData,
      defaultFromName: 'Test Business',
      defaultFromEmail: 'test@example.com',
      defaultCurrency: 'EUR',
      defaultTaxRate: 20,
    };

    expect(updatedData.defaultFromName).toBe('Test Business');
    expect(updatedData.defaultFromEmail).toBe('test@example.com');
    expect(updatedData.defaultCurrency).toBe('EUR');
    expect(updatedData.defaultTaxRate).toBe(20);
  });
});

describe('Helper Text Display Logic', () => {
  const getHelperText = (businessName: string): string => {
    return `This name appears on your invoices and email reminders (e.g., "From: ${businessName || 'Your Business'}")`;
  };

  it('should show actual business name in helper text when set', () => {
    const text = getHelperText('Acme Corp');
    expect(text).toContain('From: Acme Corp');
  });

  it('should show fallback in helper text when name is empty', () => {
    const text = getHelperText('');
    expect(text).toContain('From: Your Business');
  });

  it('should handle special characters in business name', () => {
    const text = getHelperText("John's Business & Co.");
    expect(text).toContain("From: John's Business & Co.");
  });
});

describe('Google OAuth User Metadata', () => {
  // Simulates the structure of user object from Supabase Auth with Google OAuth
  interface GoogleOAuthUser {
    id: string;
    email: string;
    user_metadata: {
      full_name?: string;
      name?: string;
      avatar_url?: string;
      email?: string;
      email_verified?: boolean;
      picture?: string;
      sub?: string;
    };
  }

  it('should extract full_name from Google OAuth user', () => {
    const googleUser: GoogleOAuthUser = {
      id: 'user-123',
      email: 'john.doe@gmail.com',
      user_metadata: {
        full_name: 'John Doe',
        name: 'John',
        avatar_url: 'https://...',
        email: 'john.doe@gmail.com',
        email_verified: true,
      },
    };

    expect(googleUser.user_metadata.full_name).toBe('John Doe');
  });

  it('should handle user without full_name but with name', () => {
    const googleUser: GoogleOAuthUser = {
      id: 'user-123',
      email: 'jane@gmail.com',
      user_metadata: {
        name: 'Jane',
      },
    };

    expect(googleUser.user_metadata.full_name).toBeUndefined();
    expect(googleUser.user_metadata.name).toBe('Jane');
  });
});

describe('Email/Password User (No OAuth Metadata)', () => {
  interface EmailUser {
    id: string;
    email: string;
    user_metadata: Record<string, never>;
  }

  it('should have empty user_metadata for email signups', () => {
    const emailUser: EmailUser = {
      id: 'user-456',
      email: 'test@example.com',
      user_metadata: {},
    };

    expect(Object.keys(emailUser.user_metadata)).toHaveLength(0);
  });

  it('should fall back to email extraction for business name', () => {
    const emailUser = {
      email: 'freelancer.pro@outlook.com',
      user_metadata: {},
    };

    const businessName =
      emailUser.user_metadata.full_name ||
      emailUser.user_metadata.name ||
      emailUser.email.split('@')[0];

    expect(businessName).toBe('freelancer.pro');
  });
});
