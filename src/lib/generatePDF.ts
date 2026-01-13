import { jsPDF } from 'jspdf';
import { Invoice, CURRENCIES } from '@/types/invoice';

export async function generatePDF(invoice: Invoice): Promise<void> {
  const doc = new jsPDF();
  const currency = CURRENCIES.find((c) => c.code === invoice.currency) || CURRENCIES[0];
  const pageWidth = doc.internal.pageSize.getWidth();

  // Colors
  const accentColor = hexToRgb(invoice.accentColor);
  const darkGray = [51, 51, 51];
  const lightGray = [128, 128, 128];

  let yPos = 20;

  // Header with accent color bar
  doc.setFillColor(accentColor[0], accentColor[1], accentColor[2]);
  doc.rect(0, 0, pageWidth, 8, 'F');

  // Logo if premium and has logo
  if (invoice.logo) {
    try {
      doc.addImage(invoice.logo, 'PNG', 15, yPos, 40, 20);
      yPos += 25;
    } catch {
      // Logo failed to load, continue without it
    }
  }

  // INVOICE title
  doc.setFontSize(32);
  doc.setTextColor(accentColor[0], accentColor[1], accentColor[2]);
  doc.text('INVOICE', 15, yPos + 10);

  // Invoice number and dates on the right
  doc.setFontSize(10);
  doc.setTextColor(darkGray[0], darkGray[1], darkGray[2]);
  doc.text(`Invoice #: ${invoice.invoiceNumber}`, pageWidth - 15, yPos, { align: 'right' });
  doc.text(`Date: ${formatDate(invoice.date)}`, pageWidth - 15, yPos + 6, { align: 'right' });
  doc.text(`Due Date: ${formatDate(invoice.dueDate)}`, pageWidth - 15, yPos + 12, { align: 'right' });

  if (invoice.isPaid) {
    doc.setTextColor(34, 197, 94);
    doc.setFontSize(12);
    doc.text('PAID', pageWidth - 15, yPos + 22, { align: 'right' });
  }

  yPos += 40;

  // From and To sections
  doc.setFontSize(10);
  doc.setTextColor(lightGray[0], lightGray[1], lightGray[2]);
  doc.text('FROM', 15, yPos);
  doc.text('TO', 110, yPos);

  yPos += 6;
  doc.setTextColor(darkGray[0], darkGray[1], darkGray[2]);
  doc.setFontSize(11);

  // From details
  doc.setFont('helvetica', 'bold');
  doc.text(invoice.fromName, 15, yPos);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  const fromLines = [invoice.fromEmail, invoice.fromPhone, ...invoice.fromAddress.split('\n')].filter(
    Boolean
  );
  fromLines.forEach((line, i) => {
    doc.text(line, 15, yPos + 5 + i * 4);
  });

  // To details
  doc.setFontSize(11);
  doc.setFont('helvetica', 'bold');
  doc.text(invoice.toName, 110, yPos);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  const toLines = [invoice.toEmail, ...invoice.toAddress.split('\n')].filter(Boolean);
  toLines.forEach((line, i) => {
    doc.text(line, 110, yPos + 5 + i * 4);
  });

  yPos += 35;

  // Items table header
  doc.setFillColor(accentColor[0], accentColor[1], accentColor[2]);
  doc.rect(15, yPos, pageWidth - 30, 8, 'F');
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(9);
  doc.setFont('helvetica', 'bold');
  doc.text('DESCRIPTION', 18, yPos + 5.5);
  doc.text('QTY', 120, yPos + 5.5);
  doc.text('PRICE', 145, yPos + 5.5);
  doc.text('AMOUNT', pageWidth - 18, yPos + 5.5, { align: 'right' });

  yPos += 12;

  // Items
  doc.setTextColor(darkGray[0], darkGray[1], darkGray[2]);
  doc.setFont('helvetica', 'normal');

  let subtotal = 0;
  invoice.items.forEach((item) => {
    const amount = item.quantity * item.price;
    subtotal += amount;

    doc.text(item.description || 'Item', 18, yPos);
    doc.text(String(item.quantity), 120, yPos);
    doc.text(`${currency.symbol}${item.price.toFixed(2)}`, 145, yPos);
    doc.text(`${currency.symbol}${amount.toFixed(2)}`, pageWidth - 18, yPos, { align: 'right' });

    // Light separator line
    doc.setDrawColor(230, 230, 230);
    doc.line(15, yPos + 3, pageWidth - 15, yPos + 3);

    yPos += 8;
  });

  yPos += 5;

  // Totals section
  const taxAmount = subtotal * (invoice.taxRate / 100);
  const total = subtotal + taxAmount;

  doc.setFontSize(10);

  // Subtotal
  doc.text('Subtotal:', 140, yPos);
  doc.text(`${currency.symbol}${subtotal.toFixed(2)}`, pageWidth - 18, yPos, { align: 'right' });

  // Tax
  if (invoice.taxRate > 0) {
    yPos += 6;
    doc.text(`Tax (${invoice.taxRate}%):`, 140, yPos);
    doc.text(`${currency.symbol}${taxAmount.toFixed(2)}`, pageWidth - 18, yPos, { align: 'right' });
  }

  // Total
  yPos += 8;
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(12);
  doc.setTextColor(accentColor[0], accentColor[1], accentColor[2]);
  doc.text('TOTAL:', 140, yPos);
  doc.text(`${currency.symbol}${total.toFixed(2)}`, pageWidth - 18, yPos, { align: 'right' });

  // Notes
  if (invoice.notes) {
    yPos += 20;
    doc.setTextColor(lightGray[0], lightGray[1], lightGray[2]);
    doc.setFontSize(9);
    doc.setFont('helvetica', 'normal');
    doc.text('NOTES', 15, yPos);
    yPos += 5;
    doc.setTextColor(darkGray[0], darkGray[1], darkGray[2]);
    const noteLines = doc.splitTextToSize(invoice.notes, pageWidth - 30);
    doc.text(noteLines, 15, yPos);
  }

  // Footer
  doc.setTextColor(lightGray[0], lightGray[1], lightGray[2]);
  doc.setFontSize(8);
  doc.text('Generated with InvoiceGen', pageWidth / 2, 285, { align: 'center' });

  // Save
  doc.save(`${invoice.invoiceNumber}.pdf`);
}

function hexToRgb(hex: string): [number, number, number] {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result
    ? [parseInt(result[1], 16), parseInt(result[2], 16), parseInt(result[3], 16)]
    : [37, 99, 235];
}

function formatDate(dateStr: string): string {
  const date = new Date(dateStr);
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}
