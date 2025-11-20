'use client';
import { CheckCircleIcon } from '@heroicons/react/24/solid';

// 這裡使用 "export const" 是因為要讓別的檔案也能引入使用
export const CheckoutStepper = ({ step }: { step: number }) => {
  const steps = [
    { num: 1, name: '選擇票種' },
    { num: 2, name: '填寫資料' },
    { num: 3, name: '確認訂單' },
    { num: 4, name: '前往付款' },
  ];

  return (
    <div className="flex items-center justify-center mb-12 w-full overflow-x-auto">
      <div className="flex items-center min-w-fit px-4">
        {steps.map((s, idx) => (
          <div key={s.num} className="flex items-center">
            {/* 圓圈與文字 */}
            <div className="flex flex-col items-center relative z-10">
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-lg transition-all duration-300 border-2
                  ${
                    step >= s.num
                      ? 'bg-[#EF9D11] border-[#EF9D11] text-white shadow-lg shadow-orange-200' // 舊版樣式：橘底白字+橘色陰影
                      : 'bg-white text-gray-400 border-gray-200' 
                  }
                `}
              >
                {/* 當前步驟大於此圓圈數字時，顯示打勾 */}
                {step > s.num ? <CheckCircleIcon className="w-6 h-6" /> : s.num}
              </div>
              <span
                className={`mt-2 text-sm font-medium whitespace-nowrap ${
                  step >= s.num ? 'text-[#EF9D11]' : 'text-gray-400'
                }`}
              >
                {s.name}
              </span>
            </div>

            {/* 連接線 (只要不是最後一個步驟，就畫線) */}
            {idx < steps.length - 1 && (
              <div
                className={`
                  w-12 sm:w-16 md:w-24 h-1 mx-2 rounded-full -mt-6 transition-colors duration-300
                  ${step > s.num ? 'bg-[#EF9D11]' : 'bg-gray-200'}
                `}
              />
            )}
          </div>
        ))}
      </div>
    </div>
  );
};