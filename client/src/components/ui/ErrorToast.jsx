import { AlertCircle, X } from 'lucide-react';

const ErrorToast = ({ message, onDismiss }) => {
  if (!message) return null;

  return (
    <div
      role="alert"
      aria-live="assertive"
      className="error-toast-enter mb-4 flex w-full items-start gap-3 rounded-xl border border-[#75464a] bg-[#2b2023] px-4 py-3 text-sm text-[#f0c4c5] shadow-lg"
    >
      <AlertCircle aria-hidden="true" className="mt-0.5 size-4 shrink-0 text-[#e4a4a7]" />
      <p className="min-w-0 flex-1 leading-5">{message}</p>
      <button
        type="button"
        onClick={onDismiss}
        aria-label="Dismiss error message"
        className="shrink-0 rounded-md p-1 text-[#d3a8aa] transition-colors hover:bg-white/10 hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#f0c4c5]"
      >
        <X aria-hidden="true" className="size-4" />
      </button>
    </div>
  );
};

export default ErrorToast;
