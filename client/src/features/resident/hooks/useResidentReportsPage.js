import { useEffect, useState } from 'react';
import { format } from 'date-fns';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import ExcelJS from 'exceljs';
import { getMyPaymentReport, listMyPayments, listMyReceipts } from '../../../services/api/residentApi';
import { getApiErrorMessage } from '../../../services/api/http';
import useResidentProfile from './useResidentProfile';
import { createPdfTableStyles, drawPdfFooter, formatPdfAmount, pdfColors } from '../utils/pdfExportUtils';

const fetchAllReceipts = async (params) => {
  const firstPage = await listMyReceipts({ ...params, page: 1, limit: 100 });
  const allReceipts = [...(firstPage.data || [])];
  for (let page = 2; page <= (firstPage.meta?.pages || 1); page += 1) {
    const result = await listMyReceipts({ ...params, page, limit: 100 });
    allReceipts.push(...(result.data || []));
  }
  return allReceipts;
};

const fetchAllPayments = async (params) => {
  const firstPage = await listMyPayments({ ...params, page: 1, limit: 100 });
  const allPayments = [...(firstPage.data || [])];
  for (let page = 2; page <= (firstPage.meta?.pages || 1); page += 1) {
    const result = await listMyPayments({ ...params, page, limit: 100 });
    allPayments.push(...(result.data || []));
  }
  return allPayments;
};

const useResidentReportsPage = () => {
  const [filters, setFilters] = useState({
    reportType: 'payment',
    dateFrom: '',
    dateTo: '',
    format: 'pdf'
  });
  const [isExporting, setIsExporting] = useState(false);
  const [payments, setPayments] = useState([]);
  const [receipts, setReceipts] = useState([]);
  const [reportSummary, setReportSummary] = useState({ totalPaid: 0, completedCount: 0 });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [reloadKey, setReloadKey] = useState(0);
  const { profile, isLoading: isProfileLoading, error: profileError, reload: reloadProfile } = useResidentProfile();

  useEffect(() => {
    let active = true;
    Promise.resolve().then(() => {
      if (active) {
        setIsLoading(true);
        setError('');
      }
    });
    Promise.all([
      getMyPaymentReport({
        dateFrom: filters.dateFrom || undefined,
        dateTo: filters.dateTo || undefined,
      }),
      fetchAllPayments({
        dateFrom: filters.dateFrom || undefined,
        dateTo: filters.dateTo || undefined,
      }),
      fetchAllReceipts({
        dateFrom: filters.dateFrom || undefined,
        dateTo: filters.dateTo || undefined,
      }),
    ])
      .then(([report, paymentResult, receiptResult]) => {
        if (!active) return;
        const normalizePayment = (payment) => ({
          ...payment,
          id: payment.id || payment._id,
          date: payment.date ? new Date(payment.date).toISOString().slice(0, 10) : '',
          amount: Number(payment.amount) || 0,
          transactionId: payment.transactionId || '',
          receiptNo: payment.receiptNo || '',
          paymentMode: payment.paymentMode || '',
        });
        setPayments(paymentResult.map(normalizePayment));
        setReportSummary(report.summary || { totalPaid: 0, completedCount: 0 });
        setReceipts(receiptResult);
      })
      .catch((requestError) => {
        if (active) {
          setError(getApiErrorMessage(requestError));
        }
      })
      .finally(() => {
        if (active) setIsLoading(false);
      });
    return () => {
      active = false;
    };
  }, [filters.dateFrom, filters.dateTo, reloadKey]);

  const reportTypes = [
    { value: 'payment', label: 'Payment Statement' },
    { value: 'yearly', label: 'Yearly Summary' },
    { value: 'receipts', label: 'All Receipts' },
  ];

  // Filter payment data based on date range
  const getFilteredPayments = () => {
    return [...payments];
  };

  const getFilteredReceipts = () => {
    return [...receipts];
  };

  // PDF Export Function
  const handleExportPDF = () => {
    setIsExporting(true);

    try {
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
      doc.text(`Name: ${profile.name || 'Not provided'}`, margin + 3, 54);
      doc.text(`Flat: ${profile.flatNo || 'Not provided'} | Block: ${profile.wing || 'Not provided'}`, margin + 3, 59);
      doc.text(`Email: ${profile.email || 'Not provided'}`, margin + 3, 64);
      doc.text(`Phone: ${profile.phone || 'Not provided'}`, pageWidth - margin - 3, 54, { align: 'right' });

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
        doc.text(`${profile.name || 'Resident'}  |  Payment summary`, margin, 26);
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
      const reportTitle = reportTypes.find((type) => type.value === filters.reportType)?.label || 'Payment Statement';
      const lastColumn = filters.reportType === 'yearly' ? 'E' : 'F';
      const isReceiptReport = filters.reportType === 'receipts';
      const isYearlyReport = filters.reportType === 'yearly';

      workbook.creator = 'SocietyVault';
      workbook.created = generatedAt;
      workbook.title = `${profile.name || 'Resident'} - ${reportTitle}`;

      const sheet = workbook.addWorksheet(reportTitle, {
        views: [{ state: 'frozen', ySplit: 7, showGridLines: false, zoomScale: 90 }],
        pageSetup: { paperSize: 9, orientation: 'portrait', fitToPage: true, fitToWidth: 1 }
      });

      sheet.columns = isYearlyReport
        ? [
          { key: 'year', width: 14 },
          { key: 'payments', width: 18 },
          { key: 'completed', width: 18 },
          { key: 'paid', width: 20 },
          { key: 'pending', width: 20 },
        ]
        : [
          { key: 'date', width: 16 },
          ...(isReceiptReport ? [{ key: 'receipt', width: 24 }] : [{ key: 'month', width: 20 }]),
          { key: 'category', width: 20 },
          { key: 'mode', width: 18 },
          { key: 'amount', width: 16 },
          ...(!isReceiptReport ? [{ key: 'status', width: 14 }] : []),
        ];

      // Title
      sheet.mergeCells(`A1:${lastColumn}1`);
      const titleCell = sheet.getCell('A1');
      titleCell.value = `SocietyVault | ${reportTitle}`;
      titleCell.font = { name: 'Aptos Display', size: 22, bold: true, color: { argb: palette.purple } };
      titleCell.alignment = { vertical: 'middle', horizontal: 'left' };
      sheet.getRow(1).height = 38;

      // Subtitle
      sheet.mergeCells(`A2:${lastColumn}2`);
      const subtitleCell = sheet.getCell('A2');
      const dateRange = filters.dateFrom && filters.dateTo
        ? `${format(new Date(filters.dateFrom), 'MMM dd, yyyy')} - ${format(new Date(filters.dateTo), 'MMM dd, yyyy')}`
        : 'All Time';
      subtitleCell.value = `Period: ${dateRange}  |  Generated: ${format(generatedAt, 'MMM dd, yyyy HH:mm')}`;
      subtitleCell.font = { name: 'Aptos', size: 10, color: { argb: palette.muted } };
      subtitleCell.alignment = { vertical: 'middle', horizontal: 'left' };
      sheet.getRow(2).height = 23;

      // Resident Info
      sheet.mergeCells(`A4:${lastColumn}4`);
      const infoCell = sheet.getCell('A4');
      infoCell.value = `${profile.name || 'Resident'} | Flat: ${profile.flatNo || 'Not provided'} | ${profile.email || 'Not provided'}`;
      infoCell.font = { name: 'Aptos', size: 10, bold: true, color: { argb: palette.ink } };
      infoCell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: palette.surface } };
      infoCell.alignment = { vertical: 'middle', horizontal: 'left', indent: 1 };
      sheet.getRow(4).height = 25;

      // Table Header
      const headerRow = sheet.getRow(6);
      const filteredPayments = getFilteredPayments();
      const filteredReceipts = getFilteredReceipts();
      const yearlyTotals = Object.values(filteredPayments.reduce((years, payment) => {
        const year = format(new Date(`${payment.date}T00:00:00`), 'yyyy');
        if (!years[year]) years[year] = { year, payments: 0, completed: 0, paid: 0, pending: 0 };
        years[year].payments += 1;
        if (payment.status === 'completed') {
          years[year].completed += 1;
          years[year].paid += payment.amount;
        } else {
          years[year].pending += payment.amount;
        }
        return years;
      }, {}));
      headerRow.values = isYearlyReport
        ? ['Year', 'Payments', 'Completed', 'Total Paid (₹)', 'Pending (₹)']
        : isReceiptReport
        ? ['Date', 'Receipt No.', 'Month', 'Category', 'Payment Mode', 'Amount (₹)']
        : ['Date', 'Month', 'Category', 'Payment Mode', 'Amount (₹)', 'Status'];
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
      const rows = isYearlyReport
        ? yearlyTotals.map((year) => [year.year, year.payments, year.completed, year.paid, year.pending])
        : isReceiptReport
        ? filteredReceipts.map((receipt) => [
          new Date(`${receipt.date}T00:00:00`),
          receipt.id,
          receipt.month,
          receipt.category,
          receipt.paymentMode,
          receipt.amount,
        ])
        : filteredPayments.map((payment) => [
          new Date(`${payment.date}T00:00:00`),
          payment.month,
          payment.category,
          payment.paymentMode,
          payment.amount,
          payment.status.toUpperCase(),
        ]);
      rows.forEach((values, index) => {
        const row = sheet.getRow(7 + index);
        row.values = values;
        row.height = 23;

        if (!isYearlyReport) row.getCell(1).numFmt = 'dd mmm yyyy';
        const amountColumn = isYearlyReport ? 4 : isReceiptReport ? 6 : 5;
        row.getCell(amountColumn).numFmt = currencyFormat;
        row.getCell(amountColumn).alignment = { vertical: 'middle', horizontal: 'right' };
        if (isYearlyReport) {
          row.getCell(5).numFmt = currencyFormat;
          row.getCell(5).alignment = { vertical: 'middle', horizontal: 'right' };
        }
        if (!isYearlyReport && !isReceiptReport) {
          row.getCell(6).alignment = { vertical: 'middle', horizontal: 'center' };
          row.getCell(6).font = {
            name: 'Aptos',
            size: 9,
            bold: true,
            color: { argb: values[5] === 'COMPLETED' ? palette.green : palette.red }
          };
        }

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

  
  return {
    filters,
    setFilters,
    isExporting,
    reportTypes,
    payments,
    receipts,
    reportSummary,
    isLoading: isLoading || isProfileLoading,
    error: error || profileError,
    profile,
    reload: () => {
      setIsLoading(true);
      setError('');
      setReloadKey((key) => key + 1);
      reloadProfile();
    },
    handleDownloadReport,
    handleResetFilters,
  };
};

export default useResidentReportsPage;
