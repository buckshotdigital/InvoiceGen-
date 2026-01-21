import { supabase } from '@/lib/supabase/client';
import { UserSettings } from '@/types/invoice';

export interface UserSettingsInput {
  defaultFromName?: string;
  defaultFromEmail?: string;
  defaultFromAddress?: string;
  defaultFromPhone?: string;
  defaultCurrency?: string;
  defaultTaxRate?: number;
  defaultAccentColor?: string;
  logo?: string;
  isPremium?: boolean;
  premiumUntil?: string;
  customSenderEmail?: string; // User's own verified Resend domain email
}

/**
 * Get user settings
 */
export async function getUserSettings(userId: string): Promise<UserSettings> {
  try {
    const { data, error } = await supabase
      .from('user_settings')
      .select('*')
      .eq('user_id', userId)
      .single();

    if (error && error.code !== 'PGRST116') {
      // PGRST116 = no rows returned
      console.error('Error fetching settings:', error);
    }

    // Return data if found, otherwise return defaults
    if (data) {
      return {
        isPremium: data.is_premium || false,
        premiumUntil: data.premium_until,
        stripeCustomerId: data.stripe_customer_id,
        stripeSubscriptionId: data.stripe_subscription_id,
        defaultFromName: data.default_from_name || '',
        defaultFromEmail: data.default_from_email || '',
        defaultFromAddress: data.default_from_address || '',
        defaultFromPhone: data.default_from_phone || '',
        defaultCurrency: data.default_currency || 'USD',
        defaultTaxRate: data.default_tax_rate || 0,
        defaultAccentColor: data.default_accent_color || '#2563eb',
        logo: data.logo_url,
        customSenderEmail: data.custom_sender_email,
      };
    }

    // Return defaults if no settings found
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
  } catch (error) {
    console.error('Error getting settings:', error);
    // Return defaults on error
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
}

/**
 * Update user settings
 */
export async function updateUserSettings(
  userId: string,
  input: UserSettingsInput
): Promise<UserSettings | null> {
  try {
    // First, check if user settings exist
    const { data: existingData } = await supabase
      .from('user_settings')
      .select('id')
      .eq('user_id', userId)
      .single();

    const updateData: any = {
      user_id: userId,
    };

    // Map input to database fields
    if (input.defaultFromName !== undefined) updateData.default_from_name = input.defaultFromName;
    if (input.defaultFromEmail !== undefined) updateData.default_from_email = input.defaultFromEmail;
    if (input.defaultFromAddress !== undefined) updateData.default_from_address = input.defaultFromAddress;
    if (input.defaultFromPhone !== undefined) updateData.default_from_phone = input.defaultFromPhone;
    if (input.defaultCurrency !== undefined) updateData.default_currency = input.defaultCurrency;
    if (input.defaultTaxRate !== undefined) updateData.default_tax_rate = input.defaultTaxRate;
    if (input.defaultAccentColor !== undefined) updateData.default_accent_color = input.defaultAccentColor;
    if (input.logo !== undefined) updateData.logo_url = input.logo;
    if (input.isPremium !== undefined) updateData.is_premium = input.isPremium;
    if (input.premiumUntil !== undefined) updateData.premium_until = input.premiumUntil;
    if (input.customSenderEmail !== undefined) updateData.custom_sender_email = input.customSenderEmail;

    let result;

    if (existingData) {
      // Update existing settings
      const { data, error } = await supabase
        .from('user_settings')
        .update(updateData)
        .eq('user_id', userId)
        .select()
        .single();

      if (error) throw error;
      result = data;
    } else {
      // Create new settings
      const { data, error } = await supabase
        .from('user_settings')
        .insert(updateData)
        .select()
        .single();

      if (error) throw error;
      result = data;
    }

    if (!result) return null;

    return {
      isPremium: result.is_premium || false,
      premiumUntil: result.premium_until,
      stripeCustomerId: result.stripe_customer_id,
      stripeSubscriptionId: result.stripe_subscription_id,
      defaultFromName: result.default_from_name || '',
      defaultFromEmail: result.default_from_email || '',
      defaultFromAddress: result.default_from_address || '',
      defaultFromPhone: result.default_from_phone || '',
      defaultCurrency: result.default_currency || 'USD',
      defaultTaxRate: result.default_tax_rate || 0,
      defaultAccentColor: result.default_accent_color || '#2563eb',
      logo: result.logo_url,
      customSenderEmail: result.custom_sender_email,
    };
  } catch (error) {
    console.error('Error updating settings:', error);
    return null;
  }
}

/**
 * Check if user has premium status
 */
export async function isPremium(userId: string): Promise<boolean> {
  try {
    const { data, error } = await supabase
      .from('user_settings')
      .select('is_premium, premium_until')
      .eq('user_id', userId)
      .single();

    if (error && error.code !== 'PGRST116') {
      console.error('Error checking premium status:', error);
      return false;
    }

    if (!data) return false;

    if (!data.is_premium) return false;

    // Check if premium has expired
    if (data.premium_until) {
      return new Date(data.premium_until) > new Date();
    }

    return true;
  } catch (error) {
    console.error('Error checking premium status:', error);
    return false;
  }
}

/**
 * Set premium status
 */
export async function setPremium(userId: string, until: string): Promise<boolean> {
  try {
    const { error } = await supabase
      .from('user_settings')
      .update({
        is_premium: true,
        premium_until: until,
      })
      .eq('user_id', userId);

    if (error) throw error;
    return true;
  } catch (error) {
    console.error('Error setting premium:', error);
    return false;
  }
}

/**
 * Revoke premium status
 */
export async function revokePremium(userId: string): Promise<boolean> {
  try {
    const { error } = await supabase
      .from('user_settings')
      .update({
        is_premium: false,
        premium_until: null,
      })
      .eq('user_id', userId);

    if (error) throw error;
    return true;
  } catch (error) {
    console.error('Error revoking premium:', error);
    return false;
  }
}
