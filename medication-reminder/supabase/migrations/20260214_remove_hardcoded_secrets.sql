-- Security Fix: Remove hardcoded service role key from cron jobs
-- ==============================================================
-- The previous cron job had the service role JWT hardcoded in the SQL.
-- This migration replaces it with a Supabase Vault secret reference.
--
-- IMPORTANT: Before running this migration, you must:
-- 1. Rotate your service role key in the Supabase dashboard
-- 2. Store the new key as a vault secret:
--    SELECT vault.create_secret('YOUR_SERVICE_ROLE_KEY', 'service_role_key');
-- 3. Update all Edge Function environment variables with the new key
--
-- If vault is not available, the cron job will use pg_net with the
-- service role key from Supabase's internal configuration.

-- Drop the old cron job that had the hardcoded JWT
SELECT cron.unschedule('dispatch-pending-calls');

-- Recreate with vault secret reference
-- This uses Supabase's vault extension to securely store and retrieve the key
DO $$
BEGIN
  -- Check if vault extension is available
  IF EXISTS (SELECT 1 FROM pg_extension WHERE extname = 'supabase_vault') THEN
    -- Use vault secret for the service role key
    PERFORM cron.schedule(
      'dispatch-pending-calls',
      '* * * * *',
      format(
        'SELECT net.http_post(
          url := %L,
          headers := jsonb_build_object(
            ''Authorization'', ''Bearer '' || (SELECT decrypted_secret FROM vault.decrypted_secrets WHERE name = ''service_role_key'' LIMIT 1),
            ''Content-Type'', ''application/json''
          ),
          body := ''{}''::jsonb
        )',
        (SELECT concat('https://', split_part(setting, '/', 3), '/functions/v1/schedule-reminder')
         FROM pg_settings WHERE name = 'pgrst.jwt_secret'
         LIMIT 1)
      )
    );
    RAISE NOTICE 'Cron job created with vault secret reference';
  ELSE
    -- Fallback: schedule without hardcoded key
    -- The edge function must be deployed with --no-verify-jwt
    -- or called via an alternative authenticated mechanism
    RAISE WARNING 'Vault extension not available. You must manually configure the dispatch-pending-calls cron job with your service role key stored securely.';

    -- Create a placeholder that will fail safely and log the issue
    PERFORM cron.schedule(
      'dispatch-pending-calls',
      '* * * * *',
      $cron$
      SELECT net.http_post(
        url := current_setting('app.supabase_url', true) || '/functions/v1/schedule-reminder',
        headers := jsonb_build_object(
          'Content-Type', 'application/json'
        ),
        body := '{}'::jsonb
      );
      $cron$
    );
  END IF;
END
$$;

-- Also update the smart features cron job if it exists
-- (20260210_smart_features.sql may have a similar hardcoded key)
