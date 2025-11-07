'use client';

import { useModal } from '../../context/ModalContext';
import { useUser } from '../../context/UserContext';
import { useState } from 'react';
import Image from 'next/image';
import { AiOutlineEye, AiOutlineEyeInvisible } from 'react-icons/ai';

export default function EmailLoginModal() {
  const { isEmailLoginOpen, closeEmailLogin, openRegister, openForgotPassword } = useModal();
  const { login } = useUser();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  if (!isEmailLoginOpen) return null;

  const handleOpenRegister = () => {
    closeEmailLogin();
    openRegister();
  };

  const handleOpenForgotPassword = () => {
    closeEmailLogin();
    openForgotPassword();
  };

  const handleLogin = async () => {
    if (!email || !password) {
      setError('⚠️ 請填寫完整資訊');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const res = await fetch('http://localhost:3001/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok) throw new Error(data.message || '登入失敗');

      // 登入成功後
      login({
        name: data.user.name,
        avatar: data.user.avatar,
        email: data.user.email,
      });

      // 存 localStorage
      if (data.token) localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));

      closeEmailLogin();
    } catch (err: unknown) {
      if (err instanceof Error) setError(err.message);
      else setError('發生未知錯誤');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl p-8 w-[400px] relative shadow-lg">
        <button
          onClick={closeEmailLogin}
          className="absolute right-4 top-4 text-gray-400 hover:text-black text-xl cursor-pointer"
        >
          ×
        </button>

        <div className="flex flex-col items-center mb-6">
          <Image src="/logo/logoColor.png" alt="LOGO" width={130} height={45} />
          <h2 className="text-2xl font-bold text-gray-800 mt-4">登入</h2>
        </div>

        <div className="flex flex-col gap-4">
          <input
            type="email"
            placeholder="電子郵件"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg text-gray-800 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#658AD0]"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <div className="relative w-full">
            <input
              type={showPassword ? 'text' : 'password'}
              placeholder="密碼"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg text-gray-800 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#658AD0]"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-800"
            >
              {showPassword ? <AiOutlineEye size={20} /> : <AiOutlineEyeInvisible size={20} />}
            </button>
          </div>

          {error && <p className="text-red-500 text-sm">{error}</p>}

          <div
            className="text-right text-sm text-gray-500 hover:text-[#658AD0] cursor-pointer"
            onClick={handleOpenForgotPassword}
          >
            忘記密碼？
          </div>

          <button
            className={`w-full py-2 rounded-lg text-white transition-colors cursor-pointer ${loading ? 'bg-gray-300' : 'bg-[#658AD0] hover:bg-[#4f6eb1]'}`}
            onClick={handleLogin}
            disabled={loading}
          >
            {loading ? '登入中...' : '登入'}
          </button>
        </div>

        <p className="text-center text-sm text-gray-700 mt-4">
          還未加入 LINKUP？{' '}
          <span
            onClick={handleOpenRegister}
            className="text-[#EF9D11] hover:underline cursor-pointer"
          >
            立即註冊！
          </span>
        </p>
      </div>
    </div>
  );
}
