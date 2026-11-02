import { useEffect, useState } from 'react';
import { getFinancialReport } from '../../../../services/api/adminApi';
import { getApiErrorMessage } from '../../../../services/api/http';
import { format } from 'date-fns';
import ExcelJS from 'exceljs';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

const reportColors = ['#d7b778', '#aa9dcc', '#d88d8e', '#83b2c5', '#89c4a5'];

const useReportsPage = () => {
  const [isExporting, setIsExporting] = useState(false);
  const [reportSummary, setReportSummary] = useState({
    totalIncome: 0,
    totalExpenses: 0,
    surplus: 0,
    pendingDues: 0,
    period: 'All time',
  });
  const [monthlyData, setMonthlyData] = useState([]);
  const [expenseBreakdown, setExpenseBreakdown] = useState([]);
  const [detailedTransactions, setDetailedTransactions] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let active = true;
    getFinancialReport()
      .then((data) => {
        if (!active) return;
        setReportSummary(data.summary);
        setMonthlyData(data.monthlyData);
        setExpenseBreakdown(data.expenseBreakdown.map((item, index) => ({
          ...item,
          color: reportColors[index % reportColors.length],
        })));
        setDetailedTransactions(data.detailedTransactions);
      })
      .catch((requestError) => {
        if (active) setError(getApiErrorMessage(requestError));
      })
      .finally(() => {
        if (active) setIsLoading(false);
      });
    return () => { active = false; };
  }, []);

  const handleExportPDF = () => {
    setIsExporting(true);

    try {
      const doc = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });
      const pageWidth = doc.internal.pageSize.getWidth();
      const pageHeight = doc.internal.pageSize.getHeight();
      const margin = 16;
      const contentWidth = pageWidth - margin * 2;
      const generatedAt = new Date();
      const formatAmount = (amount) => new Intl.NumberFormat('en-IN', {
        maximumFractionDigits: 0
      }).format(amount);
      const colors = {
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
      const tableStyles = {
        theme: 'plain',
        styles: {
          font: 'helvetica',
          fontSize: 8.5,
          textColor: colors.ink,
          cellPadding: { top: 2.5, right: 3, bottom: 2.5, left: 3 },
          lineColor: colors.line,
          lineWidth: { bottom: 0.15 }
        },
        headStyles: {
          fillColor: colors.ink,
          textColor: colors.white,
          fontSize: 8,
          fontStyle: 'bold',
          cellPadding: { top: 3, right: 3, bottom: 3, left: 3 }
        },
        alternateRowStyles: { fillColor: colors.surface },
        margin: { left: margin, right: margin }
      };

      doc.setFillColor(...colors.purple);
      doc.rect(0, 0, pageWidth, 2, 'F');
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(11);
      doc.setTextColor(...colors.purple);
      doc.text('SocietyVault', margin, 13);
      doc.setFontSize(20);
      doc.setTextColor(...colors.ink);
      doc.text('Financial Report', margin, 23);
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(9);
      doc.setTextColor(...colors.muted);
      doc.text(`Period: ${reportSummary.period}  |  All amounts in INR`, margin, 30);
      doc.text(`Generated ${format(generatedAt, 'MMM dd, yyyy | HH:mm')}`, pageWidth - margin, 30, { align: 'right' });
      doc.setDrawColor(...colors.line);
      doc.setLineWidth(0.3);
      doc.line(margin, 34, pageWidth - margin, 34);

      const metrics = [
        { label: 'TOTAL INCOME', value: reportSummary.totalIncome, color: colors.green },
        { label: 'TOTAL EXPENSES', value: reportSummary.totalExpenses, color: colors.red },
        { label: 'NET SURPLUS', value: reportSummary.surplus, color: colors.purple },
        { label: 'PENDING DUES', value: reportSummary.pendingDues, color: colors.orange }
      ];
      const cardGap = 3;
      const cardWidth = (contentWidth - cardGap * (metrics.length - 1)) / metrics.length;
      const cardY = 40;
      const cardHeight = 25;

      metrics.forEach((metric, index) => {
        const x = margin + index * (cardWidth + cardGap);
        doc.setFillColor(...colors.surface);
        doc.setDrawColor(...colors.line);
        doc.setLineWidth(0.25);
        doc.roundedRect(x, cardY, cardWidth, cardHeight, 1.5, 1.5, 'FD');
        doc.setFillColor(...metric.color);
        doc.roundedRect(x, cardY, cardWidth, 1.2, 0.6, 0.6, 'F');
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(7);
        doc.setTextColor(...colors.muted);
        doc.text(metric.label, x + 3, cardY + 8);
        doc.setFontSize(10.5);
        doc.setTextColor(...metric.color);
        doc.text(formatAmount(metric.value), x + 3, cardY + 18);
      });

      const drawSectionTitle = (title, subtitle, y) => {
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(11);
        doc.setTextColor(...colors.ink);
        doc.text(title, margin, y);
        if (subtitle) {
          doc.setFont('helvetica', 'normal');
          doc.setFontSize(8);
          doc.setTextColor(...colors.muted);
          doc.text(subtitle, pageWidth - margin, y, { align: 'right' });
        }
      };

      drawSectionTitle('Monthly cash flow', 'Income, expenses and net balance', 76);
      autoTable(doc, {
        ...tableStyles,
        startY: 81,
        head: [['Month', 'Income (INR)', 'Expenses (INR)', 'Net (INR)']],
        body: monthlyData.map((item) => [
          item.month,
          formatAmount(item.income),
          formatAmount(item.expenses),
          formatAmount(item.income - item.expenses)
        ]),
        columnStyles: {
          0: { cellWidth: 22 },
          1: { cellWidth: 52, halign: 'right' },
          2: { cellWidth: 52, halign: 'right' },
          3: { cellWidth: 52, halign: 'right', fontStyle: 'bold', textColor: colors.green }
        },
        didParseCell: (data) => {
          if (data.section === 'body' && data.column.index === 3) {
            const net = monthlyData[data.row.index].income - monthlyData[data.row.index].expenses;
            data.cell.styles.textColor = net >= 0 ? colors.green : colors.red;
          }
        }
      });

      const expenseSectionY = doc.lastAutoTable.finalY + 11;
      drawSectionTitle('Expense breakdown', 'Share of total expenses', expenseSectionY);
      autoTable(doc, {
        ...tableStyles,
        startY: expenseSectionY + 5,
        head: [['Category', 'Amount (INR)', 'Share']],
        body: expenseBreakdown.map((item) => [
          item.category,
          formatAmount(item.amount),
          `${item.percentage.toFixed(1)}%`
        ]),
        columnStyles: {
          0: { cellWidth: 84 },
          1: { cellWidth: 50, halign: 'right' },
          2: { cellWidth: 44, halign: 'right' }
        }
      });

      const drawTransactionHeader = () => {
        doc.setFillColor(...colors.purple);
        doc.rect(0, 0, pageWidth, 2, 'F');
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(17);
        doc.setTextColor(...colors.ink);
        doc.text('Detailed Transactions', margin, 19);
        doc.setFont('helvetica', 'normal');
        doc.setFontSize(8.5);
        doc.setTextColor(...colors.muted);
        doc.text(`${reportSummary.period}  |  All amounts in INR`, margin, 26);
        doc.setDrawColor(...colors.line);
        doc.line(margin, 30, pageWidth - margin, 30);
      };

      doc.addPage();
      drawTransactionHeader();
      autoTable(doc, {
        ...tableStyles,
        startY: 36,
        margin: { top: 36, left: margin, right: margin, bottom: 20 },
        head: [['Date', 'Reference', 'Description', 'Category', 'Income', 'Expense']],
        body: detailedTransactions.map((transaction) => [
          format(new Date(transaction.date), 'MMM dd, yyyy'),
          transaction.reference,
          transaction.description,
          transaction.category,
          transaction.income > 0 ? formatAmount(transaction.income) : '-',
          transaction.expense > 0 ? formatAmount(transaction.expense) : '-'
        ]),
        columnStyles: {
          0: { cellWidth: 25 },
          1: { cellWidth: 25 },
          2: { cellWidth: 54 },
          3: { cellWidth: 30 },
          4: { cellWidth: 22, halign: 'right', textColor: colors.green },
          5: { cellWidth: 22, halign: 'right', textColor: colors.red }
        },
        didDrawPage: drawTransactionHeader
      });

      const pageCount = doc.internal.getNumberOfPages();
      for (let page = 1; page <= pageCount; page += 1) {
        doc.setPage(page);
        doc.setDrawColor(...colors.line);
        doc.setLineWidth(0.25);
        doc.line(margin, pageHeight - 15, pageWidth - margin, pageHeight - 15);
        doc.setFont('helvetica', 'normal');
        doc.setFontSize(7.5);
        doc.setTextColor(...colors.muted);
        doc.text('SocietyVault Financial Report', margin, pageHeight - 9);
        doc.text(`Page ${page} of ${pageCount}`, pageWidth - margin, pageHeight - 9, { align: 'right' });
      }

      const fileName = `SocietyVault_Report_${format(generatedAt, 'yyyy-MM-dd_HHmm')}.pdf`;
      doc.save(fileName);

    } catch (error) {
      console.error('❌ [Reports] PDF export failed:', error);
      alert('Failed to export PDF. Please try again.');
    } finally {
      setIsExporting(false);
    }
  };

  const handleExportExcel = async () => {
    setIsExporting(true);

    try {
      const workbook = new ExcelJS.Workbook();
      const generatedAt = new Date();
      const palette = {
        purple: 'FF6948C4',
        ink: 'FF1F2937',
        muted: 'FF6B7280',
        green: 'FF1D8B5E',
        red: 'FFC24141',
        orange: 'FFBF7016',
        line: 'FFE1E4EB',
        surface: 'FFF7F8FB',
        white: 'FFFFFFFF'
      };
      const currencyFormat = '\u20B9#,##0;[Red]-\u20B9#,##0';
      const border = { style: 'thin', color: { argb: palette.line } };
      const colorToArgb = (hex) => `FF${hex.replace('#', '').toUpperCase()}`;
      const tintColor = (hex) => {
        const value = hex.replace('#', '');
        const channels = [0, 2, 4].map((offset) =>
          Math.round(parseInt(value.slice(offset, offset + 2), 16) * 0.13 + 255 * 0.87)
            .toString(16).padStart(2, '0')
        );
        return `FF${channels.join('').toUpperCase()}`;
      };
      const makeSectionTitle = (sheet, rowNumber, title, endColumn) => {
        sheet.mergeCells(rowNumber, 1, rowNumber, endColumn);
        const cell = sheet.getCell(rowNumber, 1);
        cell.value = title;
        cell.font = { name: 'Aptos', size: 12, bold: true, color: { argb: palette.white } };
        cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: palette.purple } };
        cell.alignment = { vertical: 'middle', horizontal: 'left', indent: 1 };
        sheet.getRow(rowNumber).height = 25;
      };
      const styleTableHeader = (row, columnCount) => {
        row.height = 25;
        for (let column = 1; column <= columnCount; column += 1) {
          const cell = row.getCell(column);
          cell.font = { name: 'Aptos', size: 10, bold: true, color: { argb: palette.ink } };
          cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFE9E5F8' } };
          cell.alignment = { vertical: 'middle', horizontal: 'center', wrapText: true };
          cell.border = { bottom: { style: 'medium', color: { argb: palette.purple } } };
        }
      };
      const styleDataRow = (row, rowIndex, columnCount) => {
        row.height = 23;
        for (let column = 1; column <= columnCount; column += 1) {
          const cell = row.getCell(column);
          cell.font = { name: 'Aptos', size: 10, color: { argb: palette.ink } };
          cell.alignment = { vertical: 'middle', horizontal: 'left' };
          cell.border = { bottom: border };
          if (rowIndex % 2 === 0) {
            cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: palette.surface } };
          }
        }
      };

      workbook.creator = 'SocietyVault';
      workbook.created = generatedAt;
      workbook.modified = generatedAt;
      workbook.subject = `Financial report for ${reportSummary.period}`;
      workbook.title = 'SocietyVault Financial Report';

      const summarySheet = workbook.addWorksheet('Financial Summary', {
        views: [{ state: 'frozen', ySplit: 3, showGridLines: false, zoomScale: 90 }],
        pageSetup: { paperSize: 9, orientation: 'landscape', fitToPage: true, fitToWidth: 1, fitToHeight: 0 }
      });
      summarySheet.columns = [
        { key: 'a', width: 18 }, { key: 'b', width: 18 }, { key: 'c', width: 18 }, { key: 'd', width: 18 },
        { key: 'e', width: 17 }, { key: 'f', width: 17 }, { key: 'g', width: 17 }, { key: 'h', width: 17 }
      ];
      summarySheet.mergeCells('A1:H1');
      const titleCell = summarySheet.getCell('A1');
      titleCell.value = 'SocietyVault | Financial Report';
      titleCell.font = { name: 'Aptos Display', size: 22, bold: true, color: { argb: palette.purple } };
      titleCell.alignment = { vertical: 'middle', horizontal: 'left' };
      summarySheet.getRow(1).height = 38;
      summarySheet.mergeCells('A2:H2');
      const subtitleCell = summarySheet.getCell('A2');
      subtitleCell.value = `Period: ${reportSummary.period}  |  Generated: ${format(generatedAt, 'MMM dd, yyyy HH:mm')}  |  Currency: INR`;
      subtitleCell.font = { name: 'Aptos', size: 10, color: { argb: palette.muted } };
      subtitleCell.alignment = { vertical: 'middle', horizontal: 'left' };
      summarySheet.getRow(2).height = 23;

      makeSectionTitle(summarySheet, 4, 'FINANCIAL SUMMARY', 8);
      const metrics = [
        { label: 'TOTAL INCOME', value: reportSummary.totalIncome, color: palette.green },
        { label: 'TOTAL EXPENSES', value: reportSummary.totalExpenses, color: palette.red },
        { label: 'NET SURPLUS', value: reportSummary.surplus, color: palette.purple },
        { label: 'PENDING DUES', value: reportSummary.pendingDues, color: palette.orange }
      ];
      metrics.forEach((metric, index) => {
        const firstColumn = index * 2 + 1;
        const lastColumn = firstColumn + 1;
        summarySheet.mergeCells(5, firstColumn, 5, lastColumn);
        summarySheet.mergeCells(6, firstColumn, 6, lastColumn);
        const label = summarySheet.getCell(5, firstColumn);
        const amount = summarySheet.getCell(6, firstColumn);
        label.value = metric.label;
        label.font = { name: 'Aptos', size: 9, bold: true, color: { argb: palette.muted } };
        label.alignment = { vertical: 'middle', horizontal: 'center' };
        label.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: palette.surface } };
        amount.value = metric.value;
        amount.numFmt = currencyFormat;
        amount.font = { name: 'Aptos Display', size: 16, bold: true, color: { argb: metric.color } };
        amount.alignment = { vertical: 'middle', horizontal: 'center' };
        amount.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: palette.surface } };
        [label, amount].forEach((cell) => { cell.border = { bottom: border }; });
      });
      summarySheet.getRow(5).height = 22;
      summarySheet.getRow(6).height = 34;

      makeSectionTitle(summarySheet, 8, 'EXPENSE BREAKDOWN', 8);
      summarySheet.getRow(9).values = ['Category', 'Amount (INR)', 'Share', '', '', '', '', ''];
      styleTableHeader(summarySheet.getRow(9), 3);
      expenseBreakdown.forEach((item, index) => {
        const row = summarySheet.getRow(10 + index);
        row.getCell(1).value = item.category;
        row.getCell(1).fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: tintColor(item.color) } };
        row.getCell(1).font = { name: 'Aptos', size: 10, bold: true, color: { argb: colorToArgb(item.color) } };
        row.getCell(2).value = item.amount;
        row.getCell(2).numFmt = currencyFormat;
        row.getCell(2).alignment = { vertical: 'middle', horizontal: 'right' };
        row.getCell(3).value = item.percentage / 100;
        row.getCell(3).numFmt = '0.0%';
        row.getCell(3).alignment = { vertical: 'middle', horizontal: 'right' };
        styleDataRow(row, index, 3);
        row.getCell(1).fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: tintColor(item.color) } };
        row.getCell(1).font = { name: 'Aptos', size: 10, bold: true, color: { argb: colorToArgb(item.color) } };
        row.getCell(2).numFmt = currencyFormat;
        row.getCell(2).alignment = { vertical: 'middle', horizontal: 'right' };
        row.getCell(3).numFmt = '0.0%';
        row.getCell(3).alignment = { vertical: 'middle', horizontal: 'right' };
      });

      const monthlyTitleRow = 17;
      makeSectionTitle(summarySheet, monthlyTitleRow, 'MONTHLY CASH FLOW', 8);
      const monthlyHeaderRow = summarySheet.getRow(monthlyTitleRow + 1);
      monthlyHeaderRow.values = ['Month', 'Income (INR)', 'Expenses (INR)', 'Net (INR)', 'Savings rate', '', '', ''];
      styleTableHeader(monthlyHeaderRow, 5);
      monthlyData.forEach((item, index) => {
        const row = summarySheet.getRow(monthlyTitleRow + 2 + index);
        const net = item.income - item.expenses;
        row.values = [item.month, item.income, item.expenses, net, item.income ? net / item.income : 0];
        styleDataRow(row, index, 5);
        [2, 3, 4].forEach((column) => {
          row.getCell(column).numFmt = currencyFormat;
          row.getCell(column).alignment = { vertical: 'middle', horizontal: 'right' };
        });
        row.getCell(4).font = { name: 'Aptos', size: 10, bold: true, color: { argb: net >= 0 ? palette.green : palette.red } };
        row.getCell(5).numFmt = '0.0%';
        row.getCell(5).alignment = { vertical: 'middle', horizontal: 'right' };
      });

      summarySheet.autoFilter = { from: 'A18', to: `E${monthlyTitleRow + monthlyData.length + 1}` };
      summarySheet.views = [{ state: 'frozen', ySplit: 2, showGridLines: false, zoomScale: 90 }];
      summarySheet.pageSetup.margins = { left: 0.25, right: 0.25, top: 0.5, bottom: 0.5, header: 0.2, footer: 0.2 };

      const transactionSheet = workbook.addWorksheet('Transactions', {
        views: [{ state: 'frozen', ySplit: 4, showGridLines: false, zoomScale: 90 }],
        pageSetup: { paperSize: 9, orientation: 'landscape', fitToPage: true, fitToWidth: 1, fitToHeight: 0, printTitlesRow: '1:4' }
      });
      transactionSheet.columns = [
        { key: 'date', width: 16 }, { key: 'reference', width: 16 }, { key: 'description', width: 34 },
        { key: 'category', width: 22 }, { key: 'income', width: 19 }, { key: 'expense', width: 19 }, { key: 'type', width: 15 }
      ];
      transactionSheet.mergeCells('A1:G1');
      transactionSheet.getCell('A1').value = 'SocietyVault | Detailed Transactions';
      transactionSheet.getCell('A1').font = { name: 'Aptos Display', size: 20, bold: true, color: { argb: palette.purple } };
      transactionSheet.getCell('A1').alignment = { vertical: 'middle', horizontal: 'left' };
      transactionSheet.getRow(1).height = 36;
      transactionSheet.mergeCells('A2:G2');
      transactionSheet.getCell('A2').value = `Period: ${reportSummary.period}  |  Generated: ${format(generatedAt, 'MMM dd, yyyy HH:mm')}  |  Currency: INR`;
      transactionSheet.getCell('A2').font = { name: 'Aptos', size: 10, color: { argb: palette.muted } };
      transactionSheet.getRow(2).height = 22;
      makeSectionTitle(transactionSheet, 3, 'TRANSACTION LEDGER', 7);
      const transactionHeader = transactionSheet.getRow(4);
      transactionHeader.values = ['Date', 'Reference', 'Description', 'Category', 'Income (INR)', 'Expense (INR)', 'Type'];
      styleTableHeader(transactionHeader, 7);

      detailedTransactions.forEach((transaction, index) => {
        const row = transactionSheet.getRow(5 + index);
        row.values = [new Date(`${transaction.date}T00:00:00`), transaction.reference, transaction.description, transaction.category, transaction.income || null, transaction.expense || null, transaction.income > 0 ? 'INCOME' : 'EXPENSE'];
        styleDataRow(row, index, 7);
        row.getCell(1).numFmt = 'dd mmm yyyy';
        row.getCell(2).font = { name: 'Aptos', size: 10, color: { argb: palette.muted } };
        row.getCell(3).alignment = { vertical: 'middle', horizontal: 'left', wrapText: true };
        [5, 6].forEach((column) => {
          row.getCell(column).numFmt = currencyFormat;
          row.getCell(column).alignment = { vertical: 'middle', horizontal: 'right' };
        });
        const isIncome = transaction.income > 0;
        row.getCell(5).font = { name: 'Aptos', size: 10, color: { argb: palette.green } };
        row.getCell(6).font = { name: 'Aptos', size: 10, color: { argb: palette.red } };
        row.getCell(7).font = { name: 'Aptos', size: 9, bold: true, color: { argb: isIncome ? palette.green : palette.red } };
        row.getCell(7).alignment = { vertical: 'middle', horizontal: 'center' };
        row.getCell(7).fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: isIncome ? 'FFE5F4ED' : 'FFFCEBEC' } };
      });
      const transactionEndRow = 4 + detailedTransactions.length;
      transactionSheet.autoFilter = { from: 'A4', to: `G${transactionEndRow}` };
      const transactionSummaryRow = transactionEndRow + 3;
      makeSectionTitle(transactionSheet, transactionSummaryRow, 'LEDGER TOTALS', 7);
      const totalIncome = detailedTransactions.reduce((sum, transaction) => sum + transaction.income, 0);
      const totalExpense = detailedTransactions.reduce((sum, transaction) => sum + transaction.expense, 0);
      const ledgerTotals = [
        { label: 'TOTAL INCOME', value: totalIncome, color: palette.green, column: 2 },
        { label: 'TOTAL EXPENSES', value: totalExpense, color: palette.red, column: 4 },
        { label: 'NET MOVEMENT', value: totalIncome - totalExpense, color: palette.purple, column: 6 }
      ];
      ledgerTotals.forEach((metric) => {
        transactionSheet.mergeCells(transactionSummaryRow + 1, metric.column, transactionSummaryRow + 1, metric.column + 1);
        transactionSheet.mergeCells(transactionSummaryRow + 2, metric.column, transactionSummaryRow + 2, metric.column + 1);
        const label = transactionSheet.getCell(transactionSummaryRow + 1, metric.column);
        const value = transactionSheet.getCell(transactionSummaryRow + 2, metric.column);
        label.value = metric.label;
        label.font = { name: 'Aptos', size: 9, bold: true, color: { argb: palette.muted } };
        label.alignment = { vertical: 'middle', horizontal: 'center' };
        value.value = metric.value;
        value.numFmt = currencyFormat;
        value.font = { name: 'Aptos Display', size: 14, bold: true, color: { argb: metric.color } };
        value.alignment = { vertical: 'middle', horizontal: 'center' };
      });
      transactionSheet.getRow(transactionSummaryRow + 1).height = 23;
      transactionSheet.getRow(transactionSummaryRow + 2).height = 30;
      transactionSheet.pageSetup.margins = { left: 0.25, right: 0.25, top: 0.5, bottom: 0.5, header: 0.2, footer: 0.2 };

      const buffer = await workbook.xlsx.writeBuffer();
      const blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
      const fileName = `SocietyVault_Report_${format(generatedAt, 'yyyy-MM-dd_HHmm')}.xlsx`;
      const downloadUrl = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = downloadUrl;
      link.download = fileName;
      link.click();
      setTimeout(() => URL.revokeObjectURL(downloadUrl), 1000);

    } catch (error) {
      console.error('? [Reports] Excel export failed:', error);
      alert('Failed to export Excel. Please try again.');
    } finally {
      setIsExporting(false);
    }
  };
  
  return {
    isExporting,
    isLoading,
    error,
    reportSummary,
    monthlyData,
    expenseBreakdown,
    detailedTransactions,
    handleExportPDF,
    handleExportExcel,
  };
};

export default useReportsPage;
