'use client';

import { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { jwtDecode } from 'jwt-decode';

export interface AdminUser {
  name: string;
  avatar: string;
  email: string;
  role: 'ADMIN' | 'SUPER_ADMIN';
}

interface DecodedAdmin {
  adminId: string;
  email: string;
  name?: string;
  avatar?: string;
  role?: 'ADMIN' | 'SUPER_ADMIN';
  exp?: number;
}

interface AdminUserContextType {
  adminUser: AdminUser | null;
  loading: boolean;
  login: (token: string) => void;
  logout: () => void;
}

const AdminUserContext = createContext<AdminUserContextType | undefined>(undefined);

export const AdminUserProvider = ({ children }: { children: ReactNode }) => {
  const [adminUser, setAdminUser] = useState<AdminUser | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  // 登出
  const logout = useCallback(() => {
    localStorage.removeItem('admin_token');
    setAdminUser(null);
    // Redirect is handled by the AdminAuth component in the layout
  }, [router]);

  // 登入 (存 token 並解析)
  const login = useCallback((token: string) => {
    localStorage.setItem('admin_token', token);
    try {
      const decoded = jwtDecode<DecodedAdmin>(token);
      setAdminUser({
        name: decoded.name || 'Admin',
        email: decoded.email,
        avatar: decoded.avatar || '',
        role: decoded.role || 'ADMIN',
      });
    } catch (error) {
      console.error('登入 token 解析失敗', error);
      logout();
    }
  }, [logout]);

  // 初始化檢查 token
  useEffect(() => {
    const token = localStorage.getItem('admin_token');
    if (token) {
      try {
        const decoded = jwtDecode<DecodedAdmin>(token);
        // 檢查是否過期
        if (decoded.exp && decoded.exp * 1000 < Date.now()) {
          console.log('Admin token expired, logging out.');
          // Schedule logout asynchronously to avoid calling setState synchronously in the effect
          setTimeout(() => logout(), 0);
          // Ensure loading is updated asynchronously
          setTimeout(() => setLoading(false), 0);
        } else {
          // Schedule state updates asynchronously to avoid cascading renders
          setTimeout(() => {
            setAdminUser({
              name: decoded.name || 'Admin',
              email: decoded.email,
              avatar: decoded.avatar || '',
              role: decoded.role || 'ADMIN',
            });
            setLoading(false); // Set loading to false after token processing
          }, 0);
        }
      } catch (error) {
        console.error('Token 解析失敗', error);
        // Schedule logout asynchronously to avoid calling setState synchronously in the effect
        setTimeout(() => logout(), 0);
        // Ensure loading is updated asynchronously
        setTimeout(() => setLoading(false), 0);
      }
    } else {
      // No token, set loading false asynchronously
      setTimeout(() => setLoading(false), 0);
    }
  }, [logout]);

  return (
    <AdminUserContext.Provider value={{ adminUser, loading, login, logout }}>
      {children}
    </AdminUserContext.Provider>
  );
};

export const useAdminUser = () => {
  const context = useContext(AdminUserContext);
  if (context === undefined) {
    throw new Error('useAdminUser must be used within an AdminUserProvider');
  }
  return context;
};