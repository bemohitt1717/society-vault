import { ArrowRight, Shield, UserRound } from 'lucide-react';
import { Button } from '@heroui/react';

const RoleSelection = ({ onSelectRole }) => {
  return (
    <div className="space-y-4">
      <p className="text-center text-sm text-[#94a1b2] mb-6">
        Choose your access level to proceed
      </p>

      <Button
        type="button"
        fullWidth
        size="lg"
        onPress={() => onSelectRole('admin')}
        className="group w-full cursor-pointer justify-between rounded-xl border border-[#35363d] bg-[#1d1e22] px-4 py-3 text-left font-semibold text-[#e7e8eb] transition duration-200 hover:border-[#55545f] hover:bg-[#24252a] active:scale-[0.99] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#a995f5]"
      >
        <span className="inline-flex items-center gap-3">
          <Shield aria-hidden="true" className="size-[18px] text-[#c5c6ce]" strokeWidth={1.8} />
          <span>Continue as Administrator</span>
        </span>
        <ArrowRight aria-hidden="true" className="size-4 text-[#aeb0b9] transition-transform duration-200 group-hover:translate-x-1" />
      </Button>

      <Button
        type="button"
        fullWidth
        size="lg"
        onPress={() => onSelectRole('resident')}
        className="group w-full cursor-pointer justify-between rounded-xl bg-[#7659d9] px-4 py-3 font-semibold text-white transition duration-200 hover:bg-[#8368e2] active:scale-[0.99] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#b9a8ff]"
      >
        <span className="inline-flex items-center gap-3">
          <UserRound aria-hidden="true" className="size-[18px] text-white" strokeWidth={1.8} />
          <span>Continue as Resident</span>
        </span>
        <ArrowRight aria-hidden="true" className="size-4 text-white/80 transition-transform duration-200 group-hover:translate-x-1" />
      </Button>
    </div>
  );
};

export default RoleSelection;
