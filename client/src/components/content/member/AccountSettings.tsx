// new-LinkUp/client/src/components/content/member/AccountSettings.tsx
'use client';

import { useState, useEffect, ChangeEvent, useMemo, useCallback } from "react";
import { EnvelopeIcon, XCircleIcon, EyeIcon, EyeSlashIcon, CheckCircleIcon } from '@heroicons/react/24/outline';
import { useRouter } from 'next/navigation';
import { useUser } from "../../../context/auth/UserContext";
import { useFavorites } from "./FavoritesContext"; 
import { apiClient } from "../../../api/auth/apiClient";
import toast from 'react-hot-toast';

type TabType = "基本資料" | "帳號安全" | "登入方式";

interface FormData {
  lastName: string;
  firstName: string;
  birthDate: string;
  country: string;
  phoneCode: string;
  phoneNumber: string;
  email: string;
}

interface PasswordData {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

interface PasswordErrors {
  currentPassword?: string;
  newPassword?: string;
  confirmPassword?: string;
}

// 定義從 API 獲取的使用者資料結構
interface UserProfile {
  id: string;
  name: string;
  email: string;
  avatar?: string | null;
  phone_number?: string | null;
  birth_date?: string | null;
  address?: string | null;
}

// --- 樣式定義 (深色玻璃風格) ---
const inputFieldClasses = "w-full rounded-xl border border-white/20 bg-white/5 text-white px-4 py-3 outline-none focus:border-[#EF9D11] focus:ring-1 focus:ring-[#EF9D11] transition-all placeholder-gray-500 disabled:opacity-50 disabled:cursor-not-allowed";
const labelClasses = "block text-sm font-medium text-gray-300 mb-2";
const cardClasses = "p-6 rounded-2xl border border-white/10 bg-white/5 backdrop-blur-sm shadow-lg";

export default function AccountSettings() {
  const router = useRouter();
  const { user, logout, updateUser } = useUser();
  const { clearAllFavorites } = useFavorites();

  const [activeTab, setActiveTab] = useState<TabType>("基本資料");
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState<FormData>({
    lastName: "",
    firstName: "",
    birthDate: "",
    country: "",
    phoneCode: "+886",
    phoneNumber: "",
    email: "",
  });
  const [initialFormData, setInitialFormData] = useState<FormData | null>(null);
  const [authError, setAuthError] = useState<string | null>(null);
  const [isVerified, setIsVerified] = useState(true); // 模擬已驗證

  // 帳號安全 Tab 狀態
  const [passwordData, setPasswordData] = useState<PasswordData>({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  const [passwordErrors, setPasswordErrors] = useState<PasswordErrors>({});
  const [showPasswords, setShowPasswords] = useState({ current: false, new: false, confirm: false });

  // 登入方式 Tab 狀態
  const [providerStatus, setProviderStatus] = useState({
    Facebook: true, 
    Google: false,  
  });

  const isDirty = useMemo(() => {
    if (!initialFormData) return false;
    return (
      formData.firstName !== initialFormData.firstName ||
      formData.lastName !== initialFormData.lastName ||
      formData.birthDate !== initialFormData.birthDate ||
      formData.country !== initialFormData.country ||
      formData.phoneCode !== initialFormData.phoneCode ||
      formData.phoneNumber !== initialFormData.phoneNumber
    );
  }, [formData, initialFormData]);

  const isPasswordFormValid = useMemo(() => {
    return (
      passwordData.currentPassword.trim() !== '' &&
      passwordData.newPassword.trim() !== '' &&
      passwordData.newPassword.trim().length >= 8 &&
      passwordData.confirmPassword.trim() !== '' && 
      passwordData.newPassword === passwordData.confirmPassword
    );
  }, [passwordData]);

  useEffect(() => {
    const fetchProfile = async () => {
      const token = localStorage.getItem('token');
      if (!user || !token) {
        logout(); 
        router.push('/');
        return; 
      }
      try {
        const data = await apiClient.get<UserProfile>('/api/member/profile');

        if (!data) {
          throw new Error("無法取得會員資料");
        }

        // 簡單拆分姓名
        const lastName = data.name ? data.name.substring(0, 1) : "";
        const firstName = data.name ? data.name.substring(1) : "";
        
        // 拆分電話
        const phoneCode = data.phone_number ? data.phone_number.split(' ')[0] : "+886";
        const phoneNumber = data.phone_number ? data.phone_number.split(' ')[1] || "" : "";

        const fetchedData = {
          lastName: lastName,
          firstName: firstName,
          birthDate: data.birth_date ? new Date(data.birth_date).toISOString().split('T')[0] : "",
          country: data.address || "",
          phoneCode: phoneCode,
          phoneNumber: phoneNumber,
          email: data.email || "",
        };

        setFormData(fetchedData);
        setInitialFormData(fetchedData);

      } catch (err: any) {
        console.error("抓取資料錯誤:", err);
        if (err.message?.includes('登入已過期')) {
          logout();
          router.push('/');
        } else {
          toast.error(err.message || "載入失敗");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [router, logout, user]);

  const updateField = (field: keyof FormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSave = async () => {
    try {
      const fullName = `${formData.lastName}${formData.firstName}`;
      const fullPhoneNumber = `${formData.phoneCode} ${formData.phoneNumber}`;

      const payload = {
        name: fullName,
        phone_number: fullPhoneNumber,
        birth_date: formData.birthDate ? new Date(formData.birthDate).toISOString() : null,
        address: formData.country,
      };

      await apiClient.put('/api/member/profile', payload);

      toast.success('資料更新成功！');
      setInitialFormData(formData);
      if (user && user.name !== fullName) {
        updateUser({ name: fullName });
      }

    } catch (err: any) {
        toast.error(err.message || '儲存時發生錯誤');
    }
  };

  const validatePasswordField = (name: keyof PasswordData, value: string) => {
    let error = '';
    if (!value.trim()) {
      error = '此欄位為必填';
    } else if (name === 'newPassword' && value.trim().length < 8) {
      error = '密碼長度至少需要 8 個字元';
    } else if (name === 'confirmPassword' && passwordData.newPassword && value !== passwordData.newPassword) {
      error = '新密碼與確認密碼不相符';
    }
    setPasswordErrors(prev => ({ ...prev, [name]: error }));
  };

  const handleChangePassword = async () => {
    const errors: PasswordErrors = {};
    if (!passwordData.currentPassword.trim()) errors.currentPassword = '此欄位為必填';
    if (!passwordData.newPassword.trim()) errors.newPassword = '此欄位為必填';
    if (!passwordData.confirmPassword.trim()) errors.confirmPassword = '此欄位為必填';

    if (Object.keys(errors).length > 0) {
      setPasswordErrors(errors);
      return;
    }

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      toast.error('新密碼與確認密碼不相符');
      return;
    }

    try {
      // 呼叫後端 API 修改密碼
      const response = await apiClient.post<{ message: string }>(
        '/api/member/account-settings/change-password',
        passwordData
      );
      toast.success(response.message || '密碼已成功更新！');
      setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
    } catch (err: any) {
      toast.error(err.message || '密碼修改失敗');
    }
  };

  const handleResendVerification = () => {
    toast.success('驗證信已重新發送！');
  };

  // 刪除帳號 (邏輯保留，樣式更新)
  const handleDeleteAccount = async () => {
    if (window.confirm(`您確定要永久刪除帳號 ${user?.email} 嗎？此操作無法復原。`)) {
      try {
        // 後端通常會將 is_active 設為 false
        await apiClient.delete('/api/member/profile');
        toast.success('您的帳號已成功刪除。');
        logout();
        router.push('/');
      } catch (err: any) {
        toast.error(err.message || '刪除帳號時發生錯誤');
      }
    }
  };

  const handleClearFavorites = () => {
    if (window.confirm('您確定要清除所有收藏的活動嗎？此操作無法復原。')) {
      clearAllFavorites();
      toast.success('已清除所有收藏的活動。');
    }
  };

  const handleBind = (provider: keyof typeof providerStatus, isCurrentlyBound: boolean) => {
    setProviderStatus(prev => ({ ...prev, [provider]: !isCurrentlyBound }));
    toast.success(`${provider} 已${isCurrentlyBound ? '解除' : ''}綁定！`);
  };

  const handleSelectChange = useCallback((field: keyof FormData) => (e: ChangeEvent<HTMLSelectElement>) => {
    updateField(field, e.target.value);
  }, []);

  if (authError) {
    return (
      <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-lg text-red-400 flex items-center gap-2">
        <XCircleIcon className="h-5 w-5" />
        <p>{authError}</p>
      </div>
    );
  }

  if (loading) return <div className="text-white text-center py-20">載入中...</div>;

  return (
    <div className="w-full mx-auto animate-in fade-in slide-in-from-bottom-4 duration-500">
      <h2 className="text-2xl font-extrabold text-white mb-2">帳號設定</h2>
      <p className="text-gray-400 mb-8">
        管理您的個人資訊、保障帳號安全，並設定或解除綁定常用的登入方式。
      </p>

      {/* Tabs */}
      <div className="flex border-b border-white/10 mb-8">
        {["基本資料", "帳號安全", "登入方式"].map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab as TabType)}
            className={`py-3 px-5 text-base font-semibold transition duration-200 border-b-2 -mb-px
              ${activeTab === tab ?
                "text-[#EF9D11] border-[#EF9D11]" :
                "text-gray-400 border-transparent hover:text-white hover:border-white/30"
              }`}
          >
            {tab}
          </button>
        ))}
      </div>

      <div className="w-full">
        {/* ================= 基本資料 ================= */}
        {activeTab === "基本資料" && (
          <div className="space-y-8">
            <div className={cardClasses}>
                <h3 className="text-lg font-bold text-white mb-6 border-b border-white/10 pb-2">個人資訊</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                    <label className={labelClasses}>姓 *</label>
                    <input type="text" className={inputFieldClasses} value={formData.lastName} onChange={(e) => updateField("lastName", e.target.value)} />
                </div>
                <div>
                    <label className={labelClasses}>名 *</label>
                    <input type="text" className={inputFieldClasses} value={formData.firstName} onChange={(e) => updateField("firstName", e.target.value)} />
                </div>
                <div>
                    <label className={labelClasses}>出生日期</label>
                    <input type="date" className={inputFieldClasses} value={formData.birthDate} onChange={e => updateField("birthDate", e.target.value)} />
                </div>
                <div>
                    <label className={labelClasses}>國家/地區</label>
                    <select className={inputFieldClasses} value={formData.country} onChange={handleSelectChange("country")}>
                        <option value="" disabled className="text-black">請選擇</option>
                        <option value="台灣" className="text-black">台灣</option>
                        <option value="中國" className="text-black">中國</option>
                        <option value="日本" className="text-black">日本</option>
                        <option value="韓國" className="text-black">韓國</option>
                        <option value="美國" className="text-black">美國</option>
                        <option value="其他" className="text-black">其他</option>
                    </select>
                </div>
                </div>
            </div>

            <div className={cardClasses}>
                <h3 className="text-lg font-bold text-white mb-6 border-b border-white/10 pb-2">聯絡資訊</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="flex gap-3">
                        <div className="w-32">
                            <label className={labelClasses}>國碼</label>
                            <select className={inputFieldClasses} value={formData.phoneCode} onChange={handleSelectChange("phoneCode")}>
                                <option className="text-black" value="+886">+886</option>
                                <option className="text-black" value="+86">+86</option>
                                <option className="text-black" value="+1">+1</option>
                            </select>
                        </div>
                        <div className="flex-1">
                            <label className={labelClasses}>電話號碼</label>
                            <input type="text" className={inputFieldClasses} value={formData.phoneNumber} onChange={(e) => updateField("phoneNumber", e.target.value)} />
                        </div>
                    </div>
                    <div>
                        <label className={labelClasses}>Email (不可修改)</label>
                        <input type="email" className={inputFieldClasses} value={formData.email} disabled />
                    </div>
                </div>
            </div>

            <div className="flex justify-end">
              <button
                type="button"
                onClick={handleSave}
                disabled={!isDirty}
                className={`px-8 py-3 rounded-xl text-white font-bold shadow-lg transition transform active:scale-95 ${isDirty
                  ? 'bg-[#EF9D11] hover:bg-[#d9890e] shadow-orange-500/20'
                  : 'bg-gray-600 cursor-not-allowed opacity-50'
                  }`}
              >
                儲存變更
              </button>
            </div>
          </div>
        )}

        {/* ================= 帳號安全 ================= */}
        {activeTab === "帳號安全" && (
          <div className="space-y-6">
            {/* 修改密碼 */}
            <div className={cardClasses}>
                <h4 className="text-lg font-bold text-white mb-6 flex items-center gap-2">
                    <span className="w-1 h-5 bg-[#EF9D11] rounded-full"></span> 更改密碼
                </h4>
                <form className="space-y-5 max-w-md">
                  {/* 原密碼 */}
                  <div className="relative">
                    <label className={labelClasses}>原密碼 <span className="text-red-500">*</span></label>
                    <div className="relative">
                        <input 
                            type={showPasswords.current ? 'text' : 'password'}
                            placeholder="請輸入您的原密碼"
                            value={passwordData.currentPassword}
                            onChange={e => setPasswordData(p => ({ ...p, currentPassword: e.target.value }))}
                            className={`${inputFieldClasses} pr-10 ${passwordErrors.currentPassword ? 'border-red-500' : ''}`} 
                        />
                        {/* 修正：眼睛按鈕垂直置中 */}
                        <button type="button" onClick={() => setShowPasswords(s => ({ ...s, current: !s.current }))}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white transition-colors">
                            {showPasswords.current ? <EyeSlashIcon className="h-5 w-5" /> : <EyeIcon className="h-5 w-5" />}
                        </button>
                    </div>
                    {passwordErrors.currentPassword && <p className="text-xs text-red-500 mt-1">{passwordErrors.currentPassword}</p>}
                  </div>

                  {/* 新密碼 */}
                  <div className="relative">
                    <label className={labelClasses}>新密碼 <span className="text-red-500">*</span></label>
                    <div className="relative">
                        <input 
                            type={showPasswords.new ? 'text' : 'password'}
                            placeholder="至少 8 個字元"
                            value={passwordData.newPassword}
                            onChange={e => setPasswordData(p => ({ ...p, newPassword: e.target.value }))}
                            className={`${inputFieldClasses} pr-10 ${passwordErrors.newPassword ? 'border-red-500' : ''}`} 
                        />
                        <button type="button" onClick={() => setShowPasswords(s => ({ ...s, new: !s.new }))}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white transition-colors">
                            {showPasswords.new ? <EyeSlashIcon className="h-5 w-5" /> : <EyeIcon className="h-5 w-5" />}
                        </button>
                    </div>
                    {passwordErrors.newPassword && <p className="text-xs text-red-500 mt-1">{passwordErrors.newPassword}</p>}
                  </div>

                  {/* 確認密碼 */}
                  <div className="relative">
                    <label className={labelClasses}>再次確認新密碼 <span className="text-red-500">*</span></label>
                    <div className="relative">
                        <input 
                            type={showPasswords.confirm ? 'text' : 'password'}
                            placeholder="再次確認新密碼"
                            value={passwordData.confirmPassword}
                            onChange={e => setPasswordData(p => ({ ...p, confirmPassword: e.target.value }))}
                            className={`${inputFieldClasses} pr-10 ${passwordErrors.confirmPassword ? 'border-red-500' : ''}`} 
                        />
                        <button type="button" onClick={() => setShowPasswords(s => ({ ...s, confirm: !s.confirm }))}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white transition-colors">
                            {showPasswords.confirm ? <EyeSlashIcon className="h-5 w-5" /> : <EyeIcon className="h-5 w-5" />}
                        </button>
                    </div>
                    {passwordErrors.confirmPassword && <p className="text-xs text-red-500 mt-1">{passwordErrors.confirmPassword}</p>}
                  </div>

                  <div className="pt-2">
                    <button type="button" onClick={handleChangePassword}
                      disabled={!isPasswordFormValid}
                      className={`w-full py-3 rounded-xl font-bold transition shadow-lg ${isPasswordFormValid
                        ? 'bg-[#EF9D11] text-white hover:bg-[#d9890e]'
                        : 'bg-white/10 text-white/30 cursor-not-allowed'
                        }`}>
                      更新密碼
                    </button>
                  </div>
                </form>
            </div>

            {/* 驗證信箱 */}
            <div className={`${cardClasses} flex flex-col md:flex-row justify-between items-center gap-4`}>
                  <div>
                      <h4 className="text-lg font-bold text-white">信箱驗證</h4>
                      <p className="text-sm text-gray-400">{user?.email}</p>
                  </div>
                  {isVerified ? (
                      <span className="px-4 py-1.5 bg-green-500/20 text-green-400 text-sm font-bold rounded-full border border-green-500/30 flex items-center gap-1">
                          <CheckCircleIcon className="w-4 h-4" /> 已驗證
                      </span>
                  ) : (
                      <button onClick={handleResendVerification} className="text-sm text-[#EF9D11] border border-[#EF9D11] px-4 py-2 rounded-lg hover:bg-[#EF9D11] hover:text-white transition">
                          發送驗證信
                      </button>
                  )}
            </div>
              
            {/* 危險區域 */}
            <div className="p-6 rounded-2xl border border-red-500/30 bg-red-500/5 flex flex-col md:flex-row justify-between items-center gap-4">
                  <div>
                      <h4 className="text-lg font-bold text-red-400">危險區域</h4>
                      <p className="text-sm text-gray-400">刪除帳號後將無法復原所有資料。</p>
                  </div>
                  <div className="flex gap-3">
                      <button onClick={handleClearFavorites} className="text-red-400 hover:text-white hover:bg-red-500/20 px-4 py-2 rounded-lg transition text-sm border border-red-500/30">
                          清除收藏
                      </button>
                      <button onClick={handleDeleteAccount} className="bg-red-600 text-white hover:bg-red-700 px-6 py-2 rounded-lg transition text-sm font-bold shadow-lg shadow-red-900/20">
                          刪除帳號
                      </button>
                  </div>
            </div>
          </div>
        )}

        {/* ================= 登入方式 ================= */}
        {activeTab === "登入方式" && (
          <div className={cardClasses}>
                <h4 className="text-lg font-bold text-white mb-6">已綁定帳號</h4>
                <div className="space-y-4 max-w-xl">
                    {/* Email (固定) */}
                    <div className="flex items-center justify-between p-4 rounded-xl bg-white/5 border border-white/10">
                        <div className="flex items-center gap-4">
                            <div className="w-10 h-10 rounded-full bg-orange-500/20 flex items-center justify-center text-orange-500">
                                <EnvelopeIcon className="w-6 h-6" />
                            </div>
                            <div>
                                <p className="text-sm text-gray-400">電子郵件 (主要登入)</p>
                                <p className="font-bold text-white">{user?.email}</p>
                            </div>
                        </div>
                    </div>

                    {/* 第三方綁定 */}
                    {Object.entries(providerStatus).map(([name, isBound]) => {
                        const isFacebook = name === 'Facebook';
                        const logoContent = isFacebook
                        ? <img src="/login-icon/facebook.png" alt="FB" className="w-6 h-6" />
                        : <img src="/login-icon/google.png" alt="Google" className="w-6 h-6" />;

                        return (
                        <div key={name} className="flex items-center justify-between p-4 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 transition">
                            <div className="flex items-center gap-4">
                                <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center shadow-sm">
                                    {logoContent}
                                </div>
                                <span className="text-white font-bold">{name}</span>
                            </div>
                            <button 
                                onClick={() => handleBind(name as keyof typeof providerStatus, isBound)} 
                                className={`px-4 py-1.5 rounded-lg text-sm font-bold border transition 
                                    ${isBound 
                                        ? 'border-red-500/50 text-red-400 hover:bg-red-500/20' 
                                        : 'border-[#EF9D11] text-[#EF9D11] hover:bg-[#EF9D11] hover:text-white'
                                    }`}
                            >
                                {isBound ? '解除綁定' : '連結帳號'}
                            </button>
                        </div>
                        );
                    })}
                </div>
          </div>
        )}
      </div>
    </div>
  );
}