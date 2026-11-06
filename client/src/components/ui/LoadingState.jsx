import { LoaderCircle } from 'lucide-react';

const LoadingState = ({ label = 'Loading...', className = '' }) => (
  <div
    role="status"
    aria-live="polite"
    className={`flex min-h-40 items-center justify-center gap-2.5 text-sm text-[#b8bac2] ${className}`}
  >
    <LoaderCircle aria-hidden="true" className="size-4 animate-spin text-[#b9a8ff] motion-reduce:animate-none" />
    <span>{label}</span>
  </div>
);

export default LoadingState;
