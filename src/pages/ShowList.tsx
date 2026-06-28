import { useAppStore } from '@/store/useAppStore';
import ShowCard from '@/components/ShowCard';
import SearchInput from '@/components/SearchInput';
import EmptyState from '@/components/EmptyState';
import { SHOW_STATUS_LABELS } from '@/types';
import type { ShowStatus } from '@/types';
import { Music, Filter } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useMemo, useState } from 'react';

const STATUS_FILTERS: Array<{ value: ShowStatus | 'all'; label: string }> = [
  { value: 'all', label: '全部' },
  { value: 'upcoming', label: SHOW_STATUS_LABELS.upcoming },
  { value: 'ongoing', label: SHOW_STATUS_LABELS.ongoing },
  { value: 'completed', label: SHOW_STATUS_LABELS.completed },
  { value: 'cancelled', label: SHOW_STATUS_LABELS.cancelled },
];

export default function ShowList() {
  const { shows, searchKeyword, setSearchKeyword } = useAppStore();
  const [statusFilter, setStatusFilter] = useState<ShowStatus | 'all'>('all');

  const venueFiltered = useMemo(() => {
    const keyword = searchKeyword.trim().toLowerCase();
    const list = keyword
      ? shows.filter((s) => s.venue.toLowerCase().includes(keyword))
      : shows;
    return [...list].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }, [shows, searchKeyword]);

  const filteredShows = useMemo(() => {
    if (statusFilter === 'all') return venueFiltered;
    return venueFiltered.filter((s) => s.status === statusFilter);
  }, [venueFiltered, statusFilter]);

  const counts = useMemo(() => {
    return {
      all: venueFiltered.length,
      upcoming: venueFiltered.filter((s) => s.status === 'upcoming').length,
      ongoing: venueFiltered.filter((s) => s.status === 'ongoing').length,
      completed: venueFiltered.filter((s) => s.status === 'completed').length,
      cancelled: venueFiltered.filter((s) => s.status === 'cancelled').length,
    };
  }, [venueFiltered]);

  return (
    <div className="page-container animate-fade-in">
      <div className="mb-6 sm:mb-8">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-12 h-12 rounded-2xl bg-accent flex items-center justify-center shadow-lg">
            <Music className="w-6 h-6 text-white" strokeWidth={2.2} />
          </div>
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-white">演出日程</h1>
            <p className="text-sm text-white/60">共 {counts.all} 场演出，按时间倒序排列</p>
          </div>
        </div>
      </div>

      <div className="space-y-4 mb-6">
        <SearchInput
          value={searchKeyword}
          onChange={setSearchKeyword}
          placeholder="输入场地名称搜索..."
        />

        <div className="flex items-center gap-2 overflow-x-auto pb-1 -mx-1 px-1">
          <Filter className="w-4 h-4 text-white/50 flex-shrink-0 ml-1" />
          {STATUS_FILTERS.map((f) => {
            const active = statusFilter === f.value;
            const count = counts[f.value];
            return (
              <button
                key={f.value}
                type="button"
                onClick={() => setStatusFilter(f.value)}
                className={cn(
                  'flex-shrink-0 px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 min-h-[40px]',
                  active
                    ? 'bg-accent text-white shadow-lg'
                    : 'bg-surface/60 text-white/70 hover:text-white hover:bg-surface-light border border-white/5',
                )}
              >
                {f.label}
                <span
                  className={cn(
                    'ml-2 px-1.5 py-0.5 rounded-full text-xs',
                    active ? 'bg-white/20' : 'bg-white/10',
                  )}
                >
                  {count}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {filteredShows.length === 0 ? (
        <EmptyState
          icon="shows"
          title={searchKeyword ? '没有找到匹配的演出' : '暂无演出数据'}
          description={
            searchKeyword
              ? `没有包含「${searchKeyword}」的场地，试试其他关键词`
              : '演出列表为空，等待添加新的演出日程'
          }
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
          {filteredShows.map((show, i) => (
            <ShowCard key={show.id} show={show} index={i} />
          ))}
        </div>
      )}
    </div>
  );
}
