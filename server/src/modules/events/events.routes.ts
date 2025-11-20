import { Router } from "express";
import * as c from "./events.controller.js"; 

const router = Router();


router.get("/", c.listEvents);

router.get("/:id", c.getEventById);


export default router;