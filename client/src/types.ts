//管理前端通知鈴鐺或訊息中心的資料
export interface Banner {
  id: number;
  title: string;
  imageUrl: string;
  linkUrl: string;
  isActive: boolean;
}

/**
 * 系統通知的資料結構
 */
export interface DemoNotification {
  id: string;
  title: string;
  content: string;
  type: '活動提醒' | '報名成功' | '系統公告' | '活動變更';
  sentAt: string;
  isRead: boolean;
}