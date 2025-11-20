// new-LinkUp/client/src/api/event-api.ts
import { apiClient } from './auth/apiClient';
import { type EventCardData } from '../components/card/EventCard';

// --- 資料介面定義 ---

// 1. 活動詳情介面
export interface EventDetailData {
  id: number;
  title: string;
  subtitle?: string;
  description: string; 
  cover_image: string;
  start_time: string;
  end_time: string;
  location_name: string;
  address: string;
  
  category?: {
    id: number;
    name: string;
  } | string;
  
  organizer: {
    id?: string;
    name: string;
    avatar: string | null;
    email?: string;
  };
  ticketTypes: any[];
  products?: any[];
  
  price_range?: string; 
  remaining_tickets?: number;
  rating_average?: number;
  rating_count?: number;
  reviews?: {
    id: number;
    user_name: string;
    user_avatar?: string;
    rating: number;
    comment: string;
    created_at: string;
  }[];
}

// 2. 天氣資料介面
export interface WeatherData {
  isForecast: boolean;   // [新增] 是否為預報
  stationName: string;
  obsTime: string;       // 觀測或預報時間
  temperature: number;
  humidity: number;
  windSpeed: number;
  windDirection?: number; // 變為可選
  rainfall: number;      // 即時是 mm，預報是 % (降雨機率)
  weatherDesc: string;   // [新增] 天氣描述 (e.g. 多雲時陰)
}

export interface AnnouncementData {
  id: number;
  title: string;
  content?: string;
  cover_image?: string; 
  linkUrl?: string;
}

// --- API 函式 ---

/**
 * [公開] 獲取單一活動詳情
 */
export async function getEventDetail(id: number): Promise<EventDetailData> {
  try {
    const response = await apiClient.get<ApiResponse<EventDetailData>>(`/api/v1/events/${id}`);
    const data = response.data;
    
    // 模擬評價資料
    if (!data.reviews) {
       data.reviews = [
         { id: 1, user_name: "Alex", rating: 5, comment: "非常棒的活動！場地規劃得很好。", created_at: "2024-01-10" },
         { id: 2, user_name: "Jamie", rating: 4, comment: "內容豐富，但排隊稍久。", created_at: "2024-01-12" },
       ];
       data.rating_average = 4.5;
       data.rating_count = 120;
    }

    // 模擬類別資料
    if (!data.category) {
        data.category = "精選活動"; 
    }
    
    return data;
  } catch (error) {
    console.error(`[event-api] 獲取活動詳情失敗 (ID: ${id}):`, error);
    throw error;
  }
}

/**
 * [公開] 獲取活動列表
 */
export async function getEvents(
  type: 'popular' | 'new' | 'all' | 'featured', 
  limit: number
): Promise<EventCardData[]> {
  const apiType = type === 'featured' ? 'popular' : type;
  const endpoint = `/api/v1/events?type=${apiType}&limit=${limit}`;
  
  try {
    const response = await apiClient.get<ApiResponse<EventCardData[]>>(endpoint);
    return response?.data || [];
  } catch (error) {
    console.error(`[event-api] 獲取活動失敗 (type: ${type}):`, error);
    return [];
  }
}

/**
 * [公開] 獲取活動天氣 (Call 後端)
 */
export async function getEventWeather(eventId: number): Promise<WeatherData | null> {
  try {
    const endpoint = `/api/events/${eventId}/weather`; 
    const response = await apiClient.get<ApiResponse<any>>(endpoint);
    const weatherData = response.data?.weather;
    
    if (!weatherData) return null;

    return {
        isForecast: weatherData.isForecast,
        stationName: weatherData.stationName,
        obsTime: weatherData.obsTime,
        temperature: weatherData.temperature,
        humidity: weatherData.humidity,
        windSpeed: weatherData.windSpeed,
        rainfall: weatherData.rainfall,
        weatherDesc: weatherData.weatherDesc,
    };
  } catch (error) {
    console.error(`[event-api] 獲取天氣失敗:`, error);
    return null;
  }
}

/**
 * [公開] 獲取公告
 */
export async function getAnnouncements(): Promise<AnnouncementData[]> {
  await new Promise(resolve => setTimeout(resolve, 300));
  return [
    { 
      id: 1, title: "【系統公告】LinkUp 2.0 全新改版上線！", 
      cover_image: "https://images.unsplash.com/photo-1516280440614-6697288d5d38?q=80&w=2070", linkUrl: "/announcements/1"
    },
    { 
      id: 2, title: "【會員權益】新註冊會員送 100 元。", 
      cover_image: "https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?q=80&w=2070", linkUrl: "/announcements/2"
    },
  ];
}