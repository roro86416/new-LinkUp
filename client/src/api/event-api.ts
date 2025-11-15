import { apiClient } from './auth/apiClient';
import { type EventCardData } from '../components/card/EventCard';

interface ApiResponse<T> {
  status: "success" | "error";
  data: T; // 我們要的資料被包在 "data" 屬性裡
  message?: string;
}

/**
 * [公開] 獲取活動列表 (用於首頁)
 * @param type - 篩選類型 (popular, new, all)
 * @param limit - 獲取數量
 */
export async function getEvents(
  type: 'popular' | 'new' | 'all', 
  limit: number
): Promise<EventCardData[]> { // (這個函式的 "回傳值" 保持不變，依然是陣列)
  
  const endpoint = `/api/v1/events?type=${type}&limit=${limit}`;
  
  try {
    const response = await apiClient.get<ApiResponse<EventCardData[]>>(endpoint);

    // 從物件中 "解構" 出 data 屬性
    // (如果 response 是 null 或 data 不存在，也回傳空陣列)
    const data = response?.data || [];
    
    return data;

  } catch (error) {
    console.error(`[event-api] 獲取活動失敗 (type: ${type}):`, error);
    throw error;
  }
}