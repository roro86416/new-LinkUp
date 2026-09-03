'use client';
import { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react';
import { jwtDecode } from 'jwt-decode';

export interface User {
  userId:string;
  name: string;
  avatar: string;
  email: string;
  provider: string; // Add provider to the User type
}

interface DecodedUser {
  userId: string;
  email: string;
  name?: string;
  avatar?: string;
  exp?: number;
  provider?: string; // Add provider to the decoded type
}

interface UserContextType {
  user: User | null;
  token: string | null;
  login: (token: string) => void;
  logout: () => void;
  updateUser: (data: Partial<User>) => void;
  loading: boolean;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider = ({ children }: { children: ReactNode }) => {
  // Use lazy initialization to set initial state from localStorage on the client
  const [user, setUser] = useState<User | null>(() => {
    if (typeof window === 'undefined') return null;
    const storedUser = localStorage.getItem('user');
    try {
      return storedUser ? JSON.parse(storedUser) : null;
    } catch {
      return null;
    }
  });

  const [token, setToken] = useState<string | null>(() => {
    if (typeof window === 'undefined') return null;
    const storedToken = localStorage.getItem('token');
    if (!storedToken) return null;

    try {
      const decoded = jwtDecode<{ exp?: number }>(storedToken);
      const isExpired = decoded.exp && decoded.exp < Date.now() / 1000;
      return isExpired ? null : storedToken;
    } catch {
      return null;
    }
  });

  // The loading state is now only for the initial client-side check.
  const [loading, setLoading] = useState(true);

  /** 登出 */
  const logout = useCallback(() => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setToken(null);
    setUser(null);
  }, []);

  /** 登入 */
  const login = useCallback(
    (newToken: string) => {
      try {
        const decoded = jwtDecode<DecodedUser>(newToken);
        const userData: User = {
          userId: decoded.userId,
          name: decoded.name || '',
          email: decoded.email,
          avatar: decoded.avatar || '',
          provider: decoded.provider || 'local', // Store the provider
        };

        localStorage.setItem('token', newToken);
        localStorage.setItem('user', JSON.stringify(userData));
        setToken(newToken);
        setUser(userData);
      } catch (error) {
        console.error('登入時處理 token 失敗:', error);
        logout();
      }
    },
    [logout]
  );

  /** 更新使用者資料 */
  const updateUser = useCallback((data: Partial<User>) => {
    setUser((prev) => {
      if (!prev) return null;
      const updatedUser = { ...prev, ...data };
      localStorage.setItem('user', JSON.stringify(updatedUser));
      return updatedUser;
    });
  }, []);

  // This effect now only runs once on the client to set loading to false.
  useEffect(() => {
    setLoading(false);
  }, []);

  // Separate effect to handle logout when token becomes null
  useEffect(() => {
    if (token === null) {
      logout(); // Ensure localStorage is clean if token was found to be expired
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token]);

  return (
    <UserContext.Provider value={{ user, token, login, logout, updateUser, loading }}>
      {children}
    </UserContext.Provider>
  );
};

/** 自定義 Hook */
export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) throw new Error('useUser 必須在 UserProvider 內使用');
  return context;
};
