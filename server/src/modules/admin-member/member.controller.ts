import { Request, Response, NextFunction } from "express";
import { AdminMemberService } from "./member.service.js";

const memberService = new AdminMemberService();

export const getAllMembersHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const members = await memberService.getAllMembers();
    res.status(200).json(members);
  } catch (error) {
    next(error);
  }
};