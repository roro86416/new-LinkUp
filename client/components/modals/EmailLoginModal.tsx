'use client';

import { useModal } from '../../context/ModalContext';
import { useState } from 'react';
import Image from 'next/image';
import { AiOutlineEye, AiOutlineEyeInvisible } from 'react-icons/ai';

export default function EmailLoginModal() {
  const {
    isEmailLoginOpen,
    closeEmailLogin,
    openRegister,
    openForgotPassword,
  } = useModal();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');

  if (!isEmailLoginOpen) return null;

  const handleOpenRegister = () => {
    closeEmailLogin();
    openRegister();
  };

  const handleOpenForgotPassword = () => {
    closeEmailLogin();
    openForgotPassword();
  };

  // 🔹 API 呼叫
  const handleLogin = async () => {
    setError('');
    try {
      const res = await fetch('http://localhost:4000/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok) throw new Error(data.message || '登入失敗');

      console.log('登入成功', data.user);

      // ✅ 存入 localStorage 或 Context
      localStorage.setItem('user', JSON.stringify(data.user));

      // ✅ 關閉 Modal
      closeEmailLogin();
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError(String(err));
      }
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
            className="w-full bg-[#658AD0] text-white py-2 rounded-lg hover:bg-[#4f6eb1] transition-colors cursor-pointer"
            onClick={handleLogin}
          >
            登入
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
