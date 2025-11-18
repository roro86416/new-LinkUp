import { FavoriteEvent } from '../../components/content/member/FavoritesContext';

// 為不同類型的活動定義更清晰的型別
export type PopularEvent = Omit<FavoriteEvent, 'location' | 'isUpcoming' | 'organizerName'>;

export interface DetailedEvent {
  id: number;
  title: string;
  date: string;
  desc: string;
  img: string;
  startTime: string;
  endTime: string;
  location: string;
  relatedLink: string;
}

// 熱門活動資料 (4筆)
export const popularEvents: DetailedEvent[] = [
  { id: 1, title: '城市光影攝影展', date: 'Oct 20, 2025', desc: '探索城市在不同光影下的多樣面貌，捕捉屬於您自己的獨特瞬間。\n本次展覽匯集了國內外知名攝影師的傑作，從繁華的都市夜景到靜謐的巷弄晨光，每一幅作品都訴說著一個動人的故事。\n我們特別設置了互動體驗區，讓您不僅能欣賞，更能親手操作專業相機，在指導下學習光影構圖的技巧。無論您是攝影愛好者還是尋求靈感的藝術家，這裡都將是您不容錯過的視覺饗宴。', img: 'https://images.unsplash.com/photo-1519681393784-d120267933ba?auto=format&fit=crop&w=800&q=80', startTime: '10:00 AM', endTime: '06:00 PM', location: '台北市信義區 華山文創園區', relatedLink: 'https://example.com/photo-exhibition' },
  { id: 2, title: '沉浸式藝術體驗', date: 'Oct 21, 2025', desc: '結合光影、聲音與互動裝置，帶您進入一個前所未有的藝術世界。\n這不僅僅是一場展覽，更是一次穿越維度的旅行。您將走進由數位藝術家精心打造的虛擬實境，感受花朵在身邊綻放，星辰在指尖流轉。\n每個展區都有獨特的主題和互動方式，鼓勵觀眾成為藝術創作的一部分。請準備好您的感官，迎接這場顛覆想像的沉浸式體驗，它將重新定義您對藝術的理解。', img: 'https://images.unsplash.com/photo-1547891654-e66ed7ebb968?auto=format&fit=crop&w=800&q=80', startTime: '11:00 AM', endTime: '09:00 PM', location: '高雄市駁二藝術特區', relatedLink: 'https://example.com/immersive-art' },
  { id: 3, title: '戶外爵士音樂節', date: 'Oct 22, 2025', desc: '在星空下享受悠揚的爵士樂，感受秋夜的浪漫氛圍。\n我們邀請了多位國際知名的爵士樂手以及本地優秀的樂團，為您帶來一整晚的聽覺盛宴。從經典的搖擺樂到現代的融合爵士，多樣的曲風將滿足所有樂迷的耳朵。\n現場備有美食市集與特色調飲，讓您在享受音樂的同時，也能品嚐美味。帶上您的野餐墊，與親朋好友一同沉醉在最自由、最放鬆的音樂之夜。', img: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&w=800&q=80', startTime: '07:00 PM', endTime: '10:00 PM', location: '台中市市民廣場', relatedLink: 'https://example.com/jazz-festival' },
  { id: 4, title: '未來科技高峰會', date: 'Oct 23, 2025', desc: '與業界領袖一同探討 AI、區塊鏈與元宇宙的未來趨勢。\n這是一場專為科技愛好者、創業者與投資人舉辦的年度盛會。我們將深入解析最新技術如何重塑產業格局，並邀請多位矽谷專家分享他們對未來的獨到見解。\n議程涵蓋主題演講、分組論壇與技術工作坊，提供您與頂尖人才深度交流的機會。無論您是想掌握趨勢還是尋找合作夥伴，這場高峰會都將為您開啟通往未來的大門。', img: 'https://images.unsplash.com/photo-1519389950473-47ba0277781c?auto=format&fit=crop&w=800&q=80', startTime: '09:00 AM', endTime: '05:00 PM', location: '新竹科學園區國際會議中心', relatedLink: 'https://example.com/tech-summit' },
];

// 最新上架資料 (4筆)
export const newlyAddedEvents: DetailedEvent[] = [
  { id: 5, title: '手沖咖啡品鑑會', date: 'Nov 1, 2025', desc: '從選豆到沖煮，咖啡大師帶您領略精品咖啡的魅力。\n本課程將介紹不同產區的咖啡豆風味特性，並親自示範多種手沖技巧，包括 V60、愛樂壓等。您將有機會品嚐至少五款由大師親手沖煮的單品咖啡。\n無論您是咖啡新手還是資深玩家，都能在這場品鑑會中深化對咖啡的理解，並找到屬於自己的完美風味。課程結束後，還能將精選的咖啡豆樣品帶回家。', img: 'https://images.unsplash.com/photo-1559496417-e7f25cb247f3?auto=format&fit=crop&w=800&q=80', startTime: '02:00 PM', endTime: '04:00 PM', location: '台北市大安區 某咖啡廳', relatedLink: 'https://example.com/coffee-tasting' },
  { id: 6, title: '週末電影馬拉松', date: 'Nov 5, 2025', desc: '連續播放經典科幻電影，享受大銀幕的震撼。\n我們為您精選了三部劃時代的科幻鉅作，從《2001太空漫遊》的哲學思辨，到《銀翼殺手》的賽博龐克美學，再到《駭客任務》的虛擬現實衝擊。\n活動將提供舒適的沙發座位與無限量供應的爆米花。讓我們一起在大銀幕前，重溫這些電影帶來的感動與啟發，並在映後參與由資深影評人主持的深度座談。', img: 'https://images.unsplash.com/photo-1536440136628-849c177e76a1?auto=format&fit=crop&w=800&q=80', startTime: '01:00 PM', endTime: '11:00 PM', location: '光點華山電影館', relatedLink: 'https://example.com/movie-marathon' },
  { id: 7, title: '寵物友善市集', date: 'Nov 10, 2025', desc: '帶上你的毛小孩，一起逛市集、交朋友。\n這個週末，我們將公園變成寵物與主人的天堂。市集匯集了超過五十個原創寵物用品品牌，從手工零食到設計師款式的項圈，應有盡有。\n現場設有寵物專屬的遊樂區和美容站，還有專業的寵物行為諮詢師提供免費諮詢。這是一個讓毛小孩盡情放電、主人輕鬆交流的絕佳機會，快來共度美好的午後時光吧！', img: 'https://images.unsplash.com/photo-1529429617124-95b109e86bb8?auto=format&fit=crop&w=800&q=80', startTime: '12:00 PM', endTime: '07:00 PM', location: '新北市板橋區 寵物公園', relatedLink: 'https://example.com/pet-market' },
  { id: 8, title: '親子烘焙教室', date: 'Nov 12, 2025', desc: '與孩子一起動手做點心，創造甜蜜的家庭回憶。\n在本課程中，專業的烘焙老師將帶領大小朋友，從揉麵糰開始，一步步製作可愛的動物造型餅乾。我們使用天然、健康的食材，讓孩子們在玩樂中學習食物的知識。\n這不僅能培養孩子的動手能力與創造力，更是增進親子感情的絕佳活動。課程結束後，每組家庭都能帶回滿滿一盒親手製作的餅乾與無價的快樂回憶。', img: 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?auto=format&fit=crop&w=800&q=80', startTime: '03:00 PM', endTime: '05:00 PM', location: '台中市西區 烘焙工作室', relatedLink: 'https://example.com/baking-class' },
];

// 瀏覽活動資料 (12筆)
export const browseEvents: DetailedEvent[] = [
  { id: 9, title: '山林健行與野餐', date: 'Dec 1, 2025', desc: '遠離塵囂，走入山林，享受大自然的寧靜與美好。\n我們將帶您走訪一條風景優美且難度適中的步道，沿途可以欣賞豐富的生態與壯麗的山景。\n健行結束後，我們將在視野開闊的草地上，為您準備豐盛的野餐籃，包含手工三明治、新鮮沙拉與特色飲品。這是一趟結合運動與美食的完美旅程，適合所有熱愛戶外活動的朋友。', img: 'https://images.unsplash.com/photo-1454982523318-4b6396f39d3a?auto=format&fit=crop&w=800&q=80', startTime: '09:00 AM', endTime: '04:00 PM', location: '陽明山國家公園', relatedLink: 'https://example.com/hiking-picnic' },
  { id: 10, title: '數位行銷實戰營', date: 'Dec 5, 2025', desc: '學習最新的數位行銷工具與策略，提升品牌能見度。\n這個為期一天的實戰營，將由業界資深專家親自授課，內容涵蓋社群媒體經營、SEO 搜尋引擎優化、內容行銷與數據分析。\n課程將透過實際案例分析與分組實作，確保您能將所學立即應用於工作中。無論您是行銷新手還是希望精進技能的專業人士，都能在此獲得寶貴的知識與經驗。', img: 'https://images.unsplash.com/photo-1557862921-37829c790f19?auto=format&fit=crop&w=800&q=80', startTime: '09:30 AM', endTime: '05:30 PM', location: '線上課程', relatedLink: 'https://example.com/digital-marketing' },
  { id: 11, title: 'VR 遊戲競技場', date: 'Dec 10, 2025', desc: '戴上 VR 頭盔，進入虛擬世界，體驗前所未有的遊戲快感。\n我們引進了最新款的 VR 設備與多款熱門的對戰遊戲，讓您與朋友們能在虛擬的戰場上一較高下。\n無論是緊張刺激的射擊遊戲，還是需要團隊合作的冒險解謎，這裡都能滿足您的需求。現場有專業人員指導，即使是第一次接觸 VR 的玩家也能輕鬆上手，享受身歷其境的刺激體驗。', img: 'https://images.unsplash.com/photo-1542751371-adc38448a05e', startTime: '01:00 PM', endTime: '10:00 PM', location: '台北三創生活園區', relatedLink: 'https://example.com/vr-arena' },
  { id: 12, title: '星空下的瑜珈課', date: 'Dec 12, 2025', desc: '在寧靜的夜晚，跟隨星光伸展身心，釋放壓力。\n這堂戶外瑜珈課將在城市中難得的靜謐角落進行。專業的瑜珈老師將引導您進行一系列溫和的伸展與呼吸練習，幫助您放鬆緊繃的肌肉，平靜紛亂的思緒。\n課程適合所有程度的學員。請自備瑜珈墊，與我們一同在星空下找回內心的平靜與和諧，為忙碌的一週畫下完美的句點。', img: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?auto=format&fit=crop&w=800&q=80', startTime: '08:00 PM', endTime: '09:00 PM', location: '大安森林公園', relatedLink: 'https://example.com/starlight-yoga' },
  { id: 13, title: '獨立樂團演唱會', date: 'Dec 15, 2025', desc: '感受最純粹的音樂能量，支持本地獨立音樂創作。\n這場演唱會集結了三組風格迥異但同樣充滿爆發力的獨立樂團，從迷幻搖滾到清新民謠，再到電子龐克，將帶給您一整晚不間斷的音樂衝擊。\n在 Live House 的近距離場地中，您將能最直接地感受到音樂的震動與樂手們的熱情。這不僅是一場表演，更是一次與音樂產生共鳴的靈魂交流。', img: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?auto=format&fit=crop&w=800&q=80', startTime: '07:30 PM', endTime: '10:30 PM', location: 'The Wall Live House', relatedLink: 'https://example.com/indie-concert' },
  { id: 14, title: '居家調酒教學', date: 'Dec 18, 2025', desc: '學習基礎調酒技巧，在家也能輕鬆調製出美味雞尾酒。\n由專業的調酒師透過線上直播，親自示範三款經典雞尾酒的調製方法，並分享各種基酒與材料的搭配秘訣。\n課程將包含完整的材料包，直接寄送到您家。您只需要準備好冰塊和杯子，就能跟著老師的步驟，親手調製出屬於自己的特調。讓您的居家時光，增添一絲微醺的樂趣。', img: 'https://images.unsplash.com/photo-1646477946182-03e28ca8b15f?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8OHx8JUU5JTg1JTkyfGVufDB8fDB8fHww', startTime: '07:00 PM', endTime: '09:00 PM', location: '線上直播', relatedLink: 'https://example.com/mixology-class' },
  { id: 15, title: '街頭美食嘉年華', date: 'Dec 20, 2025', desc: '匯集全台特色小吃，一場滿足您所有味蕾的盛宴。\n從北到南，我們為您精選了超過一百攤最具代表性的街頭美食，包括蚵仔煎、大腸包小腸、刈包、珍珠奶茶等等。\n現場不僅有美食，還有精彩的街頭藝人表演和趣味遊戲區，讓您在品嚐美食的同時，也能享受嘉年華的熱鬧氛圍。快揪團來體驗這場色香味俱全的美食之旅吧！', img: 'https://images.unsplash.com/photo-1565557623262-b51c2513a641?auto=format&fit=crop&w=800&q=80', startTime: '04:00 PM', endTime: '11:00 PM', location: '台南花園夜市', relatedLink: 'https://example.com/food-festival' },
  { id: 16, title: '跨年煙火派對', date: 'Dec 31, 2025', desc: '在絢爛的煙火下，與大家一同迎接嶄新的一年。\n我們在視野絕佳的地點舉辦這場跨年派對，讓您能無死角地欣賞璀璨的煙火秀。現場有知名 DJ 播放熱門音樂，還有無限暢飲的酒水與精緻點心。\n讓我們一起在音樂與歡笑聲中倒數，並在新年第一刻許下心願。這將是您最難忘的跨年夜，用最 high 的方式開啟全新的一年！', img: 'https://images.unsplash.com/photo-1517457373958-b7bdd4587205?auto=format&fit=crop&w=800&q=80', startTime: '09:00 PM', endTime: '01:00 AM', location: '台北101觀景台', relatedLink: 'https://example.com/nye-party' },
  { id: 17, title: '桌遊派對夜', date: 'Jan 5, 2026', desc: '集結各式經典與新潮桌遊，與好友們一較高下。\n無論您是喜歡策略思考的硬核玩家，還是偏好輕鬆歡樂的派對遊戲，我們都為您準備了豐富的選擇。現場有專業的桌遊小老師，隨時為您解釋規則，帶領您進入遊戲世界。\n這裡不只是玩遊戲，更是結交新朋友的好地方。快來加入我們，享受一個充滿歡笑與腦力激盪的夜晚！', img: 'https://images.unsplash.com/photo-1577896851231-70ef18881754?auto=format&fit=crop&w=800&q=80', startTime: '06:00 PM', endTime: '11:00 PM', location: '桌遊地下城', relatedLink: 'https://example.com/boardgame-night' },
  { id: 18, title: '行動應用開發者聚會', date: 'Jan 10, 2026', desc: '分享 iOS 與 Android 開發技巧，交流最新技術趨勢。\n本次聚會將邀請兩位資深開發者，分別就「SwiftUI 的現代化佈局技巧」與「Kotlin Multiplatform 的實戰應用」進行分享。\n我們鼓勵與會者在會後自由交流，分享彼此在開發上遇到的挑戰與心得。無論您是學生、初階工程師或資深開發者，都歡迎您來這裡學習新知、拓展人脈。', img: 'https://images.unsplash.com/photo-1556740758-90de374c12ad?auto=format&fit=crop&w=800&q=80', startTime: '07:00 PM', endTime: '09:30 PM', location: 'Google Taipei 辦公室', relatedLink: 'https://example.com/dev-meetup' },
  { id: 19, title: '古蹟文化導覽', date: 'Jan 15, 2026', desc: '跟隨歷史學家，探索城市中被遺忘的古老故事。\n這次導覽將帶您走進平常不對外開放的歷史建築，由專業的文史工作者為您解說其背後的歷史脈絡與建築特色。\n您將聽到許多課本上沒有記載的趣聞軼事，重新認識這座您所熟悉的城市。這是一趟知性的文化之旅，讓我們一起穿越時空，感受歷史的溫度。', img: 'https://images.unsplash.com/photo-1569949381669-ecf31ae8e613?auto=format&fit=crop&w=800&q=80', startTime: '10:00 AM', endTime: '12:00 PM', location: '台南安平古堡', relatedLink: 'https://example.com/heritage-tour' },
  { id: 20, title: '植栽與花藝設計', date: 'Jan 20, 2026', desc: '學習如何用綠色植物與美麗花朵點綴您的生活空間。\n在這堂課中，花藝師將教您基礎的色彩搭配原理與花材處理技巧，並帶領您完成一個屬於自己的季節花束。\n我們相信，與植物相處的過程本身就是一種療癒。課程結束後，您不僅能帶回美麗的作品，更能將這份創造美的能力，融入您的日常生活之中。所有材料與工具皆由教室提供。', img: 'https://images.unsplash.com/photo-1587334274328-64186a80aeee?auto=format&fit=crop&w=800&q=80', startTime: '02:00 PM', endTime: '05:00 PM', location: '有肉 Succulent & Gift', relatedLink: 'https://example.com/plant-design' },
];