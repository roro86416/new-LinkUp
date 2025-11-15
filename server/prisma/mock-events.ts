// 
// 這是 "server" 專案中的 "mock-events.ts"
// (已補完所有 13 個分類，共 26 筆活動)
//

// 我們移除 Prisma 類型，只保留資料
export const mockEventsData = [
  // --- 1. 課程 (Category) ---
  {
    title: "【課程】React 全端開發實戰營",
    subtitle: "從零到一部署您的網站",
    description: "學習 React, Next.js, Prisma 和 Tailwind，打造全端應用。",
    cover_image: "/slide1.jpg",
    start_time: new Date("2025-12-01T09:00:00Z"),
    end_time: new Date("2025-12-05T17:00:00Z"),
    location_name: "線上直播",
    address: "Zoom 會議室",
    latitude: 25.0339,
    longitude: 121.5645,
    status: "APPROVED",
    event_type: "ONLINE",
    ticketTypes: {
      create: [
        { name: "課程票", price: 3500, total_quantity: 100, sale_start_time: new Date("2025-10-01T12:00:00Z"), sale_end_time: new Date("2025-11-30T12:00:00Z") }
      ]
    },
  },
  {
    title: "【課程】手沖咖啡入門",
    subtitle: "品味生活的美好",
    description: "從選豆到沖煮，咖啡大師帶您領略精品咖啡的魅力。",
    cover_image: "https://images.unsplash.com/photo-1559496417-e7f25cb247f3?auto=format&fit=crop&w=800&q=80",
    start_time: new Date("2025-11-25T14:00:00Z"),
    end_time: new Date("2025-11-25T16:00:00Z"),
    location_name: "台北市大安區",
    address: "某咖啡廳",
    latitude: 25.0330,
    longitude: 121.5654,
    status: "APPROVED",
    event_type: "OFFLINE",
    ticketTypes: {
      create: [
        { name: "體驗票", price: 600, total_quantity: 20, sale_start_time: new Date("2025-10-01T12:00:00Z"), sale_end_time: new Date("2025-11-24T12:00:00Z") }
      ]
    },
  },

  // --- 2. 展覽 (Category) ---
  {
    title: "【展覽】城市光影攝影展",
    subtitle: "捕捉動人的光影瞬間",
    description: "集結頂尖攝影師，捕捉城市中最動人的光影瞬間。",
    cover_image: "/slide2.jpg",
    start_time: new Date("2025-11-20T10:00:00Z"),
    end_time: new Date("2025-12-20T18:00:00Z"),
    location_name: "華山文創園區",
    address: "台北市中正區八德路一段1號",
    latitude: 25.0441,
    longitude: 121.5298,
    status: "APPROVED",
    event_type: "OFFLINE",
    ticketTypes: {
      create: [
        { name: "全票", price: 350, total_quantity: 1000, sale_start_time: new Date("2025-10-01T12:00:00Z"), sale_end_time: new Date("2025-12-20T18:00:00Z") }
      ]
    },
  },
  {
    title: "【展覽】沉浸式藝術體驗",
    subtitle: "結合聲光與數位藝術",
    description: "帶您進入前所未有的奇幻世界。",
    cover_image: "https://images.unsplash.com/photo-1547891654-e66ed7ebb968?auto=format&fit=crop&w=800&q=80",
    start_time: new Date("2025-11-15T10:00:00Z"),
    end_time: new Date("2026-01-15T18:00:00Z"),
    location_name: "高雄駁二藝術特區",
    address: "高雄市鹽埕區大勇路1號",
    latitude: 22.623,
    longitude: 120.281,
    status: "APPROVED",
    event_type: "OFFLINE",
    ticketTypes: {
      create: [
        { name: "預售票", price: 700, total_quantity: 500, sale_start_time: new Date("2025-10-01T12:00:00Z"), sale_end_time: new Date("2025-11-14T12:00:00Z") },
        { name: "現場票", price: 900, total_quantity: 1000, sale_start_time: new Date("2025-11-15T10:00:00Z"), sale_end_time: new Date("2026-01-15T18:00:00Z") }
      ]
    },
  },

  // --- 3. 派對 (Category) ---
  {
    title: "【派對】跨年煙火派對",
    subtitle: "迎接 2026！",
    description: "在絢爛的煙火下，與大家一同迎接嶄新的一年。",
    cover_image: "https://images.unsplash.com/photo-1517457373958-b7bdd4587205?auto=format&fit=crop&w=800&q=80",
    start_time: new Date("2025-12-31T21:00:00Z"),
    end_time: new Date("2026-01-01T01:00:00Z"),
    location_name: "頂樓派對空間",
    address: "台北市信義區",
    latitude: 25.0339,
    longitude: 121.5645,
    status: "APPROVED",
    event_type: "OFFLINE",
    ticketTypes: {
      create: [{ name: "入場券", price: 1500, total_quantity: 200, sale_start_time: new Date("2025-11-01T12:00:00Z"), sale_end_time: new Date("2025-12-30T12:00:00Z") }]
    },
  },
  {
    title: "【派對】白色主題之夜",
    subtitle: "全場 DRESS CODE: 白色",
    description: "DJ 現場放送，享受純白的電子音樂之夜。",
    cover_image: "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&w=800&q=80",
    start_time: new Date("2025-11-22T22:00:00Z"),
    end_time: new Date("2025-11-23T04:00:00Z"),
    location_name: "OMNI Nightclub",
    address: "台北市大安區忠孝東路四段201號",
    latitude: 25.0419,
    longitude: 121.551,
    status: "APPROVED",
    event_type: "OFFLINE",
    ticketTypes: {
      create: [{ name: "男士票", price: 1000, total_quantity: 150, sale_start_time: new Date("2025-10-01T12:00:00Z"), sale_end_time: new Date("2025-11-22T12:00:00Z") },
               { name: "女士票", price: 800, total_quantity: 150, sale_start_time: new Date("2025-10-01T12:00:00Z"), sale_end_time: new Date("2025-11-22T12:00:00Z") }]
    },
  },

  // --- 4. 聚會 (Category) ---
  {
    title: "【聚會】桌遊派對夜",
    subtitle: "策略與歡笑",
    description: "集結各式經典與新潮桌遊，與好友們一較高下。",
    cover_image: "https://images.unsplash.com/photo-1577896851231-70ef18881754?auto=format&fit=crop&w=800&q=80",
    start_time: new Date("2025-11-29T13:00:00Z"),
    end_time: new Date("2025-11-29T22:00:00Z"),
    location_name: "桌遊地下城",
    address: "台北市中山區",
    latitude: 25.051,
    longitude: 121.52,
    status: "APPROVED",
    event_type: "OFFLINE",
    ticketTypes: {
      create: [{ name: "場地費", price: 250, total_quantity: 50, sale_start_time: new Date("2025-10-01T12:00:00Z"), sale_end_time: new Date("2025-11-29T12:00:00Z") }]
    },
  },
  {
    title: "【聚會】行動應用開發者聚會",
    subtitle: "iOS & Android",
    description: "分享 iOS 與 Android 開發技巧，交流最新技術趨勢。",
    cover_image: "https://images.unsplash.com/photo-1556740758-90de374c12ad?auto=format&fit=crop&w=800&q=80",
    start_time: new Date("2025-12-10T19:00:00Z"),
    end_time: new Date("2025-12-10T21:00:00Z"),
    location_name: "Google 台北辦公室",
    address: "台北市信義區",
    latitude: 25.0339,
    longitude: 121.5645,
    status: "APPROVED",
    event_type: "OFFLINE",
    ticketTypes: {
      create: [{ name: "免費報名", price: 0, total_quantity: 100, sale_start_time: new Date("2025-11-01T12:00:00Z"), sale_end_time: new Date("2025-12-09T12:00:00Z") }]
    },
  },

  // --- 5. 市集 (Category) ---
  {
    title: "【市集】寵物友善市集",
    subtitle: "毛孩派對",
    description: "帶上你的毛小孩，一起逛市集、交朋友。",
    cover_image: "https://images.unsplash.com/photo-1529429617124-95b109e86bb8?auto=format&fit=crop&w=800&q=80",
    start_time: new Date("2025-11-30T11:00:00Z"),
    end_time: new Date("2025-11-30T18:00:00Z"),
    location_name: "華山文創園區",
    address: "台北市中正區八德路一段1號",
    latitude: 25.0441,
    longitude: 121.5298,
    status: "APPROVED",
    event_type: "OFFLINE",
    ticketTypes: {
      create: [{ name: "免費入場", price: 0, total_quantity: 10000, sale_start_time: new Date("2025-10-01T12:00:00Z"), sale_end_time: new Date("2025-11-30T11:00:00Z") }]
    },
  },
  {
    title: "【市集】街頭美食嘉年華",
    subtitle: "滿足您的所有味蕾",
    description: "匯集全台特色小吃，一場滿足您所有味蕾的盛宴。",
    cover_image: "https://images.unsplash.com/photo-1565557623262-b51c2513a641?auto=format&fit=crop&w=800&q=80",
    start_time: new Date("2025-12-06T12:00:00Z"),
    end_time: new Date("2025-12-07T20:00:00Z"),
    location_name: "台南市藍晒圖文創園區",
    address: "台南市南區西門路一段689巷",
    latitude: 22.9842,
    longitude: 120.198,
    status: "APPROVED",
    event_type: "OFFLINE",
    ticketTypes: {
      create: [{ name: "園遊券", price: 200, total_quantity: 2000, sale_start_time: new Date("2025-10-15T12:00:00Z"), sale_end_time: new Date("2025-12-07T12:00:00Z") }]
    },
  },

  // --- 6. 比賽 (Category) ---
  {
    title: "【比賽】VR 遊戲競技場",
    subtitle: "Beat Saber 挑戰賽",
    description: "戴上 VR 頭盔，進入虛擬世界，體驗前所未有的遊戲快感。",
    cover_image: "https://images.unsplash.com/photo-1585620385358-402b2f6be8b?auto=format&fit=crop&w=800&q=80",
    start_time: new Date("2025-12-10T13:00:00Z"),
    end_time: new Date("2025-12-10T18:00:00Z"),
    location_name: "台北三創生活園區",
    address: "台北市中正區市民大道三段2號",
    latitude: 25.044,
    longitude: 121.532,
    status: "APPROVED",
    event_type: "OFFLINE",
    ticketTypes: {
      create: [{ name: "參賽券", price: 500, total_quantity: 50, sale_start_time: new Date("2025-11-01T12:00:00Z"), sale_end_time: new Date("2025-12-09T12:00:00Z") },
               { name: "觀賽券", price: 100, total_quantity: 100, sale_start_time: new Date("2025-11-01T12:00:00Z"), sale_end_time: new Date("2025-12-09T12:00:00Z") }]
    },
  },
  {
    title: "【比賽】2025高雄水陸戲獅甲",
    subtitle: "國際舞獅爭霸",
    description: "睽違六年，國際級舞獅盛會再次回到高雄市立國際游泳池！",
    cover_image: "/slide1.jpg", // [!] 使用您的範例圖
    start_time: new Date("2025-11-24T14:00:00Z"),
    end_time: new Date("2025-11-24T21:00:00Z"),
    location_name: "高雄市立國際游泳池",
    address: "高雄市苓雅區",
    latitude: 22.62,
    longitude: 120.3,
    status: "APPROVED",
    event_type: "OFFLINE",
    ticketTypes: {
      create: [{ name: "A 區", price: 800, total_quantity: 300, sale_start_time: new Date("2025-10-01T12:00:00Z"), sale_end_time: new Date("2025-11-20T12:00:00Z") },
               { name: "B 區", price: 500, total_quantity: 500, sale_start_time: new Date("2025-10-01T12:00:00Z"), sale_end_time: new Date("2025-11-20T12:00:00Z") }]
    },
  },

  // --- 7. 表演 (Category) ---
  {
    title: "【表演】獨立樂團演唱會",
    subtitle: "The Wall Live House",
    description: "感受最純粹的音樂能量，支持本地獨立音樂創作。",
    cover_image: "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?auto=format&fit=crop&w=800&q=80",
    start_time: new Date("2025-12-15T19:00:00Z"),
    end_time: new Date("2025-12-15T22:00:00Z"),
    location_name: "The Wall Live House",
    address: "台北市文山區羅斯福路四段200號",
    latitude: 25.018,
    longitude: 121.533,
    status: "APPROVED",
    event_type: "OFFLINE",
    ticketTypes: {
      create: [{ name: "預售票", price: 880, total_quantity: 150, sale_start_time: new Date("2025-11-01T12:00:00Z"), sale_end_time: new Date("2025-12-14T12:00:00Z") }]
    },
  },
  {
    title: "【表演】週末電影馬拉松",
    subtitle: "經典科幻之夜",
    description: "連續播放《銀翼殺手》、《2001太空漫遊》，享受大銀幕的震撼。",
    cover_image: "https://images.unsplash.com/photo-1536440136628-849c177e76a1?auto=format&fit=crop&w=800&q=80",
    start_time: new Date("2025-11-28T20:00:00Z"),
    end_time: new Date("2025-11-29T02:00:00Z"),
    location_name: "光點華山電影館",
    address: "台北市中正區八德路一段1號",
    latitude: 25.0441,
    longitude: 121.5298,
    status: "APPROVED",
    event_type: "OFFLINE",
    ticketTypes: {
      create: [{ name: "套票", price: 600, total_quantity: 100, sale_start_time: new Date("2025-10-15T12:00:00Z"), sale_end_time: new Date("2025-11-27T12:00:00Z") }]
    },
  },
  
  // --- 8. 研討會 (Category) ---
  {
    title: "【研討會】數位行銷實戰營",
    subtitle: "提升品牌能見度",
    description: "學習最新的數位行銷工具與策略，提升品牌能見度。",
    cover_image: "https://images.unsplash.com/photo-1557862921-37829c790f19?auto=format&fit=crop&w=800&q=80",
    start_time: new Date("2025-12-05T09:00:00Z"),
    end_time: new Date("2025-12-05T17:00:00Z"),
    location_name: "線上直播",
    address: "Google Meet",
    latitude: 25.0339,
    longitude: 121.5645,
    status: "APPROVED",
    event_type: "ONLINE",
    ticketTypes: {
      create: [{ name: "課程票", price: 1800, total_quantity: 100, sale_start_time: new Date("2025-10-15T12:00:00Z"), sale_end_time: new Date("2025-12-04T12:00:00Z") }]
    },
  },
  {
    title: "【研討會】區塊鏈技術與應用",
    subtitle: "Web3 的未來",
    description: "深入探討區塊鏈技術的基礎與未來應用潛力。",
    cover_image: "/slide3.jpg", //
    start_time: new Date("2025-11-28T14:00:00Z"),
    end_time: new Date("2025-11-28T17:00:00Z"),
    location_name: "台灣大學",
    address: "台北市大安區羅斯福路四段1號",
    latitude: 25.017,
    longitude: 121.534,
    status: "APPROVED",
    event_type: "OFFLINE",
    ticketTypes: {
      create: [{ name: "學生票", price: 300, total_quantity: 100, sale_start_time: new Date("2025-10-15T12:00:00Z"), sale_end_time: new Date("2025-11-27T12:00:00Z") },
               { name: "一般票", price: 600, total_quantity: 100, sale_start_time: new Date("2025-10-15T12:00:00Z"), sale_end_time: new Date("2025-11-27T12:00:00Z") }]
    },
  },

  // --- 9. 分享會 (Category) ---
  {
    title: "【分享會】居家調酒教學",
    subtitle: "My Bar is Your Bar",
    description: "學習基礎調酒技巧，在家也能輕鬆調製出美味雞尾酒。",
    cover_image: "https://www.1shot.tw/wp-content/uploads/2021/03/1005px-Gin-tonic-1.jpg",
    start_time: new Date("2025-12-18T19:30:00Z"),
    end_time: new Date("2025-12-18T21:30:00Z"),
    location_name: "線上直播",
    address: "Zoom",
    latitude: 25.0339,
    longitude: 121.5645,
    status: "APPROVED",
    event_type: "ONLINE",
    ticketTypes: {
      create: [{ name: "教學票 (含材料包)", price: 650, total_quantity: 50, sale_start_time: new Date("2025-11-01T12:00:00Z"), sale_end_time: new Date("2025-12-15T12:00:00Z") }]
    },
  },
  {
    title: "【分享會】植栽與花藝設計",
    subtitle: "綠化您的生活空間",
    description: "學習如何用綠色植物與美麗花朵點綴您的生活空間。",
    cover_image: "https://images.unsplash.com/photo-1587334274328-64186a80aeee?auto=format&fit=crop&w=800&q=80",
    start_time: new Date("2025-12-13T14:00:00Z"),
    end_time: new Date("2025-12-13T16:00:00Z"),
    location_name: "台北花市",
    address: "台北市內湖區新湖三路28號",
    latitude: 25.056,
    longitude: 121.57,
    status: "APPROVED",
    event_type: "OFFLINE",
    ticketTypes: {
      create: [{ name: "DIY 票", price: 700, total_quantity: 30, sale_start_time: new Date("2025-11-01T12:00:00Z"), sale_end_time: new Date("2025-12-12T12:00:00Z") }]
    },
  },

  // --- 10. 見面會 (Category) ---
  {
    title: "【見面會】百萬 YouTuber 粉絲見面會",
    subtitle: "近距離互動",
    description: "與您最喜愛的 YouTuber 見面、互動並合影留念。",
    cover_image: "https://images.unsplash.com/photo-1546410531-bb4ac68ab60b?auto=format&fit=crop&w=800&q=80",
    start_time: new Date("2025-12-20T14:00:00Z"),
    end_time: new Date("2025-12-20T17:00:00Z"),
    location_name: "台北國際會議中心 (TICC)",
    address: "台北市信義區信義路五段1號",
    latitude: 25.033,
    longitude: 121.564,
    status: "APPROVED",
    event_type: "OFFLINE",
    ticketTypes: {
      create: [{ name: "VIP 票 (含合影)", price: 1200, total_quantity: 100, sale_start_time: new Date("2025-11-15T12:00:00Z"), sale_end_time: new Date("2025-12-19T12:00:00Z") },
               { name: "一般票", price: 600, total_quantity: 300, sale_start_time: new Date("2025-11-15T12:00:00Z"), sale_end_time: new Date("2025-12-19T12:00:00Z") }]
    },
  },
  {
    title: "【見面會】人氣作家簽書會",
    subtitle: "新書《城市微光》",
    description: "與作家面對面，分享創作背後的故事。",
    cover_image: "https://images.unsplash.com/photo-1532012197267-da84d127e765?auto=format&fit=crop&w=800&q=80",
    start_time: new Date("2025-11-23T15:00:00Z"),
    end_time: new Date("2025-11-23T17:00:00Z"),
    location_name: "誠品信義店",
    address: "台北市信義區松高路11號",
    latitude: 25.040,
    longitude: 121.565,
    status: "APPROVED",
    event_type: "OFFLINE",
    ticketTypes: {
      create: [{ name: "免費入場", price: 0, total_quantity: 200, sale_start_time: new Date("2025-10-15T12:00:00Z"), sale_end_time: new Date("2025-11-23T12:00:00Z") }]
    },
  },

  // --- 11. 宣傳活動 (Category) ---
  {
    title: "【宣傳】新品發表會：Future Phone",
    subtitle: "看見未來",
    description: "見證新一代智慧型手機的誕生。",
    cover_image: "https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?auto=format&fit=crop&w=800&q=80",
    start_time: new Date("2025-11-18T14:00:00Z"),
    end_time: new Date("2025-11-18T15:00:00Z"),
    location_name: "線上直播",
    address: "YouTube Live",
    latitude: 25.0339,
    longitude: 121.5645,
    status: "APPROVED",
    event_type: "ONLINE",
    ticketTypes: {
      create: [{ name: "免費觀看", price: 0, total_quantity: 10000, sale_start_time: new Date("2025-10-15T12:00:00Z"), sale_end_time: new Date("2025-11-18T12:00:00Z") }]
    },
  },
  {
    title: "【宣傳】電玩展新作試玩",
    subtitle: "搶先體驗",
    description: "年度大作《賽博紀元》首次公開試玩。",
    cover_image: "https://images.unsplash.com/photo-1580234811497-9df7fd2f357e?auto=format&fit=crop&w=800&q=80",
    start_time: new Date("2026-01-22T10:00:00Z"),
    end_time: new Date("2026-01-25T18:00:00Z"),
    location_name: "台北電玩展 (南港展覽館)",
    address: "台北市南港區經貿二路1號",
    latitude: 25.055,
    longitude: 121.615,
    status: "APPROVED",
    event_type: "OFFLINE",
    ticketTypes: {
      create: [{ name: "電玩展門票", price: 250, total_quantity: 5000, sale_start_time: new Date("2025-12-01T12:00:00Z"), sale_end_time: new Date("2026-01-25T12:00:00Z") }]
    },
  },

  // --- 12. 導覽 (Category) ---
  {
    title: "【導覽】古蹟文化導覽",
    subtitle: "走進大稻埕",
    description: "跟隨歷史學家，探索城市中被遺忘的古老故事。",
    cover_image: "https://images.unsplash.com/photo-1569949381669-ecf31ae8e613?auto=format&fit=crop&w=800&q=80",
    start_time: new Date("2025-11-29T14:00:00Z"),
    end_time: new Date("2025-11-29T16:00:00Z"),
    location_name: "大稻埕霞海城隍廟",
    address: "台北市大同區迪化街一段61號",
    latitude: 25.056,
    longitude: 121.511,
    status: "APPROVED",
    event_type: "OFFLINE",
    ticketTypes: {
      create: [{ name: "導覽費", price: 150, total_quantity: 30, sale_start_time: new Date("2025-10-15T12:00:00Z"), sale_end_time: new Date("2025-11-28T12:00:00Z") }]
    },
  },
  {
    title: "【導覽】博物館驚魂夜",
    subtitle: "閉館後的奇妙冒險",
    description: "夜宿博物館，探索展品在夜晚的秘密生活。",
    cover_image: "https://images.unsplash.com/photo-1583896303253-17a604f057c7?auto=format&fit=crop&w=800&q=80",
    start_time: new Date("2025-12-12T20:00:00Z"),
    end_time: new Date("2025-12-13T08:00:00Z"),
    location_name: "國立故宮博物院",
    address: "台北市士林區至善路二段221號",
    latitude: 25.102,
    longitude: 121.548,
    status: "APPROVED",
    event_type: "OFFLINE",
    ticketTypes: {
      create: [{ name: "夜宿體驗票", price: 2500, total_quantity: 50, sale_start_time: new Date("2025-11-01T12:00:00Z"), sale_end_time: new Date("2025-12-10T12:00:00Z") }]
    },
  },

  // --- 13. 體驗 (Category) ---
  {
    title: "【體驗】星空下的瑜珈課",
    subtitle: "釋放壓力",
    description: "在寧靜的夜晚，跟隨星光伸展身心，釋放壓力。",
    cover_image: "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?auto=format&fit=crop&w=800&q=80",
    start_time: new Date("2025-11-27T19:00:00Z"),
    end_time: new Date("2025-11-27T20:30:00Z"),
    location_name: "大安森林公園",
    address: "台北市大安區新生南路二段1號",
    latitude: 25.032,
    longitude: 121.536,
    status: "APPROVED",
    event_type: "OFFLINE",
    ticketTypes: {
      create: [{ name: "課程券", price: 450, total_quantity: 40, sale_start_time: new Date("2025-10-15T12:00:00Z"), sale_end_time: new Date("2025-11-26T12:00:00Z") }]
    },
  },
  {
    title: "【體驗】山林健行與野餐",
    subtitle: "走入大自然",
    description: "遠離塵囂，走入山林，享受大自然的寧靜與美好。",
    cover_image: "https://images.unsplash.com/photo-1454982523318-4b6396f39d3a?auto=format&fit=crop&w=800&q=80",
    start_time: new Date("2025-12-06T08:00:00Z"),
    end_time: new Date("2025-12-06T15:00:00Z"),
    location_name: "陽明山國家公園",
    address: "台北市北投區",
    latitude: 25.16,
    longitude: 121.54,
    status: "APPROVED",
    event_type: "OFFLINE",
    ticketTypes: {
      create: [{ name: "嚮導費 (含餐點)", price: 100, total_quantity: 25, sale_start_time: new Date("2025-11-01T12:00:00Z"), sale_end_time: new Date("2025-12-05T12:00:00Z") }]
    },
  },
];

// [!!!] 3. "分類名稱" 和 "資料" 的映射
// (注意：這裡的 key 必須 100% 符合您 seed.ts 中的 categories 陣列)
export const eventsByCategory: Record<string, any[]> = {
  "課程": [
    mockEventsData[0], // React 全端
    mockEventsData[1], // 手沖咖啡
  ],
  "展覽": [
    mockEventsData[2], // 城市光影
    mockEventsData[3], // 沉浸式藝術
  ],
  "派對": [
    mockEventsData[4], // 跨年
    mockEventsData[5], // 白色主題
  ],
  "聚會": [
    mockEventsData[6], // 桌遊
    mockEventsData[7], // 開發者聚會
  ],
  "市集": [
    mockEventsData[8], // 寵物
    mockEventsData[9], // 街頭美食
  ],
  "比賽": [
    mockEventsData[10], // VR
    mockEventsData[11], // 戲獅甲
  ],
  "表演": [
    mockEventsData[12], // 獨立樂團
    mockEventsData[13], // 電影馬拉松
  ],
  "研討會": [
    mockEventsData[14], // 數位行銷
    mockEventsData[15], // 區塊鏈
  ],
  "分享會": [
    mockEventsData[16], // 居家調酒
    mockEventsData[17], // 植栽
  ],
  "見面會": [
    mockEventsData[18], // YouTuber
    mockEventsData[19], // 簽書會
  ],
  "宣傳活動": [
    mockEventsData[20], // 新品發表
    mockEventsData[21], // 電玩展
  ],
  "導覽": [
    mockEventsData[22], // 古蹟
    mockEventsData[23], // 博物館
  ],
  "體驗": [
    mockEventsData[24], // 瑜珈
    mockEventsData[25], // 健行
  ],
};