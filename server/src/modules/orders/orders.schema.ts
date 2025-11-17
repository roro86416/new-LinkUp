import { z } from "zod";

// (保留您原有的 DeliveryMethodSchema)
const DeliveryMethodSchema = z.enum(["shipping", "on_site_pickup"], {
    message: "無效的配送方式，請選擇 'shipping' 或 'on_site_pickup'",
});

// 【新增】定義單張電子票券的持有人資料規範
// 這對應您 Figma 圖片中的欄位
const ticketAttendeeSchema = z.object({
  name: z.string().min(2, "持票人姓名至少 2 個字"),
  email: z.string().email("持票人 Email 格式不正確"),
  phone: z.string().regex(/^09\d{8}$/, "持票人手機號碼格式不正確"),
  gender: z.string().optional(), // 性別為選填
});

/**
 * @desc 結帳請求的主體 (Body) 規範
 */
const orderBodySchema = z.object({
  // --- 付款人帳單資訊 (來自 Order model) ---
  billing_name: z.string().min(2, "收件人姓名至少 2 個字").max(100),
  billing_phone: z.string().regex(/^09\d{8}$/, "手機號碼格式不正確 (09開頭共10碼)"),
  payment_method: z.string().min(1, "必須選擇付款方式"),
  delivery_method: DeliveryMethodSchema, 
  billing_address: z.string().max(255).optional(), 
  coupon_code: z.string().max(20).optional(),
  total_amount: z.number().positive("總金額必須為正數"), 

  // --- 【新增】持票人資料 (來自 Ticket model) ---
  // 
  // 這是最重要的修改：
  // 我們要求前端必須傳送一個 "attendees" 陣列。
  // 注意：如果購物車中沒有票券 (只有商品)，這個陣列可以為空。
  attendees: z.array(ticketAttendeeSchema),
});

// 最終傳給 verify 中間件的 Schema
export const createOrderSchema = z.object({
  body: orderBodySchema,
});

// 導出 TypeScript 類型供 Controller 和 Service 使用
export type OrderCreateBody = z.infer<typeof orderBodySchema>;
// 【新增】導出持票人類型
export type TicketAttendee = z.infer<typeof ticketAttendeeSchema>;