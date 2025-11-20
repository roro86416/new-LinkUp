import { Router } from "express";
import verify from "../../middleware/verify.middleware.js";
import {
  createEventSchema,
  updateEventSchema,
  createGuestSchema,
  updateGuestSchema,
  createTicketTypeSchema,
  updateTicketTypeSchema,
  createCouponSchema,
  updateCouponSchema,
  createAttachmentSchema,
} from "./organizer.schema.js";
import * as c from "./organizer.controller.js";

const router = Router();

// Event
router.get("/events", c.listEvents);
router.post("/events", verify(createEventSchema), c.createEvent);
router.put("/events/:eventId", verify(updateEventSchema), c.updateEvent);
router.delete("/events/:eventId", c.deleteEvent);
router.post("/events/:eventId/copy", c.copyEvent);

// Guests
router.post("/events/:eventId/guests", verify(createGuestSchema), c.addGuest);
router.put(
  "/events/:eventId/guests/:guestId",
  verify(updateGuestSchema),
  c.updateGuest
);
router.delete("/events/:eventId/guests/:guestId", c.deleteGuest);

// Ticket Types
router.post(
  "/events/:eventId/ticket-types",
  verify(createTicketTypeSchema),
  c.addTicketType
);
router.put(
  "/events/:eventId/ticket-types/:ticketTypeId",
  verify(updateTicketTypeSchema),
  c.updateTicketType
);
router.delete(
  "/events/:eventId/ticket-types/:ticketTypeId",
  c.deleteTicketType
);

// Coupons
router.post(
  "/events/:eventId/coupons",
  verify(createCouponSchema),
  c.addCoupon
);
router.put(
  "/events/:eventId/coupons/:couponId",
  verify(updateCouponSchema),
  c.updateCoupon
);
router.delete("/events/:eventId/coupons/:couponId", c.deleteCoupon);

// Attachments
router.post(
  "/events/:eventId/attachments",
  verify(createAttachmentSchema),
  c.addAttachment
);
router.delete("/events/:eventId/attachments/:attachmentId", c.deleteAttachment);

export default router;
