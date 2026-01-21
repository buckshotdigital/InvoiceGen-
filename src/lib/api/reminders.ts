import { supabaseAdmin } from '@/lib/supabase/client';

/**
 * Get the number of reminders sent by a user this month
 */
export async function getReminderCountThisMonth(userId: string): Promise<number> {
  if (!supabaseAdmin) {
    throw new Error('Supabase admin client not configured');
  }

  // Get the first day of the current month
  const now = new Date();
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

  const { data, error } = await supabaseAdmin
    .from('reminder_logs')
    .select('id', { count: 'exact' })
    .eq('user_id', userId)
    .gte('sent_at', startOfMonth.toISOString())
    .eq('status', 'sent');

  if (error) {
    console.error('Failed to get reminder count:', error);
    throw new Error('Failed to check reminder count');
  }

  return data?.length || 0;
}

/**
 * Check if user is premium
 */
export async function checkUserPremium(userId: string): Promise<boolean> {
  if (!supabaseAdmin) {
    return false;
  }

  const { data, error } = await supabaseAdmin
    .from('user_settings')
    .select('is_premium, premium_until')
    .eq('user_id', userId)
    .single();

  if (error) {
    console.error('Failed to check premium status:', error);
    return false;
  }

  if (!data?.is_premium) {
    return false;
  }

  // Check if premium subscription has expired
  if (data.premium_until) {
    const expiryDate = new Date(data.premium_until);
    if (expiryDate < new Date()) {
      // Premium has expired
      return false;
    }
  }

  return true;
}

/**
 * Get user's premium status and remaining reminders
 */
export async function getUserReminderQuota(userId: string): Promise<{
  isPremium: boolean;
  remindersUsedThisMonth: number;
  remainingReminders: number;
  canSendReminder: boolean;
}> {
  const isPremium = await checkUserPremium(userId);
  const remindersUsedThisMonth = await getReminderCountThisMonth(userId);

  const limit = isPremium ? Infinity : 3;
  const remainingReminders = isPremium ? Infinity : Math.max(0, limit - remindersUsedThisMonth);
  const canSendReminder = isPremium || remindersUsedThisMonth < 3;

  return {
    isPremium,
    remindersUsedThisMonth,
    remainingReminders,
    canSendReminder,
  };
}
