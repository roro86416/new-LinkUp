// components/cards/FeaturedCardMarquee.tsx
"use client";

import FeaturedCard from "./FeaturedCard";

interface FeaturedMarqueeProps {
  items: {
    image: string;
    category?: string;
    title: string;
    description?: string;
    href: string;
  }[];
  speed?: number;
}

export default function FeaturedCardMarquee({
  items,
  speed = 40,
}: FeaturedMarqueeProps) {
  return (
    <div className="w-full overflow-hidden">
      <div
        className="flex gap-6 whitespace-nowrap"
        style={{
          animation: `marquee ${speed}s linear infinite`,
        }}
      >
        {/* 原始內容 + 複製一次 → 無縫 */}
        {[...items, ...items].map((item, idx) => (
          <FeaturedCard key={idx} {...item} className="min-w-[380px]" />
        ))}
      </div>

      {/* Inline keyframes（無須改 globals.css） */}
      <style>{`
        @keyframes marquee {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
      `}</style>
    </div>
  );
}
