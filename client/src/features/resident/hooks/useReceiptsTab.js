import { useState } from 'react';
import { downloadResidentReceiptPdf } from '../utils/receiptPdf';

const useReceiptsTab = (receipts, profile) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [isExporting, setIsExporting] = useState(false);

  const filteredReceipts = !searchTerm
    ? receipts
    : receipts.filter((receipt) => {
      const searchLower = searchTerm.toLowerCase();
      return receipt.id.toLowerCase().includes(searchLower)
        || receipt.month.toLowerCase().includes(searchLower)
        || receipt.category.toLowerCase().includes(searchLower);
    });

  const handleDownloadReceipt = (receipt) => {
    setIsExporting(true);
    try {
      downloadResidentReceiptPdf(receipt, profile);
    } catch (error) {
      console.error('[Receipts] PDF export failed:', error);
      alert('Failed to download receipt. Please try again.');
    } finally {
      setIsExporting(false);
    }
  };

  const handleDownloadAll = () => {
    setIsExporting(true);
    receipts.forEach((receipt, index) => {
      setTimeout(() => handleDownloadReceipt(receipt), index * 500);
    });
    setTimeout(() => setIsExporting(false), receipts.length * 500 + 1000);
  };

  return {
    searchTerm,
    setSearchTerm,
    isExporting,
    filteredReceipts,
    handleDownloadReceipt,
    handleDownloadAll,
  };
};

export default useReceiptsTab;
