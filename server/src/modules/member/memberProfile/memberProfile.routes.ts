import { Router } from "express";
import { MemberProfileController } from "./memberProfile.controller.js";
import { auth } from "../../../middleware/auth.middleware.js";

const router = Router();
const controller = new MemberProfileController();

// CRUD
router.get("/profile", auth("member"), controller.getProfile.bind(controller));
router.post("/profile", auth("member"), controller.createProfile.bind(controller));
router.put("/profile", auth("member"), controller.updateProfile.bind(controller));
router.delete("/profile", auth("member"), controller.deleteAccount.bind(controller));

export default router;
