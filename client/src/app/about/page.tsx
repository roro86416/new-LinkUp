'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { 
  RocketLaunchIcon, 
  UserGroupIcon, 
  SparklesIcon, 
  GlobeAsiaAustraliaIcon,
  MusicalNoteIcon,
  FireIcon
} from '@heroicons/react/24/outline';

export default function AboutPage() {
  return (
    <div className="min-h-screen font-sans relative selection:bg-[#EF9D11] selection:text-white overflow-x-hidden pb-20 text-white">
      
      {/* ---------------- 1. 全域背景 (與首頁一致) ---------------- */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div className="absolute inset-0 bg-[linear-gradient(180deg,#0f172a_0%,#1e293b_45%,#000000_100%)]"></div>
        {/* 星空紋理 */}
        <div className="absolute inset-0 opacity-40 mix-blend-overlay" style={{ backgroundImage: `url('https://images.unsplash.com/photo-1534796636912-3b95b3ab5986?q=80&w=2072&auto=format&fit=crop')`, backgroundSize: 'cover', filter: 'contrast(120%)' }}></div>
        {/* 噪點裝飾 */}
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] opacity-30"></div>
      </div>

      {/* 頂部留白 (避開 Header) */}
      <div className="fixed top-0 left-0 w-full h-20 z-50 pointer-events-none"></div>

      <main className="relative z-10 pt-24 px-4 container mx-auto max-w-6xl flex flex-col gap-20">

        {/* ---------------- 2. Hero Section (太空主題) ---------------- */}
        <section className="relative w-full h-[500px] rounded-[40px] overflow-hidden shadow-2xl border border-white/10 group">
          {/* 背景圖：演唱會人海 + 太空感 */}
          <div className="absolute inset-0">
              <Image 
                src="/tide3.jpg" 
                alt="About Hero" 
                fill 
                className="object-cover opacity-60 group-hover:scale-105 transition-transform duration-[20s]"
                priority
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0C2838] via-[#0C2838]/40 to-transparent"></div>
          </div>

          {/* 內容 */}
          <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-4 z-10">
            <div className="animate-in fade-in zoom-in duration-1000">
              <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#EF9D11]/20 text-[#EF9D11] border border-[#EF9D11]/50 text-sm font-bold tracking-widest mb-6 backdrop-blur-md shadow-[0_0_15px_rgba(239,157,17,0.3)]">
                <RocketLaunchIcon className="w-4 h-4" />
                OUR MISSION
              </span>
              <h1 className="text-5xl md:text-7xl font-extrabold text-white mb-6 tracking-tight drop-shadow-2xl">
                連結每一個<br/>
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#EF9D11] via-yellow-400 to-orange-500">
                  精彩瞬間
                </span>
              </h1>
              <p className="text-lg md:text-xl text-gray-200 leading-relaxed max-w-2xl mx-auto drop-shadow-md">
                LinkUp 是您通往娛樂宇宙的傳送門。<br/>
                從獨立音樂祭到山林露營，我們帶您飛向無限可能的熱情座標。
              </p>
            </div>
          </div>
        </section>

        {/* ---------------- 3. 核心價值 (玻璃擬態 Grid) ---------------- */}
        <section>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Card 1 */}
            <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-[32px] p-8 hover:bg-white/20 transition-all duration-300 hover:-translate-y-2 group shadow-lg">
              <div className="w-14 h-14 rounded-2xl bg-[#EF9D11]/20 border border-[#EF9D11]/30 flex items-center justify-center mb-6 group-hover:bg-[#EF9D11] transition-colors duration-500">
                <FireIcon className="w-8 h-8 text-[#EF9D11] group-hover:text-white transition-colors" />
              </div>
              <h3 className="text-2xl font-bold text-white mb-3">極速啟航</h3>
              <p className="text-gray-300 leading-relaxed">
                拒絕繁瑣，直覺的購票流程讓您在最短時間內完成準備。秒殺票券？我們為您的手速提供最強後盾。
              </p>
            </div>

            {/* Card 2 */}
            <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-[32px] p-8 hover:bg-white/20 transition-all duration-300 hover:-translate-y-2 group shadow-lg">
              <div className="w-14 h-14 rounded-2xl bg-blue-500/20 border border-blue-500/30 flex items-center justify-center mb-6 group-hover:bg-blue-500 transition-colors duration-500">
                <GlobeAsiaAustraliaIcon className="w-8 h-8 text-blue-400 group-hover:text-white transition-colors" />
              </div>
              <h3 className="text-2xl font-bold text-white mb-3">無界連結</h3>
              <p className="text-gray-300 leading-relaxed">
                打破地域限制，匯聚全台 Live House、展覽與戶外活動。無論身在何處，精彩活動觸手可及。
              </p>
            </div>

            {/* Card 3 */}
            <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-[32px] p-8 hover:bg-white/20 transition-all duration-300 hover:-translate-y-2 group shadow-lg">
              <div className="w-14 h-14 rounded-2xl bg-purple-500/20 border border-purple-500/30 flex items-center justify-center mb-6 group-hover:bg-purple-500 transition-colors duration-500">
                <SparklesIcon className="w-8 h-8 text-purple-400 group-hover:text-white transition-colors" />
              </div>
              <h3 className="text-2xl font-bold text-white mb-3">專屬體驗</h3>
              <p className="text-gray-300 leading-relaxed">
                透過智慧推薦與會員收藏功能，我們比您更懂您的喜好，為您量身打造獨一無二的娛樂清單。
              </p>
            </div>
          </div>
        </section>

        {/* ---------------- 4. 沉浸式圖文介紹 (交錯排列) ---------------- */}
        <section className="space-y-24">
          
          {/* 區塊 A: 音樂祭 */}
          <div className="flex flex-col md:flex-row items-center gap-12 group">
            <div className="w-full md:w-1/2 relative h-[450px] rounded-[40px] overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.5)] border border-white/10">
              <Image 
                src="https://images.unsplash.com/photo-1470225620780-dba8ba36b745?q=80&w=2070&auto=format&fit=crop" 
                alt="Music Festival" 
                fill 
                className="object-cover group-hover:scale-110 transition-transform duration-700" 
              />
              {/* 裝飾框線 */}
              <div className="absolute inset-4 border border-white/20 rounded-[32px] pointer-events-none"></div>
            </div>
            <div className="w-full md:w-1/2 space-y-6">
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-[#EF9D11] text-white mb-2 shadow-lg shadow-orange-500/50">
                 <MusicalNoteIcon className="w-6 h-6" />
              </div>
              <h2 className="text-4xl md:text-5xl font-bold text-white">
                感受現場的<span className="text-[#EF9D11]">心跳聲</span>
              </h2>
              <p className="text-lg text-gray-300 leading-relaxed">
                我們相信，最真實的感動往往發生在現場。那些震耳欲聾的貝斯聲、那些與陌生人肩並肩的吶喊，是數位世界無法取代的溫度。
                <br/><br/>
                LinkUp 致力於縮短您與舞台的距離，讓每一次的購票都成為一場期待已久的旅程。
              </p>
              <div className="pt-4">
                <Link href="/eventlist">
                  <button className="px-8 py-3 rounded-full bg-white text-[#0C2838] font-bold hover:bg-[#EF9D11] hover:text-white transition-all shadow-[0_0_20px_rgba(255,255,255,0.3)] hover:shadow-[0_0_30px_rgba(239,157,17,0.6)] transform hover:-translate-y-1">
                    探索熱門活動
                  </button>
                </Link>
              </div>
            </div>
          </div>

          {/* 區塊 B: 露營戶外 */}
          <div className="flex flex-col md:flex-row-reverse items-center gap-12 group">
            <div className="w-full md:w-1/2 relative h-[450px] rounded-[40px] overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.5)] border border-white/10">
               <Image 
                src="https://images.unsplash.com/photo-1523987355523-c7b5b0dd90a7?q=80&w=2094&auto=format&fit=crop" 
                alt="Camping" 
                fill 
                className="object-cover group-hover:scale-110 transition-transform duration-700" 
              />
              <div className="absolute inset-4 border border-white/20 rounded-[32px] pointer-events-none"></div>
            </div>
            <div className="w-full md:w-1/2 space-y-6 text-right md:text-left">
              <div className="md:text-right w-full flex flex-col md:items-end">
                  <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-green-500 text-white mb-4 shadow-lg shadow-green-500/50">
                    <GlobeAsiaAustraliaIcon className="w-6 h-6" />
                  </div>
                  <h2 className="text-4xl md:text-5xl font-bold text-white">
                    打造您的<span className="text-green-400">專屬記憶</span>
                  </h2>
                  <p className="text-lg text-gray-300 leading-relaxed mt-6">
                    不只是售票，我們更在乎您的體驗。從週末的山林露營到城市的深夜派對，LinkUp 團隊持續優化每一個環節。
                    <br/><br/>
                    加入我們的會員計畫，更能享有抽獎活動，讓每一次的出發都充滿期待。
                  </p>
              </div>
            </div>
          </div>
        </section>

        {/* ---------------- 5. 團隊介紹 (簡約版) ---------------- */}
        <section className="py-20 mt-10 relative">
           {/* 背景裝飾光暈 */}
           <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-[#EF9D11]/10 rounded-full blur-[120px] pointer-events-none"></div>

           <div className="relative z-10 bg-white/5 backdrop-blur-2xl border border-white/10 rounded-[40px] p-12 text-center shadow-2xl">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-[#EF9D11] shadow-lg shadow-orange-500/40 mb-6 text-white animate-bounce-slow">
              <UserGroupIcon className="w-8 h-8" />
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">介紹我們</h2>
            <p className="text-gray-400 text-lg mb-12 max-w-2xl mx-auto">
              我們是一群熱愛活動的探索者。<br/>LinkUp 是我們對理想生活方式的實踐。
            </p>
            
            {/* 成員頭像 (使用 Unsplash 人像) */}
            <div className="flex justify-center gap-8 flex-wrap">
               {[
                 "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=200", 
                 "https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=200", 
                 "https://images.unsplash.com/photo-1599566150163-29194dcaad36?q=80&w=200", 
                 "https://images.unsplash.com/photo-1527980965255-d3b416303d12?q=80&w=200"
               ].map((src, i) => (
                 <div key={i} className="group relative w-24 h-24 md:w-32 md:h-32 rounded-full p-1 cursor-pointer transition-all duration-300 hover:scale-110">
                    {/* 外框光暈 */}
                    <div className="absolute inset-0 bg-gradient-to-br from-[#EF9D11] to-transparent rounded-full animate-spin-slow opacity-70 group-hover:opacity-100"></div>
                    <div className="absolute inset-[2px] bg-[#0C2838] rounded-full"></div>
                    
                    {/* 圖片 */}
                    <div className="relative w-full h-full rounded-full overflow-hidden border-4 border-transparent">
                       <Image 
                          src={src} 
                          alt="Team Member" 
                          fill
                          className="object-cover grayscale group-hover:grayscale-0 transition-all duration-500" 
                       />
                    </div>
                 </div>
               ))}
            </div>
          </div>
        </section>

      </main>
    </div>
  );
}