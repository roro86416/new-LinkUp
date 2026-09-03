// server/src/modules/orders/orders.schema.ts
import { z } from "zod";

// [新增] 為了讓 Schema 能驗證 item_type，我們需要定義這個 Enum
// 這必須與您的 Prisma Enum 保持一致
export enum ItemType {
  ticket_types = "ticket_types",
  products = "products",
}

// (保留您原本的 DeliveryMethodSchema)
const DeliveryMethodSchema = z.enum(["shipping", "on_site_pickup"], {
    message: "無效的配送方式，請選擇 'shipping' 或 'on_site_pickup'",
});

// [新增] 定義訂單中的單一項目 (Item)
// 這是新流程必須的，否則 Service 讀不到商品資料
const OrderItemSchema = z.object({
  item_type: z.nativeEnum(ItemType),
  ticket_type_id: z.string().optional(),     // 如果是票券，必填
  product_variant_id: z.number().optional(), // 如果是商品，必填
  quantity: z.number().min(1, "數量至少為 1"),
});

// [保留] 定義單張電子票券的持有人資料規範
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
  // --- 付款人帳單資訊 ---
  billing_name: z.string().min(2, "收件人姓名至少 2 個字").max(100),
  billing_phone: z.string().regex(/^09\d{8}$/, "手機號碼格式不正確 (09開頭共10碼)"),
  
  // [修正] 您前端有傳 billing_email，建議這裡加回去，或是確認前端不傳
  billing_email: z.string().email("Email 格式錯誤"), 

  payment_method: z.string().min(1, "必須選擇付款方式"),
  delivery_method: DeliveryMethodSchema, 
  billing_address: z.string().max(255).optional(), 
  coupon_code: z.string().max(20).optional(),
  total_amount: z.number().positive("總金額必須為正數"), 

  // --- [關鍵新增] 購買項目 (Items) ---
  // 這是修復 Service 錯誤的關鍵
  items: z.array(OrderItemSchema).min(1, "訂單不能為空"),

  // --- 持票人資料 ---
  attendees: z.array(ticketAttendeeSchema),
});

// 最終傳給 verify 中間件的 Schema
export const createOrderSchema = z.object({
  body: orderBodySchema,
});

// 導出 TypeScript 類型供 Controller 和 Service 使用
export type OrderCreateBody = z.infer<typeof orderBodySchema>;
export type TicketAttendee = z.infer<typeof ticketAttendeeSchema>;