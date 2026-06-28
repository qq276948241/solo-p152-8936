import type { ShowStatus } from '@/types';
import { SHOW_STATUS_LABELS } from '@/types';
import { cn } from '@/lib/utils';
import { SlidersHorizontal } from 'lucide-react';

const STATUS_OPTIONS: Array<{ value: ShowStatus | 'all'; label: string }> = [
  { value: 'all', label: '全部' },
  { value: 'upcoming', label: SHOW_STATUS_LABELS.upcoming },
  { value: 'ongoing', label: SHOW_STATUS_LABELS.ongoing },
  { value: 'completed', label: SHOW_STATUS_LABELS.completed },
  { value: 'cancelled', label: SHOW_STATUS_LABELS.cancelled },
];

interface Props {
  active: ShowStatus | 'all';
  onChange: (value: ShowStatus | 'all') => void;
  counts: Record<ShowStatus | 'all', number>;
}

export default function StatusFilterBar({ active, onChange, counts }: Props) {
  return (
    <div className="flex items-center gap-2 overflow-x-auto pb-1 -mx-1 px-1 scrollbar-none">
      <SlidersHorizontal className="w-4 h-4 text-white/40 flex-shrink-0 ml-1" />
      {STATUS_OPTIONS.map((opt) => {
        const isActive = active === opt.value;
        return (
          <button
            key={opt.value}
            type="button"
            onClick={() => onChange(opt.value)}
            className={cn(
              'flex-shrink-0 inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all duration-200 whitespace-nowrap min-h-[36px]',
              isActive
                ? 'bg-accent text-white shadow-md shadow-accent/30'
                : 'bg-primary-400/40 text-white/80 border border-white/25 hover:border-accent/50 hover:text-white hover:bg-primary-400/60',
            )}
          >
            {opt.label}
            <span
              className={cn(
                'px-1.5 py-0.5 rounded-full text-[10px] leading-none',
                isActive ? 'bg-white/25 text-white' : 'bg-white/10 text-white/60',
              )}
            >
              {counts[opt.value]}
            </span>
          </button>
        );
      })}
    </div>
  );
}
