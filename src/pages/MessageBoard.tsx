import { useMemo, useState } from 'react';
import { MessageCircleHeart, ChevronDown, Star, MapPin, Calendar, Filter, Eye } from 'lucide-react';
import { useAppStore } from '@/store/useAppStore';
import MessageCard from '@/components/MessageCard';
import EmptyState from '@/components/EmptyState';
import StatusBadge from '@/components/StatusBadge';
import { compareByDateDesc, cn } from '@/lib/utils';
import { formatDate } from '@/utils/format';

type FilterMode = 'all' | 'starred';

export default function MessageBoard() {
  const { shows, getMessagesByShowId, toggleMessageStar } = useAppStore();

  const showsSorted = useMemo(
    () => [...shows].sort(compareByDateDesc),
    [shows],
  );

  const [selectedShowId, setSelectedShowId] = useState<string>(showsSorted[0]?.id ?? '');
  const [filterMode, setFilterMode] = useState<FilterMode>('all');
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const selectedShow = useMemo(
    () => showsSorted.find((s) => s.id === selectedShowId),
    [showsSorted, selectedShowId],
  );

  const allMessages = useMemo(
    () => (selectedShowId ? getMessagesByShowId(selectedShowId) : []),
    [selectedShowId, getMessagesByShowId],
  );

  const filteredMessages = useMemo(() => {
    if (filterMode === 'starred') return allMessages.filter((m) => m.starred);
    return allMessages;
  }, [allMessages, filterMode]);

  const starredCount = allMessages.filter((m) => m.starred).length;

  return (
    <div className="page-container animate-fade-in">
      <div className="mb-6 sm:mb-8">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-12 h-12 rounded-2xl bg-accent flex items-center justify-center shadow-lg">
            <MessageCircleHeart className="w-6 h-6 text-white" strokeWidth={2.2} />
          </div>
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-white">留言板</h1>
            <p className="text-sm text-white/60">
              共 {allMessages.length} 条留言
              {starredCount > 0 && (
                <span className="ml-2 inline-flex items-center gap-1 text-accent">
                  <Star className="w-3.5 h-3.5 fill-current" />
                  {starredCount} 条标星
                </span>
              )}
            </p>
          </div>
        </div>
      </div>

      <div className="space-y-4 mb-6">
        <div className="relative">
          <button
            type="button"
            onClick={() => setDropdownOpen((v) => !v)}
            onBlur={() => setTimeout(() => setDropdownOpen(false), 150)}
            className="w-full card-base p-4 sm:p-5 flex items-center justify-between gap-4 text-left hover:border-accent/30 transition-all"
          >
            <div className="flex-1 min-w-0">
              <div className="text-xs text-white/50 mb-1">当前选择演出</div>
              {selectedShow ? (
                <div className="flex flex-wrap items-center gap-2 sm:gap-3">
                  <h3 className="text-white font-semibold truncate">{selectedShow.venue}</h3>
                  <StatusBadge status={selectedShow.status} />
                </div>
              ) : (
                <h3 className="text-white/60 font-medium">暂无演出</h3>
              )}
              {selectedShow && (
                <div className="flex flex-wrap items-center gap-x-4 gap-y-1 mt-2 text-xs sm:text-sm text-white/60">
                  <span className="inline-flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5 text-accent/70" />
                    {formatDate(selectedShow.date)}
                  </span>
                  <span className="inline-flex items-center gap-1 max-w-full">
                    <MapPin className="w-3.5 h-3.5 text-accent/70 flex-shrink-0" />
                    <span className="truncate">{selectedShow.address}</span>
                  </span>
                </div>
              )}
            </div>
            <ChevronDown
              className={cn(
                'w-5 h-5 text-accent flex-shrink-0 transition-transform duration-200',
                dropdownOpen && 'rotate-180',
              )}
            />
          </button>

          {dropdownOpen && (
            <div className="absolute left-0 right-0 top-full mt-2 z-30 card-base max-h-80 overflow-y-auto animate-fade-in py-2 shadow-2xl">
              {showsSorted.length === 0 ? (
                <div className="px-5 py-4 text-white/50 text-sm text-center">暂无演出数据</div>
              ) : (
                showsSorted.map((s) => {
                  const count = getMessagesByShowId(s.id).length;
                  const active = s.id === selectedShowId;
                  return (
                    <button
                      key={s.id}
                      type="button"
                      onMouseDown={(e) => e.preventDefault()}
                      onClick={() => {
                        setSelectedShowId(s.id);
                        setDropdownOpen(false);
                      }}
                      className={cn(
                        'w-full px-4 sm:px-5 py-3 text-left transition-colors flex items-center gap-3 min-h-[56px]',
                        active
                          ? 'bg-accent/15 text-white'
                          : 'text-white/80 hover:bg-white/5 hover:text-white',
                      )}
                    >
                      <div className="flex-1 min-w-0">
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="font-medium truncate">{s.venue}</span>
                          <StatusBadge status={s.status} />
                        </div>
                        <div className="text-xs text-white/50 mt-1">{formatDate(s.date)}</div>
                      </div>
                      <div className="flex items-center gap-2 flex-shrink-0">
                        <span
                          className={cn(
                            'text-xs px-2 py-1 rounded-full',
                            count > 0 ? 'bg-accent/20 text-accent' : 'bg-white/5 text-white/40',
                          )}
                        >
                          {count} 条
                        </span>
                      </div>
                    </button>
                  );
                })
              )}
            </div>
          )}
        </div>

        <div className="flex items-center gap-2 overflow-x-auto pb-1 -mx-1 px-1">
          <Filter className="w-4 h-4 text-white/50 flex-shrink-0 ml-1" />
          {([
            { value: 'all', label: '全部留言', count: allMessages.length },
            { value: 'starred', label: '标星留言', count: starredCount },
          ] as const).map((f) => {
            const active = filterMode === f.value;
            return (
              <button
                key={f.value}
                type="button"
                onClick={() => setFilterMode(f.value)}
                className={cn(
                  'flex-shrink-0 px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 min-h-[40px] inline-flex items-center gap-2',
                  active
                    ? 'bg-accent text-white shadow-lg'
                    : 'bg-surface/60 text-white/70 hover:text-white hover:bg-surface-light border border-white/5',
                )}
              >
                {f.value === 'starred' && <Star className={cn('w-4 h-4', active && 'fill-current')} />}
                {f.label}
                <span
                  className={cn(
                    'px-1.5 py-0.5 rounded-full text-xs',
                    active ? 'bg-white/20' : 'bg-white/10',
                  )}
                >
                  {f.count}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {allMessages.length === 0 ? (
        <EmptyState
          icon="messages"
          title={selectedShow ? '该演出暂无留言' : '请先选择一场演出'}
          description={
            selectedShow
              ? '还没有观众在这场演出下留言，等演出宣传起来就会有啦'
              : '从上方选择一场演出，即可查看对应的观众留言'
          }
          action={
            selectedShow ? (
              <div className="inline-flex items-center gap-2 text-white/60 text-sm">
                <Eye className="w-4 h-4" />
                <span>耐心等待观众留言...</span>
              </div>
            ) : null
          }
        />
      ) : filteredMessages.length === 0 ? (
        <EmptyState
          icon="messages"
          title="没有标星的留言"
          description="点击留言右上角的星标，可以将重要留言标记出来方便查看"
        />
      ) : (
        <div className="space-y-3 sm:space-y-4">
          {filteredMessages.map((msg, i) => (
            <MessageCard key={msg.id} message={msg} onToggleStar={toggleMessageStar} index={i} />
          ))}
        </div>
      )}
    </div>
  );
}
