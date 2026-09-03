// new-LinkUp/client/src/components/content/member/Game/LotteryGame.tsx
'use client';
import React, { useState } from 'react';
import { SparklesIcon, GiftIcon } from '@heroicons/react/24/solid';
// import toast from 'react-hot-toast'; // Context 裡面已經有 toast 了，這裡可以移除
import { useCoupons } from '../CouponsContext'; // [新增 1] 引入 Context

export default function LotteryGame() {
  const { addCoupon } = useCoupons(); // [新增 2] 取得新增折價券的方法
  const [isSpinning, setIsSpinning] = useState(false);
  const [result, setResult] = useState<{name:string, code:string}|null>(null);

  const handleDraw = () => {
    if (isSpinning) return;
    setIsSpinning(true);
    setResult(null);

    // 模擬抽獎過程
    setTimeout(() => {
        // [修改 3] 為了配合 Context 的介面，我們幫獎品補上 image 欄位 (雖然目前 UI 沒用到)
        const prizes = [
            { name: '95折優惠券', code: 'LUCKY95', chance: 0.5, image: '' },
            { name: '9折優惠券', code: 'LUCKY90', chance: 0.3, image: '' },
            { name: '85折優惠券', code: 'LUCKY85', chance: 0.15, image: '' },
            { name: '免費票券一張', code: 'FREE01', chance: 0.05, image: '' },
        ];
        
        const rand = Math.random();
        let acc = 0;
        let wonPrize = prizes[0];
        
        for(const p of prizes) {
            acc += p.chance;
            if (rand < acc) { wonPrize = p; break; }
        }

        setResult(wonPrize);
        setIsSpinning(false);
        
        // [修改 4] 關鍵修改！使用 Context 的方法來新增折價券
        // 這會自動處理 LocalStorage ('user_coupons') 並更新畫面
        addCoupon({
          name: wonPrize.name,
          image: wonPrize.image
        });

    }, 2000);
  };

  return (
    <div className="w-full mx-auto text-center animate-in fade-in slide-in-from-bottom-2 duration-300">
       <header className="mb-12">
        <h1 className="text-3xl font-extrabold text-white mb-2 flex items-center justify-center gap-2">
            <SparklesIcon className="w-8 h-8 text-yellow-400" /> 每日幸運抽獎
        </h1>
        <p className="text-gray-400">試試您的手氣，贏取專屬優惠！</p>
      </header>

      <div className="relative w-full max-w-md mx-auto bg-white/5 border border-white/10 rounded-[40px] p-10 shadow-2xl overflow-hidden">
          {/* 裝飾光暈 */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-64 h-64 bg-[#EF9D11]/20 blur-[100px] rounded-full pointer-events-none"></div>

          <div className="relative z-10 py-10">
              <div className={`w-40 h-40 mx-auto bg-gradient-to-br from-orange-400 to-red-500 rounded-full flex items-center justify-center shadow-[0_0_40px_rgba(249,115,22,0.4)] transition-all duration-1000 ${isSpinning ? 'animate-spin scale-110' : 'hover:scale-105'}`}>
                  <GiftIcon className="w-20 h-20 text-white" />
              </div>

              {result ? (
                  <div className="mt-8 animate-in zoom-in duration-500">
                      <p className="text-gray-300 text-sm mb-1">恭喜您獲得</p>
                      <h3 className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 to-orange-400 mb-4">
                          {result.name}
                      </h3>
                      <div className="bg-white/10 rounded-lg py-2 px-4 inline-block border border-white/20 text-white font-mono tracking-widest">
                          {result.code}
                      </div>
                      <p className="text-xs text-gray-500 mt-4">已自動存入您的折價券夾</p>
                  </div>
              ) : (
                  <div className="mt-8 h-24 flex items-center justify-center">
                      {isSpinning ? <p className="text-xl text-white animate-pulse">抽獎中...</p> : <p className="text-gray-400">點擊按鈕開始抽獎</p>}
                  </div>
              )}
          </div>

          <button 
            onClick={handleDraw}
            disabled={isSpinning}
            className="w-full bg-[#EF9D11] hover:bg-[#d88d0e] text-white font-bold py-4 rounded-xl shadow-lg transition-all transform active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSpinning ? '好運降臨中...' : '立即抽獎'}
          </button>
      </div>
    </div>
  );
}