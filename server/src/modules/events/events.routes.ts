import { Router } from "express";
import * as c from "./events.controller.js"; 

const router = Router();


// 可測試 http://localhost:3001/api/v1/events/test
router.get("/test", (req, res) => {
  res.send("events module ok");
});

// http://localhost:3001/api/v1/events
router.get("/", c.listEvents);

// http://localhost:3001/api/v1/events/45
router.get("/:id", c.getEventById);


export default router;