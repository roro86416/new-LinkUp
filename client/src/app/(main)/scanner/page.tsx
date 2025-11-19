'use client';
import { useState } from 'react';
import { apiClient } from '../../../api/auth/apiClient';
// [修改] 移除 toast 引用，或是留著但不使用
// import toast from 'react-hot-toast'; 
import { QrCodeIcon, CheckCircleIcon, XCircleIcon, VideoCameraIcon, PencilIcon } from '@heroicons/react/24/outline';
import Link from 'next/link';
import { Scanner } from '@yudiel/react-qr-scanner';

interface CheckInResponse {
  status: string;
  message: string;
  data?: {
    ticketId: number;
    attendeeName: string;
    eventName: string;
    scanTime: string;
  };
}

export default function ScannerPage() {
  const [qrInput, setQrInput] = useState('');
  const [result, setResult] = useState<CheckInResponse | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isCameraMode, setIsCameraMode] = useState(false);

  // 驗票邏輯
  const verifyTicket = async (code: string) => {
    if (isLoading) return;

    setIsLoading(true);
    setResult(null);
    
    // [修改] 移除 Loading Toast
    // const toastId = toast.loading('驗證中...');

    try {
      const response = await apiClient.post<CheckInResponse>('/api/v1/check-in/verify', {
        qr_code: code
      });
      
      setResult(response);
      
      if (response.status === 'success') {
        // [修改] 移除成功 Toast，只依靠下方的結果區顯示
        // toast.success('驗票成功！', { id: toastId });
        
        if (isCameraMode) {
           setIsCameraMode(false); 
        } else {
           setQrInput('');
        }
      } else {
        // [修改] 移除失敗 Toast
        // toast.error(response.message || '驗票失敗', { id: toastId });
      }
    } catch (error: any) {
      console.error(error);
      const errorMsg = error.message || '驗票失敗';
      
      // 設定結果狀態，讓畫面顯示紅色叉叉
      setResult({ status: 'error', message: errorMsg });
      
      // [修改] 移除錯誤 Toast
      // toast.error(errorMsg, { id: toastId });
    } finally {
      setIsLoading(false);
    }
  };

  const handleManualSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (qrInput) verifyTicket(qrInput);
  };

  const handleScan = (detectedCodes: any[]) => {
    if (detectedCodes && detectedCodes.length > 0) {
      const code = detectedCodes[0].rawValue;
      if (code) {
        if (!isLoading) {
            verifyTicket(code);
        }
      }
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        
        <div className="text-center">
          <QrCodeIcon className="mx-auto h-16 w-16 text-orange-600" />
          <h2 className="mt-2 text-3xl font-extrabold text-gray-900">電子票券驗票</h2>
          
          <div className="mt-4 flex justify-center gap-4">
             <button 
                onClick={() => setIsCameraMode(false)}
                className={`flex items-center gap-2 px-4 py-2 rounded-full transition-colors ${!isCameraMode ? 'bg-orange-600 text-white' : 'bg-white text-gray-600 border hover:bg-gray-50'}`}
             >
                <PencilIcon className="w-4 h-4"/> 手動輸入
             </button>
             <button 
                onClick={() => {
                    setResult(null);
                    setIsCameraMode(true);
                }}
                className={`flex items-center gap-2 px-4 py-2 rounded-full transition-colors ${isCameraMode ? 'bg-orange-600 text-white' : 'bg-white text-gray-600 border hover:bg-gray-50'}`}
             >
                <VideoCameraIcon className="w-4 h-4"/> 相機掃描
             </button>
          </div>
        </div>

        {/* 內容區 */}
        {isCameraMode ? (
            <div className="rounded-xl overflow-hidden shadow-lg relative bg-black">
                <Scanner
                    onScan={handleScan}
                    onError={(error) => console.log(error)}
                    components={{
                        audio: false, 
                        torch: true,  
                        finder: true  
                    }}
                    styles={{
                        container: { width: '100%', aspectRatio: '1/1' }
                    }}
                />
                <p className="text-white text-center py-2 bg-black">請將鏡頭對準 QR Code</p>
            </div>
        ) : (
            <form className="mt-8 space-y-6" onSubmit={handleManualSubmit}>
              <div className="rounded-md shadow-sm -space-y-px">
                <input
                    type="text"
                    required
                    suppressHydrationWarning={true}
                    className="appearance-none rounded-md relative block w-full px-3 py-4 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-orange-500 focus:border-orange-500 focus:z-10 sm:text-lg"
                    placeholder="輸入票券代碼"
                    value={qrInput}
                    onChange={(e) => setQrInput(e.target.value)}
                />
              </div>
              <button type="submit" disabled={isLoading} className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-lg font-medium rounded-md text-white bg-orange-600 hover:bg-orange-700 disabled:bg-gray-400 transition-colors">
                 {isLoading ? '驗證中...' : '送出驗證'}
              </button>
            </form>
        )}

        {/* 結果顯示區 */}
        {result && (
           <div className={`mt-6 p-6 rounded-xl border-2 shadow-lg transition-all duration-300 ${result.status === 'success' ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'}`}>
                <div className="flex items-center justify-center mb-4">
                  {result.status === 'success' ? (
                    <CheckCircleIcon className="h-12 w-12 text-green-600" />
                  ) : (
                    <XCircleIcon className="h-12 w-12 text-red-600" />
                  )}
                </div>
                
                <h3 className={`text-center text-2xl font-bold mb-2 ${result.status === 'success' ? 'text-green-800' : 'text-red-800'}`}>
                  {result.message}
                </h3>

                {result.status === 'success' && result.data && (
                  <div className="mt-4 space-y-2 text-center text-gray-700 border-t border-green-200 pt-4">
                    <p><span className="font-bold">活動：</span> {result.data.eventName}</p>
                    <p><span className="font-bold">姓名：</span> {result.data.attendeeName}</p>
                    <p><span className="font-bold">時間：</span> {new Date(result.data.scanTime).toLocaleString()}</p>
                  </div>
                )}
           </div>
        )}

        <div className="text-center mt-8">
          <Link href="/" className="text-orange-600 hover:text-orange-500 font-medium">
            ← 回到首頁
          </Link>
        </div>

      </div>
    </div>
  );
}