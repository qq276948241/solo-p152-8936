import { useCallback, useEffect, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import type { Show, ShowStatus } from '@/types';
import {
  compareByDateDesc,
  countShowsByStatus,
  filterShowsByVenue,
} from '@/lib/utils';

const VALID_STATUSES: Array<ShowStatus | 'all'> = [
  'all',
  'upcoming',
  'ongoing',
  'completed',
  'cancelled',
];

function normalizeStatus(raw: string | null): ShowStatus | 'all' {
  if (!raw) return 'all';
  return (VALID_STATUSES as string[]).includes(raw)
    ? (raw as ShowStatus | 'all')
    : 'all';
}

interface UseShowFilterResult {
  filteredShows: Show[];
  searchKeyword: string;
  setSearchKeyword: (value: string) => void;
  activeStatus: ShowStatus | 'all';
  setActiveStatus: (value: ShowStatus | 'all') => void;
  statusCounts: Record<ShowStatus | 'all', number>;
}

export function useShowFilter(shows: Show[]): UseShowFilterResult {
  const [searchParams, setSearchParams] = useSearchParams();

  const rawStatus = searchParams.get('status');
  const searchKeyword = searchParams.get('q') ?? '';
  const activeStatus = normalizeStatus(rawStatus);

  useEffect(() => {
    const needsFix =
      (rawStatus !== null && activeStatus === 'all') ||
      (searchParams.get('q') !== null && searchKeyword.trim() === '');
    if (!needsFix) return;

    setSearchParams(
      (prev) => {
        const next = new URLSearchParams(prev);
        if (rawStatus !== null && activeStatus === 'all') next.delete('status');
        const currentQ = next.get('q');
        if (currentQ !== null && currentQ.trim() === '') next.delete('q');
        return next;
      },
      { replace: true },
    );
  }, [rawStatus, activeStatus, searchKeyword, searchParams, setSearchParams]);

  const setSearchKeyword = useCallback(
    (value: string) => {
      setSearchParams(
        (prev) => {
          const next = new URLSearchParams(prev);
          const trimmed = value.trim();
          if (trimmed) {
            next.set('q', trimmed);
          } else {
            next.delete('q');
          }
          return next;
        },
        { replace: true },
      );
    },
    [setSearchParams],
  );

  const setActiveStatus = useCallback(
    (value: ShowStatus | 'all') => {
      setSearchParams(
        (prev) => {
          const next = new URLSearchParams(prev);
          if (value && value !== 'all') {
            next.set('status', value);
          } else {
            next.delete('status');
          }
          return next;
        },
        { replace: true },
      );
    },
    [setSearchParams],
  );

  const venueFiltered = useMemo(() => {
    const matched = filterShowsByVenue(shows, searchKeyword);
    return [...matched].sort(compareByDateDesc);
  }, [shows, searchKeyword]);

  const filteredShows = useMemo(() => {
    if (activeStatus === 'all') return venueFiltered;
    return venueFiltered.filter((s) => s.status === activeStatus);
  }, [venueFiltered, activeStatus]);

  const statusCounts = useMemo(
    () => countShowsByStatus(venueFiltered),
    [venueFiltered],
  );

  return {
    filteredShows,
    searchKeyword,
    setSearchKeyword,
    activeStatus,
    setActiveStatus,
    statusCounts,
  };
}
