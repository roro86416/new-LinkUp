'use client';
import { useModal } from '../../../context/auth/ModalContext';
import { useState } from 'react';
import Image from 'next/image';
import { AiOutlineEye, AiOutlineEyeInvisible } from 'react-icons/ai';

interface RegisterResult {
  message: string;
  userId?: number;
  token?: string;
}

async function registerUser(email: string, password: string): Promise<RegisterResult> {
  const res = await fetch('http://localhost:3001/api/auth/register', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  });

  const result = await res.json();

  if (!res.ok) {
    throw new Error(result.message || result.error || '註冊失敗');
  }

  return result;
}

export default function RegisterModal() {
  const { isRegisterOpen, closeRegister, openEmailLogin } = useModal();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState(''); // 🔥 新增
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  if (!isRegisterOpen) return null;

  const handleRegister = async () => {
    if (!email || !password || !confirmPassword) {
      setMessage('⚠️ 請填寫完整資訊');
      return;
    }

    if (password.length < 8) {
      setMessage('❌ 密碼長度至少需要 8 個字元');
      return;
    }

    // 🔥 新增：確認密碼匹配
    if (password !== confirmPassword) {
      setMessage('❌ 密碼與確認密碼不一致');
      return;
    }

    setLoading(true);
    setMessage(null);

    try {
      const result = await registerUser(email, password);
      console.log('✅ 註冊成功:', result);

      setMessage('🎉 註冊成功！');
      setEmail('');
      setPassword('');
      setConfirmPassword(''); // 清空

      if (result.token) localStorage.setItem('token', result.token);

      setTimeout(() => {
        closeRegister();
        openEmailLogin();
      }, 1500);
    } catch (err: unknown) {
      if (err instanceof Error) {
        try {
          const errors = JSON.parse(err.message);
          if (Array.isArray(errors) && errors.length > 0) {
            setMessage(`❌ ${errors[0].message}`);
          }
        } catch {
          setMessage(`❌ ${err.message}`);
        }
      } else {
        setMessage('❌ 發生未知錯誤');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl p-8 w-[400px] relative shadow-lg">
        <button
          onClick={closeRegister}
          className="absolute right-4 top-4 text-gray-400 hover:text-black text-xl cursor-pointer"
        >
          ×
        </button>

        <div className="flex flex-col items-center mb-6">
          <Image src="/logo/logoColor.png" alt="LOGO" width={130} height={45} />
          <h2 className="text-2xl font-bold text-gray-800 text-center mt-4 mb-4">免費註冊</h2>
        </div>

        <input
          type="email"
          placeholder="電子郵件"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full mb-3 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#EF9D11] focus:bg-white focus:text-gray-900 text-gray-800 placeholder-gray-500"
        />

        <div className="relative w-full mb-3">
          <input
            type={showPassword ? 'text' : 'password'}
            placeholder="密碼 (至少 8 碼)"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none text-gray-800 placeholder-gray-500 focus:ring-2 focus:ring-[#EF9D11]"
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-800"
          >
            {showPassword ? <AiOutlineEye size={20} /> : <AiOutlineEyeInvisible size={20} />}
          </button>
        </div>
        <div className="relative w-full mb-3">
          <input
            type={showPassword ? 'text' : 'password'}
            placeholder="確認密碼"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none text-gray-800 placeholder-gray-500 focus:ring-2 focus:ring-[#EF9D11]"
          />
        </div>

        <button
          onClick={handleRegister}
          disabled={loading}
          className="w-full py-2 rounded-lg transition-colors cursor-pointer bg-[#EF9D11] hover:bg-[#d9890e] text-white disabled:bg-gray-300 disabled:text-gray-600 disabled:cursor-not-allowed mb-4"
        >
          {loading ? '註冊中...' : '註冊'}
        </button>

        {message && (
          <p className="text-center text-sm mt-3 text-gray-700 whitespace-pre-wrap">{message}</p>
        )}

        <p className="text-center text-sm text-gray-700 mt-4">
          已成為會員？{' '}
          <span
            onClick={() => {
              closeRegister();
              openEmailLogin();
            }}
            className="text-[#658AD0] hover:underline cursor-pointer"
          >
            立即登入！
          </span>
        </p>
      </div>
    </div>
  );
}
