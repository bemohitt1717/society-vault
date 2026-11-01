import { useNavigate } from 'react-router-dom';
import { AlertTriangle, ArrowRight, Calendar } from 'lucide-react';

const PaymentReminderBanner = ({ dueAmount, dueDate }) => {
  const navigate = useNavigate();


  if (!dueAmount || dueAmount <= 0) {
    return null;
  }

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    });
  };

  const getDaysRemaining = (date) => {
    const today = new Date();
    const due = new Date(date);
    const diffTime = due - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const daysRemaining = getDaysRemaining(dueDate);
  const isOverdue = daysRemaining < 0;
  const isUrgent = daysRemaining <= 3 && daysRemaining >= 0;

  const getBannerColor = () => {
    if (isOverdue) return 'bg-[#ff6b6b]/10 border-[#ff6b6b]/30';
    if (isUrgent) return 'bg-[#ffa500]/10 border-[#ffa500]/30';
    return 'bg-[#7f5af0]/10 border-[#7f5af0]/30';
  };

  const getTextColor = () => {
    if (isOverdue) return 'text-[#ff6b6b]';
    if (isUrgent) return 'text-[#ffa500]';
    return 'text-[#7f5af0]';
  };

  const getIconColor = () => {
    if (isOverdue) return 'bg-[#ff6b6b]/15 text-[#ff6b6b]';
    if (isUrgent) return 'bg-[#ffa500]/15 text-[#ffa500]';
    return 'bg-[#7f5af0]/15 text-[#7f5af0]';
  };

  const getMessage = () => {
    if (isOverdue) {
      return {
        title: '⚠️ Payment Overdue!',
        subtitle: `Your payment of ₹${dueAmount.toLocaleString()} is overdue by ${Math.abs(
          daysRemaining
        )} days. Please pay immediately to avoid penalties.`,
      };
    }
    if (isUrgent) {
      return {
        title: '🔔 Payment Due Soon!',
        subtitle: `You have ₹${dueAmount.toLocaleString()} due in ${daysRemaining} ${
          daysRemaining === 1 ? 'day' : 'days'
        }. Pay now to avoid late fees.`,
      };
    }
    return {
      title: '💰 Pending Payment',
      subtitle: `You have ₹${dueAmount.toLocaleString()} pending. Due by ${formatDate(dueDate)}.`,
    };
  };

  const { title, subtitle } = getMessage();

  return (
    <div
      className={`border rounded-xl p-4 md:p-5 ${getBannerColor()} transition-all hover:shadow-lg`}
    >
      <div className="flex items-start gap-4">
        {/* Icon */}
        <div
          className={`w-10 h-10 md:w-12 md:h-12 rounded-xl flex items-center justify-center flex-shrink-0 ${getIconColor()}`}
        >
          {isOverdue ? (
            <AlertTriangle className="w-5 h-5 md:w-6 md:h-6" strokeWidth={2.5} />
          ) : (
            <Calendar className="w-5 h-5 md:w-6 md:h-6" strokeWidth={2.5} />
          )}
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <h3 className={`text-base md:text-lg font-bold ${getTextColor()} mb-1`}>{title}</h3>
          <p className="text-sm text-[#94a1b2] leading-relaxed">{subtitle}</p>

          {/* Action Button */}
          <button
            onClick={() => {
              navigate('/resident/payments');
            }}
            className={`mt-3 inline-flex items-center gap-2 px-4 py-2 rounded-lg font-medium text-sm transition-all hover:gap-3 ${
              isOverdue
                ? 'bg-[#ff6b6b] text-white hover:bg-[#ff5252]'
                : isUrgent
                ? 'bg-[#ffa500] text-white hover:bg-[#ff9500]'
                : 'bg-[#7f5af0] text-white hover:bg-[#6d48d9]'
            }`}
          >
            Pay Now
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default PaymentReminderBanner;
