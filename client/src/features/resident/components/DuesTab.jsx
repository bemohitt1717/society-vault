import { ArrowRight, Calendar, Check, CreditCard, X } from 'lucide-react';
import { UPIIcon, BankIcon, CardIcon, CashIcon } from '../../../components/icons/PaymentIcons';
import { paymentPrimaryButtonClass } from '../../../components/ui/actionButtonStyles';
import useDuesTab from '../hooks/useDuesTab';

const paymentMethods = [
  { id: 'upi', label: 'UPI Payment', Icon: UPIIcon },
  { id: 'bank', label: 'Bank Transfer', Icon: BankIcon },
  { id: 'card', label: 'Debit/Credit Card', Icon: CardIcon },
  { id: 'cash', label: 'Cash at Office', Icon: CashIcon },
];

const DuesTab = ({ dues, onPayNow, isSubmitting = false }) => {
  const {
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
  } = useDuesTab(dues, onPayNow);

  if (!dues || dues.length === 0) {
    return (
      <div className="rounded-xl border border-[#303136] bg-[#1a1a1e] px-6 py-10 text-center">
        <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-[#278b68]/15">
          <Check aria-hidden="true" className="h-6 w-6 text-[#68c99d]" />
        </div>
        <h3 className="mb-2 text-lg font-semibold text-[#f4f4f5]">No pending dues</h3>
        <p className="text-sm text-[#aeb4bf]">There are no pending payments on your account at the moment.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 items-start gap-5 lg:grid-cols-12">
      <section className="space-y-5 lg:col-span-7" aria-labelledby="outstanding-dues-title">
        <button
          type="button"
          onClick={handlePayAll}
          aria-label={`Pay all ${dues.length} pending payments, total ₹${totalDue.toLocaleString('en-IN')}`}
          className="group w-full rounded-xl border border-[#45414f] bg-[#1d1c22] p-5 text-left transition-colors duration-200 hover:border-[#615a70] hover:bg-[#222027] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#a78bfa] active:scale-[0.995] cursor-pointer"
        >
          <div className="flex items-center justify-between gap-4">
            <div className="min-w-0">
              <p className="mb-1 text-sm text-[#b8bec8]">Total amount due</p>
              <p className="text-2xl font-semibold tabular-nums text-[#f4f4f5] sm:text-3xl">
                ₹{totalDue.toLocaleString('en-IN')}
              </p>
              <p className="mt-2 text-xs text-[#aeb4bf]">
                {dues.length} pending {dues.length === 1 ? 'payment' : 'payments'} · Pay all
              </p>
            </div>
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-[#7f5af0]/15 text-[#a78bfa] transition-transform duration-200 group-hover:translate-x-0.5">
              <ArrowRight aria-hidden="true" className="h-5 w-5" />
            </span>
          </div>
        </button>

        <div className="overflow-hidden rounded-xl border border-[#303136] bg-[#1a1a1e]">
          <div className="flex items-center justify-between gap-3 border-b border-[#303136] px-4 py-3.5 sm:px-5">
            <h2 id="outstanding-dues-title" className="text-sm font-semibold text-[#f4f4f5]">
              Outstanding dues
            </h2>
            <span className="text-xs tabular-nums text-[#aeb4bf]">
              {dues.length} {dues.length === 1 ? 'item' : 'items'}
            </span>
          </div>

          <div className="divide-y divide-[#2b2d31]">
            {dues.map((due) => {
              const daysOverdue = getDaysOverdue(due.dueDate);
              const isSelected = selectedDue?.id === due.id;

              return (
                <button
                  key={due.id}
                  type="button"
                  onClick={() => setSelectedDue(due)}
                  aria-pressed={isSelected}
                  className={`group flex w-full items-center justify-between gap-4 px-4 py-4 text-left transition-colors duration-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-inset focus-visible:outline-[#a78bfa] cursor-pointer sm:px-5 ${
                    isSelected ? 'bg-[#25232a]' : 'hover:bg-[#202124]'
                  }`}
                >
                  <span className="min-w-0 flex-1">
                    <span className="block truncate text-sm font-semibold text-[#f4f4f5]">
                      {due.category}
                    </span>
                    <span className="mt-1.5 flex flex-wrap items-center gap-x-2 gap-y-1 text-xs text-[#aeb4bf]">
                      <Calendar aria-hidden="true" className="h-3.5 w-3.5 shrink-0 text-[#a78bfa]" />
                      <span>{due.month}</span>
                      <span aria-hidden="true" className="text-[#686b73]">/</span>
                      <span>Due {formatDate(due.dueDate)}</span>
                      {daysOverdue > 0 && (
                        <span className="text-[#e69a9a]">{daysOverdue}d overdue</span>
                      )}
                    </span>
                  </span>

                  <span className="shrink-0 text-right">
                    <span className="block text-base font-semibold tabular-nums text-[#f4f4f5] sm:text-lg">
                      ₹{getOutstandingAmount(due).toLocaleString('en-IN')}
                    </span>
                    {due.penalty > 0 && (
                      <span className="mt-0.5 block text-xs text-[#e69a9a]">
                        Includes ₹{due.penalty.toLocaleString('en-IN')} penalty
                      </span>
                    )}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      </section>

      <aside className="lg:col-span-5" aria-label="Payment options">
        {selectedDue ? (
          <section className="space-y-5 rounded-xl border border-[#303136] bg-[#1a1a1e] p-4 sm:p-5 lg:sticky lg:top-4">
            <div className="flex items-start justify-between gap-4">
              <div>
                <h2 className="text-base font-semibold text-[#f4f4f5]">Complete payment</h2>
                <p className="mt-1 text-sm text-[#aeb4bf]">{selectedDue.category}</p>
              </div>
              <button
                type="button"
                aria-label="Close payment options"
                onClick={() => setSelectedDue(null)}
                className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md text-[#aeb4bf] transition-colors hover:bg-[#2b2d31] hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#a78bfa] cursor-pointer"
              >
                <X aria-hidden="true" className="h-4 w-4" />
              </button>
            </div>

            <div className="rounded-lg border border-[#34363b] bg-[#222327] px-4 py-3">
              <p className="text-xs text-[#aeb4bf]">Amount to pay</p>
              <p className="mt-1 text-2xl font-semibold tabular-nums text-[#f4f4f5]">
                ₹{selectedAmount.toLocaleString('en-IN')}
              </p>
            </div>

            <fieldset>
              <legend className="mb-2.5 text-sm font-medium text-[#e4e4e7]">
                Select payment method
              </legend>
              <div className="space-y-2">
                {paymentMethods.map(({ id, label, Icon }) => {
                  const isSelected = paymentMethod === id;

                  return (
                    <button
                      key={id}
                      type="button"
                      aria-pressed={isSelected}
                      onClick={() => setPaymentMethod(id)}
                      className={`flex min-h-12 w-full items-center gap-3 rounded-lg border px-3.5 py-3 text-left transition-colors duration-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#a78bfa] active:scale-[0.995] cursor-pointer ${
                        isSelected
                          ? 'border-[#76669c] bg-[#292631]'
                          : 'border-[#34363b] bg-[#222327] hover:border-[#55575e] hover:bg-[#28292d]'
                      }`}
                    >
                      <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md bg-[#7f5af0]/12 text-[#a78bfa]">
                        <Icon className="h-4.5 w-4.5" />
                      </span>
                      <span className="flex-1 text-sm font-medium text-[#e4e4e7]">{label}</span>
                      {isSelected && <Check aria-hidden="true" className="h-4 w-4 text-[#b9a6f5]" />}
                    </button>
                  );
                })}
              </div>
            </fieldset>

            <button type="button" onClick={handlePayment} disabled={isSubmitting} className={paymentPrimaryButtonClass}>
              {isSubmitting ? 'Creating request…' : 'Create payment request'}
              <span className="tabular-nums">₹{selectedAmount.toLocaleString('en-IN')}</span>
            </button>
          </section>
        ) : (
          <section className="rounded-xl border border-[#303136] bg-[#1a1a1e] px-5 py-7 text-center lg:sticky lg:top-4">
            <span className="mx-auto mb-3 flex h-10 w-10 items-center justify-center rounded-lg bg-[#7f5af0]/12 text-[#a78bfa]">
              <CreditCard aria-hidden="true" className="h-5 w-5" />
            </span>
            <h2 className="text-sm font-semibold text-[#f4f4f5]">Choose a due to continue</h2>
            <p className="mx-auto mt-1.5 max-w-xs text-xs leading-relaxed text-[#aeb4bf]">
              Select an individual payment or choose the total amount due.
            </p>
          </section>
        )}
      </aside>
    </div>
  );
};

export default DuesTab;
