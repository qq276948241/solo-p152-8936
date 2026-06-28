export type ShowStatus = 'upcoming' | 'ongoing' | 'completed' | 'cancelled';

export interface Show {
  id: string;
  venue: string;
  date: string;
  price: number;
  status: ShowStatus;
  address: string;
  notes: string;
  createdAt: string;
  updatedAt: string;
}

export interface Message {
  id: string;
  showId: string;
  nickname: string;
  content: string;
  createdAt: string;
  starred: boolean;
}

export const SHOW_STATUS_LABELS: Record<ShowStatus, string> = {
  upcoming: '即将开演',
  ongoing: '正在进行',
  completed: '已结束',
  cancelled: '已取消',
};

export const SHOW_STATUS_COLORS: Record<ShowStatus, string> = {
  upcoming: 'bg-accent/20 text-accent border border-accent/40',
  ongoing: 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40',
  completed: 'bg-white/10 text-white/60 border border-white/15',
  cancelled: 'bg-red-500/20 text-red-400 border border-red-500/40',
};
