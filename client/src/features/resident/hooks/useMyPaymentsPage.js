import { useCallback, useEffect, useState } from 'react';
import { CreditCard, FileText, History } from 'lucide-react';
import { initiatePayment, listMyDues, listMyPayments, listMyReceipts } from '../../../services/api/residentApi';
import { getApiErrorMessage } from '../../../services/api/http';
import useResidentProfile from './useResidentProfile';

const fetchAllPages = async (request) => {
  const firstPage = await request({ page: 1, limit: 100 });
  const results = [...(firstPage.data || [])];
  for (let page = 2; page <= (firstPage.meta?.pages || 1); page += 1) {
    const result = await request({ page, limit: 100 });
    results.push(...(result.data || []));
  }
  return results;
};

const useMyPaymentsPage = () => {
  const [activeTab, setActiveTab] = useState('dues');
  const [dues, setDues] = useState([]);
  const [payments, setPayments] = useState([]);
  const [receipts, setReceipts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const [reloadKey, setReloadKey] = useState(0);
  const { profile, isLoading: isProfileLoading, error: profileError, reload: reloadProfile } = useResidentProfile();

  const loadPaymentData = useCallback(async () => {
    const [duesResult, paymentsResult, receiptsResult] = await Promise.all([
      fetchAllPages(listMyDues),
      fetchAllPages(listMyPayments),
      fetchAllPages(listMyReceipts),
    ]);
    setDues(duesResult.filter((due) => ['pending', 'partially_paid'].includes(due.status)));
    setPayments(paymentsResult);
    setReceipts(receiptsResult);
  }, []);

  useEffect(() => {
    let active = true;
    Promise.resolve()
      .then(loadPaymentData)
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
  }, [loadPaymentData, reloadKey]);

  const tabs = [
    { id: 'dues', label: 'Pending Dues', shortLabel: 'Dues', icon: CreditCard, count: dues.length },
    { id: 'history', label: 'Payment History', shortLabel: 'History', icon: History, count: payments.length },
    { id: 'receipts', label: 'Receipts', shortLabel: 'Receipts', icon: FileText, count: receipts.length },
  ];

  const payNow = async (selectedDues, paymentMethod) => {
    setError('');
    setMessage('');
    setIsSubmitting(true);
    try {
      await initiatePayment({ selectedDues, paymentMethod });
      setMessage('Payment request created and is pending confirmation. No gateway payment has been processed.');
      try {
        await loadPaymentData();
      } catch (refreshError) {
        setError(`Payment request was created, but the latest data could not be refreshed: ${getApiErrorMessage(refreshError)}`);
      }
      return true;
    } catch (requestError) {
      setError(getApiErrorMessage(requestError));
      return false;
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    activeTab,
    setActiveTab,
    dues,
    payments,
    receipts,
    profile,
    tabs,
    payNow,
    isLoading: isLoading || isProfileLoading,
    isSubmitting,
    error: error || profileError,
    message,
    reload: () => {
      setIsLoading(true);
      setError('');
      setReloadKey((key) => key + 1);
      reloadProfile();
    },
  };
};

export default useMyPaymentsPage;
