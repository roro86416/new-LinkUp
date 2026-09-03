// interfaces.ts

/**
 * 定義單一評論資料的結構，對應您的 PostReview Prisma Model
 */
export interface PostReview {
  id: number;
  post_id: number;      // 貼文 ID
  user_id: string;      // 用戶 ID (我們在前端會讓使用者輸入，以模擬登入狀態)
  content: string;      // 評論內容
  rating: number;       // 評分 (1 到 5 的星級評分)
  created_at: string;
  currentPostId?: number;   // 創建時間 (在前端顯示時為格式化的日期)
  
  // 為了方便前端顯示，我們假設有以下資訊
  // ⚠️ 實際應用中，您需要在 API 中 join 這些資料
  author_display_name: string; 
}