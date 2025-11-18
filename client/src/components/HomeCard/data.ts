import { FavoriteEvent } from '../content/member/FavoritesContext';

// 為不同類型的活動定義更清晰的型別
export type PopularEvent = Omit<FavoriteEvent, 'location' | 'isUpcoming' | 'organizerName'>;

export interface DetailedEvent {
  id: number;
  title: string;
  date: string;
  desc: string;
  img: string;
}

// 熱門活動資料 (4筆)
export const popularEvents: PopularEvent[] = [
  { id: 1, title: '城市光影攝影展', date: 'Oct 20, 2025' },
  { id: 2, title: '沉浸式藝術體驗', date: 'Oct 21, 2025' },
  { id: 3, title: '戶外爵士音樂節', date: 'Oct 22, 2025' },
  { id: 4, title: '未來科技高峰會', date: 'Oct 23, 2025' },
];

// 最新上架資料 (4筆)
export const newlyAddedEvents: DetailedEvent[] = [
  { id: 5, title: '手沖咖啡品鑑會', date: 'Nov 1, 2025', desc: '從選豆到沖煮，咖啡大師帶您領略精品咖啡的魅力。', img: 'https://images.unsplash.com/photo-1559496417-e7f25cb247f3?auto=format&fit=crop&w=800&q=80' },
  { id: 6, title: '週末電影馬拉松', date: 'Nov 5, 2025', desc: '連續播放經典科幻電影，享受大銀幕的震撼。', img: 'https://images.unsplash.com/photo-1536440136628-849c177e76a1?auto=format&fit=crop&w=800&q=80' },
  { id: 7, title: '寵物友善市集', date: 'Nov 10, 2025', desc: '帶上你的毛小孩，一起逛市集、交朋友。', img: 'https://images.unsplash.com/photo-1529429617124-95b109e86bb8?auto=format&fit=crop&w=800&q=80' },
  { id: 8, title: '親子烘焙教室', date: 'Nov 12, 2025', desc: '與孩子一起動手做點心，創造甜蜜的家庭回憶。', img: 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?auto=format&fit=crop&w=800&q=80' },
];

// 瀏覽活動資料 (12筆)
export const browseEvents: DetailedEvent[] = [
  { id: 9, title: '山林健行與野餐', date: 'Dec 1, 2025', desc: '遠離塵囂，走入山林，享受大自然的寧靜與美好。', img: 'https://images.unsplash.com/photo-1454982523318-4b6396f39d3a?auto=format&fit=crop&w=800&q=80' },
  { id: 10, title: '數位行銷實戰營', date: 'Dec 5, 2025', desc: '學習最新的數位行銷工具與策略，提升品牌能見度。', img: 'https://images.unsplash.com/photo-1557862921-37829c790f19?auto=format&fit=crop&w=800&q=80' },
  { id: 11, title: 'VR 遊戲競技場', date: 'Dec 10, 2025', desc: '戴上 VR 頭盔，進入虛擬世界，體驗前所未有的遊戲快感。', img: 'https://assets.simpleviewinc.com/sv-raleigh/image/upload/c_limit,h_1200,q_75,w_1200/v1/cms_resources/clients/raleigh/EX_LCS_Finals_2023_Pablo_Jasso_04_09_23_Sunday45_cdbf5077-3eaf-4bb9-9381-307f2cb596b1.jpg' },
  { id: 12, title: '星空下的瑜珈課', date: 'Dec 12, 2025', desc: '在寧靜的夜晚，跟隨星光伸展身心，釋放壓力。', img: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?auto=format&fit=crop&w=800&q=80' },
  { id: 13, title: '獨立樂團演唱會', date: 'Dec 15, 2025', desc: '感受最純粹的音樂能量，支持本地獨立音樂創作。', img: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?auto=format&fit=crop&w=800&q=80' },
  { id: 14, title: '居家調酒教學', date: 'Dec 18, 2025', desc: '學習基礎調酒技巧，在家也能輕鬆調製出美味雞尾酒。', img: 'https://www.1shot.tw/wp-content/uploads/2021/03/1005px-Gin-tonic-1.jpg' },
  { id: 15, title: '街頭美食嘉年華', date: 'Dec 20, 2025', desc: '匯集全台特色小吃，一場滿足您所有味蕾的盛宴。', img: 'https://images.unsplash.com/photo-1565557623262-b51c2513a641?auto=format&fit=crop&w=800&q=80' },
  { id: 16, title: '跨年煙火派對', date: 'Dec 31, 2025', desc: '在絢爛的煙火下，與大家一同迎接嶄新的一年。', img: 'https://images.unsplash.com/photo-1517457373958-b7bdd4587205?auto=format&fit=crop&w=800&q=80' },
  { id: 17, title: '桌遊派對夜', date: 'Jan 5, 2026', desc: '集結各式經典與新潮桌遊，與好友們一較高下。', img: 'https://images.unsplash.com/photo-1577896851231-70ef18881754?auto=format&fit=crop&w=800&q=80' },
  { id: 18, title: '行動應用開發者聚會', date: 'Jan 10, 2026', desc: '分享 iOS 與 Android 開發技巧，交流最新技術趨勢。', img: 'https://images.unsplash.com/photo-1556740758-90de374c12ad?auto=format&fit=crop&w=800&q=80' },
  { id: 19, title: '古蹟文化導覽', date: 'Jan 15, 2026', desc: '跟隨歷史學家，探索城市中被遺忘的古老故事。', img: 'https://images.unsplash.com/photo-1569949381669-ecf31ae8e613?auto=format&fit=crop&w=800&q=80' },
  { id: 20, title: '植栽與花藝設計', date: 'Jan 20, 2026', desc: '學習如何用綠色植物與美麗花朵點綴您的生活空間。', img: 'https://images.unsplash.com/photo-1587334274328-64186a80aeee?auto=format&fit=crop&w=800&q=80' },
];