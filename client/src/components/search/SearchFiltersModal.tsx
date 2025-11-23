"use client";

import { useState } from "react";

interface SearchFiltersModalProps {
  isOpen: boolean;
  onClose: () => void;
  onApply: (filters: FilterState) => void;
}

/** 篩選條件的型別（之後串 API 可以直接用） */
export interface FilterState {
  sort: string;
  price: "all" | "free" | "paid";
  format: "all" | "online" | "offline";
  time: string;
  topics: string[];
  location: string;
}

const ALL_TOPICS = [
  "戶外體驗",
  "課程學習",
  "親子",
  "商業",
  "藝文",
  "手作",
  "美食",
  "運動",
  "寵物",
  "攝影",
  "科技",
  "電影",
  "娛樂",
  "設計",
  "遊戲",
  "音樂",
  "健康",
  "創業",
  "投資",
  "區塊鏈",
  "時尚",
  "公益",
];

const ALL_LOCATIONS = [
  "全部",
  "台北市",
  "新北市",
  "桃園市",
  "台中市",
  "台南市",
  "高雄市",
];

export default function SearchFiltersModal({
  isOpen,
  onClose,
  onApply,
}: SearchFiltersModalProps) {
  const [filters, setFilters] = useState<FilterState>({
    sort: "relevance",
    price: "all",
    format: "all",
    time: "",
    topics: [],
    location: "全部",
  });

  if (!isOpen) return null;

  const toggleTopic = (topic: string) => {
    setFilters((prev) => {
      const exists = prev.topics.includes(topic);
      return {
        ...prev,
        topics: exists
          ? prev.topics.filter((t) => t !== topic)
          : [...prev.topics, topic],
      };
    });
  };

  const handleApply = () => {
    onApply(filters);
    onClose();
  };

  const handleReset = () => {
    setFilters({
      sort: "relevance",
      price: "all",
      format: "all",
      time: "",
      topics: [],
      location: "全部",
    });
  };

  return (
    <div className="fixed inset-0 z-40 flex items-center justify-center bg-black/50">
      <div className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-3xl bg-white p-6 md:p-8">
        {/* 關閉按鈕 */}
        <button
          onClick={onClose}
          className="absolute right-4 top-4 text-2xl text-gray-400 hover:text-gray-700"
        >
          ×
        </button>

        <h2 className="mb-6 text-2xl font-bold text-gray-900">篩選</h2>

        {/* 排序 */}
        <section className="mb-6">
          <h3 className="mb-2 text-sm font-semibold text-gray-700">排序</h3>
          <select
            className="w-full rounded-full border border-gray-300 px-4 py-2 text-sm focus:border-blue-500 focus:outline-none"
            value={filters.sort}
            onChange={(e) =>
              setFilters((prev) => ({ ...prev, sort: e.target.value }))
            }
          >
            <option value="relevance">最相關</option>
            <option value="latest">最新上架</option>
            <option value="soonest">最早開始</option>
            <option value="popular">最多人收藏</option>
          </select>
        </section>

        {/* 價格 & 形式 & 時間 */}
        <section className="mb-6 space-y-4">
          {/* 價格 */}
          <div>
            <h3 className="mb-2 text-sm font-semibold text-gray-700">價格</h3>
            <div className="flex flex-wrap gap-2">
              {[
                { label: "全部", value: "all" },
                { label: "免費", value: "free" },
                { label: "付費", value: "paid" },
              ].map((item) => (
                <button
                  key={item.value}
                  onClick={() =>
                    setFilters((prev) => ({
                      ...prev,
                      price: item.value as FilterState["price"],
                    }))
                  }
                  className={`rounded-full px-4 py-1 text-sm ${
                    filters.price === item.value
                      ? "bg-blue-600 text-white"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                >
                  {item.label}
                </button>
              ))}
            </div>
          </div>

          {/* 形式 */}
          <div>
            <h3 className="mb-2 text-sm font-semibold text-gray-700">形式</h3>
            <div className="flex flex-wrap gap-2">
              {[
                { label: "全部", value: "all" },
                { label: "線上活動", value: "online" },
                { label: "線下活動", value: "offline" },
              ].map((item) => (
                <button
                  key={item.value}
                  onClick={() =>
                    setFilters((prev) => ({
                      ...prev,
                      format: item.value as FilterState["format"],
                    }))
                  }
                  className={`rounded-full px-4 py-1 text-sm ${
                    filters.format === item.value
                      ? "bg-blue-600 text-white"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                >
                  {item.label}
                </button>
              ))}
            </div>
          </div>

          {/* 時間 */}
          <div>
            <h3 className="mb-2 text-sm font-semibold text-gray-700">時間</h3>
            <div className="flex flex-wrap gap-2">
              {["今天", "明天", "本週", "本週末", "下週", "下週末"].map(
                (label) => (
                  <button
                    key={label}
                    onClick={() =>
                      setFilters((prev) => ({
                        ...prev,
                        time: prev.time === label ? "" : label,
                      }))
                    }
                    className={`rounded-full px-4 py-1 text-sm ${
                      filters.time === label
                        ? "bg-blue-600 text-white"
                        : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                    }`}
                  >
                    {label}
                  </button>
                )
              )}
            </div>
          </div>
        </section>

        {/* 主題 */}
        <section className="mb-6">
          <h3 className="mb-2 text-sm font-semibold text-gray-700">主題</h3>
          <div className="flex flex-wrap gap-2">
            {ALL_TOPICS.map((topic) => {
              const active = filters.topics.includes(topic);
              return (
                <button
                  key={topic}
                  onClick={() => toggleTopic(topic)}
                  className={`rounded-full px-4 py-1 text-sm ${
                    active
                      ? "bg-blue-600 text-white"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                >
                  {topic}
                </button>
              );
            })}
          </div>
        </section>

        {/* 地點 */}
        <section className="mb-8">
          <h3 className="mb-2 text-sm font-semibold text-gray-700">地點</h3>
          <select
            className="w-full rounded-full border border-gray-300 px-4 py-2 text-sm focus:border-blue-500 focus:outline-none"
            value={filters.location}
            onChange={(e) =>
              setFilters((prev) => ({ ...prev, location: e.target.value }))
            }
          >
            {ALL_LOCATIONS.map((loc) => (
              <option key={loc} value={loc}>
                {loc}
              </option>
            ))}
          </select>
        </section>

        {/* 底部按鈕 */}
        <div className="flex flex-col gap-3 md:flex-row md:justify-end">
          <button
            onClick={handleReset}
            className="w-full rounded-full border border-gray-300 px-6 py-2 text-sm text-gray-700 hover:bg-gray-100 md:w-auto"
          >
            重設
          </button>
          <button
            onClick={handleApply}
            className="w-full rounded-full bg-gradient-to-r from-blue-500 to-indigo-500 px-8 py-2 text-sm font-semibold text-white hover:from-blue-600 hover:to-indigo-600 md:w-auto"
          >
            篩選
          </button>
        </div>
      </div>
    </div>
  );
}
