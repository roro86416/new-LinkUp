'use client';

import React, { createContext, useContext, useState, ReactNode, useCallback, useEffect } from 'react';
import toast from 'react-hot-toast';
// 1. 引入 UserContext
import { useUser } from '../../../context/auth/UserContext'; 

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
  removeCoupon: (id: string) => void;
  loading: boolean;
}

const CouponsContext = createContext<CouponsContextType | undefined>(undefined);

export const CouponsProvider = ({ children }: { children: ReactNode }) => {
  // 2. 取得當前使用者資訊
  const { user } = useUser(); 
  
  // 3. 初始值先給空陣列 (等待 useEffect 讀取)
  const [coupons, setCoupons] = useState<Coupon[]>([]);
  const [loading, setLoading] = useState(true);

  // 4. [讀取邏輯] 當 user.id 改變時，讀取專屬的 Key
  useEffect(() => {
    // 如果沒登入，清空資料並結束
    if (!user?.userId) {
        setCoupons([]);
        setLoading(false);
        return;
    }

    setLoading(true);
    try {
      // 使用動態 Key: user_coupons_101
      const key = `user_coupons_${user.userId}`; 
      const savedCoupons = localStorage.getItem(key);
      if (savedCoupons) {
        setCoupons(JSON.parse(savedCoupons));
      } else {
        setCoupons([]);
      }
    } catch (e) {
      console.error("讀取優惠券失敗", e);
      setCoupons([]);
    } finally {
      setLoading(false);
    }
  }, [user?.userId]); // 關鍵：監聽 ID 變化

  // 5. [寫入邏輯] 當 coupons 或 user.id 改變時，寫入專屬 Key
  useEffect(() => {
    if (!user?.userId) return;
    
    const key = `user_coupons_${user.userId}`;
    localStorage.setItem(key, JSON.stringify(coupons));
  }, [coupons, user?.userId]);

  const addCoupon = useCallback((prize: { name: string; image: string }) => {
    // 防呆：沒登入不能領 (雖然理論上不會發生)
    if (!user?.userId) { 
        toast.error("請先登入");
        return;
    }

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
  }, [user?.userId]);

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