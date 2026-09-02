// new-LinkUp/client/src/components/content/member/FavoritesContext.tsx
'use client';

import React, { createContext, useContext, useState, ReactNode, useCallback, useEffect } from 'react';
import { type EventCardData } from '../../card/EventCard';
// [修改] 1. 引入 UserContext 以取得當前使用者 ID
import { useUser } from '../../../context/auth/UserContext';

// ----------------------------------------------------
// 類型定義
// ----------------------------------------------------

interface FavoritesContextType {
  favoriteEvents: EventCardData[];
  addFavoriteEvent: (event: EventCardData) => void;
  removeFavoriteEvent: (eventId: number) => void;
  toggleFavorite: (event: EventCardData) => void;
  isFavorited: (eventId: number) => boolean;
  clearAllFavorites: () => void;
  loading: boolean;
}

const FavoritesContext = createContext<FavoritesContextType | undefined>(undefined);

export const FavoritesProvider = ({ children }: { children: ReactNode }) => {
  // [修改] 2. 取得 user 資訊
  const { user } = useUser();
  
  // [修改] 3. 初始狀態設為空陣列，等待 useEffect 根據 userId 讀取
  const [favoriteEvents, setFavoriteEvents] = useState<EventCardData[]>([]);
  const [loading, setLoading] = useState(true);

  // [修改] 4. 讀取邏輯：當 user.userId 改變時，讀取專屬 Key
  useEffect(() => {
    // 如果沒登入，清空並結束
    if (!user?.userId) {
      setFavoriteEvents([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    try {
      // [關鍵] 使用包含 userId 的動態 Key
      const key = `favoriteEvents_${user.userId}`;
      const item = window.localStorage.getItem(key);
      if (item) {
        setFavoriteEvents(JSON.parse(item));
      } else {
        setFavoriteEvents([]);
      }
    } catch (error) {
      console.error(`Error reading localStorage key favoriteEvents_${user.userId}:`, error);
      setFavoriteEvents([]);
    } finally {
      setLoading(false);
    }
  }, [user?.userId]); // 依賴 userId 變化

  // [修改] 5. 寫入邏輯：當最愛清單或 userId 改變時，寫入專屬 Key
  useEffect(() => {
    if (!user?.userId) return;

    try {
      const key = `favoriteEvents_${user.userId}`;
      window.localStorage.setItem(key, JSON.stringify(favoriteEvents));
    } catch (error) {
      console.error(`Error setting localStorage key favoriteEvents_${user.userId}:`, error);
    }
  }, [favoriteEvents, user?.userId]);

  // --- 以下邏輯保持不變 ---

  const addFavoriteEvent = useCallback((event: EventCardData) => {
    if (!user?.userId) return; // 簡單防呆
    setFavoriteEvents(prev => {
      if (prev.some(e => e.id === event.id)) return prev;
      return [...prev, event];
    });
  }, [user?.userId]);

  const removeFavoriteEvent = useCallback((eventId: number) => {
    setFavoriteEvents(prev => prev.filter(e => e.id !== eventId));
  }, []);

  const toggleFavorite = useCallback((event: EventCardData) => {
    if (!user?.userId) return; // 簡單防呆
    setFavoriteEvents(prev => {
      const exists = prev.some(e => e.id === event.id);
      if (exists) {
        return prev.filter(e => e.id !== event.id);
      } else {
        return [...prev, event];
      }
    });
  }, [user?.userId]);

  const isFavorited = useCallback((eventId: number) => {
    return favoriteEvents.some(e => e.id === eventId);
  }, [favoriteEvents]);

  const clearAllFavorites = useCallback(() => {
    setFavoriteEvents([]);
  }, []);

  const value = { 
    favoriteEvents, 
    addFavoriteEvent, 
    removeFavoriteEvent, 
    toggleFavorite,
    isFavorited,
    clearAllFavorites, 
    loading 
  };

  return <FavoritesContext.Provider value={value}>{children}</FavoritesContext.Provider>;
};

export const useFavorites = () => {
  const context = useContext(FavoritesContext);
  if (context === undefined) {
    throw new Error('useFavorites must be used within a FavoritesProvider');
  }
  return context;
};