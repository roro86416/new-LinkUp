import { notFound } from "next/navigation";
import Breadcrumb from "../../post-component/layouts/Breadcrumb";
import ArticleHeader from "../postHeader";
import ArticleContent from "../postContent";
import CommentSection from "../commentList";

interface Article {
  title: string;
  slug: string;
  content: string;
  createdAt: string;
  image: string;
  author: { name: string; id: number };
  category: { name: string; id: number };
  tags: { name: string }[];
  eventLink?: string;
}

interface CategoryPageProps {
  paths: { name: string; href: string }[];
}


export default async function ArticlePage({
  params,
}: {
  params: { slug: string };
}) {

 const imageTree = "http://localhost:3001/uploads/file-1763833836659-814654143.jpg"; // 假設這張是聖誕樹的圖
  const imageDinner = "http://localhost:3001/uploads/file-1763833823011-433021134.jpg"
  const article: Article = {
    title: "聖誕節的溫馨時刻與傳統",
    slug: params.slug, // 動態從網址帶入
    content: `
      <h2>前言：冬日裡的暖流</h2>
      <p>聖誕節是一個充滿魔幻與溫馨的節日，它不僅代表著家庭團聚，更是傳遞愛與希望的時刻。每年的這個時候，世界各地都會沉浸在節慶的歡樂氛圍中。</p>
      <p>從裝飾精美的聖誕樹到耳邊迴盪的聖誕歌曲，每一個細節都編織成一幅美麗的冬日畫卷。</p>
      <p>這篇文章將帶你一起探索聖誕節的起源、全球各地的慶祝方式，以及如何創造屬於你自己的聖誕回憶。</p>
      
      <h3>聖誕樹的點亮</h3>
      <p>
        聖誕樹是聖誕節最經典的象徵之一。每當聖誕節來臨，人們就會在家中擺放一棵聖誕樹，並用五彩繽紛的燈飾、小掛件和糖果來裝飾它。
        點亮聖誕樹的瞬間，整個空間都會被溫暖與希望所籠罩。這個傳統可以追溯到數百年前的歐洲，當時人們相信綠色的樹木能在嚴冬中帶來生命力。
        現在，聖誕樹已成為家庭團聚和分享禮物的中心，孩子們尤其期待在樹下發現驚喜。
      </p>

      <figure class="my-8">
        <img 
          src="${imageTree}" 
          alt="裝飾精美的聖誕樹" 
          class="w-full h-auto rounded-lg shadow-lg"
        />
        <figcaption class="text-center text-sm text-gray-500 mt-2">
          溫馨的燈光點亮了聖誕樹，象徵著希望與喜悅。
        </figcaption>
      </figure>

      <h3>聖誕大餐與禮物交換</h3>
      <p>
        聖誕大餐是家庭團聚的重頭戲。豐盛的烤火雞、火腿、各種甜點和熱飲，讓家人們圍坐一堂，分享一年來的點滴。
        而禮物交換更是增添節日氣氛的重要環節。從精心挑選的禮物到手寫的祝福卡片，每一份心意都代表著對彼此的愛與關懷。
        這些傳統不僅強化了家庭成員之間的連結，也讓聖誕節成為一個充滿感恩與愛的時刻。
      </p>

      <figure class="my-8">
        <img 
          src="${imageDinner}" 
          alt="豐盛的聖誕家庭晚宴" 
          class="w-full h-auto rounded-lg shadow-lg"
        />
        <figcaption class="text-center text-sm text-gray-500 mt-2">
          家人們圍坐一桌，享受美味的聖誕大餐。
        </figcaption>
      </figure>
    `,
    createdAt: "2025-11-09",
    image: "http://localhost:3001/uploads/file-1763376404896-842942761.jpg",
    author: { name: "Max", id: 1 },
    category: { name: "節慶活動", id: 1 },
    tags: [{ name: "聖誕節" }, { name: "節慶" }, { name: "家庭" }],
    eventLink: "http://localhost:3001/uploads/file-1763376404896-842942761.jpg",
  };

  return (
    <main className="max-w-5xl mx-auto px-6 py-10">
      {/* 導覽路徑 */}
      <Breadcrumb
        paths={[
          { name: "首頁", href: "/" },
          { name: "文章專區", href: "/articles" },
          { name: article.title, href: `/article/${article.slug}` },
        ]}
      />

      {/* 文章標頭 */}
      <ArticleHeader article={article} />

      {/* 文章內容 */}
      <ArticleContent content={article.content} />

      {/* 評論區 */}
      <CommentSection />
    </main>
  );
}