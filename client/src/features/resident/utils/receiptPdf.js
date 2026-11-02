import { format } from 'date-fns';
import { jsPDF } from 'jspdf';
import { drawPdfFooter, formatPdfAmount, pdfColors } from './pdfExportUtils';

export const downloadResidentReceiptPdf = (receipt, residentProfile = {}) => {
  const doc = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });
  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const margin = 16;
  const generatedAt = new Date();
  const colors = pdfColors;

  doc.setFillColor(...colors.purple);
  doc.rect(0, 0, pageWidth, 2, 'F');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(11);
  doc.setTextColor(...colors.purple);
  doc.text('SocietyVault', margin, 13);
  doc.setFontSize(20);
  doc.setTextColor(...colors.ink);
  doc.text('PAYMENT RECEIPT', margin, 26);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(10);
  doc.setTextColor(...colors.muted);
  doc.text(`Receipt No: ${receipt.id}`, pageWidth - margin, 13, { align: 'right' });
  doc.text(`Date: ${format(new Date(receipt.date), 'MMM dd, yyyy')}`, pageWidth - margin, 20, { align: 'right' });

  doc.setDrawColor(...colors.line);
  doc.setLineWidth(0.3);
  doc.line(margin, 32, pageWidth - margin, 32);

  const isPaid = receipt.status === 'generated' || receipt.status === 'completed';
  const statusColor = isPaid ? colors.green : receipt.status === 'failed' ? colors.red : colors.orange;
  const statusLabel = receipt.status === 'generated' ? 'PAID' : receipt.status.toUpperCase();
  doc.setFillColor(...statusColor);
  doc.roundedRect(margin, 40, 40, 8, 1.5, 1.5, 'F');
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8);
  doc.setTextColor(...colors.white);
  doc.text(statusLabel, margin + 20, 45.5, { align: 'center' });

  doc.setFillColor(...colors.surface);
  doc.setDrawColor(...colors.line);
  doc.setLineWidth(0.25);
  doc.roundedRect(margin, 54, pageWidth - margin * 2, 32, 1.5, 1.5, 'FD');
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9);
  doc.setTextColor(...colors.purple);
  doc.text('RESIDENT DETAILS', margin + 3, 61);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(...colors.ink);
  doc.text(`Name: ${residentProfile.name || 'Not provided'}`, margin + 3, 68);
  doc.text(`Flat No: ${residentProfile.flatNo || 'Not provided'} | Block: ${residentProfile.wing || 'Not provided'}`, margin + 3, 74);
  doc.text(`Email: ${residentProfile.email || 'Not provided'}`, margin + 3, 80);

  doc.setFillColor(...colors.white);
  doc.roundedRect(margin, 92, pageWidth - margin * 2, 70, 1.5, 1.5, 'FD');
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(...colors.purple);
  doc.text('PAYMENT DETAILS', margin + 3, 99);

  const detailRows = [
    ['Payment Month:', receipt.month],
    ['Category:', receipt.category],
    ['Payment Mode:', receipt.paymentMode],
    ['Payment Date:', format(new Date(receipt.date), 'MMM dd, yyyy')],
    ['Transaction ID:', receipt.transactionId || 'N/A']
  ];
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  detailRows.forEach(([label, value], index) => {
    const y = 106 + index * 7;
    doc.setTextColor(...colors.muted);
    doc.text(label, margin + 3, y);
    doc.setTextColor(...colors.ink);
    doc.text(value, margin + 50, y);
  });

  doc.setFillColor(...colors.purple);
  doc.roundedRect(margin, 168, pageWidth - margin * 2, 18, 1.5, 1.5, 'F');
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(11);
  doc.setTextColor(...colors.white);
  doc.text('AMOUNT PAID', margin + 3, 176);
  doc.setFontSize(16);
  doc.text(`INR ${formatPdfAmount(receipt.amount)}`, pageWidth - margin - 3, 179, { align: 'right' });

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  doc.setTextColor(...colors.muted);
  doc.text('Thank you for your payment!', pageWidth / 2, 198, { align: 'center' });
  doc.setFontSize(8);
  doc.text('This is a computer-generated receipt and does not require a signature.', pageWidth / 2, 204, { align: 'center' });

  drawPdfFooter(doc, {
    pageWidth,
    pageHeight,
    margin,
    label: 'SocietyVault | Payment Receipt'
  });
  doc.text(`Generated on ${format(generatedAt, 'MMM dd, yyyy HH:mm')}`, pageWidth - margin, pageHeight - 9, { align: 'right' });

  const fileName = `Receipt_${receipt.id}_${format(new Date(receipt.date), 'yyyy-MM-dd')}.pdf`;
  doc.save(fileName);
};
