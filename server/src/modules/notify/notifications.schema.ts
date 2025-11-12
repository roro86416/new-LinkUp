import { z } from "zod";

const targetType = z.enum(["USER", "ORGANIZER", "ALL"]);
const notificationType = z.enum([
  "system",
  "event",
  "transaction",
  "review",
  "announcement",
]);

export const createNotificationSchema = z.object({
  body: z.object({
    template_id: z.string().optional(),
    template_params: z.record(z.string(), z.any()).optional(), // 用來替換模板變數的參數
    sender_admin_id: z.string().optional(),
    target_type: targetType.default("USER"),
    target_id: z.union([z.string(), z.number()]).optional(),
    type: notificationType,
    title: z.string().min(1, "標題不能為空").max(100).optional(),
    message: z.string().min(1, "內容不能為空").optional(),
    event_id: z.number().int().optional(),
    link_url: z.string().url("請提供有效的 URL").optional(),
  }).superRefine((data, ctx) => {
    if (data.template_id) {
      // 如果有 template_id，則 title 和 message 不是必需的
      return;
    }
    if (!data.title || !data.message) {
      // 如果沒有 template_id，則 title 和 message 是必需的
      ctx.addIssue({ code: z.ZodIssueCode.custom, message: "當未使用模板時，title 和 message 為必填欄位" });
    }
  })
});

export const updateNotificationStatusSchema = z.object({
  body: z.object({
    is_read: z.boolean(),
  }),
});