import { useState } from 'react';
import { format } from 'date-fns';
import ExcelJS from 'exceljs';
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';
import { createPdfTableStyles, drawPdfFooter, formatPdfAmount, pdfColors } from '../utils/pdfExportUtils';
import { downloadResidentReceiptPdf } from '../utils/receiptPdf';

const usePaymentHistoryTab = ({ payments, profile }) => {
  const [filters, setFilters] = useState({
    search: '',
    dateFrom: '',
    dateTo: '',
    category: '',
    status: ''
  });
  const [isExporting, setIsExporting] = useState(false);

  // Get filtered payments
  const getFilteredPayments = () => {
    let filtered = [...payments];

    // Search filter
    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      filtered = filtered.filter(
        (p) =>
          (p.category || '').toLowerCase().includes(searchLower) ||
          (p.month || '').toLowerCase().includes(searchLower) ||
          p.transactionId?.toLowerCase().includes(searchLower) ||
          p.receiptNo?.toLowerCase().includes(searchLower)
      );
    }

    // Date range filter
    if (filters.dateFrom) {
      filtered = filtered.filter((p) => new Date(p.date) >= new Date(filters.dateFrom));
    }
    if (filters.dateTo) {
      filtered = filtered.filter((p) => new Date(p.date) <= new Date(filters.dateTo));
    }

    // Category filter
    if (filters.category) {
      filtered = filtered.filter((p) => p.category === filters.category);
    }

    // Status filter
    if (filters.status) {
      filtered = filtered.filter((p) => p.status === filters.status);
    }

    return filtered;
  };

  const filteredPayments = getFilteredPayments();

  // Get unique categories
  const categories = [...new Set(payments.map((p) => p.category).filter(Boolean))];

  const handleResetFilters = () => {
    setFilters({
      search: '',
      dateFrom: '',
      dateTo: '',
      category: '',
      status: ''
    });
  };

  const handleExportPDF = () => {
    setIsExporting(true);

    try {
      const doc = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });
      const pageWidth = doc.internal.pageSize.getWidth();
      const pageHeight = doc.internal.pageSize.getHeight();
      const margin = 16;
      const generatedAt = new Date();
      const colors = pdfColors;
      const dateRange = filters.dateFrom || filters.dateTo
        ? `${filters.dateFrom ? format(new Date(`${filters.dateFrom}T00:00:00`), 'MMM dd, yyyy') : 'Beginning'} - ${filters.dateTo ? format(new Date(`${filters.dateTo}T00:00:00`), 'MMM dd, yyyy') : 'Present'}`
        : 'All Time';

      const drawHeader = () => {
        doc.setFillColor(...colors.purple);
        doc.rect(0, 0, pageWidth, 2, 'F');
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(11);
        doc.setTextColor(...colors.purple);
        doc.text('SocietyVault', margin, 13);
        doc.setFontSize(19);
        doc.setTextColor(...colors.ink);
        doc.text('Payment History', margin, 23);
        doc.setFont('helvetica', 'normal');
        doc.setFontSize(8.5);
        doc.setTextColor(...colors.muted);
        doc.text(`Period: ${dateRange}  |  All amounts in INR`, margin, 30);
        doc.text(`Generated ${format(generatedAt, 'MMM dd, yyyy | HH:mm')}`, pageWidth - margin, 30, { align: 'right' });
        doc.setDrawColor(...colors.line);
        doc.setLineWidth(0.3);
        doc.line(margin, 34, pageWidth - margin, 34);
        doc.setFontSize(8);
        doc.text(`${profile.name || 'Resident'}  |  Flat ${profile.flatNo || 'Not provided'}, Block ${profile.wing || 'Not provided'}`, margin, 41);
      };

      drawHeader();
      autoTable(doc, {
        ...createPdfTableStyles(margin),
        startY: 47,
        margin: { top: 47, left: margin, right: margin, bottom: 20 },
        styles: {
          ...createPdfTableStyles(margin).styles,
          fontSize: 7.5,
          cellPadding: { top: 2.5, right: 2, bottom: 2.5, left: 2 }
        },
        head: [['Date', 'Month', 'Category', 'Mode', 'Transaction ID', 'Amount (INR)', 'Status']],
        body: filteredPayments.map((payment) => [
          format(new Date(`${payment.date}T00:00:00`), 'dd MMM yyyy'),
          payment.month,
          payment.category,
          payment.paymentMode,
          payment.transactionId || 'N/A',
          formatPdfAmount(payment.amount),
          payment.status.toUpperCase()
        ]),
        columnStyles: {
          0: { cellWidth: 22 },
          1: { cellWidth: 27 },
          2: { cellWidth: 27 },
          3: { cellWidth: 21 },
          4: { cellWidth: 32 },
          5: { cellWidth: 27, halign: 'right', fontStyle: 'bold' },
          6: { cellWidth: 22, halign: 'center' }
        },
        didParseCell: (data) => {
          if (data.section === 'body' && data.column.index === 6) {
            const status = filteredPayments[data.row.index].status;
            const statusColors = {
              completed: colors.green,
              pending: colors.orange,
              failed: colors.red
            };
            data.cell.styles.textColor = statusColors[status] || colors.purple;
            data.cell.styles.fontStyle = 'bold';
          }
        },
        didDrawPage: drawHeader
      });

      const completedPayments = filteredPayments.filter((payment) => payment.status === 'completed');
      const totalPaid = completedPayments.reduce((sum, payment) => sum + payment.amount, 0);
      let summaryY = doc.lastAutoTable.finalY + 9;
      if (summaryY + 27 > pageHeight - 20) {
        doc.addPage();
        drawHeader();
        summaryY = 49;
      }

      doc.setFillColor(...colors.surface);
      doc.setDrawColor(...colors.line);
      doc.roundedRect(margin, summaryY, pageWidth - margin * 2, 27, 1.5, 1.5, 'FD');
      doc.setFillColor(...colors.purple);
      doc.roundedRect(margin, summaryY, pageWidth - margin * 2, 1.2, 0.6, 0.6, 'F');
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(9);
      doc.setTextColor(...colors.ink);
      doc.text('Payment Summary', margin + 3, summaryY + 8);
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(8.5);
      doc.setTextColor(...colors.muted);
      doc.text(`Records: ${filteredPayments.length}  |  Completed: ${completedPayments.length}`, margin + 3, summaryY + 16);
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(...colors.green);
      doc.text(`Total Paid: INR ${formatPdfAmount(totalPaid)}`, margin + 3, summaryY + 23);

      const pageCount = doc.internal.getNumberOfPages();
      for (let page = 1; page <= pageCount; page += 1) {
        doc.setPage(page);
        drawPdfFooter(doc, {
          pageWidth,
          pageHeight,
          margin,
          label: 'SocietyVault Payment History'
        });
        doc.text(`Page ${page} of ${pageCount}`, pageWidth - margin, pageHeight - 9, { align: 'right' });
      }

      const fileName = `Payment_History_${format(generatedAt, 'yyyy-MM-dd_HHmm')}.pdf`;
      doc.save(fileName);
    } catch (error) {
      console.error('❌ [Payment History] PDF export failed:', error);
      alert('Failed to export payment history PDF. Please try again.');
    } finally {
      setIsExporting(false);
    }
  };

  const handleDownloadReceipt = (payment) => {
    setIsExporting(true);
    try {
      downloadResidentReceiptPdf({
        ...payment,
        id: payment.receiptNo,
        status: payment.status
      }, profile);
    } catch (error) {
      console.error('❌ [Payment History] Receipt PDF export failed:', error);
      alert('Failed to download receipt. Please try again.');
    } finally {
      setIsExporting(false);
    }
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    });
  };

  // Excel Export Function
  const handleExportExcel = async () => {
    setIsExporting(true);

    try {
      const workbook = new ExcelJS.Workbook();
      const generatedAt = new Date();
      
      const palette = {
        purple: 'FF7F5AF0',
        ink: 'FF1F2937',
        muted: 'FF6B7280',
        green: 'FF2CB67D',
        red: 'FFC24141',
        orange: 'FFFFA500',
        line: 'FFE1E4EB',
        surface: 'FFF7F8FB',
        white: 'FFFFFFFF'
      };

      const currencyFormat = '₹#,##0;[Red]-₹#,##0';

      workbook.creator = 'SocietyVault';
      workbook.created = generatedAt;
      workbook.title = 'Payment History';

      const sheet = workbook.addWorksheet('Payment History', {
        views: [{ state: 'frozen', ySplit: 4, showGridLines: false, zoomScale: 90 }],
        pageSetup: { paperSize: 9, orientation: 'landscape', fitToPage: true, fitToWidth: 1 }
      });

      sheet.columns = [
        { key: 'date', width: 14 },
        { key: 'month', width: 18 },
        { key: 'category', width: 18 },
        { key: 'mode', width: 16 },
        { key: 'transactionId', width: 20 },
        { key: 'amount', width: 14 },
        { key: 'status', width: 12 },
        { key: 'receiptNo', width: 18 }
      ];

      // Title
      sheet.mergeCells('A1:H1');
      const titleCell = sheet.getCell('A1');
      titleCell.value = 'SocietyVault | Payment History';
      titleCell.font = { name: 'Aptos Display', size: 22, bold: true, color: { argb: palette.purple } };
      titleCell.alignment = { vertical: 'middle', horizontal: 'left' };
      sheet.getRow(1).height = 38;

      // Subtitle
      sheet.mergeCells('A2:H2');
      const subtitleCell = sheet.getCell('A2');
      const dateRange = filters.dateFrom && filters.dateTo
        ? `${format(new Date(filters.dateFrom), 'MMM dd, yyyy')} - ${format(new Date(filters.dateTo), 'MMM dd, yyyy')}`
        : 'All Time';
      subtitleCell.value = `Period: ${dateRange}  |  Generated: ${format(generatedAt, 'MMM dd, yyyy HH:mm')}`;
      subtitleCell.font = { name: 'Aptos', size: 10, color: { argb: palette.muted } };
      subtitleCell.alignment = { vertical: 'middle', horizontal: 'left' };
      sheet.getRow(2).height = 23;

      // Table Header
      const headerRow = sheet.getRow(4);
      headerRow.values = ['Date', 'Month', 'Category', 'Payment Mode', 'Transaction ID', 'Amount (₹)', 'Status', 'Receipt No'];
      headerRow.height = 25;
      headerRow.eachCell((cell) => {
        cell.font = { name: 'Aptos', size: 10, bold: true, color: { argb: palette.white } };
        cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: palette.purple } };
        cell.alignment = { vertical: 'middle', horizontal: 'center' };
        cell.border = {
          top: { style: 'thin', color: { argb: palette.line } },
          bottom: { style: 'medium', color: { argb: palette.purple } }
        };
      });

      // Data Rows
      filteredPayments.forEach((payment, index) => {
        const row = sheet.getRow(5 + index);
        row.values = [
          new Date(`${payment.date}T00:00:00`),
          payment.month,
          payment.category,
          payment.paymentMode,
          payment.transactionId || 'N/A',
          payment.amount,
          payment.status.toUpperCase(),
          payment.receiptNo || 'N/A'
        ];
        row.height = 23;

        row.getCell(1).numFmt = 'dd mmm yyyy';
        row.getCell(6).numFmt = currencyFormat;
        row.getCell(6).alignment = { vertical: 'middle', horizontal: 'right' };
        row.getCell(7).alignment = { vertical: 'middle', horizontal: 'center' };
        
        // Status color coding
        const statusColors = {
          completed: palette.green,
          pending: palette.orange,
          failed: palette.red,
          processing: palette.purple
        };
        row.getCell(7).font = {
          name: 'Aptos',
          size: 9,
          bold: true,
          color: { argb: statusColors[payment.status] || palette.muted }
        };

        if (index % 2 === 0) {
          row.eachCell((cell) => {
            if (!cell.fill || !cell.fill.fgColor) {
              cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: palette.surface } };
            }
          });
        }
      });

      // Summary Row
      const summaryRow = 5 + filteredPayments.length + 2;
      sheet.mergeCells(summaryRow, 1, summaryRow, 5);
      const summaryCell = sheet.getCell(summaryRow, 1);
      summaryCell.value = 'TOTAL AMOUNT';
      summaryCell.font = { name: 'Aptos', size: 11, bold: true, color: { argb: palette.ink } };
      summaryCell.alignment = { vertical: 'middle', horizontal: 'right' };
      summaryCell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: palette.surface } };

      const totalAmount = filteredPayments.reduce((sum, p) => sum + p.amount, 0);
      const totalCell = sheet.getCell(summaryRow, 6);
      totalCell.value = totalAmount;
      totalCell.numFmt = currencyFormat;
      totalCell.font = { name: 'Aptos Display', size: 14, bold: true, color: { argb: palette.purple } };
      totalCell.alignment = { vertical: 'middle', horizontal: 'right' };
      totalCell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: palette.surface } };

      const buffer = await workbook.xlsx.writeBuffer();
      const blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
      const fileName = `Payment_History_${format(generatedAt, 'yyyy-MM-dd_HHmm')}.xlsx`;
      const downloadUrl = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = downloadUrl;
      link.download = fileName;
      link.click();
      setTimeout(() => URL.revokeObjectURL(downloadUrl), 1000);

    } catch (error) {
      console.error('❌ [Payment History] Excel export failed:', error);
      alert('Failed to export Excel. Please try again.');
    } finally {
      setIsExporting(false);
    }
  };

  
  return { filters, setFilters, isExporting, filteredPayments, categories, handleResetFilters, handleExportPDF, handleDownloadReceipt, formatDate, handleExportExcel };
};

export default usePaymentHistoryTab;
