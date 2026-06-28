import { useMemo, useState } from 'react';
import type { Show, ShowStatus } from '@/types';
import {
  compareByDateDesc,
  countShowsByStatus,
  filterShowsByVenue,
} from '@/lib/utils';

interface UseShowFilterResult {
  filteredShows: Show[];
  activeStatus: ShowStatus | 'all';
  setActiveStatus: (value: ShowStatus | 'all') => void;
  statusCounts: Record<ShowStatus | 'all', number>;
}

export function useShowFilter(shows: Show[], searchKeyword: string): UseShowFilterResult {
  const [activeStatus, setActiveStatus] = useState<ShowStatus | 'all'>('all');

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
    activeStatus,
    setActiveStatus,
    statusCounts,
  };
}
