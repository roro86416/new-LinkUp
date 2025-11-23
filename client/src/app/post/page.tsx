import FeaturedCard from "./post-component/card/FeaturedCard";
import GridCard from "./post-component/card/Gridcard";
import HorizontalCard from "./post-component/card/HorizontalCard";
import CreatorButton from "../post/post-component/ui/CreatorButton";
import FeaturedCarousel from "./post-component/card/FeaturedCarousel";

const FEATURED_ITEMS = [
  {
    image: "http://localhost:3001/uploads/file-1763835804589-798662722.jpg",
    category: "音樂會",
    title: "走進音樂的世界：Scott Robertson 專訪",
    description: "帶你深入了解音樂創作與舞台背後的故事…",
    href: "/post/music-life",
  },
  {
    image: "http://localhost:3001/uploads/file-1763835366487-693190998.jpg",
    category: "嘉年華",
    title: "未來嘉年華：2025 年活動科技新趨勢",
    description: "區塊鏈與科技如何翻轉大型活動的運作方式。",
    href: "/post/future-carnival",
  },
  {
    image: "http://localhost:3001/uploads/file-1763835382845-362950624.jpg",
    category: "聖誕節",
    title: "2025 聖誕舞台設計趨勢",
    description: "打造節慶氛圍的舞台靈感與視覺設計。",
    href: "/post/christmas-design",
  },
];

export default function HomePage() {
  return (
    <div className="space-y-24">
      {/* Hero / Featured Section */}
      <section className="max-w-6xl mx-auto px-4">
        <FeaturedCarousel items={FEATURED_ITEMS} interval={5000} />
      </section>

      {/* Editor Picks Section */}
      <section className="max-w-6xl mx-auto px-4">
        <h2 className="text-2xl font-bold mb-6">編輯精選</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <GridCard
            image="http://localhost:3001/uploads/file-1763837038614-382542749.jpg"
            title="音樂祭如何影響城市文化？"
            category="音樂會"
            href="/post/editor-music"
          />
          <GridCard
            image="http://localhost:3001/uploads/file-1763837049040-305200104.jpg"
            title="大型舞台活動的幕後故事"
            category="嘉年華"
            href="/post/editor-stage"
          />
          <GridCard
            image="http://localhost:3001/uploads/file-1763836179449-31657640.jpg"
            title="那些讓活動更美好的創作者們"
            category="愛心活動"
            href="/post/editor-creators"
          />
        </div>
      </section>

      {/* Trending Section */}
      <section className="bg-gray-50 py-16">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-2xl font-bold mb-6">熱門趨勢</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <GridCard
              image="http://localhost:3001/uploads/file-1763837029903-811921704.jpg"
              title="戶外活動再次崛起！為什麼？"
              category="嘉年華"
              href="/post/trend-outdoor"
            />
            <GridCard
              image="http://localhost:3001/uploads/file-1763836169707-417338611.jpg"
              title="讓人敬佩的活動創作者們"
              category="愛心活動"
              href="/post/trend-creators"
            />
            <GridCard
              image="http://localhost:3001/uploads/file-1763837021547-530289897.jpg"
              title="夜生活文化的下一步"
              category="音樂會"
              href="/post/trend-nightlife"
            />
          </div>
        </div>
      </section>

      {/* Tips & Guides */}
      <section className="max-w-6xl mx-auto px-4">
        <h2 className="text-2xl font-bold mb-6">實用指南</h2>
        <div className="space-y-6">
          <HorizontalCard
            image="http://localhost:3001/uploads/file-1763835796792-173259613.jpg"
            category="咖啡相關活動"
            title="提升活動行銷的 10 個小技巧"
            description="簡單易懂的行銷策略，讓你的活動更容易被看見。"
            href="/post/guide-marketing"
          />

          <HorizontalCard
            image="http://localhost:3001/uploads/file-1763836179449-31657640.jpg"
            category="愛心活動"
            title="打造願意回流的忠實觀眾群"
            description="讓你的活動成為大家每年必參加的選擇。"
            href="/post/guide-audience"
          />
        </div>
      </section>

      {/* Community Highlight Section */}
      <section className="bg-lime-200 py-5">
        <div className="max-w-5xl mx-auto px-4">
          <h2 className="text-3xl font-extrabold mb-8">社群亮點</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <FeaturedCard
              image="http://localhost:3001/uploads/file-1763836169707-417338611.jpg"
              title="活動創作者如何讓人們聚在一起"
              category="愛心活動"
              href="/post/community-main"
            />

            <div className="space-y-3">
              <GridCard
                image="http://localhost:3001/uploads/file-1763376404896-842942761.jpg"
                title="聖誕節的溫馨時刻與傳統"
                category="節慶活動"
                href="/post/detail1/1"
              />
              <GridCard
                image="http://localhost:3001/uploads/file-1763835776791-838774558.jpg"
                title="活動如何幫助人們建立連結"
                category="咖啡相關活動"
                href="/post/community-connect"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Tools & Features */}
      <section className="max-w-6xl mx-auto px-4">
        <h2 className="text-2xl font-bold mb-6">工具與功能</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <GridCard
            image="http://localhost:3001/uploads/file-1763088247815-714015603.jpg"
            title="如何使用活動折扣碼？"
            category="嘉年華"
            href="/post/tools-coupon"
          />
          <GridCard
            image="http://localhost:3001/uploads/file-1763835785522-621470929.jpg"
            title="自動化工具讓你省下更多時間"
            category="咖啡相關活動"
            href="/post/tools-automation"
          />
          <GridCard
            image="http://localhost:3001/uploads/file-1763836156058-917696741.jpg"
            title="活動主辦人必學的最佳做法"
            category="愛心活動"
            href="/post/tools-bestpractices"
          />
        </div>
      </section>

      <CreatorButton href="../post/backend/admin/create-post" />
    </div>
  );
}
