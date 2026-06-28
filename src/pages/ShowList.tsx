import { useAppStore } from '@/store/useAppStore';
import ShowCard from '@/components/ShowCard';
import SearchInput from '@/components/SearchInput';
import StatusFilterBar from '@/components/StatusFilterBar';
import EmptyState from '@/components/EmptyState';
import type { ShowStatus } from '@/types';
import { Music } from 'lucide-react';
import { useMemo, useState } from 'react';

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

      <div className="space-y-3 mb-6">
        <SearchInput
          value={searchKeyword}
          onChange={setSearchKeyword}
          placeholder="输入场地名称搜索..."
        />
        <StatusFilterBar
          active={statusFilter}
          onChange={setStatusFilter}
          counts={counts}
        />
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
