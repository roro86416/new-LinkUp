import { useState, useEffect, ChangeEvent, useMemo, useCallback } from "react";
import { EnvelopeIcon, CheckCircleIcon, XCircleIcon, EyeIcon, EyeSlashIcon } from '@heroicons/react/24/outline';
import { useRouter } from 'next/navigation';
import { useUser } from "../../../context/auth/UserContext";
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

// 共用樣式
const labelClasses = "before:content[' '] after:content[' '] pointer-events-none absolute left-0 -top-1.5 flex h-full w-full select-none text-[11px] font-normal leading-tight text-gray-600 transition-all before:pointer-events-none before:mt-[6.5px] before:mr-1 before:box-border before:block before:h-1.5 before:w-2.5 before:rounded-tl-md before:border-t before:border-l before:border-gray-300 before:transition-all after:pointer-events-none after:mt-[6.5px] after:ml-1 after:box-border after:block after:h-1.5 after:w-2.5 after:flex-grow after:rounded-tr-md after:border-t after:border-r after:border-gray-300 after:transition-all peer-placeholder-shown:text-sm peer-placeholder-shown:leading-[3.75] peer-placeholder-shown:text-gray-600 peer-placeholder-shown:before:border-transparent peer-placeholder-shown:after:border-transparent peer-focus:text-[11px] peer-focus:leading-tight peer-focus:text-orange-600 peer-focus:before:border-t-2 peer-focus:before:border-l-2 peer-focus:before:!border-orange-500 peer-focus:after:border-t-2 peer-focus:after:border-r-2 peer-focus:after:!border-orange-500 peer-disabled:text-transparent peer-disabled:before:border-transparent peer-disabled:after:border-transparent peer-disabled:peer-placeholder-shown:text-gray-500";
const inputFieldClasses = "peer w-full h-full bg-white text-gray-900 font-sans font-normal outline-none focus:outline-none disabled:bg-gray-100 disabled:border-0 transition-all border text-base px-3 py-2.5 rounded-[7px] border-gray-300 focus:border-orange-500";

export default function AccountSettings() {
  const router = useRouter();
  const { user, logout, updateUser } = useUser();

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
    Facebook: true, // 模擬已綁定
    Google: false,  // 模擬未綁定
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
      passwordData.confirmPassword.trim() !== '' && // This is now implicitly checked by the next line
      passwordData.newPassword === passwordData.confirmPassword
    );
  }, [passwordData]);

  useEffect(() => {
    const fetchProfile = async () => {
      const token = localStorage.getItem('token');
      if (!user || !token) {
        console.log("使用者未登入，正在導向至首頁...");
        logout(); // 確保狀態完全清除
        router.push('/');
        return; // 直接返回，不執行後續的 fetch
      }
      try {
        // 💡 使用 apiClient 簡化請求
        const data = await apiClient.get('/api/member/profile');

        if (!data) {
          throw new Error("無法取得會員資料");
        }

        // 簡單拆分姓名
        const lastName = data.name ? data.name.substring(0, 1) : "";
        const firstName = data.name ? data.name.substring(1) : "";

        const fetchedData = {
          lastName: lastName,
          firstName: firstName,
          birthDate: data.birth_date ? new Date(data.birth_date).toISOString().split('T')[0] : "", // 格式化日期
          country: data.address || "", // 後端是 address
          phoneCode: data.phone_number ? data.phone_number.split(' ')[0] : "+886",
          phoneNumber: data.phone_number ? data.phone_number.split(' ')[1] || "" : "",
          email: data.email || "",
        };

        setFormData(fetchedData);
        setInitialFormData(fetchedData);

      } catch (err) {
        console.error("抓取資料錯誤:", err);
        // 💡 統一處理 401 錯誤
        if (err instanceof Error && err.message.includes('登入已過期')) {
          logout();
          router.push('/');
        } else if (err instanceof Error) {
          toast.error(err.message);
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
      // 將姓名合併回傳
      const fullName = `${formData.lastName}${formData.firstName}`;
      // 將電話號碼合併
      const fullPhoneNumber = `${formData.phoneCode} ${formData.phoneNumber}`;

      const payload = {
        name: fullName,
        phone_number: fullPhoneNumber,
        birth_date: formData.birthDate ? new Date(formData.birthDate).toISOString() : null,
        address: formData.country,
      };

      // 💡 使用 apiClient 簡化請求
      await apiClient.put('/api/member/profile', payload);

      toast.success('資料更新成功！');
      setInitialFormData(formData);
      // 更新 UserContext 中的使用者名稱
      if (user && user.name !== fullName) {
        updateUser({ name: fullName });
      }

    } catch (err) {
      if (err instanceof Error) {
        toast.error(err.message || '儲存時發生錯誤');
      }
    }
  };

  // 驗證密碼欄位
  const validatePasswordField = (name: keyof PasswordData, value: string) => {
    let error = '';
    if (!value.trim()) {
      error = '此欄位為必填';
    } else if (name === 'newPassword' && value.trim().length < 8) {
      error = '密碼長度至少需要 8 個字元';
    } else if (name === 'confirmPassword' && passwordData.newPassword && value !== passwordData.newPassword) {
      error = '新密碼與確認密碼不相符';
    } else if (name === 'newPassword' && passwordData.confirmPassword && value !== passwordData.confirmPassword) {
      // 當新密碼變更時，也重新驗證確認密碼欄位
      setPasswordErrors(prev => ({ ...prev, confirmPassword: '新密碼與確認密碼不相符' }));
    }
    setPasswordErrors(prev => ({ ...prev, [name]: error }));
  };

  // 帳號安全 - 更改密碼
  const handleChangePassword = async () => {
    // 再次進行提交前的完整驗證
    const errors: PasswordErrors = {};
    if (!passwordData.currentPassword.trim()) errors.currentPassword = '此欄位為必填';
    if (!passwordData.newPassword.trim()) errors.newPassword = '此欄位為必填';
    if (!passwordData.confirmPassword.trim()) errors.confirmPassword = '此欄位為必填';

    if (Object.keys(errors).length > 0) {
      setPasswordErrors(errors);
      toast.error('請完成所有必填欄位');
      return;
    }


    if (passwordData.newPassword !== passwordData.confirmPassword) {
      toast.error('新密碼與確認密碼不相符');
      setPasswordErrors(prev => ({ ...prev, confirmPassword: '新密碼與確認密碼不相符' }));
      return;
    }
    if (passwordData.newPassword.length < 8) {
      toast.error('新密碼長度至少需要 8 個字元');
      setPasswordErrors(prev => ({ ...prev, newPassword: '密碼長度至少需要 8 個字元' }));
      return;
    }
    setPasswordErrors({});



    try {
      console.log('Change password payload:', passwordData);

      const response = await apiClient.post(
        '/api/member/account-settings/change-password',
        passwordData
      );

      toast.success(response.message || '密碼已成功更新！');

      // 成功後清空表單
      setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
    } catch (err) {
      console.error('Change password error:', err);
      // Use a type guard to safely access the error message
      if (err instanceof Error) {
        toast.error(err.message);
      } else {
        toast.error('發生未知錯誤');
      }
    }
  };

  // 帳號安全 - 重新發送驗證信函
  const handleResendVerification = () => {
    console.log("重新發送驗證信...");
    toast.success('驗證信已重新發送！');
  };

  // 帳號安全 - 刪除會員
  const handleDeleteAccount = async () => {
    if (window.confirm(`您確定要永久刪除帳號 ${user?.email} 嗎？此操作無法復原。`)) {
      try {
        console.log("嘗試刪除會員...");
        await apiClient.delete('/api/member/profile');
        toast.success('您的帳號已成功刪除。');
        logout();
        router.push('/');
      } catch (err) {
        console.error("刪除會員失敗:", err);
        if (err instanceof Error) {
          toast.error(err.message || '刪除帳號時發生錯誤');
        } else {
          toast.error('刪除帳號時發生未知錯誤');
        }
      }
    }
  };

  // 登入方式 - 處理綁定/解除綁定
  const handleBind = (provider: keyof typeof providerStatus, isCurrentlyBound: boolean) => {
    console.log(`嘗試 ${isCurrentlyBound ? '解除' : ''}綁定 ${provider}`);
    setProviderStatus(prev => ({ ...prev, [provider]: !isCurrentlyBound }));
    toast.success(`${provider} 已${isCurrentlyBound ? '解除' : ''}綁定！`);
  };

  // 處理原生 <select> 的 ChangeEvent
  const handleSelectChange = useCallback((field: keyof FormData) => (e: ChangeEvent<HTMLSelectElement>) => {
    updateField(field, e.target.value);
  }, []);

  if (authError) {
    return (
      <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
        <div className="flex items-center text-red-700">
          <XCircleIcon className="h-5 w-5 mr-2" />
          <p>{authError}</p>
        </div>
      </div>
    );
  }

  if (loading) return <div>載入中...</div>;

  return (
    <div className="w-full mx-auto">
      <h2 className="text-2xl font-extrabold text-gray-900 mb-2">帳號設定</h2>
      <p className="text-gray-500">
        管理您的個人資訊、保障帳號安全，並設定或解除綁定常用的登入方式。
      </p>

      <div className="flex border-b border-gray-300 mt-6">
        {["基本資料", "帳號安全", "登入方式"].map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab as TabType)}
            className={`py-3 px-5 text-base font-semibold transition duration-200 border-b-2 
    ${activeTab === tab ?
                "text-[#EF9D11] border-[#EF9D11]" :
                "text-gray-600 border-transparent hover:text-orange-600 hover:border-orange-400"
              } -mb-px focus:outline-none whitespace-nowrap`}
          >
            {tab}
          </button>
        ))}
      </div>

      <div className="w-full">
        {activeTab === "基本資料" && (
          <div className="p-6 md:p-8">
            <h3 className="text-xl font-semibold text-gray-800 mb-8 border-b pb-4 border-gray-200">個人資訊</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-6 mb-8">
              <label className="relative w-full min-w-[200px] h-12">
                <input
                  type="text"
                  className={inputFieldClasses + " h-full"}
                  placeholder=" "
                  value={formData.lastName}
                  onChange={(e: ChangeEvent<HTMLInputElement>) => updateField("lastName", e.target.value)}
                />
                <span className={labelClasses}>姓 *</span>
              </label>
              <label className="relative w-full min-w-[200px] h-12">
                <input
                  type="text"
                  className={inputFieldClasses + " h-full"}
                  placeholder=" "
                  value={formData.firstName}
                  onChange={(e: ChangeEvent<HTMLInputElement>) => updateField("firstName", e.target.value)}
                />
                <span className={labelClasses}>名 *</span>
              </label>
              <label className="relative w-full min-w-[200px] h-12">
                <input
                  type="date"
                  className={inputFieldClasses + " h-full"}
                  placeholder=" "
                  value={formData.birthDate}
                  onChange={e => updateField("birthDate", e.target.value)}
                />
                <span className={labelClasses}>出生日期</span>
              </label>
              <div className="relative h-12 w-full min-w-[200px]">
                <select
                  className={inputFieldClasses + " h-full appearance-none"}
                  value={formData.country}
                  onChange={handleSelectChange("country")}
                >
                  <option value="" disabled>請選擇</option>
                  <option value="台灣">台灣</option>
                  <option value="中國">中國</option>
                  <option value="日本">日本</option>
                  <option value="韓國">韓國</option>
                  <option value="美國">美國</option>
                  <option value="其他">其他</option>
                </select>
                <label className={labelClasses}>國家/地區</label>
              </div>
            </div>

            <h3 className="text-xl font-semibold text-gray-800 mb-8 border-b pb-4 border-gray-200 mt-10">聯絡資訊</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-6 mb-8">
              <div className="flex gap-3">
                <div className="relative h-12 w-32 min-w-[120px]">
                  <select
                    className={inputFieldClasses + " h-full appearance-none"}
                    value={formData.phoneCode}
                    onChange={handleSelectChange("phoneCode")}
                  >
                    <option value="+886">+886 (台灣)</option>
                    <option value="+86">+86 (中國)</option>
                    <option value="+81">+81 (日本)</option>
                    <option value="+82">+82 (韓國)</option>
                    <option value="+1">+1 (美國/加拿大)</option>
                  </select>
                  <label className={labelClasses}>國碼</label>
                </div>
                <label className="relative w-full min-w-[200px] h-12">
                  <input
                    type="text"
                    className={inputFieldClasses + " h-full"}
                    placeholder=" "
                    value={formData.phoneNumber}
                    onChange={(e: ChangeEvent<HTMLInputElement>) => updateField("phoneNumber", e.target.value)}
                  />
                  <span className={labelClasses}>電話號碼</span>
                </label>
              </div>
              <label className="relative w-full min-w-[200px] h-12">
                <input
                  type="email"
                  className={inputFieldClasses + " h-full"}
                  placeholder=" "
                  value={formData.email}
                  disabled
                />
                <span className={labelClasses}>聯絡 E-mail</span>
              </label>
            </div>

            <div className="flex justify-end pt-6 border-t border-gray-200 mt-10">
              <button
                type="button"
                onClick={handleSave}
                disabled={!isDirty}
                className={`px-8 py-2.5 rounded-xl text-white font-medium shadow-lg transition duration-150 ease-in-out text-base ${isDirty
                  ? 'bg-[#EF9D11] hover:bg-[#d9890e] cursor-pointer'
                  : 'bg-gray-300 cursor-not-allowed'
                  }`}
              >
                儲存變更
              </button>
            </div>
          </div>
        )}

        {activeTab === "帳號安全" && (
          <div className="p-6 md:p-8">
            <h3 className="text-xl font-semibold text-gray-800 mb-8 border-b pb-4 border-gray-200">管理密碼與帳號狀態</h3>
            <div className="space-y-12">
              <div className="p-6 rounded-xl border border-gray-200 bg-gray-50/50 shadow-sm">
                <h4 className="text-lg font-semibold text-gray-800 mb-6 border-l-4 border-orange-500 pl-3">更改密碼</h4>
                <form className="space-y-6 max-w-md">
                  <div className="relative">
                    <label htmlFor="currentPassword"
                      className="block text-sm font-medium text-gray-700 mb-2">原密碼 <span
                        className="text-red-500">*</span></label>
                    <input id="currentPassword" type={showPasswords.current ? 'text' : 'password'}
                      placeholder="請輸入您的原密碼"
                      value={passwordData.currentPassword}
                      onChange={e => setPasswordData(p => ({ ...p, currentPassword: e.target.value }))}
                      onBlur={e => validatePasswordField('currentPassword', e.target.value)} className={`w-full px-4 py-2.5 border rounded-lg focus:ring-orange-500 focus:border-orange-500 transition duration-150 bg-white text-gray-900 ${passwordErrors.currentPassword ? 'border-red-500' : 'border-gray-300'}`} />
                    <button type="button" onClick={() => setShowPasswords(s => ({ ...s, current: !s.current }))}
                      className="absolute right-3 top-10 text-gray-500">
                      {showPasswords.current ? <EyeSlashIcon className="h-5 w-5" /> : <EyeIcon className="h-5 w-5" />}
                    </button>
                    {passwordErrors.currentPassword && (
                      <p className="text-xs text-red-600 mt-1">{passwordErrors.currentPassword}</p>
                    )}
                  </div>
                  <div className="relative">
                    <label htmlFor="newPassword"
                      className="block text-sm font-medium text-gray-700 mb-2">新密碼 <span
                        className="text-red-500">*</span></label>
                    <input id="newPassword" type={showPasswords.new ? 'text' : 'password'}
                      placeholder="至少 8 個字元"
                      value={passwordData.newPassword}
                      onChange={e => setPasswordData(p => ({ ...p, newPassword: e.target.value }))}
                      onBlur={e => validatePasswordField('newPassword', e.target.value)} className={`w-full px-4 py-2.5 border rounded-lg focus:ring-orange-500 focus:border-orange-500 transition duration-150 bg-white text-gray-900 ${passwordErrors.newPassword ? 'border-red-500' : 'border-gray-300'}`} />
                    <button type="button" onClick={() => setShowPasswords(s => ({ ...s, new: !s.new }))}
                      className="absolute right-3 top-10 text-gray-500">
                      {showPasswords.new ? <EyeSlashIcon className="h-5 w-5" /> : <EyeIcon className="h-5 w-5" />}
                    </button>
                    {passwordErrors.newPassword && (
                      <p className="text-xs text-red-600 mt-1">{passwordErrors.newPassword}</p>
                    )}
                  </div>
                  <div className="relative">
                    <label htmlFor="confirmPassword"
                      className="block text-sm font-medium text-gray-700 mb-2">再次確認新密碼 <span
                        className="text-red-500">*</span></label>
                    <input id="confirmPassword" type={showPasswords.confirm ? 'text' : 'password'}
                      placeholder="再次確認新密碼"
                      value={passwordData.confirmPassword}
                      onChange={e => setPasswordData(p => ({ ...p, confirmPassword: e.target.value }))}
                      onBlur={e => validatePasswordField('confirmPassword', e.target.value)} className={`w-full px-4 py-2.5 border rounded-lg focus:ring-orange-500 focus:border-orange-500 transition duration-150 bg-white text-gray-900 ${passwordErrors.confirmPassword ? 'border-red-500' : 'border-gray-300'}`} />
                    <button type="button" onClick={() => setShowPasswords(s => ({ ...s, confirm: !s.confirm }))}
                      className="absolute right-3 top-10 text-gray-500">
                      {showPasswords.confirm ? <EyeSlashIcon className="h-5 w-5" /> : <EyeIcon className="h-5 w-5" />}
                    </button>
                    {passwordErrors.confirmPassword && (
                      <p className="text-xs text-red-600 mt-1">{passwordErrors.confirmPassword}</p>
                    )}
                  </div>
                  <div className="pt-4 text-right">
                    <button type="button" onClick={handleChangePassword}
                      disabled={!isPasswordFormValid}
                      className={`text-white font-semibold py-2.5 px-6 rounded-xl shadow-lg transition duration-150 focus:outline-none focus:ring-4 focus:ring-orange-300 text-base ${isPasswordFormValid
                        ? 'bg-[#EF9D11] hover:bg-[#d9890e] cursor-pointer'
                        : 'bg-gray-300 cursor-not-allowed'
                        }`}>
                      儲存新密碼
                    </button>
                  </div>
                </form>
              </div>
              <div className="p-6 rounded-xl border border-gray-200 bg-gray-50/50 shadow-sm">
                <h4 className="text-lg font-semibold text-gray-800 mb-6 border-l-4 border-orange-500 pl-3">驗證登入信箱</h4>
                <div
                  className="flex flex-col sm:flex-row items-center justify-between p-5 rounded-lg border border-gray-300 bg-white shadow-sm">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:gap-4 mb-4 sm:mb-0">
                    <p className="text-gray-700 font-mono text-base break-all">{user?.email}</p>
                    <span
                      className={`text-xs font-semibold py-1.5 px-3 rounded-full ${isVerified ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                      {isVerified ? '✓ 已驗證' : '✗ 尚未驗證'}
                    </span>
                  </div>
                  {!isVerified && (
                    <button onClick={handleResendVerification}
                      className="text-sm text-orange-600 font-medium hover:text-orange-800 transition duration-150 disabled:opacity-50 w-full sm:w-auto text-center py-2 px-4 rounded-lg border border-orange-300"
                      disabled={!user?.email}>
                      重新發送驗證信
                    </button>
                  )}
                  {isVerified && (
                    <div className="text-sm text-gray-500 w-full sm:w-auto text-center sm:text-right">
                      您的郵箱已安全驗證。
                    </div>
                  )}
                </div>
              </div>
              <div className="p-6 rounded-xl border border-red-600 bg-red-50/50 shadow-sm">
                <h4 className="text-lg font-semibold text-gray-800 mb-6 border-l-4 border-red-600 pl-3">刪除會員</h4>
                <div
                  className="flex flex-col sm:flex-row items-center justify-between p-5 rounded-lg border border-red-300 bg-white shadow-sm">
                  <p className="text-gray-700 mb-4 sm:mb-0 text-base">
                    永久刪除帳號 <span className="font-mono font-semibold break-all text-red-700">{user?.email}</span>
                  </p>
                  <button onClick={handleDeleteAccount}
                    className="bg-red-600 text-white font-semibold py-2.5 px-6 rounded-xl shadow-lg hover:bg-red-700 transition duration-150 focus:outline-none focus:ring-4 focus:ring-red-300 w-full sm:w-auto text-base cursor-pointer">
                    刪除會員
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
        {activeTab === "登入方式" && (
          <div className="p-6 md:p-8">
            <h3 className="text-xl font-semibold text-gray-800 mb-8 border-b pb-4 border-gray-200">登入方式管理</h3>
            <div className="space-y-12">
              <div className="mb-12">
                <h4 className="text-xl font-semibold text-gray-800 mb-4 border-l-4 border-gray-400 pl-3">電子郵件</h4>
                <div className="p-5 rounded-xl border border-gray-200 max-w-lg bg-white shadow-md">
                  <div className="flex items-start space-x-4"> <div className="p-3 bg-orange-100 rounded-xl shrink-0 mt-0.5">
                    <EnvelopeIcon className="w-6 h-6 text-orange-600" />
                  </div>
                    <div>
                      <p className="text-sm font-medium text-gray-500 mb-1">主要登入方式</p>
                      <p className="text-lg font-semibold text-gray-800 break-all">{user?.email}</p>
                    </div>
                  </div>
                </div>
              </div>
              <div>
                <h4 className="text-xl font-semibold text-gray-800 mb-6 border-l-4 border-gray-400 pl-3">第三方帳號綁定</h4>
                <div className="space-y-6 max-w-lg">
                  {Object.entries(providerStatus).map(([name, isBound]) => {
                    const isFacebook = name === 'Facebook';
                    const logoContent: React.ReactNode = isFacebook
                      ? <img src="/login-icon/facebook.png" alt="Facebook Logo" className="w-8 h-8 object-contain" />
                      : <img src="/login-icon/google.png" alt="Google Logo" className="w-8 h-8 object-contain" />;

                    return (
                      <div key={name}
                        className="flex items-center justify-between p-5 rounded-xl border border-gray-200 bg-white shadow-md">
                        <div className="flex items-center space-x-4">
                          <div
                            className="w-12 h-12 rounded-full flex items-center justify-center font-bold text-lg text-white bg-transparent shadow-md">
                            {logoContent}
                          </div>
                          <p className="text-lg font-medium text-gray-800">{name}</p>
                        </div>
                        {isBound ? (
                          <button
                            onClick={() => handleBind(name as keyof typeof providerStatus, isBound)}
                            className="py-2.5 px-6 rounded-xl text-base font-medium bg-red-50 text-red-600 border border-red-200 hover:bg-red-100 transition duration-150 shadow-sm">
                            解除綁定
                          </button>
                        ) : (
                          <button
                            onClick={() => handleBind(name as keyof typeof providerStatus, isBound)}
                            className="py-2.5 px-6 rounded-xl text-base font-medium border border-orange-500 text-orange-600 hover:bg-orange-50 transition duration-150 shadow-sm">
                            綁定
                          </button>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}