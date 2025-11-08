'use client';
import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { jwtDecode } from 'jwt-decode'; // ✅ 正確的命名匯出方式

export interface User {
  name: string;
  avatar: string;
  email: string;
}

// 修正：移除索引簽名，避免 number | undefined 與 string | undefined 衝突
interface DecodedUser {
  userId: string;
  email: string;
  name?: string;
  avatar?: string;
  exp?: number;
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
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    try {
      const storedToken = localStorage.getItem('token');
      const storedUser = localStorage.getItem('user');

      if (storedToken) {
        const decoded = jwtDecode<DecodedUser & { exp?: number }>(storedToken);
        const currentTime = Date.now() / 1000;

        if (decoded.exp && decoded.exp < currentTime) {
          logout();
        } else {
          // 💡 修正：不再依賴 storedUser，直接從 token 解碼來恢復狀態
          const userData: User = {
            name: decoded.name || '',
            email: decoded.email,
            avatar: decoded.avatar || '',
          };
          setUser(userData);
          setToken(storedToken);
        }
      }
    } catch (error) {
      console.error('恢復登入狀態失敗:', error);
      localStorage.removeItem('token');
      localStorage.removeItem('user');
    } finally {
      setLoading(false);
    }
  }, []);

  const login = (newToken: string) => {
    try {
      const decoded = jwtDecode<DecodedUser>(newToken);
      const userData: User = {
        name: decoded.name || '',
        email: decoded.email,
        avatar: decoded.avatar || '',
      };
      localStorage.setItem('token', newToken);
      localStorage.setItem('user', JSON.stringify(userData));
      setToken(newToken);
      setUser(userData);
    } catch (error) {
      console.error('登入時處理 token 失敗:', error);
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setToken(null);
    setUser(null);
  };

  const updateUser = (data: Partial<User>) => {
    setUser(prev => {
      if (!prev) return null;
      const updatedUser = { ...prev, ...data };
      localStorage.setItem('user', JSON.stringify(updatedUser));
      return updatedUser;
    });
  };

  return (
    <UserContext.Provider value={{ user, token, login, logout, updateUser, loading }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) throw new Error('useUser 必須在 UserProvider 內使用');
  return context;
};
