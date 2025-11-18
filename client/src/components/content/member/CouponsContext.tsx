'use client';

import React, { createContext, useContext, useState, ReactNode, useCallback, useEffect } from 'react';
import toast from 'react-hot-toast';

// 1. 定義折價券的資料結構
export interface Coupon {
  id: string; // 唯一 ID
  name: string; // 獎項名稱，例如 '折價券 50 元'
  value: number; // 折扣金額
  image: string; // 圖片 URL
  obtainedAt: string; // 獲得時間 (ISO 格式)
  expiresAt: string; // 到期時間 (ISO 格式)
  isUsed: boolean; // 是否已使用
}

interface CouponsContextType {
  coupons: Coupon[];
  addCoupon: (prize: { name: string; image: string }) => void;
  loading: boolean;
}

const CouponsContext = createContext<CouponsContextType | undefined>(undefined);

export const CouponsProvider = ({ children }: { children: ReactNode }) => {
  const [coupons, setCoupons] = useState<Coupon[]>(() => {
    if (typeof window === 'undefined') return [];
    try {
      const savedCoupons = localStorage.getItem('user_coupons');
      return savedCoupons ? JSON.parse(savedCoupons) : [];
    } catch {
      return [];
    }
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    localStorage.setItem('user_coupons', JSON.stringify(coupons));
  }, [coupons]);

  const addCoupon = useCallback((prize: { name: string; image: string }) => {
    // 從獎項名稱中解析出金額
    const valueMatch = prize.name.match(/(\d+)/);
    const value = valueMatch ? parseInt(valueMatch[1], 10) : 0;

    const newCoupon: Coupon = {
      id: `coupon_${Date.now()}_${Math.random()}`,
      name: prize.name,
      value: value,
      image: prize.image,
      obtainedAt: new Date().toISOString(),
      expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(), // 30 天後到期
      isUsed: false,
    };

    setCoupons(prev => [newCoupon, ...prev]);
    toast.success(`恭喜！您獲得一張 ${prize.name}！`);
  }, []);

  return <CouponsContext.Provider value={{ coupons, addCoupon, loading }}>{children}</CouponsContext.Provider>;
};

export const useCoupons = () => {
  const context = useContext(CouponsContext);
  if (!context) {
    throw new Error('useCoupons must be used within a CouponsProvider');
  }
  return context;
};