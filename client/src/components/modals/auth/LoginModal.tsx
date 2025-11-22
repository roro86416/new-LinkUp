'use client';
import { useModal } from '../../../context/auth/ModalContext';
import { useState } from 'react';
import Image from 'next/image';
import { GoogleLogin } from '@react-oauth/google';
import { apiClient } from '../../../api/auth/apiClient';
import { AiOutlineEye, AiOutlineEyeInvisible } from 'react-icons/ai';
import toast from 'react-hot-toast';

export default function LoginModal() {
  const { isLoginOpen, closeLogin, openRegister, openForgotPassword } = useModal();
  
  // 表單狀態
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  if (!isLoginOpen) return null;

  // --- 通用：處理登入成功後的邏輯 ---
  const handleLoginSuccess = (data: any) => {
    const token = data.token || data.data?.token;
    const user = data.user || data.data?.user;

    if (token) {
      // 1. 儲存 Token 與 User
      localStorage.setItem('token', token);
      if (user) localStorage.setItem('user', JSON.stringify(user));
      
      // 2. 寫入 Cookie (增加相容性)
      document.cookie = `token=${token}; path=/; max-age=604800; SameSite=Lax`;
      
      toast.success('登入成功！');
      closeLogin();

      // 3. 標準流程：重新整理頁面以更新狀態
      window.location.reload();
    } else {
      setMessage('登入失敗：無法取得憑證');
    }
  };

  // --- Google 登入 ---
  const handleGoogleSuccess = async (credentialResponse: any) => {
    try {
      const res = await apiClient.post('/api/auth/google', {
        credential: credentialResponse.credential
      });
      handleLoginSuccess(res);
    } catch (error) {
      console.error('Google Login Failed:', error);
      setMessage('Google 登入失敗，請稍後再試');
    }
  };

  // --- Email 登入 ---
  const handleEmailLogin = async () => {
    if (!email || !password) {
      setMessage('⚠️ 請輸入帳號與密碼');
      return;
    }
    setLoading(true);
    setMessage(null);

    try {
      const res = await apiClient.post('/api/auth/login', { email, password });
      handleLoginSuccess(res);
    } catch (err: any) {
      const errorMsg = err.response?.data?.error || err.message || '帳號或密碼錯誤';
      setMessage(`❌ ${errorMsg}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-[9999] p-4 animate-in fade-in duration-200">
      {/* 卡片容器：圓角、陰影、雙欄佈局 */}
      <div className="bg-white rounded-[32px] w-full max-w-4xl h-[600px] flex overflow-hidden shadow-2xl relative">
        
        {/* 關閉按鈕 */}
        <button 
          onClick={closeLogin} 
          className="absolute right-6 top-6 text-gray-400 hover:text-gray-800 z-10 p-2 rounded-full hover:bg-gray-100 transition-colors cursor-pointer"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
        </button>

        {/* 左側：太空主題視覺 (桌機版顯示) */}
        <div className="hidden md:flex w-1/2 bg-[#0C2838] relative flex-col justify-between p-12 text-white">
           {/* 背景圖 */}
           <div className="absolute inset-0 opacity-60">
             <Image 
               src="/slide3.jpg" 
               alt="Login Background" 
               fill 
               className="object-cover" 
               priority
             />
             <div className="absolute inset-0 bg-gradient-to-t from-[#0C2838] via-[#0C2838]/50 to-transparent"></div>
           </div>

           {/* Logo 與 Slogan */}
           <div className="relative z-10">
             <Image src="/logo/logoColor.png" alt="LinkUp" width={140} height={50} className="mb-6 brightness-0 invert" />
             <h2 className="text-3xl font-bold leading-tight tracking-wide">
               重返星際軌道<br />
               <span className="text-[#EF9D11]">連結無限精彩</span>
             </h2>
           </div>

           <div className="relative z-10">
             <p className="text-gray-300 text-sm leading-relaxed border-l-2 border-[#EF9D11] pl-4">
               您的探索日誌已準備就緒，<br/>歡迎回到 LinkUp 指揮中心。
             </p>
           </div>
        </div>

        {/* 右側：登入表單 (Google + Email) */}
        <div className="w-full md:w-1/2 flex flex-col justify-center items-center p-10 bg-white overflow-y-auto">
          <div className="w-full max-w-sm space-y-6">
            
            <div className="text-center">
              <h3 className="text-2xl font-bold text-gray-800">歡迎登艦</h3>
              <p className="text-gray-500 text-sm mt-2">請選擇登入方式以繼續旅程</p>
            </div>

            {/* Google Login 按鈕 */}
            <div className="flex justify-center w-full">
               <GoogleLogin
                 onSuccess={handleGoogleSuccess}
                 onError={() => setMessage('Google 登入服務暫時無法使用')}
                 width="320"
                 shape="pill"
                 theme="outline"
                 size="large"
                 text="continue_with"
               />
            </div>

            {/* 分隔線 */}
            <div className="relative flex py-1 items-center">
                <div className="flex-grow border-t border-gray-200"></div>
                <span className="flex-shrink-0 mx-4 text-gray-400 text-xs uppercase tracking-wider">或使用 Email</span>
                <div className="flex-grow border-t border-gray-200"></div>
            </div>

            {/* Email 表單 */}
            <div className="space-y-4">
              <input
                type="email"
                placeholder="電子信箱"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-5 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#EF9D11]/50 focus:border-[#EF9D11] transition-all text-gray-800 placeholder-gray-400"
              />
              
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  placeholder="密碼"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-5 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#EF9D11]/50 focus:border-[#EF9D11] transition-all text-gray-800 placeholder-gray-400"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 cursor-pointer"
                >
                  {showPassword ? <AiOutlineEyeInvisible size={20} /> : <AiOutlineEye size={20} />}
                </button>
              </div>

              <div className="flex justify-end">
                <button 
                  onClick={() => { closeLogin(); openForgotPassword(); }}
                  className="text-xs text-gray-500 hover:text-[#EF9D11] transition-colors"
                >
                  忘記通訊密碼？
                </button>
              </div>

              <button
                onClick={handleEmailLogin}
                disabled={loading}
                className="w-full py-3.5 rounded-xl bg-[#0C2838] hover:bg-[#1a3c50] text-white font-bold shadow-lg transition-all hover:-translate-y-0.5 disabled:opacity-70 disabled:cursor-not-allowed disabled:hover:translate-y-0 flex items-center justify-center gap-2"
              >
                {loading ? '驗證中...' : '立即登入'}
              </button>
            </div>

            {/* 錯誤訊息 */}
            {message && (
              <div className="p-3 rounded-lg text-sm text-center bg-red-50 text-red-500 animate-pulse">
                {message}
              </div>
            )}

            {/* 切換到註冊 */}
            <div className="pt-2 text-center">
              <p className="text-gray-500 text-sm">
                還沒有登機證？{' '}
                <button 
                  onClick={() => { closeLogin(); openRegister(); }}
                  className="text-[#EF9D11] font-bold hover:underline hover:text-[#d68b0e]"
                >
                  免費註冊
                </button>
              </p>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}