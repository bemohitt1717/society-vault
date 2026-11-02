import { X, Edit2, Trash2, Calendar, CreditCard, User, Home, Hash, FileText } from 'lucide-react';
import { format } from 'date-fns';
import {
  adminPrimaryButtonClass,
  adminSecondaryButtonClass,
} from '../../../../components/ui/actionButtonStyles';

const IncomeDetailDrawer = ({ income, onClose, onEdit, onDelete, error, isDeleting }) => {
  const handleDelete = () => {
    if (window.confirm('Are you sure you want to delete this income transaction? This action cannot be undone.')) {
      onDelete(income.id);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-end bg-black/70">
      {/* Drawer */}
      <div role="dialog" aria-modal="true" aria-labelledby="income-detail-title" className="flex h-full w-full max-w-md flex-col overflow-hidden border-l border-[#303136] bg-[#1a1a1e] animate-slide-in-right">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-[#303136] px-5 py-4 sm:px-6">
          <h2 id="income-detail-title" className="text-lg font-semibold text-[#f4f4f5]">Income Details</h2>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close income details"
            className="rounded-lg p-1.5 text-[#aeb4bf] transition-colors hover:bg-[#242629] hover:text-[#f4f4f5] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#a5a7ad] cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 space-y-6 overflow-y-auto px-5 py-4 sm:px-6">
          {error && <p role="alert" className="rounded-lg border border-[#8d4b4d] bg-[#2c1d20] px-3 py-2 text-sm text-[#f0b2b4]">{error}</p>}
          {/* Transaction ID Badge */}
          <div className="flex items-center justify-between">
            <span className="text-sm font-mono text-[#aeb4bf]">
              {income.id}
            </span>
            <span className="text-sm text-[#b8bec8]">
              {income.category}
            </span>
          </div>

          {/* Amount */}
          <div className="rounded-lg border border-[#303136] bg-[#202124] p-4">
            <p className="mb-1 text-xs text-[#aeb4bf]">Amount</p>
            <h3 className="text-2xl font-semibold tabular-nums text-[#8db5a2]">₹{income.amount.toLocaleString()}</h3>
          </div>

          {/* Description */}
          <div>
            <p className="mb-2 text-xs text-[#aeb4bf]">Description</p>
            <p className="text-sm text-[#e4e4e7]">{income.description}</p>
          </div>

          {/* Details Grid */}
          <div className="space-y-4">
            <div className="flex items-start gap-3">
              <Calendar className="mt-0.5 h-5 w-5 shrink-0 text-[#9ca3af]" />
              <div>
                <p className="text-xs text-[#aeb4bf]">Date Received</p>
                <p className="text-sm text-[#e4e4e7]">{format(new Date(income.date), 'MMMM dd, yyyy')}</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <CreditCard className="mt-0.5 h-5 w-5 shrink-0 text-[#9ca3af]" />
              <div>
                <p className="text-xs text-[#aeb4bf]">Payment Mode</p>
                <p className="text-sm text-[#e4e4e7]">{income.paymentMode}</p>
              </div>
            </div>

            {income.transactionRef && (
              <div className="flex items-start gap-3">
                <Hash className="mt-0.5 h-5 w-5 shrink-0 text-[#9ca3af]" />
                <div>
                  <p className="text-xs text-[#aeb4bf]">Transaction Reference</p>
                  <p className="font-mono text-sm text-[#e4e4e7]">{income.transactionRef}</p>
                </div>
              </div>
            )}

            {income.resident && (
              <div className="flex items-start gap-3">
                <User className="mt-0.5 h-5 w-5 shrink-0 text-[#9ca3af]" />
                <div>
                  <p className="text-xs text-[#aeb4bf]">Resident</p>
                  <p className="text-sm text-[#e4e4e7]">{income.resident}</p>
                </div>
              </div>
            )}

            {income.flat && (
              <div className="flex items-start gap-3">
                <Home className="mt-0.5 h-5 w-5 shrink-0 text-[#9ca3af]" />
                <div>
                  <p className="text-xs text-[#aeb4bf]">Flat / Unit</p>
                  <p className="font-mono text-sm text-[#e4e4e7]">{income.flat}</p>
                </div>
              </div>
            )}

            {income.remarks && (
              <div className="flex items-start gap-3">
                <FileText className="mt-0.5 h-5 w-5 shrink-0 text-[#9ca3af]" />
                <div>
                  <p className="text-xs text-[#aeb4bf]">Remarks</p>
                  <p className="text-sm text-[#e4e4e7]">{income.remarks}</p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Footer Actions */}
        <div className="flex items-center gap-3 border-t border-[#303136] px-5 py-4 sm:px-6">
          <button
            onClick={onEdit}
            className={`${adminPrimaryButtonClass} flex-1`}
          >
            <Edit2 className="w-4 h-4" />
            Edit
          </button>
          <button
            onClick={handleDelete}
            disabled={isDeleting}
            className={`${adminSecondaryButtonClass} flex-1`}
          >
            <Trash2 className="w-4 h-4" />
            {isDeleting ? 'Deleting...' : 'Delete'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default IncomeDetailDrawer;
