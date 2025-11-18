/**
 * 獎項的資料結構定義
 */
export interface Prize {
  id: number;
  name: string; // 獎項名稱
  image: string; // 獎項圖片 URL
}

/**
 * 可自訂的獎項列表
 * 您可以在這裡新增、修改或刪除獎項
 * 圖片建議尺寸: 150x150px。我先使用 placeholder 圖片，請替換成您自己的圖片路徑。
 */
export const prizes: Prize[] = [
  { id: 1, name: '折價券 10 元', image: 'https://placehold.co/150x150/f39c12/ffffff?text=NT$10' },
  { id: 2, name: '折價券 50 元', image: 'https://placehold.co/150x150/e67e22/ffffff?text=NT$50' },
  { id: 3, name: '折價券 100 元', image: 'https://placehold.co/150x150/d35400/ffffff?text=NT$100' },
  { id: 4, name: '折價券 150 元', image: 'https://placehold.co/150x150/e74c3c/ffffff?text=NT$150' },
  { id: 5, name: '折價券 200 元', image: 'https://placehold.co/150x150/c0392b/ffffff?text=NT$200' },
];