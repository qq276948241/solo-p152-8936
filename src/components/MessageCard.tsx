import { Star, User, Clock } from 'lucide-react';
import type { Message } from '@/types';
import { formatRelativeTime } from '@/utils/format';
import { cn } from '@/lib/utils';

interface Props {
  message: Message;
  onToggleStar: (id: string) => void;
  index?: number;
}

export default function MessageCard({ message, onToggleStar, index = 0 }: Props) {
  const delayClass = `animate-delay-${Math.min(index * 80, 400)}` as const;

  return (
    <div
      className={cn(
        'card-base p-4 sm:p-5 animate-fade-in',
        message.starred && 'border-accent/40 shadow-[0_0_16px_rgba(255,107,53,0.12)]',
        delayClass,
      )}
    >
      <div className="flex items-start justify-between gap-3 mb-3">
        <div className="flex items-center gap-3 min-w-0 flex-1">
          <div className="w-10 h-10 rounded-full bg-accent/20 border border-accent/30 flex items-center justify-center flex-shrink-0">
            <User className="w-5 h-5 text-accent" />
          </div>
          <div className="min-w-0">
            <h4 className="font-semibold text-white truncate">{message.nickname}</h4>
            <div className="flex items-center gap-1 text-xs text-white/50 mt-0.5">
              <Clock className="w-3 h-3" />
              <span>{formatRelativeTime(message.createdAt)}</span>
            </div>
          </div>
        </div>

        <button
          type="button"
          onClick={() => onToggleStar(message.id)}
          className={cn(
            'w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 transition-all duration-200',
            message.starred
              ? 'bg-accent/20 text-accent hover:bg-accent/30 shadow-glow'
              : 'bg-white/5 text-white/40 hover:text-accent hover:bg-white/10',
          )}
          aria-label={message.starred ? '取消标星' : '标星'}
        >
          <Star className={cn('w-5 h-5', message.starred && 'fill-current')} strokeWidth={2} />
        </button>
      </div>

      <p className="text-white/85 text-sm sm:text-base leading-relaxed pl-0 sm:pl-[52px]">
        {message.content}
      </p>
    </div>
  );
}
