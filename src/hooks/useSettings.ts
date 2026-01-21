'use client';

import { useCallback, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import {
  getUserSettings,
  updateUserSettings,
  isPremium,
  setPremium,
  revokePremium,
  UserSettingsInput,
} from '@/lib/api/settings';
import { UserSettings } from '@/types/invoice';

export function useSettings() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchSettings = useCallback(async (): Promise<UserSettings | null> => {
    if (!user) return null;
    setLoading(true);
    setError(null);
    try {
      return await getUserSettings(user.id);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to fetch settings';
      setError(message);
      return null;
    } finally {
      setLoading(false);
    }
  }, [user]);

  const updateSettings = useCallback(
    async (input: UserSettingsInput): Promise<UserSettings | null> => {
      if (!user) return null;
      setLoading(true);
      setError(null);
      try {
        return await updateUserSettings(user.id, input);
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Failed to update settings';
        setError(message);
        return null;
      } finally {
        setLoading(false);
      }
    },
    [user]
  );

  const checkPremium = useCallback(async (): Promise<boolean> => {
    if (!user) return false;
    try {
      return await isPremium(user.id);
    } catch (err) {
      console.error('Failed to check premium status:', err);
      return false;
    }
  }, [user]);

  const activatePremium = useCallback(
    async (until: string): Promise<boolean> => {
      if (!user) return false;
      setLoading(true);
      setError(null);
      try {
        return await setPremium(user.id, until);
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Failed to activate premium';
        setError(message);
        return false;
      } finally {
        setLoading(false);
      }
    },
    [user]
  );

  const deactivatePremium = useCallback(async (): Promise<boolean> => {
    if (!user) return false;
    setLoading(true);
    setError(null);
    try {
      return await revokePremium(user.id);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to deactivate premium';
      setError(message);
      return false;
    } finally {
      setLoading(false);
    }
  }, [user]);

  return {
    loading,
    error,
    fetchSettings,
    updateSettings,
    checkPremium,
    activatePremium,
    deactivatePremium,
  };
}
