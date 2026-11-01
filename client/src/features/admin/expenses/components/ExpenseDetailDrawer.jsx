import { X, Edit2, Trash2, Calendar, User, DollarSign, FileText, Building2, CreditCard } from 'lucide-react';
import {
  adminPrimaryButtonClass,
  adminSecondaryButtonClass,
} from '../../../../components/ui/actionButtonStyles';

const ExpenseDetailDrawer = ({ expense, isOpen, onClose, onEdit, onDelete }) => {

  if (!isOpen || !expense) return null;

  const handleEdit = () => {
    onEdit(expense);
    onClose();
  };

  const handleDelete = () => {
    if (window.confirm(`Are you sure you want to delete expense "${expense.description}"?`)) {
      onDelete(expense.id);
      onClose();
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Paid':
        return 'text-[#8db5a2]';
      case 'Pending':
        return 'text-[#d2b88e]';
      case 'Overdue':
        return 'text-[#d2b88e]';
      case 'Cancelled':
        return 'text-[#c99393]';
      default:
        return 'text-[#aeb4bf]';
    }
  };

  return (
    <>
      {/* Backdrop */}
      <div 
        className="fixed inset-0 z-40 bg-black/70 transition-opacity"
        onClick={onClose}
      />
      
      {/* Drawer */}
      <div role="dialog" aria-modal="true" aria-labelledby="expense-detail-title" className="fixed right-0 top-0 z-50 h-full w-full overflow-y-auto border-l border-[#303136] bg-[#1a1a1e] md:w-[480px]">
        {/* Header */}
        <div className="sticky top-0 flex items-center justify-between border-b border-[#303136] bg-[#1a1a1e] px-5 py-4 sm:px-6">
          <div>
            <h2 id="expense-detail-title" className="text-lg font-semibold text-[#f4f4f5]">Expense Details</h2>
            <p className="mt-1 text-sm text-[#aeb4bf]">ID: {expense.id}</p>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close expense details"
            className="rounded-lg p-2 text-[#aeb4bf] transition-colors hover:bg-[#242629] hover:text-[#f4f4f5] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#a5a7ad] cursor-pointer"
          >
            <X className="w-5 h-5 text-gray-400" />
          </button>
        </div>

        {/* Content */}
        <div className="space-y-5 px-5 py-5 sm:px-6">
          {/* Status Badge */}
          <div className="flex items-center gap-3">
            <span className={`text-sm font-medium ${getStatusColor(expense.paymentStatus)}`}>
              {expense.paymentStatus}
            </span>
            <span className="text-sm text-[#aeb4bf]">{expense.date}</span>
          </div>

          {/* Description */}
          <div className="space-y-2">
            <div className="flex items-start gap-3">
              <FileText className="mt-0.5 h-5 w-5 text-[#9ca3af]" />
              <div className="flex-1">
                <p className="mb-1 text-xs text-[#aeb4bf]">Description</p>
                <p className="font-medium text-[#e4e4e7]">{expense.description}</p>
              </div>
            </div>
          </div>

          {/* Amount */}
          <div className="space-y-2">
            <div className="flex items-start gap-3">
              <DollarSign className="mt-0.5 h-5 w-5 text-[#8db5a2]" />
              <div className="flex-1">
                <p className="mb-1 text-xs text-[#aeb4bf]">Amount</p>
                <p className="text-2xl font-semibold tabular-nums text-[#8db5a2]">₹{expense.amount.toLocaleString()}</p>
              </div>
            </div>
          </div>

          {/* Category */}
          <div className="space-y-2">
            <div className="flex items-start gap-3">
              <Building2 className="mt-0.5 h-5 w-5 text-[#9ca3af]" />
              <div className="flex-1">
                <p className="mb-1 text-xs text-[#aeb4bf]">Category</p>
                <p className="text-[#e4e4e7]">{expense.category}</p>
              </div>
            </div>
          </div>

          {/* Vendor */}
          <div className="space-y-2">
            <div className="flex items-start gap-3">
              <User className="mt-0.5 h-5 w-5 text-[#9ca3af]" />
              <div className="flex-1">
                <p className="mb-1 text-xs text-[#aeb4bf]">Vendor</p>
                <p className="text-[#e4e4e7]">{expense.vendor}</p>
              </div>
            </div>
          </div>

          {/* Payment Mode */}
          <div className="space-y-2">
            <div className="flex items-start gap-3">
              <CreditCard className="mt-0.5 h-5 w-5 text-[#9ca3af]" />
              <div className="flex-1">
                <p className="mb-1 text-xs text-[#aeb4bf]">Payment Mode</p>
                <p className="text-[#e4e4e7]">{expense.paymentMode}</p>
              </div>
            </div>
          </div>

          {/* Date */}
          <div className="space-y-2">
            <div className="flex items-start gap-3">
              <Calendar className="mt-0.5 h-5 w-5 text-[#9ca3af]" />
              <div className="flex-1">
                <p className="mb-1 text-xs text-[#aeb4bf]">Transaction Date</p>
                <p className="text-[#e4e4e7]">{expense.date}</p>
              </div>
            </div>
          </div>

          {/* Divider */}
          <div className="border-t border-[#303136] pt-5">
            <p className="mb-3 text-xs text-[#aeb4bf]">Additional Information</p>
            <div className="space-y-2 rounded-lg bg-[#202124] p-4">
              <div className="flex justify-between text-sm">
                <span className="text-[#aeb4bf]">Created</span>
                <span className="text-[#e4e4e7]">{expense.date}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-[#aeb4bf]">Last Modified</span>
                <span className="text-[#e4e4e7]">{expense.date}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="sticky bottom-0 flex gap-3 border-t border-[#303136] bg-[#1a1a1e] px-5 py-4 sm:px-6">
          <button
            onClick={handleEdit}
            className={`${adminPrimaryButtonClass} flex-1`}
          >
            <Edit2 className="w-4 h-4" />
            Edit Expense
          </button>
          <button
            onClick={handleDelete}
            className={`${adminSecondaryButtonClass} flex-1 text-[#d59696] hover:text-[#e4b0b0]`}
          >
            <Trash2 className="w-4 h-4" />
            Delete
          </button>
        </div>
      </div>
    </>
  );
};

export default ExpenseDetailDrawer;
