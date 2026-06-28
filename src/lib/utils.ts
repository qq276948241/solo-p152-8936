import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import type { Show, ShowStatus } from '@/types';
import { formatDate, formatTime } from '@/utils/format';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function compareByDateDesc<T extends { date: string }>(a: T, b: T): number {
  return new Date(b.date).getTime() - new Date(a.date).getTime();
}

export function compareByCreatedAtDesc<T extends { createdAt: string }>(a: T, b: T): number {
  return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
}

export function formatShowTime(isoString: string): { dateText: string; timeText: string } {
  return {
    dateText: formatDate(isoString),
    timeText: formatTime(isoString),
  };
}

export function countShowsByStatus(shows: Show[]): Record<ShowStatus | 'all', number> {
  return shows.reduce(
    (acc, s) => {
      acc.all += 1;
      acc[s.status] += 1;
      return acc;
    },
    { all: 0, upcoming: 0, ongoing: 0, completed: 0, cancelled: 0 } as Record<ShowStatus | 'all', number>,
  );
}

export function filterShowsByVenue(shows: Show[], keyword: string): Show[] {
  const k = keyword.trim().toLowerCase();
  if (!k) return shows;
  return shows.filter((s) => s.venue.toLowerCase().includes(k));
}
