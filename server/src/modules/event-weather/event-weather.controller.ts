// server/src/modules/event-weather/event-weather.controller.ts
import { Request, Response } from "express";
import { getEventWeatherSchema } from "./event-weather.schema.js";
import { getEventWeatherService } from "./event-weather.service.js";

export async function getEventWeatherController(req: Request, res: Response) {
  try {
    // 1. 驗證路徑參數
    const parsed = getEventWeatherSchema.parse({
      params: req.params,
    });

    const { eventId } = parsed.params;

    // 2. 呼叫 service（下一步實作）
    const weather = await getEventWeatherService(eventId);

    return res.status(200).json({
      success: true,
      message: "天氣查詢成功",
      data: weather,
    });
  } catch (error: any) {
    console.error("❌ getEventWeather 錯誤：", error);

    if (error.name === "ZodError") {
      return res.status(400).json({
        success: false,
        message: "路徑參數格式錯誤",
        errors: error.errors,
      });
    }

    return res.status(500).json({
      success: false,
      message: "天氣查詢失敗",
    });
  }
}
