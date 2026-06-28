import type { ShowStatus } from '@/types';
import { SHOW_STATUS_LABELS, SHOW_STATUS_COLORS } from '@/types';
import { cn } from '@/lib/utils';

interface Props {
  status: ShowStatus;
  className?: string;
}

export default function StatusBadge({ status, className }: Props) {
  return (
    <span className={cn('badge', SHOW_STATUS_COLORS[status], className)}>
      {SHOW_STATUS_LABELS[status]}
    </span>
  );
}
