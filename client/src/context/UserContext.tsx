'use client';
import { createContext, useContext, useState, ReactNode } from 'react';

export interface User {
  name: string;
  avatar: string; // 大頭照 URL
  email: string;
}

interface UserContextType {
  user: User | null;
  login: (userData: User) => void;
  logout: () => void;
  updateUser: (data: Partial<User>) => void; // 更新部分欄位
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);

  // 登入
  const login = (userData: User) => {
    setUser(userData);
  };

  // 登出
  const logout = () => setUser(null);

  // 更新部分欄位（例如 avatar 或 name）
  const updateUser = (data: Partial<User>) => {
    setUser(prev => (prev ? { ...prev, ...data } : prev));
  };

  return (
    <UserContext.Provider value={{ user, login, logout, updateUser }}>
      {children}
    </UserContext.Provider>
  );
};

// 自訂 Hook
export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) throw new Error('useUser 必須在 UserProvider 內使用');
  return context;
};
