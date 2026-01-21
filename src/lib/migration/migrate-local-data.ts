import { supabase } from '@/lib/supabase/client';
import { storage } from '@/lib/storage';

const MIGRATION_KEY = 'invoicegen_migration_completed';

interface MigrationResult {
  success: boolean;
  message: string;
  invoicesCount?: number;
  error?: any;
}

export async function migrateLocalStorageToSupabase(userId: string): Promise<MigrationResult> {
  try {
    // Check if migration already completed
    const migrationCompleted = localStorage.getItem(MIGRATION_KEY);
    if (migrationCompleted === 'true') {
      return { success: true, message: 'Already migrated' };
    }

    // Get local data
    const localInvoices = storage.getInvoices();
    const localSettings = storage.getSettings();

    console.log(`Starting migration for user ${userId}. Found ${localInvoices.length} invoices.`);

    // Migrate user settings if they exist
    if (localSettings) {
      const { error: settingsError } = await supabase.from('user_settings').upsert(
        {
          user_id: userId,
          default_from_name: localSettings.defaultFromName,
          default_from_email: localSettings.defaultFromEmail,
          default_from_address: localSettings.defaultFromAddress,
          default_from_phone: localSettings.defaultFromPhone,
          default_currency: localSettings.defaultCurrency,
          default_tax_rate: localSettings.defaultTaxRate,
          default_accent_color: localSettings.defaultAccentColor,
          logo_url: localSettings.logo,
          is_premium: localSettings.isPremium || false,
          premium_until: localSettings.premiumUntil,
        },
        { onConflict: 'user_id' }
      );

      if (settingsError) {
        console.error('Settings migration error:', settingsError);
        return {
          success: false,
          message: 'Failed to migrate settings',
          error: settingsError,
        };
      }
    }

    // Migrate invoices if they exist
    let invoiceCount = 0;
    if (localInvoices.length > 0) {
      const invoicesToMigrate = localInvoices.map((invoice) => ({
        id: invoice.id,
        user_id: userId,
        invoice_number: invoice.invoiceNumber,
        date: invoice.date,
        due_date: invoice.dueDate,
        from_name: invoice.fromName,
        from_email: invoice.fromEmail,
        from_address: invoice.fromAddress,
        from_phone: invoice.fromPhone,
        to_name: invoice.toName,
        to_email: invoice.toEmail,
        to_address: invoice.toAddress,
        items: invoice.items,
        currency: invoice.currency,
        tax_rate: invoice.taxRate,
        logo_url: invoice.logo,
        accent_color: invoice.accentColor,
        is_paid: invoice.isPaid,
        notes: invoice.notes,
        created_at: invoice.createdAt,
        updated_at: invoice.createdAt,
      }));

      const { error: invoiceError, data } = await supabase
        .from('invoices')
        .insert(invoicesToMigrate)
        .select();

      if (invoiceError) {
        console.error('Invoice migration error:', invoiceError);
        return {
          success: false,
          message: `Failed to migrate invoices: ${invoiceError.message}`,
          error: invoiceError,
        };
      }

      invoiceCount = data?.length || 0;
    }

    // Mark migration complete in localStorage
    localStorage.setItem(MIGRATION_KEY, 'true');

    // Update user metadata
    await supabase.auth.updateUser({
      data: { migration_completed: true },
    });

    console.log(`Migration completed. Migrated ${invoiceCount} invoices.`);

    return {
      success: true,
      message: `Successfully migrated ${invoiceCount} invoices`,
      invoicesCount: invoiceCount,
    };
  } catch (error) {
    console.error('Migration error:', error);
    return {
      success: false,
      message: 'Unexpected error during migration',
      error,
    };
  }
}

/**
 * Rollback migration if needed (for testing/debugging)
 * This doesn't delete local data, just clears the migration flag
 */
export function rollbackMigration() {
  localStorage.removeItem(MIGRATION_KEY);
}

/**
 * Check if migration has been completed
 */
export function isMigrationCompleted(): boolean {
  return localStorage.getItem(MIGRATION_KEY) === 'true';
}
