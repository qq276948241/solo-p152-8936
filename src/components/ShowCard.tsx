import { Link } from 'react-router-dom';
import { MapPin, Calendar, Ticket, ChevronRight } from 'lucide-react';
import type { Show } from '@/types';
import StatusBadge from './StatusBadge';
import { formatPrice } from '@/utils/format';
import { formatShowTime } from '@/lib/utils';

interface Props {
  show: Show;
  index?: number;
}

export default function ShowCard({ show, index = 0 }: Props) {
  const delayClass = `animate-delay-${Math.min(index * 100, 500)}` as const;
  const { dateText, timeText } = formatShowTime(show.date);

  return (
    <Link
      to={`/shows/${show.id}`}
      className={`card-hoverable p-5 sm:p-6 block animate-fade-in ${delayClass}`}
    >
      <div className="flex items-start justify-between gap-3 mb-4">
        <div className="flex-1 min-w-0">
          <h3 className="text-lg sm:text-xl font-bold text-white truncate mb-2 pr-2">
            {show.venue}
          </h3>
          <StatusBadge status={show.status} />
        </div>
        <ChevronRight className="w-5 h-5 text-accent/70 flex-shrink-0 mt-1 group-hover:translate-x-1 transition-transform" />
      </div>

      <div className="space-y-3 text-sm">
        <div className="flex items-center gap-3 text-white/80">
          <Calendar className="w-4 h-4 text-accent/80 flex-shrink-0" />
          <div className="flex flex-col sm:flex-row sm:items-center sm:gap-2">
            <span className="font-medium">{dateText}</span>
            <span className="text-white/50 text-xs sm:text-sm">{timeText}</span>
          </div>
        </div>

        <div className="flex items-center gap-3 text-white/80">
          <MapPin className="w-4 h-4 text-accent/80 flex-shrink-0" />
          <span className="truncate text-sm">{show.address}</span>
        </div>

        <div className="flex items-center gap-3">
          <Ticket className="w-4 h-4 text-accent/80 flex-shrink-0" />
          <span className="text-accent font-bold text-base">{formatPrice(show.price)}</span>
        </div>
      </div>

      {show.notes && (
        <div className="mt-4 pt-4 border-t border-white/10">
          <p className="text-sm text-white/60 line-clamp-2">{show.notes}</p>
        </div>
      )}
    </Link>
  );
}
