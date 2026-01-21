import { Resend } from 'resend';

const resendApiKey = process.env.RESEND_API_KEY;

if (!resendApiKey) {
  console.warn('RESEND_API_KEY is not configured. Email reminders will not work.');
}

export const resend = resendApiKey ? new Resend(resendApiKey) : null;

// Default from email (verified domain)
const DEFAULT_FROM_EMAIL = 'invoices@bdsalesinc.ca';

/**
 * Send an email reminder using Resend
 * @param toEmail - Recipient email address
 * @param toName - Recipient name
 * @param subject - Email subject
 * @param html - Email HTML content
 * @param replyToEmail - Reply-to email (user's business email)
 * @param businessName - From name (user's business name)
 * @param customFromEmail - Optional custom verified Resend domain email
 */
export async function sendReminderEmail(
  toEmail: string,
  toName: string,
  subject: string,
  html: string,
  replyToEmail?: string,
  businessName: string = 'InvoiceGen',
  customFromEmail?: string
): Promise<{ success: boolean; messageId?: string; error?: string }> {
  if (!resend) {
    console.error('❌ Resend not configured - API key missing');
    return {
      success: false,
      error: 'Resend is not configured. Please add RESEND_API_KEY to your environment variables.',
    };
  }

  // Use custom from email if provided, otherwise use default verified domain
  // If custom email is used, that email sends directly (user has their own Resend domain)
  // If no custom email, send from default domain with reply-to set to user's email
  const fromEmail = customFromEmail || DEFAULT_FROM_EMAIL;
  const effectiveReplyTo = customFromEmail ? undefined : (replyToEmail || fromEmail);

  try {
    console.log('📧 Resend client sending email:', {
      to: toEmail,
      from: `${businessName} <${fromEmail}>`,
      replyTo: effectiveReplyTo,
      subject,
      usingCustomDomain: !!customFromEmail,
    });

    const emailPayload: {
      from: string;
      to: string;
      replyTo?: string;
      subject: string;
      html: string;
    } = {
      from: `${businessName} <${fromEmail}>`,
      to: toEmail,
      subject,
      html,
    };

    // Only add replyTo if not using custom domain
    if (effectiveReplyTo) {
      emailPayload.replyTo = effectiveReplyTo;
    }

    const response = await resend.emails.send(emailPayload);

    console.log('📨 Resend API response:', response);

    if (response.error) {
      console.error('❌ Resend error:', response.error);
      return {
        success: false,
        error: response.error.message,
      };
    }

    console.log('✅ Email sent via Resend:', response.data?.id);
    return {
      success: true,
      messageId: response.data?.id,
    };
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    console.error('❌ Resend send error:', errorMessage);
    return {
      success: false,
      error: errorMessage,
    };
  }
}
