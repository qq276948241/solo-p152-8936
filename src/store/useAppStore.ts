import { create } from 'zustand';
import type { Show, Message, ShowStatus } from '@/types';
import { MOCK_SHOWS, MOCK_MESSAGES } from '@/data/mockData';

interface AppState {
  shows: Show[];
  messages: Message[];
  searchKeyword: string;

  getShowById: (id: string) => Show | undefined;
  getMessagesByShowId: (showId: string) => Message[];
  getFilteredShows: () => Show[];

  setSearchKeyword: (keyword: string) => void;
  updateShow: (id: string, data: Partial<Show>) => void;
  updateShowStatus: (id: string, status: ShowStatus) => void;
  toggleMessageStar: (messageId: string) => void;
}

const SHOWS_KEY = 'gig-scheduler-shows';
const MESSAGES_KEY = 'gig-scheduler-messages';

function loadFromStorage<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);
    if (raw) return JSON.parse(raw) as T;
  } catch {
    /* ignore */
  }
  return fallback;
}

function saveToStorage<T>(key: string, value: T) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    /* ignore */
  }
}

export const useAppStore = create<AppState>((set, get) => ({
  shows: loadFromStorage<Show[]>(SHOWS_KEY, MOCK_SHOWS),
  messages: loadFromStorage<Message[]>(MESSAGES_KEY, MOCK_MESSAGES),
  searchKeyword: '',

  getShowById: (id) => get().shows.find((s) => s.id === id),

  getMessagesByShowId: (showId) =>
    get()
      .messages.filter((m) => m.showId === showId)
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()),

  getFilteredShows: () => {
    const { shows, searchKeyword } = get();
    const keyword = searchKeyword.trim().toLowerCase();
    const list = keyword
      ? shows.filter((s) => s.venue.toLowerCase().includes(keyword))
      : shows;
    return [...list].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  },

  setSearchKeyword: (keyword) => set({ searchKeyword: keyword }),

  updateShow: (id, data) =>
    set((state) => {
      const shows = state.shows.map((s) =>
        s.id === id ? { ...s, ...data, updatedAt: new Date().toISOString() } : s,
      );
      saveToStorage(SHOWS_KEY, shows);
      return { shows };
    }),

  updateShowStatus: (id, status) =>
    set((state) => {
      const shows = state.shows.map((s) =>
        s.id === id ? { ...s, status, updatedAt: new Date().toISOString() } : s,
      );
      saveToStorage(SHOWS_KEY, shows);
      return { shows };
    }),

  toggleMessageStar: (messageId) =>
    set((state) => {
      const messages = state.messages.map((m) =>
        m.id === messageId ? { ...m, starred: !m.starred } : m,
      );
      saveToStorage(MESSAGES_KEY, messages);
      return { messages };
    }),
}));
