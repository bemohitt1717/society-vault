import { useState } from 'react';
import { CreditCard, FileText, History } from 'lucide-react';
import { currentDues, paymentHistory, receipts } from '../data/mockResidentData';

const useMyPaymentsPage = () => {
  const [activeTab, setActiveTab] = useState('dues');
  const tabs = [
    { id: 'dues', label: 'Pending Dues', shortLabel: 'Dues', icon: CreditCard, count: currentDues.length },
    { id: 'history', label: 'Payment History', shortLabel: 'History', icon: History, count: paymentHistory.length },
    { id: 'receipts', label: 'Receipts', shortLabel: 'Receipts', icon: FileText, count: receipts.length },
  ];

  const payNow = (selectedDues) => {
    const total = selectedDues.reduce((sum, due) => sum + due.amount + due.penalty, 0);
    window.alert(`Payment initiated for ${selectedDues.length} items.\nTotal: ₹${total.toLocaleString()}`);
  };

  return {
    activeTab,
    setActiveTab,
    dues: currentDues,
    payments: paymentHistory,
    receipts,
    tabs,
    payNow,
  };
};

export default useMyPaymentsPage;
