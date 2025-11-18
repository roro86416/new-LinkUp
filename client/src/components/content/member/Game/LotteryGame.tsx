import React, { useState, useEffect, useRef } from 'react';
import { prizes, Prize } from './lotteryPrizes';
import { useCoupons } from '../CouponsContext'; // 1. 引入 useCoupons

const LotteryGame: React.FC = () => {
  // 狀態管理
  const [isSpinning, setIsSpinning] = useState(false); // 是否正在抽獎
  const [result, setResult] = useState<Prize | null>(null); // 抽獎結果
  const [displayedPrize, setDisplayedPrize] = useState<Prize>(prizes[0]); // 動畫中顯示的獎項
  const { addCoupon } = useCoupons(); // 2. 取得 addCoupon 函式

  // 使用 ref 來儲存 interval ID，避免 re-render 問題
  const spinningInterval = useRef<NodeJS.Timeout | null>(null);

  // 當元件卸載時，清除 interval 以防止記憶體洩漏
  useEffect(() => {
    return () => {
      if (spinningInterval.current) {
        clearInterval(spinningInterval.current);
      }
    };
  }, []);

  // 開始抽獎的函式
  const handleStart = () => {
    if (isSpinning) return; // 如果正在抽獎，則不執行

    setIsSpinning(true);
    setResult(null);

    // 快速切換顯示的獎項，製造滾動動畫效果
    spinningInterval.current = setInterval(() => {
      const randomIndex = Math.floor(Math.random() * prizes.length);
      setDisplayedPrize(prizes[randomIndex]);
    }, 100); // 每 100 毫秒切換一次

    // 設定 3 秒後停止動畫並顯示結果
    setTimeout(() => {
      if (spinningInterval.current) {
        clearInterval(spinningInterval.current);
      }
      // 決定最終獎項
      const finalPrizeIndex = Math.floor(Math.random() * prizes.length);
      const finalPrize = prizes[finalPrizeIndex];

      setResult(finalPrize);
      setDisplayedPrize(finalPrize);
      setIsSpinning(false);

      // 3. 將抽中的獎項加入到 Context
      addCoupon(finalPrize);
    }, 3000); // 總抽獎時間
  };

  return (
    <div className="flex h-[450px] w-[450px] flex-col justify-around rounded-xl border border-gray-300 bg-gray-50 p-6 text-center font-sans shadow-lg">
      <div>
        <h2 className="text-2xl font-bold text-slate-800">會員專屬抽獎</h2>
        <p className="mt-1 text-gray-600">點擊按鈕，試試您的手氣！</p>
      </div>

      <div className="my-2 flex flex-grow flex-col items-center justify-center rounded-lg border-2 border-dashed border-gray-300 bg-white p-5">
        <div className="mb-4 flex h-[150px] w-[150px] items-center justify-center overflow-hidden">
          <img
            src={result ? result.image : displayedPrize.image}
            alt={result ? result.name : displayedPrize.name}
            className="max-h-full max-w-full object-contain animate-in fade-in zoom-in-75 duration-300"
            key={result ? result.id : displayedPrize.id}
          />
        </div>
        <div className="flex min-h-[50px] items-center justify-center text-xl font-bold text-red-600">
          {result ? `恭喜抽中：${result.name}` : displayedPrize.name}
        </div>
      </div>

      <button
        className="
          rounded-lg 
          border-none 
          bg-[#EF9D11] 
          px-6 py-3 
          text-xl 
          font-bold 
          text-white 
          shadow-md 
          transition-all 
          hover:bg-[#d9890e] 
          active:translate-y-px 
          disabled:cursor-not-allowed disabled:bg-gray-300 disabled:text-gray-600"
        onClick={handleStart}
        disabled={isSpinning}
      >
        {isSpinning ? '抽獎中...' : (result ? '再抽一次' : '開始抽獎')}
      </button>
    </div>
  );
};

export default LotteryGame;