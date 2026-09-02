// components/FeaturedCarousel.tsx
"use client";

import { useState, useEffect } from "react";
// 確保這裡的路徑指向您的 FeaturedCard 檔案
import FeaturedCard from "./FeaturedCard"; 

interface CarouselItem {
  image: string;
  category?: string;
  title: string;
  description?: string;
  href: string;
}

interface FeaturedCarouselProps {
  items: CarouselItem[];
  interval?: number; 
}

export default function FeaturedCarousel({
  items,
  interval = 5000,
}: FeaturedCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFading, setIsFading] = useState(false); 
  const FADE_DURATION = 500; 

  // ... (自動切換和淡入淡出邏輯，與我上次提供的內容相同)
  useEffect(() => {
    if (items.length <= 1) return; 

    const timer = setInterval(() => {
      setIsFading(true); 

      setTimeout(() => {
        setCurrentIndex((prevIndex) => (prevIndex + 1) % items.length);
        setIsFading(false); 
      }, FADE_DURATION);
      
    }, interval);

    return () => clearInterval(timer);
  }, [items, interval]);

  if (!items || items.length === 0) {
    return null;
  }

  const currentItem = items[currentIndex];

  return (
    <div className="relative w-full overflow-hidden" style={{ height: '350px' }}>
      <div
        className={`
          transition-opacity duration-500 absolute inset-0 
          ${isFading ? "opacity-0" : "opacity-100"}
        `}
      >
        <FeaturedCard
          image={currentItem.image}
          category={currentItem.category}
          title={currentItem.title}
          description={currentItem.description}
          href={currentItem.href}
          className="w-full h-full" 
        />
      </div>

      {/* 導航點 (Dots) 略... */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 z-10">
        {items.map((_, idx) => (
          <button
            key={idx}
            onClick={() => {
              if (idx === currentIndex) return;
              setIsFading(true);
              setTimeout(() => {
                setCurrentIndex(idx);
                setIsFading(false);
              }, FADE_DURATION);
            }}
            className={`w-3 h-3 rounded-full bg-white/50 hover:bg-white transition-colors duration-300 ${
              idx === currentIndex ? "bg-white scale-125" : ""
            }`}
            aria-label={`Go to slide ${idx + 1}`}
          />
        ))}
      </div>
    </div>
  );
}