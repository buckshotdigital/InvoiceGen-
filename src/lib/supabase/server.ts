import { createClient } from '@supabase/supabase-js';

/**
 * Create a Supabase client authenticated with a user's access token.
 * This allows server-side verification of the user's identity.
 */
export function createServerSupabaseClient(accessToken: string) {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      global: {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      },
    }
  );
}
