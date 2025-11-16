
import Image from "next/image";

export default function HomePage() {
  return (
    <main className="w-full flex flex-col items-center">
      {/* 🟧 跑馬燈 Marquee */}
      <div className="w-full overflow-hidden whitespace-nowrap border-b border-neutral-300 bg-white py-3">
        <div className="inline-flex animate-marquee gap-12 text-neutral-600 text-sm">
          <span>🎉 最新文章發布：活動行銷策略完全解析</span>
          <span>📅 活動企劃必備：2025 趨勢觀察</span>
          <span>✨ 探索成功活動背後的祕密心法</span>
          <span>🎉 最新文章發布：活動行銷策略完全解析</span>
          <span>📅 活動企劃必備：2025 趨勢觀察</span>
          <span>✨ 探索成功活動背後的祕密心法</span>
        </div>
      </div>

      {/* 🟧 主視覺 Featured Article (Eventbrite 風格) */}
      <section className="max-w-5xl w-full px-6 mt-10">
        <div className="w-full h-[420px] relative rounded-2xl overflow-hidden shadow-sm group cursor-pointer">
          <Image
            src="/sample/hero.jpg"
            alt="Hero image"
            fill
            className="object-cover group-hover:scale-105 transition duration-700"
          />

          {/* 減弱邊框效果 → 更像 Eventbrite */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />

          <div className="absolute bottom-0 p-8 text-white">
            <span className="text-sm opacity-90">Event Tips</span>
            <h2 className="text-4xl font-bold mt-2">2025 活動行銷的五個關鍵趨勢</h2>
            <p className="opacity-90 mt-3 max-w-xl">
              想要讓你的活動在今年脫穎而出？這五個行銷策略你一定不能錯過。
            </p>
          </div>
        </div>
      </section>

      {/* 🟧 文章列表區 Latest Articles */}
      <section className="max-w-5xl w-full px-6 mt-14 mb-20">
        <h2 className="text-2xl font-semibold mb-6">Latest Articles</h2>

        {/* 卡片區 → Eventbrite 風格淡邊框 */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {[1, 2, 3, 4, 5, 6].map((card) => (
            <article
              key={card}
              className="rounded-2xl overflow-hidden bg-white shadow-sm hover:shadow-md transition border border-neutral-200/40"
            >
              <div className="relative w-full h-48">
                <Image
                  src={`/sample/card${card}.jpg`}
                  alt="Card Image"
                  fill
                  className="object-cover"
                />
              </div>

              <div className="p-5">
                <span className="text-xs uppercase text-neutral-500">Event</span>
                <h3 className="text-lg font-semibold mt-2">活動行銷策略 #{card}</h3>
                <p className="text-sm text-neutral-600 mt-2 line-clamp-2">
                  如何透過精準內容與社群互動提升活動參與率？探索完整策略！
                </p>
              </div>
            </article>
          ))}
        </div>
      </section>
    </main>
  );
}

