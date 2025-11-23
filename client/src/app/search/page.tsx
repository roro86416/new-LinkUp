"use client";

import { useState } from "react";
import EventCard, {
  EventCardData,
} from "../../components/card/EventCard";
import SearchFiltersModal, {
  FilterState,
} from "../../components/search/SearchFiltersModal";

/** 🔹 先用假資料，之後再換成 API 回傳 */
const MOCK_FAVORITES: EventCardData[] = [
  {
    id: 40,
    title: "北投星空小旅行｜步道 X 星空導覽",
    start_time: "2025-11-21T19:00:00.000Z",
    location_name: "陽明山冷水坑停車場",
    cover_image:
      "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1200&q=80",
    organizerName: "LinkUp Demo",
    price: 880,
  },
  {
    id: 54,
    title: "【表演】獨立樂團演唱會",
    start_time: "2025-12-15T19:00:00.000Z",
    location_name: "The Wall Live House",
    cover_image:
      "https://images.unsplash.com/photo-1512427691650-1e0c2f9a81b3?auto=format&fit=crop&w=1200&q=80",
    organizerName: "Demo Organizer User",
    price: 880,
  },
  // …可以再補幾筆
];

const MOCK_UPCOMING: EventCardData[] = [
  {
    id: 51,
    title: "烘焙工作坊｜手作甜點入門",
    start_time: "2025-11-22T14:00:00.000Z",
    location_name: "台南市南區創意基地",
    cover_image:
      "https://images.unsplash.com/photo-1495147466023-ac5c588e2e94?auto=format&fit=crop&w=1200&q=80",
    organizerName: "甜點研究社",
    price: 1200,
  },
  // …一樣可以再補
];

export default function SearchPage() {
  const [keyword, setKeyword] = useState("");
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [filters, setFilters] = useState<FilterState | null>(null);

  /** 收藏狀態（純前端），之後串收藏 API 再調整 */
  const [favoriteIds, setFavoriteIds] = useState<number[]>([]);

  const handleToggleFavorite = (id: number) => {
    setFavoriteIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // 🔜 之後這裡會呼叫 GET /api/events/search
    // 並把 keyword + filters 一起傳給後端
    console.log("搜尋關鍵字 =", keyword, "filters =", filters);
  };

  return (
    <main className="min-h-screen bg-gray-50">
      <section className="border-b bg-white">
        <div className="mx-auto flex max-w-6xl flex-col gap-4 px-4 py-6 md:flex-row md:items-center md:justify-between">
          {/* 左側：標題 + 搜尋列 */}
          <div className="w-full md:flex-1">
            <h1 className="mb-3 text-2xl font-bold text-gray-900 md:text-3xl">
              搜尋活動
            </h1>
            <form onSubmit={handleSearchSubmit}>
              <div className="flex items-center gap-2 rounded-full border border-gray-300 bg-gray-50 px-4 py-2">
                <input
                  type="text"
                  placeholder="輸入關鍵字、主題或地點"
                  className="flex-1 bg-transparent text-sm text-gray-800 outline-none"
                  value={keyword}
                  onChange={(e) => setKeyword(e.target.value)}
                />
                <button
                  type="submit"
                  className="rounded-full bg-blue-600 px-4 py-1.5 text-sm font-semibold text-white hover:bg-blue-700"
                >
                  搜尋
                </button>
              </div>
            </form>
          </div>

          {/* 右側：篩選按鈕 */}
          <div className="flex items-center gap-3 md:w-auto">
            <button
              type="button"
              onClick={() => setIsFilterOpen(true)}
              className="flex items-center gap-2 rounded-full border border-gray-300 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
            >
              <span>篩選條件</span>
              <span className="text-lg">▼</span>
            </button>
          </div>
        </div>
      </section>

      {/* 內容區：熱門 + 即將開始 */}
      <section className="mx-auto max-w-6xl px-4 pb-10 pt-6">
        {/* 熱門收藏 */}
        <div className="mb-10">
          <div className="mb-4 flex items-baseline justify-between">
            <h2 className="text-lg font-semibold text-gray-900">
              最多人收藏的活動
            </h2>
            <span className="text-xs text-gray-500">
              之後會串接 /api/events/favorites
            </span>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {MOCK_FAVORITES.map((event) => (
              <EventCard
                key={event.id}
                event={event}
                isFavorited={favoriteIds.includes(event.id)}
                onToggleFavorite={handleToggleFavorite}
              />
            ))}
          </div>
        </div>

        {/* 即將開始 */}
        <div className="mb-10">
          <div className="mb-4 flex items-baseline justify-between">
            <h2 className="text-lg font-semibold text-gray-900">
              即將開始的活動
            </h2>
            <span className="text-xs text-gray-500">
              之後會串接 /api/events/upcoming
            </span>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {MOCK_UPCOMING.map((event) => (
              <EventCard
                key={event.id}
                event={event}
                isFavorited={favoriteIds.includes(event.id)}
                onToggleFavorite={handleToggleFavorite}
              />
            ))}
          </div>
        </div>
      </section>

      {/* 篩選彈窗 */}
      <SearchFiltersModal
        isOpen={isFilterOpen}
        onClose={() => setIsFilterOpen(false)}
        onApply={(selected) => setFilters(selected)}
      />
    </main>
  );
}
