import { Invoice } from '@/types/invoice';

export type ReminderType = 'due_soon' | 'overdue_1_7' | 'overdue_8_30' | 'final_notice';

export interface EmailTemplate {
  subject: string;
  html: string;
  text: string;
  reminderType: ReminderType;
}

/**
 * Determine which reminder type should be sent based on invoice status
 */
export function determineReminderType(invoice: Invoice, businessName: string): ReminderType | null {
  if (invoice.isPaid) return null;

  const now = new Date();
  const dueDate = new Date(invoice.dueDate);
  const daysUntilDue = Math.ceil((dueDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
  const daysOverdue = Math.floor((now.getTime() - dueDate.getTime()) / (1000 * 60 * 60 * 24));

  // If due in next 3 days (and not yet due)
  if (daysUntilDue > 0 && daysUntilDue <= 3) {
    return 'due_soon';
  }

  // If overdue
  if (daysOverdue > 0) {
    if (daysOverdue <= 7) return 'overdue_1_7';
    if (daysOverdue <= 30) return 'overdue_8_30';
    return 'final_notice';
  }

  return null;
}

/**
 * Generate HTML for a reminder email
 */
export function generateEmailTemplate(
  invoice: Invoice,
  reminderType: ReminderType,
  businessName: string,
  businessEmail: string
): EmailTemplate {
  const invoiceUrl = `${process.env.NEXT_PUBLIC_DOMAIN}/invoices/${invoice.id}`;
  const dueDate = new Date(invoice.dueDate).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  const subtotal = invoice.items.reduce((sum, item) => sum + item.quantity * item.price, 0);
  const tax = subtotal * (invoice.taxRate / 100);
  const total = subtotal + tax;

  let subject = '';
  let heading = '';
  let mainMessage = '';
  let urgencyLevel = '';

  switch (reminderType) {
    case 'due_soon':
      subject = `Friendly Reminder: Invoice ${invoice.invoiceNumber} Due Soon`;
      heading = 'Payment Due Soon';
      mainMessage = `Just a friendly reminder that invoice <strong>${invoice.invoiceNumber}</strong> is due on <strong>${dueDate}</strong>.`;
      urgencyLevel = 'info';
      break;

    case 'overdue_1_7':
      subject = `Payment Overdue: Invoice ${invoice.invoiceNumber}`;
      heading = '⚠️ Payment Overdue';
      mainMessage = `This is a reminder that invoice <strong>${invoice.invoiceNumber}</strong> is now overdue. Please submit payment at your earliest convenience.`;
      urgencyLevel = 'warning';
      break;

    case 'overdue_8_30':
      subject = `Payment Seriously Overdue: Invoice ${invoice.invoiceNumber}`;
      heading = '⚠️ Payment Seriously Overdue';
      mainMessage = `Invoice <strong>${invoice.invoiceNumber}</strong> is now significantly overdue. Immediate payment is required to avoid further action.`;
      urgencyLevel = 'critical';
      break;

    case 'final_notice':
      subject = `Final Notice: Invoice ${invoice.invoiceNumber}`;
      heading = '🚨 Final Notice';
      mainMessage = `This is a <strong>FINAL NOTICE</strong> regarding invoice <strong>${invoice.invoiceNumber}</strong>. Payment must be received immediately.`;
      urgencyLevel = 'critical';
      break;
  }

  const html = generateHTML(
    invoice,
    invoiceUrl,
    subject,
    heading,
    mainMessage,
    dueDate,
    total,
    businessName,
    businessEmail,
    urgencyLevel
  );

  const text = generatePlainText(invoice, invoiceUrl, subject, mainMessage, dueDate, total, businessName);

  return {
    subject,
    html,
    text,
    reminderType,
  };
}

function generateHTML(
  invoice: Invoice,
  invoiceUrl: string,
  subject: string,
  heading: string,
  mainMessage: string,
  dueDate: string,
  total: number,
  businessName: string,
  businessEmail: string,
  urgencyLevel: string
): string {
  const accentColor = invoice.accentColor || '#2563eb';
  const borderColor = urgencyLevel === 'critical' ? '#dc2626' : urgencyLevel === 'warning' ? '#f59e0b' : accentColor;

  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${subject}</title>
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #333; }
    .container { max-width: 600px; margin: 0 auto; padding: 20px; }
    .header { background: linear-gradient(135deg, ${borderColor}, ${adjustColor(borderColor, 20)}); color: white; padding: 30px; border-radius: 8px 8px 0 0; }
    .header h1 { margin: 0; font-size: 24px; }
    .content { background: #fff; border: 1px solid #ddd; border-top: none; padding: 30px; }
    .invoice-box { background: #f9fafb; border-left: 4px solid ${borderColor}; padding: 15px; margin: 20px 0; }
    .amount { font-size: 28px; font-weight: bold; color: ${borderColor}; }
    .button { display: inline-block; background: ${borderColor}; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: 600; margin: 20px 0; }
    .footer { background: #f3f4f6; color: #666; padding: 20px; border-radius: 0 0 8px 8px; font-size: 12px; text-align: center; border: 1px solid #ddd; border-top: none; }
    .footer p { margin: 5px 0; }
    .urgency-bar { background: ${borderColor}; height: 4px; border-radius: 8px; margin: 20px 0; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>${heading}</h1>
      <p style="margin: 10px 0 0 0; opacity: 0.9;">Invoice #${invoice.invoiceNumber}</p>
    </div>

    <div class="content">
      <p>Hi ${invoice.toName},</p>

      <p>${mainMessage}</p>

      <div class="invoice-box">
        <div style="margin-bottom: 10px;"><strong>Due Date:</strong> ${dueDate}</div>
        <div style="margin-bottom: 10px;"><strong>Invoice Number:</strong> ${invoice.invoiceNumber}</div>
        <div class="amount">Amount Due: $${total.toFixed(2)}</div>
      </div>

      <p style="text-align: center; margin: 30px 0;">
        <a href="${invoiceUrl}" class="button">View Invoice</a>
      </p>

      <p>If you have any questions about this invoice or need to discuss payment arrangements, please don't hesitate to reach out.</p>

      <p>
        <strong>${businessName}</strong><br>
        ${businessEmail}
      </p>
    </div>

    <div class="footer">
      <p>© ${new Date().getFullYear()} ${businessName}. All rights reserved.</p>
      <p>This is an automated payment reminder. Please do not reply to this email.</p>
      <p><a href="${invoiceUrl}" style="color: ${borderColor}; text-decoration: none;">View Invoice Online</a></p>
    </div>
  </div>
</body>
</html>
  `;
}

function generatePlainText(
  invoice: Invoice,
  invoiceUrl: string,
  subject: string,
  mainMessage: string,
  dueDate: string,
  total: number,
  businessName: string
): string {
  return `
${subject}

Hi ${invoice.toName},

${mainMessage}

Invoice Details:
- Invoice Number: ${invoice.invoiceNumber}
- Due Date: ${dueDate}
- Amount Due: $${total.toFixed(2)}

View Invoice: ${invoiceUrl}

If you have any questions about this invoice or need to discuss payment arrangements, please don't hesitate to reach out.

${businessName}

---
This is an automated payment reminder. Please do not reply to this email.
  `.trim();
}

/**
 * Adjust color brightness
 */
function adjustColor(color: string, percent: number): string {
  const num = parseInt(color.replace('#', ''), 16);
  const amt = Math.round(2.55 * percent);
  const R = Math.min(255, (num >> 16) + amt);
  const G = Math.min(255, (num >> 8 & 0x00FF) + amt);
  const B = Math.min(255, (num & 0x0000FF) + amt);
  return '#' + (0x1000000 + R * 0x10000 + G * 0x100 + B).toString(16).slice(1);
}
