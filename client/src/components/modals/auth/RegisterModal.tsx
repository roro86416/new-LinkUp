'use client';
import { useModal } from '../../../context/auth/ModalContext';
import { useState } from 'react';
import Image from 'next/image';
import { AiOutlineEye, AiOutlineEyeInvisible } from 'react-icons/ai';
import { apiClient } from '../../../api/auth/apiClient';

export default function RegisterModal() {
  const { isRegisterOpen, closeRegister, openEmailLogin, openLogin } = useModal();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  if (!isRegisterOpen) return null;

  const handleRegister = async () => {
    if (!email || !password || !confirmPassword) {
      setMessage('⚠️ 請填寫完整資訊'); return;
    }
    if (password.length < 8) {
      setMessage('❌ 密碼長度至少需要 8 個字元'); return;
    }
    if (password !== confirmPassword) {
      setMessage('❌ 密碼與確認密碼不一致'); return;
    }

    setLoading(true);
    setMessage(null);

    try {
      // 使用 apiClient 或 fetch
      await apiClient.post('/api/auth/register', { email, password });
      
      setMessage('🎉 註冊成功！');
      setEmail(''); setPassword(''); setConfirmPassword('');

      setTimeout(() => {
        closeRegister();
        openEmailLogin();
      }, 1500);
    } catch (err: any) {
       setMessage(`❌ ${err.message || '註冊失敗'}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-[9999] p-4 animate-in fade-in duration-200">
      <div className="bg-white rounded-[32px] w-full max-w-4xl h-[600px] flex overflow-hidden shadow-2xl relative">
        
        {/* 關閉按鈕 */}
        <button 
          onClick={closeRegister} 
          className="absolute right-6 top-6 text-gray-400 hover:text-gray-800 z-10 p-2 rounded-full hover:bg-gray-100 transition-colors"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
        </button>

        {/* 左側：視覺主圖 (Register Style) */}
        <div className="hidden md:flex w-1/2 bg-orange-50 relative flex-col justify-between p-12 text-[#0C2838]">
           {/* 換一張比較明亮的圖，或是保持一致 */}
           <div className="absolute inset-0 opacity-90 mix-blend-multiply bg-[#EF9D11]"></div>
           <div className="absolute inset-0 opacity-30">
             <Image src="/tide3.jpg" alt="Register Background" fill className="object-cover grayscale" />
           </div>
           
           <div className="relative z-10">
             <h2 className="text-3xl font-bold leading-tight text-white tracking-wide">
               領取登機證<br />
               啟航探索娛樂宇宙
             </h2>
           </div>

           <div className="relative z-10 text-white/90">
             <p className="text-lg font-medium mb-2 flex items-center gap-2">
               <span className="bg-white/20 p-1 rounded">🚀</span> 加入 LinkUp 艦隊
             </p>
             <p className="text-sm opacity-80 leading-relaxed">
               全台最熱門的音樂祭、展覽與<br/>戶外活動座標，您的專屬票券管家已上線。
             </p>
           </div>
        </div>

        {/* 右側：註冊表單 */}
        <div className="w-full md:w-1/2 flex flex-col justify-center items-center p-10 bg-white">
          <div className="w-full max-w-sm space-y-6">
            
            <div className="text-center">
              <h3 className="text-2xl font-bold text-gray-800">建立新帳號</h3>
              <p className="text-gray-500 text-sm mt-1">填寫以下資訊加入我們</p>
            </div>

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
                  placeholder="設定密碼 (至少 8 碼)"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-5 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#EF9D11]/50 focus:border-[#EF9D11] transition-all text-gray-800 placeholder-gray-400"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? <AiOutlineEyeInvisible size={20} /> : <AiOutlineEye size={20} />}
                </button>
              </div>

              <input
                type={showPassword ? 'text' : 'password'}
                placeholder="再次確認密碼"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full px-5 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#EF9D11]/50 focus:border-[#EF9D11] transition-all text-gray-800 placeholder-gray-400"
              />
            </div>

            <button
              onClick={handleRegister}
              disabled={loading}
              className="w-full py-3.5 rounded-xl bg-[#EF9D11] hover:bg-[#d68b0e] text-white font-bold shadow-lg shadow-orange-200 transition-all hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0"
            >
              {loading ? '建立帳號中...' : '立即註冊'}
            </button>

            {message && (
              <div className={`p-3 rounded-lg text-sm text-center ${message.includes('成功') ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-500'}`}>
                {message}
              </div>
            )}

            <p className="text-center text-sm text-gray-500">
              已有帳號？{' '}
              <button
                onClick={() => { closeRegister(); openLogin(); }}
                className="text-[#EF9D11] font-semibold hover:underline"
              >
                直接登入
              </button>
            </p>

          </div>
        </div>
      </div>
    </div>
  );
}