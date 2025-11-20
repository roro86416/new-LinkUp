// new-LinkUp/client/src/components/content/member/FavoritesContext.tsx
'use client';

import React, { createContext, useContext, useState, ReactNode, useCallback, useEffect } from 'react';
import { type EventCardData } from '../../card/EventCard'; // 引入統一的卡片資料型別

// ----------------------------------------------------
// 1. 類型定義
// ----------------------------------------------------

interface FavoritesContextType {
  favoriteEvents: EventCardData[];
  addFavoriteEvent: (event: EventCardData) => void;
  removeFavoriteEvent: (eventId: number) => void;
  toggleFavorite: (event: EventCardData) => void; // 新增：切換收藏狀態
  isFavorited: (eventId: number) => boolean;      // 新增：檢查是否已收藏
  clearAllFavorites: () => void;
  loading: boolean;
}

const FavoritesContext = createContext<FavoritesContextType | undefined>(undefined);

// LocalStorage Hook (保持原本邏輯)
const useLocalStorage = <T,>(key: string, initialValue: T): [T, (value: T | ((val: T) => T)) => void] => {
  const [storedValue, setStoredValue] = useState<T>(initialValue);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    try {
      const item = window.localStorage.getItem(key);
      if (item) {
        setStoredValue(JSON.parse(item));
      }
    } catch (error) {
      console.error(`Error reading localStorage key “${key}”:`, error);
    }
  }, [key]);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    try {
      const item = window.localStorage.getItem(key);
      const currentValueInLocalStorage = item ? JSON.parse(item) : null;
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
  const [loading, setLoading] = useState(true);
  const [favoriteEvents, setFavoriteEvents] = useLocalStorage<EventCardData[]>('favoriteEvents', []);

  useEffect(() => {
    setLoading(false);
  }, []);

  const addFavoriteEvent = useCallback((event: EventCardData) => {
    setFavoriteEvents(prev => {
      if (prev.some(e => e.id === event.id)) return prev;
      return [...prev, event];
    });
  }, [setFavoriteEvents]);

  const removeFavoriteEvent = useCallback((eventId: number) => {
    setFavoriteEvents(prev => prev.filter(e => e.id !== eventId));
  }, [setFavoriteEvents]);

  // 新增：整合切換邏輯
  const toggleFavorite = useCallback((event: EventCardData) => {
    setFavoriteEvents(prev => {
      const exists = prev.some(e => e.id === event.id);
      if (exists) {
        return prev.filter(e => e.id !== event.id);
      } else {
        return [...prev, event];
      }
    });
  }, [setFavoriteEvents]);

  // 新增：檢查狀態 helper
  const isFavorited = useCallback((eventId: number) => {
    return favoriteEvents.some(e => e.id === eventId);
  }, [favoriteEvents]);

  const clearAllFavorites = useCallback(() => {
    setFavoriteEvents([]);
  }, [setFavoriteEvents]);

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