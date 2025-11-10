import { z } from "zod";

export const updateMemberProfileSchema = z.object({
  name: z.string().min(1, "姓名為必填"),
  gender: z.enum(["male", "female", "other"]).optional(),
  birth_date: z.string().datetime().optional(),
  address: z.string().optional(),
  phone_number: z.string().optional(),
  email: z.string().email("請輸入正確的 Email").optional(),
});

export type UpdateMemberProfileInput = z.infer<typeof updateMemberProfileSchema>;
