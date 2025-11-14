import express from "express";
import { getEventWeatherController } from "./event-weather.controller.js";

const router = express.Router();
// 取得活動天氣資訊
router.get("/:eventId/weather", getEventWeatherController);

export default router;
