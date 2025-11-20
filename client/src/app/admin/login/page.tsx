//系統管理員登入頁面

'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAdminUser } from '../../../context/auth/AdminUserContext'; // 引入 useAdminUser
import Image from 'next/image';
import { ArrowRightOnRectangleIcon, EnvelopeIcon, LockClosedIcon, EyeIcon, EyeSlashIcon } from '@heroicons/react/24/solid'; // 引入眼睛圖示

export default function AdminLoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(''); // ⭐️ 保持 error 狀態
  const [loading, setLoading] = useState(false); // ⭐️ 新增 loading 狀態
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false); // ⭐️ 新增密碼可見性狀態
  const { login } = useAdminUser(); // ⭐️ 從 Context 取得 login 函式

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    // 模擬 API 呼叫
    try {
      // 這裡替換成你真實的 API 呼叫
      const response = await fetch('http://localhost:3001/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || '登入失敗');
      login(data.token); // ⭐️ 使用 Context 的 login 函式
      // 登入成功後，layout 會自動處理跳轉
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message || '帳號或密碼錯誤');
      } else {
        setError(String(err) || '帳號或密碼錯誤');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen flex-col justify-center items-center bg-gray-800 px-6 py-12 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-sm">
        <Image
          src="/logo/logoBlack.png"
          alt="LOGO"
          width={150}
          height={50}
          className="invert brightness-200 mx-auto"
          style={{ width: 'auto' }}
        />
        <h2 className="mt-10 text-center text-2xl font-bold leading-9 tracking-tight text-white">
          系統管理員登入
        </h2>
      </div>

      <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
        <form className="space-y-6" onSubmit={handleLogin}>
          <div>
            <label htmlFor="email" className="block text-sm font-medium leading-6 text-gray-300">
              電子郵件
            </label>
            <div className="relative mt-2">
              <EnvelopeIcon className="pointer-events-none absolute left-3 top-1/2 h-5 w-5 text-gray-400 transform -translate-y-1/2" />
              <input
                id="email"
                name="email"
                type="email" // 保持 email 類型
                autoComplete="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="block w-full rounded-md border-0 bg-white/5 py-2 pl-10 pr-3 text-white shadow-sm ring-1 ring-inset ring-white/10 focus:ring-2 focus:ring-inset focus:ring-orange-500 focus:bg-white focus:text-gray-900 sm:text-sm sm:leading-6"
              />
            </div>
          </div> {/* ⭐️ Email input 結束 */}

          <div>
            <label htmlFor="password" className="block text-sm font-medium leading-6 text-gray-300">
              密碼
            </label>
            <div className="relative mt-2">
              <LockClosedIcon className="pointer-events-none absolute left-3 top-1/2 h-5 w-5 text-gray-400 transform -translate-y-1/2" />
              <input
                id="password"
                name="password"
                type={showPassword ? 'text' : 'password'} // ⭐️ 根據狀態切換類型
                autoComplete="current-password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="block w-full rounded-md border-0 bg-white/5 py-2 pl-10 pr-10 text-white shadow-sm ring-1 ring-inset ring-white/10 focus:ring-2 focus:ring-inset focus:ring-orange-500 focus:bg-white focus:text-gray-900 sm:text-sm sm:leading-6" // 
              />
              <button
                type="button" // ⭐️ 避免觸發表單提交
                onClick={() => setShowPassword(!showPassword)} // ⭐️ 切換密碼可見性
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-300 focus:outline-none"
              >
                {showPassword ? <EyeIcon className="h-5 w-5" /> : <EyeSlashIcon className="h-5 w-5" />} {/* ⭐️ 根據狀態顯示不同圖示 */}
              </button>
            </div>
          </div>

          {error && <p className="text-sm text-red-400 text-center">{error}</p>}

          <div>
            <button
              disabled={loading}
              type="submit"
              className="flex w-full justify-center items-center gap-2 rounded-md bg-orange-600 px-3 py-2 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-orange-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-orange-600 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
            >
              <ArrowRightOnRectangleIcon className="h-5 w-5" />
              {loading ? '登入中...' : '登入'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}