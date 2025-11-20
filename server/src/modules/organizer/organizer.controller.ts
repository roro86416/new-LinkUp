import { Request, Response } from "express";
import * as svc from "./organizer.service.js";

// --- Event ---
export const listEvents = async (_req: Request, res: Response) => {
  const data = await svc.listMyEvents();
  res.json({ status: "success", data });
};

export const createEvent = async (req: Request, res: Response) => {
  const data = await svc.createEvent(req.body);
  res.status(201).json({ status: "success", data });
};

export const updateEvent = async (req: Request, res: Response) => {
  const id = parseInt(req.params.eventId);
  const data = await svc.updateEvent(id, req.body);
  res.json({ status: "success", data });
};

export const deleteEvent = async (req: Request, res: Response) => {
  const id = parseInt(req.params.eventId);
  await svc.deleteEvent(id);
  res.status(204).send();
};

export const copyEvent = async (req: Request, res: Response) => {
  const id = parseInt(req.params.eventId);
  const data = await svc.copyEvent(id);
  res.status(201).json({ status: "success", data });
};

// --- Guests ---
export const addGuest = async (req: Request, res: Response) => {
  const eventId = parseInt(req.params.eventId);
  const data = await svc.addGuest(eventId, req.body);
  res.status(201).json({ status: "success", data });
};

export const updateGuest = async (req: Request, res: Response) => {
  const eventId = parseInt(req.params.eventId);
  const guestId = parseInt(req.params.guestId);
  const data = await svc.updateGuest(eventId, guestId, req.body);
  res.json({ status: "success", data });
};

export const deleteGuest = async (req: Request, res: Response) => {
  const eventId = parseInt(req.params.eventId);
  const guestId = parseInt(req.params.guestId);
  await svc.deleteGuest(eventId, guestId);
  res.status(204).send();
};

// --- Ticket Types ---
export const addTicketType = async (req: Request, res: Response) => {
  const eventId = parseInt(req.params.eventId);
  const data = await svc.addTicketType(eventId, req.body);
  res.status(201).json({ status: "success", data });
};

export const updateTicketType = async (req: Request, res: Response) => {
  const eventId = parseInt(req.params.eventId);
  const ticketTypeId = req.params.ticketTypeId;
  const data = await svc.updateTicketType(eventId, ticketTypeId, req.body);
  res.json({ status: "success", data });
};

export const deleteTicketType = async (req: Request, res: Response) => {
  const eventId = parseInt(req.params.eventId);
  const ticketTypeId = req.params.ticketTypeId;
  await svc.deleteTicketType(eventId, ticketTypeId);
  res.status(204).send();
};

// --- Coupons ---
export const addCoupon = async (req: Request, res: Response) => {
  const eventId = parseInt(req.params.eventId);
  const data = await svc.addCoupon(eventId, req.body);
  res.status(201).json({ status: "success", data });
};

export const updateCoupon = async (req: Request, res: Response) => {
  const eventId = parseInt(req.params.eventId);
  const couponId = req.params.couponId;
  const data = await svc.updateCoupon(eventId, couponId, req.body);
  res.json({ status: "success", data });
};

export const deleteCoupon = async (req: Request, res: Response) => {
  const eventId = parseInt(req.params.eventId);
  const couponId = req.params.couponId;
  await svc.deleteCoupon(eventId, couponId);
  res.status(204).send();
};

// --- Attachments ---
export const addAttachment = async (req: Request, res: Response) => {
  const eventId = parseInt(req.params.eventId);
  const data = await svc.addAttachment(eventId, req.body);
  res.status(201).json({ status: "success", data });
};

export const deleteAttachment = async (req: Request, res: Response) => {
  const eventId = parseInt(req.params.eventId);
  const attachmentId = parseInt(req.params.attachmentId);
  await svc.deleteAttachment(eventId, attachmentId);
  res.status(204).send();
};
