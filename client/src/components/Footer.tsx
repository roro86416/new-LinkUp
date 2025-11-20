// new-LinkUp/client/src/components/Footer.tsx
'use client';

import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { ChevronRight } from 'lucide-react';

export default function Footer() {
  const pathname = usePathname();

  // 如果是後台登入頁面，不渲染 Footer
  if (pathname === '/admin/login') {
    return null;
  }

  return (
    // 增加 mt-40 確保上方有足夠空間容納漂浮的太空人，避免擋到頁面內容
    <div className="relative mt-40 w-full">
         
         {/* 太空人素材 
            - 位置：置中，透過 -top 往上推
            - 重疊：設定 -top 數值略小於高度，創造「一點點重疊」的效果
            - 圖片：/homepage/astronaut.png
         */}
         <div className="absolute left-1/2 transform -translate-x-1/2 -top-36 md:-top-36 w-24 h-24 md:w-36 md:h-36 animate-bounce-slow z-20 pointer-events-none">
             <img 
                src="/homepage/astronaut.png" 
                alt="Astronaut"
                className="w-full h-full object-contain drop-shadow-[0_10px_20px_rgba(0,0,0,0.5)]"
             />
         </div>

         <footer className="relative z-10 bg-[#05121b]/90 backdrop-blur-lg border-t border-white/10 pt-20 pb-10 text-gray-400">
            <div className="container mx-auto px-6 grid grid-cols-1 md:grid-cols-4 gap-8 text-sm">
                {/* Brand & Logo */}
                <div className="space-y-4">
                    <Link href="/" className="inline-block">
                        {/* Logo 圖片
                           - 圖片路徑：/logo/logoBlack.png
                           - 樣式：h-10 (高度適中)，invert (將黑色反轉為白色)
                        */}
                        <img 
                            src="/logo/logoBlack.png" 
                            alt="LINKUP Logo" 
                            className="h-10 w-auto invert opacity-90 hover:opacity-100 transition-opacity"
                        />
                    </Link>
                    <p className="leading-relaxed">連結每一個精彩瞬間，<br/>讓生活充滿無限可能。</p>
                </div>
                
                {/* Links 1 */}
                <div>
                    <h4 className="text-white font-bold mb-4 uppercase tracking-wider">關於</h4>
                    <ul className="space-y-2">
                        <li><a href="#" className="hover:text-[#EF9D11] transition-colors">關於我們</a></li>
                        <li><a href="/admin" className="hover:text-[#EF9D11] transition-colors">加入團隊</a></li>
                        <li><a href="/scanner" className="hover:text-[#EF9D11] transition-colors">媒體報導</a></li>
                    </ul>
                </div>

                {/* Links 2 */}
                <div>
                    <h4 className="text-white font-bold mb-4 uppercase tracking-wider">協助</h4>
                    <ul className="space-y-2">
                        <li><a href="#" className="hover:text-[#EF9D11] transition-colors">常見問題</a></li>
                        <li><a href="#" className="hover:text-[#EF9D11] transition-colors">聯絡客服</a></li>
                        <li><a href="#" className="hover:text-[#EF9D11] transition-colors">隱私權政策</a></li>
                    </ul>
                </div>

                {/* Newsletter */}
                <div>
                    <h4 className="text-white font-bold mb-4 uppercase tracking-wider">訂閱電子報</h4>
                    <div className="flex bg-white/10 rounded-full p-1 focus-within:ring-2 focus-within:ring-[#EF9D11] transition-all">
                        <input type="email" placeholder="您的 Email" className="bg-transparent border-none focus:outline-none text-white px-4 w-full placeholder-gray-500" />
                        <button className="bg-[#EF9D11] hover:bg-[#d88d0e] text-white w-10 h-10 rounded-full flex items-center justify-center transition-colors flex-shrink-0">
                            <ChevronRight size={16} />
                        </button>
                    </div>
                </div>
            </div>
            
            {/* Copyright */}
            <div className="text-center mt-16 pt-8 border-t border-white/5 text-xs text-gray-500">
                &copy; 2025 LinkUp Inc. All rights reserved.
            </div>
         </footer>
    </div>
  );
}