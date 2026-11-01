import { useState } from 'react';
import { format } from 'date-fns';
import ExcelJS from 'exceljs';
import { societyFinances } from '../data/mockResidentData';

const useSocietyFinancesPage = () => {
  const [stats] = useState(societyFinances.stats);
  const [transactions] = useState(societyFinances.recentTransactions);
  const [filters, setFilters] = useState({
    search: '',
    dateFrom: '',
    dateTo: '',
    type: '', // 'income' or 'expense'
  });
  const [isExporting, setIsExporting] = useState(false);

  // Filter transactions
  const getFilteredTransactions = () => {
    let filtered = [...transactions];

    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      filtered = filtered.filter(
        (t) =>
          t.category.toLowerCase().includes(searchLower) ||
          t.description.toLowerCase().includes(searchLower)
      );
    }

    if (filters.dateFrom) {
      filtered = filtered.filter((t) => new Date(t.date) >= new Date(filters.dateFrom));
    }

    if (filters.dateTo) {
      filtered = filtered.filter((t) => new Date(t.date) <= new Date(filters.dateTo));
    }

    if (filters.type) {
      filtered = filtered.filter((t) => t.type === filters.type);
    }

    return filtered;
  };

  const filteredTransactions = getFilteredTransactions();

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    });
  };

  const handleResetFilters = () => {
    setFilters({
      search: '',
      dateFrom: '',
      dateTo: '',
      type: '',
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
        line: 'FFE1E4EB',
        surface: 'FFF7F8FB',
        white: 'FFFFFFFF'
      };

      const currencyFormat = '₹#,##0;[Red]-₹#,##0';

      workbook.creator = 'SocietyVault';
      workbook.created = generatedAt;
      workbook.title = 'Society Finances';

      const sheet = workbook.addWorksheet('Society Transactions', {
        views: [{ state: 'frozen', ySplit: 6, showGridLines: false, zoomScale: 90 }],
        pageSetup: { paperSize: 9, orientation: 'landscape', fitToPage: true, fitToWidth: 1 }
      });

      sheet.columns = [
        { key: 'date', width: 14 },
        { key: 'category', width: 22 },
        { key: 'description', width: 35 },
        { key: 'type', width: 12 },
        { key: 'amount', width: 16 }
      ];

      // Title
      sheet.mergeCells('A1:E1');
      const titleCell = sheet.getCell('A1');
      titleCell.value = 'SocietyVault | Society Finances';
      titleCell.font = { name: 'Aptos Display', size: 22, bold: true, color: { argb: palette.purple } };
      titleCell.alignment = { vertical: 'middle', horizontal: 'left' };
      sheet.getRow(1).height = 38;

      // Subtitle
      sheet.mergeCells('A2:E2');
      const subtitleCell = sheet.getCell('A2');
      const dateRange = filters.dateFrom && filters.dateTo
        ? `${format(new Date(filters.dateFrom), 'MMM dd, yyyy')} - ${format(new Date(filters.dateTo), 'MMM dd, yyyy')}`
        : 'All Time';
      subtitleCell.value = `Period: ${dateRange}  |  Generated: ${format(generatedAt, 'MMM dd, yyyy HH:mm')}`;
      subtitleCell.font = { name: 'Aptos', size: 10, color: { argb: palette.muted } };
      subtitleCell.alignment = { vertical: 'middle', horizontal: 'left' };
      sheet.getRow(2).height = 23;

      // Summary Stats Row
      const summaryRow = sheet.getRow(4);
      summaryRow.values = [
        `Total Income: ₹${stats.totalIncome.toLocaleString()}`,
        `Total Expenses: ₹${stats.totalExpenses.toLocaleString()}`,
        `Available Funds: ₹${stats.availableFunds.toLocaleString()}`,
        `Collection Rate: ${stats.collectionRate}%`,
        ''
      ];
      summaryRow.height = 25;
      summaryRow.eachCell((cell, colNum) => {
        if (colNum <= 4) {
          cell.font = { name: 'Aptos', size: 9, bold: true, color: { argb: palette.ink } };
          cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: palette.surface } };
          cell.alignment = { vertical: 'middle', horizontal: 'center' };
          cell.border = { bottom: { style: 'thin', color: { argb: palette.line } } };
        }
      });

      // Table Header
      const headerRow = sheet.getRow(6);
      headerRow.values = ['Date', 'Category', 'Description', 'Type', 'Amount (₹)'];
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
      filteredTransactions.forEach((transaction, index) => {
        const row = sheet.getRow(7 + index);
        row.values = [
          new Date(`${transaction.date}T00:00:00`),
          transaction.category,
          transaction.description,
          transaction.type.toUpperCase(),
          transaction.amount
        ];
        row.height = 23;

        row.getCell(1).numFmt = 'dd mmm yyyy';
        row.getCell(3).alignment = { vertical: 'middle', horizontal: 'left', wrapText: true };
        row.getCell(4).alignment = { vertical: 'middle', horizontal: 'center' };
        row.getCell(4).font = {
          name: 'Aptos',
          size: 9,
          bold: true,
          color: { argb: transaction.type === 'income' ? palette.green : palette.red }
        };
        
        row.getCell(5).numFmt = currencyFormat;
        row.getCell(5).alignment = { vertical: 'middle', horizontal: 'right' };
        row.getCell(5).font = {
          name: 'Aptos',
          size: 10,
          bold: true,
          color: { argb: transaction.type === 'income' ? palette.green : palette.red }
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
      const summaryRowNum = 7 + filteredTransactions.length + 2;
      sheet.mergeCells(summaryRowNum, 1, summaryRowNum, 4);
      const totalLabelCell = sheet.getCell(summaryRowNum, 1);
      totalLabelCell.value = 'NET AMOUNT';
      totalLabelCell.font = { name: 'Aptos', size: 11, bold: true, color: { argb: palette.ink } };
      totalLabelCell.alignment = { vertical: 'middle', horizontal: 'right' };
      totalLabelCell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: palette.surface } };

      const totalIncome = filteredTransactions.filter(t => t.type === 'income').reduce((sum, t) => sum + t.amount, 0);
      const totalExpense = filteredTransactions.filter(t => t.type === 'expense').reduce((sum, t) => sum + t.amount, 0);
      const netAmount = totalIncome - totalExpense;
      
      const totalCell = sheet.getCell(summaryRowNum, 5);
      totalCell.value = netAmount;
      totalCell.numFmt = currencyFormat;
      totalCell.font = { name: 'Aptos Display', size: 14, bold: true, color: { argb: netAmount >= 0 ? palette.green : palette.red } };
      totalCell.alignment = { vertical: 'middle', horizontal: 'right' };
      totalCell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: palette.surface } };

      const buffer = await workbook.xlsx.writeBuffer();
      const blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
      const fileName = `Society_Finances_${format(generatedAt, 'yyyy-MM-dd_HHmm')}.xlsx`;
      const downloadUrl = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = downloadUrl;
      link.download = fileName;
      link.click();
      setTimeout(() => URL.revokeObjectURL(downloadUrl), 1000);

    } catch (error) {
      console.error('❌ [Society Finances] Excel export failed:', error);
      alert('Failed to export Excel. Please try again.');
    } finally {
      setIsExporting(false);
    }
  };

  
  return { stats, transactions, filters, setFilters, isExporting, filteredTransactions, formatDate, handleResetFilters, handleExportExcel };
};

export default useSocietyFinancesPage;
