import prisma from "../../utils/prisma-only.js";
import { Prisma } from "../../generated/prisma/client.js";
import { CreateEventBody } from "./organizer.schema.js";
import { ApplyOrganizerBody } from "./organizer.schema.js";

// TODO: 登入完成後改從 req.user 取
const MOCK_ORGANIZER_ID = "00000000-0000-0000-0000-000000000001";

// -------- Event --------
export const listMyEvents = async () => {
  return prisma.event.findMany({
    where: { organizer_id: MOCK_ORGANIZER_ID },
    orderBy: { start_time: "desc" },
  });
};

export const createEvent = async (data: CreateEventBody) => {
  return prisma.event.create({
    data: {
      ...data,
      latitude: new Prisma.Decimal(String(data.latitude)),
      longitude: new Prisma.Decimal(String(data.longitude)),
      organizer_id: MOCK_ORGANIZER_ID,
    },
  });
};
export const updateEvent = async (
  eventId: number,
  data: Partial<CreateEventBody>
) => {
  // 權限檢查
  const found = await prisma.event.findFirst({
    where: { id: eventId, organizer_id: MOCK_ORGANIZER_ID },
  });
  if (!found) throw new Error("Event not found or no permission");

  return prisma.event.update({
    where: { id: eventId },
    data,
  });
};

export const deleteEvent = async (eventId: number) => {
  const found = await prisma.event.findFirst({
    where: { id: eventId, organizer_id: MOCK_ORGANIZER_ID },
  });
  if (!found) throw new Error("Event not found or no permission");

  return prisma.event.delete({ where: { id: eventId } });
};

export const copyEvent = async (eventId: number) => {
  const existing = await prisma.event.findFirst({
    where: { id: eventId, organizer_id: MOCK_ORGANIZER_ID },
  });
  if (!existing) throw new Error("Event not found or no permission");

  const { id, created_at, updated_at, ...rest } = existing as any;
  return prisma.event.create({
    data: {
      ...rest,
      title: `${existing.title} - 複製`,
    },
  });
};

// -------- Guests --------
export const addGuest = async (
  eventId: number,
  body: { name: string; bio: string; photo_url: string }
) => {
  await ensureEventOwned(eventId);
  return prisma.eventGuest.create({ data: { ...body, event_id: eventId } });
};

export const updateGuest = async (
  eventId: number,
  guestId: number,
  body: Partial<{ name: string; bio: string; photo_url: string }>
) => {
  await ensureGuestOwned(eventId, guestId);
  return prisma.eventGuest.update({ where: { id: guestId }, data: body });
};

export const deleteGuest = async (eventId: number, guestId: number) => {
  await ensureGuestOwned(eventId, guestId);
  return prisma.eventGuest.delete({ where: { id: guestId } });
};

// -------- Ticket Types --------
export const addTicketType = async (
  eventId: number,
  body: {
    name: string;
    price: number;
    total_quantity: number;
    sale_start_time: Date;
    sale_end_time: Date;
  }
) => {
  await ensureEventOwned(eventId);
  return prisma.ticketType.create({
    data: {
      event_id: eventId,
      name: body.name,
      price: body.price,
      total_quantity: body.total_quantity,
      sale_start_time: body.sale_start_time,
      sale_end_time: body.sale_end_time,
    },
  });
};

export const updateTicketType = async (
  eventId: number,
  ticketTypeId: string,
  body: Partial<{
    name: string;
    price: number;
    total_quantity: number;
    sale_start_time: Date;
    sale_end_time: Date;
  }>
) => {
  await ensureTicketTypeOwned(eventId, ticketTypeId);
  return prisma.ticketType.update({ where: { id: ticketTypeId }, data: body });
};

export const deleteTicketType = async (
  eventId: number,
  ticketTypeId: string
) => {
  await ensureTicketTypeOwned(eventId, ticketTypeId);
  return prisma.ticketType.delete({ where: { id: ticketTypeId } });
};

// -------- Coupons --------
export const addCoupon = async (
  eventId: number,
  body: {
    code: string;
    discount_type: "PERCENTAGE" | "FIXED_AMOUNT";
    value: number;
    expires_at: Date;
    usage_limit: number;
  }
) => {
  await ensureEventOwned(eventId);
  return prisma.coupon.create({
    data: {
      event_id: eventId,
      code: body.code,
      discount_type: body.discount_type,
      value: body.value,
      expires_at: body.expires_at,
      usage_limit: body.usage_limit,
    },
  });
};

export const updateCoupon = async (
  eventId: number,
  couponId: string,
  body: Partial<{
    code: string;
    discount_type: "PERCENTAGE" | "FIXED_AMOUNT";
    value: number;
    expires_at: Date;
    usage_limit: number;
  }>
) => {
  await ensureCouponOwned(eventId, couponId);
  return prisma.coupon.update({ where: { id: couponId }, data: body });
};

export const deleteCoupon = async (eventId: number, couponId: string) => {
  await ensureCouponOwned(eventId, couponId);
  return prisma.coupon.delete({ where: { id: couponId } });
};

// -------- Attachments --------
export const addAttachment = async (
  eventId: number,
  body: { file_name: string; file_url: string }
) => {
  await ensureEventOwned(eventId);
  return prisma.eventAttachment.create({
    data: { event_id: eventId, ...body },
  });
};

export const deleteAttachment = async (
  eventId: number,
  attachmentId: number
) => {
  await ensureAttachmentOwned(eventId, attachmentId);
  return prisma.eventAttachment.delete({ where: { id: attachmentId } });
};

// -------- Helpers (權限確認) --------
const ensureEventOwned = async (eventId: number) => {
  const exist = await prisma.event.findFirst({
    where: { id: eventId, organizer_id: MOCK_ORGANIZER_ID },
  });
  if (!exist) throw new Error("Event not found or no permission");
};

const ensureGuestOwned = async (eventId: number, guestId: number) => {
  const guest = await prisma.eventGuest.findFirst({
    where: {
      id: guestId,
      event_id: eventId,
      event: { organizer_id: MOCK_ORGANIZER_ID },
    },
  });
  if (!guest) throw new Error("Guest not found or no permission");
};

const ensureTicketTypeOwned = async (eventId: number, ticketTypeId: string) => {
  const tt = await prisma.ticketType.findFirst({
    where: {
      id: ticketTypeId,
      event_id: eventId,
      event: { organizer_id: MOCK_ORGANIZER_ID },
    },
  });
  if (!tt) throw new Error("TicketType not found or no permission");
};

const ensureCouponOwned = async (eventId: number, couponId: string) => {
  const c = await prisma.coupon.findFirst({
    where: {
      id: couponId,
      event_id: eventId,
    },
  });
  if (!c) throw new Error("Coupon not found or no permission");
};

const ensureAttachmentOwned = async (eventId: number, attachmentId: number) => {
  const a = await prisma.eventAttachment.findFirst({
    where: {
      id: attachmentId,
      event_id: eventId,
      event: { organizer_id: MOCK_ORGANIZER_ID },
    },
  });
  if (!a) throw new Error("Attachment not found or no permission");
};

export const applyOrganizer = async (userId: string, body: ApplyOrganizerBody) => {
  const exist = await prisma.organizer.findUnique({
    where: { user_id: userId },
  });
  if (exist) return exist;

  // 建立 organizers 資料
  const organizer = await prisma.organizer.create({
    data: {
      user_id: userId,
      org_name: body.org_name,
      org_address: body.org_address ?? null,
      org_phone: body.org_phone ?? null,
      org_tax_id: body.org_tax_id ?? null,
      org_description: body.org_description ?? null,
      is_verified: false,
    },
  });

  // 更新 user.role
  await prisma.user.update({
    where: { id: userId },
    data: { role: "ORGANIZER" },
  });

  return organizer;
};
