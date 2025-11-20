// new-LinkUp/client/src/components/content/member/CouponsContext.tsx
'use client';

import React, { createContext, useContext, useState, ReactNode, useCallback, useEffect } from 'react';
import toast from 'react-hot-toast';

export interface Coupon {
  id: string;
  name: string;
  value: number;
  image: string;
  obtainedAt: string;
  expiresAt: string;
  isUsed: boolean;
}

interface CouponsContextType {
  coupons: Coupon[];
  addCoupon: (prize: { name: string; image: string }) => void;
  removeCoupon: (id: string) => void; // [新增] 刪除函式定義
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
    const valueMatch = prize.name.match(/(\d+)/);
    const value = valueMatch ? parseInt(valueMatch[1], 10) : 0;

    const newCoupon: Coupon = {
      id: `coupon_${Date.now()}_${Math.random()}`,
      name: prize.name,
      value: value,
      image: prize.image,
      obtainedAt: new Date().toISOString(),
      expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
      isUsed: false,
    };

    setCoupons(prev => [newCoupon, ...prev]);
    toast.success(`恭喜！您獲得一張 ${prize.name}！`);
  }, []);

  // [新增] 實作刪除函式
  const removeCoupon = useCallback((id: string) => {
    setCoupons(prev => prev.filter(c => c.id !== id));
  }, []);

  return <CouponsContext.Provider value={{ coupons, addCoupon, removeCoupon, loading }}>{children}</CouponsContext.Provider>;
};

export const useCoupons = () => {
  const context = useContext(CouponsContext);
  if (!context) {
    throw new Error('useCoupons must be used within a CouponsProvider');
  }
  return context;
};