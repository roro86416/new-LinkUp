//FavoritesContext.tsx = 資料 / 邏輯層（State + 方法）

'use client';

import React, { createContext, useContext, useState, ReactNode, useCallback, useEffect } from 'react';

// ----------------------------------------------------
// 1. 類型定義 (從 Favorites.tsx 搬移過來)
// ----------------------------------------------------

export interface FavoriteEvent {
  id: number;
  title: string;
  date: string;
  location: string;
  isUpcoming: boolean;
  organizerName: string;
}

interface FavoritesContextType {
  favoriteEvents: FavoriteEvent[];
  addFavoriteEvent: (event: FavoriteEvent) => void;
  removeFavoriteEvent: (eventId: number) => void;
  clearAllFavorites: () => void;
  loading: boolean;
}

const FavoritesContext = createContext<FavoritesContextType | undefined>(undefined);

const useLocalStorage = <T,>(key: string, initialValue: T): [T, (value: T | ((val: T) => T)) => void] => {
  // 1. 初始狀態總是使用 initialValue，以確保 SSR 和客戶端首次渲染一致
  const [storedValue, setStoredValue] = useState<T>(initialValue);

  // 2. 在 useEffect 中從 localStorage 讀取資料，這只會在客戶端執行
  useEffect(() => {
    // 防止在伺服器端執行
    if (typeof window === 'undefined') {
      return;
    }
    try {
      const item = window.localStorage.getItem(key);
      // 如果 localStorage 中有值，則更新狀態
      if (item) {
        // eslint-disable-next-line react-hooks/rules-of-hooks
        setStoredValue(JSON.parse(item));
      }
    } catch (error) {
      console.error(`Error reading localStorage key “${key}”:`, error);
    }
  }, [key]); // 依賴 key，雖然在此應用中 key 不會變，但這是個好習慣

  // 3. 使用另一個 useEffect 來監聽 storedValue 的變化，並將其同步到 localStorage。
  useEffect(() => {
    if (typeof window === 'undefined') {
      return;
    }
    try {
      // 取得當前 localStorage 的值
      const item = window.localStorage.getItem(key);
      const currentValueInLocalStorage = item ? JSON.parse(item) : null;

      // 只有當 React 狀態與 localStorage 不同時才寫入，避免不必要的 I/O 操作。
      if (JSON.stringify(storedValue) !== JSON.stringify(currentValueInLocalStorage)) {
        window.localStorage.setItem(key, JSON.stringify(storedValue));
      }
    } catch (error) {
      console.error(`Error setting localStorage key “${key}”:`, error);
    }
  }, [key, storedValue]);

  return [storedValue, setStoredValue];
};

export const FavoritesProvider = ({ children }: { children: ReactNode }) => {
  // 增加一個 loading 狀態，處理客戶端水合
  const [loading, setLoading] = useState(true);
  const [favoriteEvents, setFavoriteEvents] = useLocalStorage<FavoriteEvent[]>('favoriteEvents', []);

  useEffect(() => {
    // 這個 effect 只在客戶端執行，當它完成時，代表 localStorage 的資料已經被讀取
    // 我們可以安全地將 loading 設為 false
    // eslint-disable-next-line react-hooks/exhaustive-deps
    setLoading(false);
  }, []);

  const addFavoriteEvent = useCallback((event: FavoriteEvent) => {
    setFavoriteEvents(prevEvents => [...prevEvents, event]);
  }, [setFavoriteEvents]);

  const removeFavoriteEvent = useCallback((eventId: number) => {
    setFavoriteEvents(prevEvents => prevEvents.filter(e => e.id !== eventId));
  }, [setFavoriteEvents]);

  const clearAllFavorites = useCallback(() => {
    setFavoriteEvents([]);
  }, [setFavoriteEvents]);

  const value = { favoriteEvents, addFavoriteEvent, removeFavoriteEvent, clearAllFavorites, loading };

  return <FavoritesContext.Provider value={value}>{children}</FavoritesContext.Provider>;
};

export const useFavorites = () => {
  const context = useContext(FavoritesContext);
  if (context === undefined) {
    throw new Error('useFavorites must be used within a FavoritesProvider');
  }
  return context;
};