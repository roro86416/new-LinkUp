import { z } from "zod";

// 共用
export const uuid = z.string().uuid();
export const intId = z.coerce.number().int().positive();

// -------- Event --------
export const createEventSchema = z.object({
  body: z.object({
    title: z.string().min(1),
    subtitle: z.string().optional(),
    description: z.string().min(1),
    cover_image: z.string().min(1),
    start_time: z.coerce.date(),
    end_time: z.coerce.date(),
    location_name: z.string().min(1),
    address: z.string().min(1),
    latitude: z.coerce.number(),
    longitude: z.coerce.number(),
    status: z.enum(["PENDING", "APPROVED", "REJECTED"]).default("PENDING"),
    event_type: z.enum(["OFFLINE", "ONLINE"]),
    online_event_url: z.string().url().optional(),
    category_id: intId,
  }),
});

export type CreateEventBody = z.infer<typeof createEventSchema>["body"];

export const updateEventSchema = z.object({
  body: createEventSchema.shape.body.partial(),
});

// -------- Guest --------
export const createGuestSchema = z.object({
  body: z.object({
    name: z.string().min(1),
    bio: z.string().min(1),
    photo_url: z.string().min(1),
  }),
});
export const updateGuestSchema = z.object({
  body: createGuestSchema.shape.body.partial(),
});

// -------- TicketType --------
export const createTicketTypeSchema = z.object({
  body: z.object({
    name: z.string().min(1),
    price: z.coerce.number(),
    total_quantity: z.coerce.number().int().positive(),
    sale_start_time: z.coerce.date(),
    sale_end_time: z.coerce.date(),
  }),
});
export const updateTicketTypeSchema = z.object({
  body: createTicketTypeSchema.shape.body.partial(),
});

// -------- Coupon --------
export const createCouponSchema = z.object({
  body: z.object({
    code: z.string().min(1),
    discount_type: z.enum(["PERCENTAGE", "FIXED_AMOUNT"]),
    value: z.coerce.number(),
    expires_at: z.coerce.date(),
    usage_limit: z.coerce.number().int().positive(),
  }),
});
export const updateCouponSchema = z.object({
  body: createCouponSchema.shape.body.partial(),
});

// -------- Attachment --------
export const createAttachmentSchema = z.object({
  body: z.object({
    file_name: z.string().min(1),
    file_url: z.string().min(1),
  }),
});