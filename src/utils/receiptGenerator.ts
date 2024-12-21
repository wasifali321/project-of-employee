import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { format } from 'date-fns';
import type { VisaService } from '../types';

export function generateReceipt(service: VisaService, companyLogo?: string) {
  const doc = new jsPDF();
  const remainingAmount = service.totalPrice - service.sellingPrice;
  const pageWidth = doc.internal.pageSize.width;

  // Add company logo if available
  if (companyLogo) {
    try {
      doc.addImage(
        companyLogo,
        'PNG',
        pageWidth / 2 - 20, // Center the logo
        10,
        40,
        20
      );
      doc.setFontSize(20);
      doc.text('Visa Service Receipt', pageWidth / 2, 45, { align: 'center' });
    } catch (error) {
      console.error('Error adding logo to receipt:', error);
      // Fallback to text-only header
      doc.setFontSize(20);
      doc.text('Visa Service Receipt', pageWidth / 2, 20, { align: 'center' });
    }
  } else {
    doc.setFontSize(20);
    doc.text('Visa Service Receipt', pageWidth / 2, 20, { align: 'center' });
  }
  
  // Add receipt number and date
  const startY = companyLogo ? 60 : 40;
  doc.setFontSize(12);
  doc.text(`Receipt #: ${service.receiptNumber}`, 20, startY);
  doc.text(`Date: ${format(new Date(service.date), 'dd/MM/yyyy')}`, 20, startY + 10);

  // Add customer details
  const customerInfo = [
    ['Customer Name:', service.customerName],
    ['Passport Number:', service.passportNumber],
    ['Mobile Number:', service.mobileNumber],
    ['Organization:', service.organization]
  ];

  autoTable(doc, {
    startY: startY + 20,
    head: [['Detail', 'Value']],
    body: customerInfo,
    theme: 'grid',
    styles: { fontSize: 12, cellPadding: 5 }
  });

  // Add payment details
  const paymentInfo = [
    ['Total Amount:', `SAR ${service.totalPrice.toFixed(2)}`],
    ['Received Amount:', `SAR ${service.sellingPrice.toFixed(2)}`],
    ['Remaining Amount:', `SAR ${remainingAmount.toFixed(2)}`]
  ];

  autoTable(doc, {
    startY: doc.lastAutoTable.finalY + 10,
    head: [['Payment Details', 'Amount']],
    body: paymentInfo,
    theme: 'grid',
    styles: { fontSize: 12, cellPadding: 5 }
  });

  // Add footer
  const footerY = doc.lastAutoTable.finalY + 30;
  doc.line(20, footerY, pageWidth - 20, footerY);
  doc.text('Authorized Signature', pageWidth - 60, footerY + 10);

  // Add terms and conditions
  doc.setFontSize(10);
  doc.text('Terms & Conditions:', 20, footerY + 30);
  doc.text('1. This receipt is valid for 30 days from the date of issue.', 20, footerY + 40);
  doc.text('2. Please keep this receipt for future reference.', 20, footerY + 50);

  return doc;
}