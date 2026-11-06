import { LoaderCircle } from 'lucide-react';

const LoadingState = ({ label = 'Loading...', className = '', fullPage = false }) => (
  <div
    role="status"
    aria-live="polite"
    aria-busy="true"
    className={`flex items-center justify-center text-sm text-[#b8bac2] ${
      fullPage
        ? 'min-h-[calc(100dvh-6rem)] flex-col gap-3 md:min-h-[calc(100dvh-7.5rem)]'
        : 'min-h-40 gap-2.5'
    } ${className}`}
  >
    <LoaderCircle
      aria-hidden="true"
      className={`${fullPage ? 'size-6' : 'size-4'} animate-spin text-[#b9a8ff] motion-reduce:animate-none`}
    />
    <span className={fullPage ? 'font-medium text-[#d3ccf7]' : ''}>{label}</span>
  </div>
);

export default LoadingState;
