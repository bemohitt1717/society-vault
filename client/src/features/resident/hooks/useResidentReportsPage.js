import { useState } from 'react';
import { format } from 'date-fns';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import ExcelJS from 'exceljs';
import { paymentHistory, receipts } from '../data/mockResidentData';
import { getResidentProfile } from '../data/residentProfileStorage';
import { createPdfTableStyles, drawPdfFooter, formatPdfAmount, pdfColors } from '../utils/pdfExportUtils';

const useResidentReportsPage = () => {
  const [filters, setFilters] = useState({
    reportType: 'payment',
    dateFrom: '',
    dateTo: '',
    format: 'pdf'
  });
  const [isExporting, setIsExporting] = useState(false);

  const reportTypes = [
    { value: 'payment', label: 'Payment Statement' },
    { value: 'yearly', label: 'Yearly Summary' },
    { value: 'receipts', label: 'All Receipts' },
  ];

  // Filter payment data based on date range
  const getFilteredPayments = () => {
    let filtered = [...paymentHistory];
    
    if (filters.dateFrom) {
      filtered = filtered.filter(p => new Date(p.date) >= new Date(filters.dateFrom));
    }
    
    if (filters.dateTo) {
      filtered = filtered.filter(p => new Date(p.date) <= new Date(filters.dateTo));
    }
    
    return filtered;
  };

  const getFilteredReceipts = () => {
    let filtered = [...receipts];

    if (filters.dateFrom) {
      filtered = filtered.filter((receipt) => new Date(receipt.date) >= new Date(filters.dateFrom));
    }

    if (filters.dateTo) {
      filtered = filtered.filter((receipt) => new Date(receipt.date) <= new Date(filters.dateTo));
    }

    return filtered;
  };

  // PDF Export Function
  const handleExportPDF = () => {
    setIsExporting(true);

    try {
      const residentProfile = getResidentProfile();
      const doc = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });
      const pageWidth = doc.internal.pageSize.getWidth();
      const pageHeight = doc.internal.pageSize.getHeight();
      const margin = 16;
      const generatedAt = new Date();

      const colors = pdfColors;
      const tableStyles = createPdfTableStyles(margin);

      // Header - purple top bar
      doc.setFillColor(...colors.purple);
      doc.rect(0, 0, pageWidth, 2, 'F');

      // Title
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(11);
      doc.setTextColor(...colors.purple);
      doc.text('SocietyVault', margin, 13);
      
      doc.setFontSize(20);
      doc.setTextColor(...colors.ink);
      const reportTitle = reportTypes.find((type) => type.value === filters.reportType)?.label || 'Payment Statement';
      doc.text(reportTitle, margin, 23);

      // Subtitle
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(9);
      doc.setTextColor(...colors.muted);
      const dateRange = filters.dateFrom && filters.dateTo
        ? `${format(new Date(filters.dateFrom), 'MMM dd, yyyy')} - ${format(new Date(filters.dateTo), 'MMM dd, yyyy')}`
        : 'All Time';
      doc.text(`Period: ${dateRange}  |  All amounts in INR`, margin, 30);
      doc.text(`Generated ${format(generatedAt, 'MMM dd, yyyy | HH:mm')}`, pageWidth - margin, 30, { align: 'right' });

      // Divider line
      doc.setDrawColor(...colors.line);
      doc.setLineWidth(0.3);
      doc.line(margin, 34, pageWidth - margin, 34);

      // Resident Info Box
      doc.setFillColor(...colors.surface);
      doc.setDrawColor(...colors.line);
      doc.setLineWidth(0.25);
      doc.roundedRect(margin, 40, pageWidth - margin * 2, 30, 1.5, 1.5, 'FD');

      doc.setFont('helvetica', 'bold');
      doc.setFontSize(10);
      doc.setTextColor(...colors.ink);
      doc.text('Resident Information', margin + 3, 47);

      doc.setFont('helvetica', 'normal');
      doc.setFontSize(8.5);
      doc.setTextColor(...colors.muted);
      doc.text(`Name: ${residentProfile.name}`, margin + 3, 54);
      doc.text(`Flat: ${residentProfile.flatNo} | Block: ${residentProfile.wing}`, margin + 3, 59);
      doc.text(`Email: ${residentProfile.email}`, margin + 3, 64);
      doc.text(`Phone: ${residentProfile.phone}`, pageWidth - margin - 3, 54, { align: 'right' });

      const filteredPayments = getFilteredPayments();
      const filteredReceipts = getFilteredReceipts();
      const yearlyTotals = Object.values(filteredPayments.reduce((years, payment) => {
        const year = format(new Date(`${payment.date}T00:00:00`), 'yyyy');
        if (!years[year]) {
          years[year] = { year, payments: 0, completed: 0, paid: 0, pending: 0 };
        }
        years[year].payments += 1;
        if (payment.status === 'completed') {
          years[year].completed += 1;
          years[year].paid += payment.amount;
        } else {
          years[year].pending += payment.amount;
        }
        return years;
      }, {}));
      const tableHead = filters.reportType === 'receipts'
        ? [['Date', 'Receipt No.', 'Month', 'Category', 'Mode', 'Amount (INR)']]
        : filters.reportType === 'yearly'
        ? [['Year', 'Payments', 'Completed', 'Total Paid (INR)', 'Pending (INR)']]
        : [['Date', 'Month', 'Category', 'Mode', 'Amount (INR)', 'Status']];
      const tableBody = filters.reportType === 'receipts'
        ? filteredReceipts.map((receipt) => [
          format(new Date(`${receipt.date}T00:00:00`), 'MMM dd, yyyy'),
          receipt.id,
          receipt.month,
          receipt.category,
          receipt.paymentMode,
          formatPdfAmount(receipt.amount)
        ])
        : filters.reportType === 'yearly'
        ? yearlyTotals.map((year) => [
          year.year,
          String(year.payments),
          String(year.completed),
          formatPdfAmount(year.paid),
          formatPdfAmount(year.pending)
        ])
        : filteredPayments.map((payment) => [
          format(new Date(`${payment.date}T00:00:00`), 'MMM dd, yyyy'),
          payment.month,
          payment.category,
          payment.paymentMode,
          formatPdfAmount(payment.amount),
          payment.status.toUpperCase()
        ]);

      autoTable(doc, {
        ...tableStyles,
        startY: 78,
        head: tableHead,
        body: tableBody,
        columnStyles: filters.reportType === 'receipts'
          ? {
            0: { cellWidth: 25 },
            1: { cellWidth: 29 },
            2: { cellWidth: 34 },
            3: { cellWidth: 31 },
            4: { cellWidth: 28 },
            5: { cellWidth: 30, halign: 'right', fontStyle: 'bold' }
          }
          : filters.reportType === 'yearly'
          ? {
            0: { cellWidth: 20 },
            1: { cellWidth: 27, halign: 'center' },
            2: { cellWidth: 27, halign: 'center' },
            3: { cellWidth: 52, halign: 'right', fontStyle: 'bold', textColor: colors.green },
            4: { cellWidth: 52, halign: 'right', textColor: colors.orange }
          }
          : {
            0: { cellWidth: 25 },
            1: { cellWidth: 30 },
            2: { cellWidth: 32 },
            3: { cellWidth: 25 },
            4: { cellWidth: 28, halign: 'right', fontStyle: 'bold' },
            5: { cellWidth: 25, halign: 'center' }
          },
        didParseCell: (data) => {
          if (filters.reportType === 'payment' && data.section === 'body' && data.column.index === 5) {
            const status = filteredPayments[data.row.index].status;
            data.cell.styles.textColor = status === 'completed' ? colors.green : colors.red;
            data.cell.styles.fontStyle = 'bold';
          }
        }
      });

      // Summary Section
      let summaryY = doc.lastAutoTable.finalY + 10;
      const summaryHeight = 27;
      if (summaryY + summaryHeight > pageHeight - 20) {
        doc.addPage();
        summaryY = 38;
        doc.setFillColor(...colors.purple);
        doc.rect(0, 0, pageWidth, 2, 'F');
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(17);
        doc.setTextColor(...colors.ink);
        doc.text(reportTitle, margin, 19);
        doc.setFont('helvetica', 'normal');
        doc.setFontSize(8.5);
        doc.setTextColor(...colors.muted);
        doc.text(`${residentProfile.name}  |  Payment summary`, margin, 26);
        doc.setDrawColor(...colors.line);
        doc.line(margin, 30, pageWidth - margin, 30);
      }
      const completedRecords = filteredPayments.filter((payment) => payment.status === 'completed');
      const totalPaid = filters.reportType === 'receipts'
        ? filteredReceipts.reduce((sum, receipt) => sum + receipt.amount, 0)
        : filters.reportType === 'yearly'
        ? yearlyTotals.reduce((sum, year) => sum + year.paid, 0)
        : completedRecords.reduce((sum, payment) => sum + payment.amount, 0);
      const recordCount = filters.reportType === 'receipts' ? filteredReceipts.length : filteredPayments.length;
      const summaryHeading = filters.reportType === 'receipts'
        ? 'Receipt Summary'
        : filters.reportType === 'yearly'
        ? 'Yearly Summary'
        : 'Payment Summary';
      const summaryCount = filters.reportType === 'receipts'
        ? `Receipts included: ${recordCount}`
        : filters.reportType === 'yearly'
        ? `Years included: ${yearlyTotals.length}  |  Payments: ${recordCount}`
        : `Total Payments: ${completedRecords.length} completed of ${recordCount}`;

      doc.setFillColor(...colors.surface);
      doc.setDrawColor(...colors.line);
      doc.setLineWidth(0.25);
      doc.roundedRect(margin, summaryY, pageWidth - margin * 2, summaryHeight, 1.5, 1.5, 'FD');
      doc.setFillColor(...colors.purple);
      doc.roundedRect(margin, summaryY, pageWidth - margin * 2, 1.2, 0.6, 0.6, 'F');

      doc.setFont('helvetica', 'bold');
      doc.setFontSize(10);
      doc.setTextColor(...colors.ink);
      doc.text(summaryHeading, margin + 3, summaryY + 8);

      doc.setFont('helvetica', 'normal');
      doc.setFontSize(9);
      doc.setTextColor(...colors.muted);
      doc.text(summaryCount, margin + 3, summaryY + 15);
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(...colors.green);
      doc.text(`Total Amount Paid: INR ${formatPdfAmount(totalPaid)}`, margin + 3, summaryY + 22);

      // Footer
      const pageCount = doc.internal.getNumberOfPages();
      for (let page = 1; page <= pageCount; page += 1) {
        doc.setPage(page);
        drawPdfFooter(doc, {
          pageWidth,
          pageHeight,
          margin,
          label: 'SocietyVault Payment Statement'
        });
        doc.text(`Page ${page} of ${pageCount}`, pageWidth - margin, pageHeight - 9, { align: 'right' });
      }

      const fileName = `SocietyVault_${filters.reportType}_${format(generatedAt, 'yyyy-MM-dd_HHmm')}.pdf`;
      doc.save(fileName);

    } catch (error) {
      console.error('❌ [Resident Reports] PDF export failed:', error);
      alert('Failed to export PDF. Please try again.');
    } finally {
      setIsExporting(false);
    }
  };

  // Excel Export Function
  const handleExportExcel = async () => {
    setIsExporting(true);

    try {
      const residentProfile = getResidentProfile();
      const workbook = new ExcelJS.Workbook();
      const generatedAt = new Date();
      
      const palette = {
        purple: 'FF7F5AF0',
        ink: 'FF1F2937',
        muted: 'FF6B7280',
        green: 'FF2CB67D',
        red: 'FFC24141',
        line: 'FFE1E4EB',
        surface: 'FFF7F8FB',
        white: 'FFFFFFFF'
      };

      const currencyFormat = '₹#,##0;[Red]-₹#,##0';

      workbook.creator = 'SocietyVault';
      workbook.created = generatedAt;
      workbook.title = `${residentProfile.name} - Payment Statement`;

      const sheet = workbook.addWorksheet('Payment Statement', {
        views: [{ state: 'frozen', ySplit: 7, showGridLines: false, zoomScale: 90 }],
        pageSetup: { paperSize: 9, orientation: 'portrait', fitToPage: true, fitToWidth: 1 }
      });

      sheet.columns = [
        { key: 'date', width: 16 },
        { key: 'month', width: 20 },
        { key: 'category', width: 20 },
        { key: 'mode', width: 18 },
        { key: 'amount', width: 16 },
        { key: 'status', width: 14 }
      ];

      // Title
      sheet.mergeCells('A1:F1');
      const titleCell = sheet.getCell('A1');
      titleCell.value = `SocietyVault | Payment Statement`;
      titleCell.font = { name: 'Aptos Display', size: 22, bold: true, color: { argb: palette.purple } };
      titleCell.alignment = { vertical: 'middle', horizontal: 'left' };
      sheet.getRow(1).height = 38;

      // Subtitle
      sheet.mergeCells('A2:F2');
      const subtitleCell = sheet.getCell('A2');
      const dateRange = filters.dateFrom && filters.dateTo
        ? `${format(new Date(filters.dateFrom), 'MMM dd, yyyy')} - ${format(new Date(filters.dateTo), 'MMM dd, yyyy')}`
        : 'All Time';
      subtitleCell.value = `Period: ${dateRange}  |  Generated: ${format(generatedAt, 'MMM dd, yyyy HH:mm')}`;
      subtitleCell.font = { name: 'Aptos', size: 10, color: { argb: palette.muted } };
      subtitleCell.alignment = { vertical: 'middle', horizontal: 'left' };
      sheet.getRow(2).height = 23;

      // Resident Info
      sheet.mergeCells('A4:F4');
      const infoCell = sheet.getCell('A4');
      infoCell.value = `${residentProfile.name} | Flat: ${residentProfile.flatNo} | ${residentProfile.email}`;
      infoCell.font = { name: 'Aptos', size: 10, bold: true, color: { argb: palette.ink } };
      infoCell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: palette.surface } };
      infoCell.alignment = { vertical: 'middle', horizontal: 'left', indent: 1 };
      sheet.getRow(4).height = 25;

      // Table Header
      const headerRow = sheet.getRow(6);
      headerRow.values = ['Date', 'Month', 'Category', 'Payment Mode', 'Amount (₹)', 'Status'];
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
      const filteredPayments = getFilteredPayments();
      filteredPayments.forEach((payment, index) => {
        const row = sheet.getRow(7 + index);
        row.values = [
          new Date(`${payment.date}T00:00:00`),
          payment.month,
          payment.category,
          payment.paymentMode,
          payment.amount,
          payment.status.toUpperCase()
        ];
        row.height = 23;

        row.getCell(1).numFmt = 'dd mmm yyyy';
        row.getCell(5).numFmt = currencyFormat;
        row.getCell(5).alignment = { vertical: 'middle', horizontal: 'right' };
        row.getCell(6).alignment = { vertical: 'middle', horizontal: 'center' };
        row.getCell(6).font = {
          name: 'Aptos',
          size: 9,
          bold: true,
          color: { argb: payment.status === 'completed' ? palette.green : palette.red }
        };

        if (index % 2 === 0) {
          row.eachCell((cell) => {
            cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: palette.surface } };
          });
        }
      });

      const buffer = await workbook.xlsx.writeBuffer();
      const blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
      const fileName = `SocietyVault_${filters.reportType}_${format(generatedAt, 'yyyy-MM-dd_HHmm')}.xlsx`;
      const downloadUrl = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = downloadUrl;
      link.download = fileName;
      link.click();
      setTimeout(() => URL.revokeObjectURL(downloadUrl), 1000);

    } catch (error) {
      console.error('❌ [Resident Reports] Excel export failed:', error);
      alert('Failed to export Excel. Please try again.');
    } finally {
      setIsExporting(false);
    }
  };

  const handleDownloadReport = () => {
    
    if (filters.format === 'pdf') {
      handleExportPDF();
    } else if (filters.format === 'excel') {
      handleExportExcel();
    }
  };

  const handleResetFilters = () => {
    setFilters({
      reportType: 'payment',
      dateFrom: '',
      dateTo: '',
      format: 'pdf'
    });
  };

  
  return { filters, setFilters, isExporting, reportTypes, handleDownloadReport, handleResetFilters };
};

export default useResidentReportsPage;
