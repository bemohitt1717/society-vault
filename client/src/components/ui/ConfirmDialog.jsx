import { useEffect, useRef } from 'react';

const ConfirmDialog = ({
  isOpen,
  title,
  description,
  confirmLabel = 'Confirm',
  cancelLabel = 'Cancel',
  error = '',
  isLoading = false,
  onConfirm,
  onCancel,
}) => {
  const cancelButtonRef = useRef(null);

  useEffect(() => {
    if (!isOpen) return undefined;
    cancelButtonRef.current?.focus();
    const handleKeyDown = (event) => {
      if (event.key === 'Escape' && !isLoading) onCancel();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, isLoading, onCancel]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-[100] grid place-items-center bg-black/65 p-4"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget && !isLoading) onCancel();
      }}
    >
      <section
        role="dialog"
        aria-modal="true"
        aria-labelledby="confirm-dialog-title"
        className="w-full max-w-sm rounded-xl border border-[#3b3d42] bg-[#1a1a1e] p-5 shadow-[0_16px_48px_rgba(0,0,0,0.42)]"
      >
        <h2 id="confirm-dialog-title" className="text-base font-semibold text-[#f4f4f5]">{title}</h2>
        <p className="mt-2 text-sm leading-6 text-[#c5c6ce]">{description}</p>
        {error && <p role="alert" className="mt-3 text-sm text-[#f0b2b4]">{error}</p>}
        <div className="mt-6 flex justify-end gap-3">
          <button
            ref={cancelButtonRef}
            type="button"
            disabled={isLoading}
            onClick={onCancel}
            className="min-h-10 cursor-pointer rounded-lg border border-[#3b3d42] px-4 text-sm font-medium text-[#d8d9de] transition-colors hover:bg-[#292a2f] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#a5a7ad] disabled:cursor-not-allowed disabled:opacity-50"
          >
            {cancelLabel}
          </button>
          <button
            type="button"
            disabled={isLoading}
            onClick={onConfirm}
            className="min-h-10 cursor-pointer rounded-lg bg-[#8d4c50] px-4 text-sm font-semibold text-white transition-colors hover:bg-[#a4575c] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#e3a2a4] disabled:cursor-wait disabled:opacity-60"
          >
            {isLoading ? 'Please wait...' : confirmLabel}
          </button>
        </div>
      </section>
    </div>
  );
};

export default ConfirmDialog;
