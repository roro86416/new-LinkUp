'use client';
import { useModal } from '../../../context/auth/ModalContext';
import { useUser } from '../../../context/auth/UserContext';
import { useState } from 'react';
import Image from 'next/image';
import { AiOutlineEye, AiOutlineEyeInvisible } from 'react-icons/ai';
import { useRouter } from 'next/navigation';

export default function AdminLoginModal() {
  const { isAdminLoginOpen, closeAdminLogin } = useModal();
  const { login } = useUser();
  const router = useRouter();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  if (!isAdminLoginOpen) return null;

  const handleLogin = async () => {
    if (!email || !password) {
      setError('⚠️ 請填寫 Email 和密碼');
      return;
    }

    setLoading(true);
    setError('');

    try {
      // 1. 呼叫後台登入 API
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/admin/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || '登入失敗，請檢查您的帳號密碼');
      }

      // 2. 登入成功，儲存 token
      if (data.token) {
        // ⚠️ 注意：後台登入的 token 建議使用不同的名稱儲存
        localStorage.setItem('admin_token', data.token);
        // 這裡我們暫時不呼叫 useUser 的 login，因為它主要用於前台使用者
        // 您可以擴充 UserContext 來同時管理 admin 狀態
      } else {
        throw new Error('登入成功，但未收到 Token');
      }

      // 3. 關閉視窗並導向後台
      closeAdminLogin();
      router.push('/admin');

    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(`❌ ${err.message}`);
      } else {
        setError('發生未知錯誤');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    // ⭐️ 修改：
    // 1. 將 bg-black/60 改為 bg-black，讓背景完全變黑。
    // 2. 移除 items-center 和 justify-center，因為我們希望背景填滿整個畫面，
    //    而 Modal 本身會透過下方的 div 自己置中。
    <div className="fixed inset-0 bg-black z-50">
      <div className="bg-gray-800 text-white rounded-2xl p-8 w-[400px] relative shadow-lg">
        <button
          onClick={closeAdminLogin}
          className="absolute right-4 top-4 text-gray-400 hover:text-white text-xl cursor-pointer"
        >
          ×
        </button>

        <div className="flex flex-col items-center mb-6">
          <Image src="/logo/logoBlack.png" alt="LOGO" width={130} height={45} className="invert brightness-200" />
          <h2 className="text-2xl font-bold mt-4">後台管理登入</h2>
        </div>

        <div className="flex flex-col gap-4">
          <input
            type="email"
            placeholder="管理者 Email"
            className="w-full px-4 py-2 border bg-gray-700 border-gray-600 rounded-lg placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <div className="relative w-full">
            <input
              type={showPassword ? 'text' : 'password'}
              placeholder="密碼"
              className="w-full px-4 py-2 border bg-gray-700 border-gray-600 rounded-lg placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white"
            >
              {showPassword ? <AiOutlineEye size={20} /> : <AiOutlineEyeInvisible size={20} />}
            </button>
          </div>

          {error && <p className="text-red-400 text-sm">{error}</p>}

          <button
            className={`w-full py-2.5 mt-2 rounded-lg text-white font-semibold transition-colors cursor-pointer ${loading ? 'bg-gray-500' : 'bg-indigo-600 hover:bg-indigo-700'
              }`}
            onClick={handleLogin}
            disabled={loading}
          >
            {loading ? '登入中...' : '登入'}
          </button>
        </div>
      </div>
    </div>
  );
}