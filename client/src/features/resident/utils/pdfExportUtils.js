export const pdfColors = {
  ink: [31, 41, 55],
  muted: [107, 114, 128],
  purple: [105, 72, 196],
  green: [29, 139, 94],
  red: [194, 65, 65],
  orange: [191, 112, 22],
  line: [225, 228, 235],
  surface: [247, 248, 251],
  white: [255, 255, 255]
};

export const formatPdfAmount = (amount) => new Intl.NumberFormat('en-IN', {
  maximumFractionDigits: 0
}).format(amount);

export const createPdfTableStyles = (margin) => ({
  theme: 'plain',
  styles: {
    font: 'helvetica',
    fontSize: 8.5,
    textColor: pdfColors.ink,
    cellPadding: { top: 2.5, right: 3, bottom: 2.5, left: 3 },
    lineColor: pdfColors.line,
    lineWidth: { bottom: 0.15 }
  },
  headStyles: {
    fillColor: pdfColors.ink,
    textColor: pdfColors.white,
    fontSize: 8,
    fontStyle: 'bold',
    cellPadding: { top: 3, right: 3, bottom: 3, left: 3 }
  },
  alternateRowStyles: { fillColor: pdfColors.surface },
  margin: { left: margin, right: margin }
});

export const drawPdfFooter = (doc, { pageWidth, pageHeight, margin, label }) => {
  doc.setDrawColor(...pdfColors.line);
  doc.setLineWidth(0.25);
  doc.line(margin, pageHeight - 15, pageWidth - margin, pageHeight - 15);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7.5);
  doc.setTextColor(...pdfColors.muted);
  doc.text(label, margin, pageHeight - 9);
};
