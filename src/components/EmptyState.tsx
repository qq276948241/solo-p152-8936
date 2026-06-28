import { Music2, MessageSquareOff } from 'lucide-react';
import type { ReactNode } from 'react';

interface Props {
  icon?: 'shows' | 'messages';
  title: string;
  description?: string;
  action?: ReactNode;
}

export default function EmptyState({ icon = 'shows', title, description, action }: Props) {
  const Icon = icon === 'shows' ? Music2 : MessageSquareOff;

  return (
    <div className="card-base p-8 sm:p-12 text-center animate-fade-in">
      <div className="w-20 h-20 mx-auto mb-6 rounded-3xl bg-accent/10 border border-accent/20 flex items-center justify-center">
        <Icon className="w-10 h-10 text-accent/70" strokeWidth={1.5} />
      </div>
      <h3 className="text-xl font-bold text-white mb-2">{title}</h3>
      {description && <p className="text-white/60 mb-6 max-w-sm mx-auto">{description}</p>}
      {action && <div>{action}</div>}
    </div>
  );
}
