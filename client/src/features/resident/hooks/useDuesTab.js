import { useState } from 'react';

const useDuesTab = (dues, onPayNow) => {
  const [selectedDue, setSelectedDue] = useState(null);
  const [paymentMethod, setPaymentMethod] = useState('upi');
  const getOutstandingAmount = (due) => Math.max((due.amount || 0) + (due.penalty || 0) - (due.paidAmount || 0), 0);
  const totalDue = (dues || []).reduce((sum, due) => sum + getOutstandingAmount(due), 0);
  const selectedAmount = selectedDue ? getOutstandingAmount(selectedDue) : 0;

  const getDaysOverdue = (dueDate) => {
    const diffDays = Math.ceil((new Date() - new Date(dueDate)) / (1000 * 60 * 60 * 24));
    return Math.max(diffDays, 0);
  };

  const formatDate = (date) => new Date(date).toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'short',
  });

  const handlePayment = async () => {
    if (!selectedDue) return;
    const created = await onPayNow?.([selectedDue], paymentMethod);
    if (created) setSelectedDue(null);
  };

  const handlePayAll = () => {
    if (!dues?.length) return;
    setSelectedDue({
      id: 'ALL',
      category: 'All Dues',
      month: 'Multiple',
      amount: totalDue,
      penalty: 0,
      dueDate: dues[0].dueDate,
    });
  };

  return {
    selectedDue,
    setSelectedDue,
    paymentMethod,
    setPaymentMethod,
    totalDue,
    selectedAmount,
    getOutstandingAmount,
    getDaysOverdue,
    formatDate,
    handlePayment,
    handlePayAll,
  };
};

export default useDuesTab;
