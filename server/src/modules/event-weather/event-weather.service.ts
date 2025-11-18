/* 功能：
1. 用 eventId 取得活動資訊（特別是 latitude / longitude）
2. 根據活動地點（經緯度）查詢氣象署天氣 API
3. 回傳簡化過、前端能用的天氣資訊
*/
// server/src/modules/event-weather/event-weather.service.ts
import prisma from "../../utils/prisma-only.js";
import axios from "axios";

export async function getEventWeatherService(eventId: number) {
  try {

    const apiKey = process.env.CWB_API_KEY;
    // 1. 找到活動，取得經緯度
    const event = await prisma.event.findUnique({
      where: { id: eventId },
      select: {
        id: true,
        title: true,
        latitude: true,
        longitude: true,
        location_name: true,
        address: true,
      },
    });

    if (!event) {
      throw new Error("找不到該活動");
    }

    if (!event.latitude || !event.longitude) {
      throw new Error("該活動未設定經緯度");
    }

    // 2. 呼叫中央氣象署 API （自動觀測站）
    const WEATHER_URL = `https://opendata.cwa.gov.tw/api/v1/rest/datastore/O-A0001-001`;

    const response = await axios.get(WEATHER_URL, {
      params: {
        Authorization: apiKey,
        format: "JSON",
        lat: event.latitude,
        lon: event.longitude,
      },
    });

    const records = response.data?.records?.Station || [];

    if (records.length === 0) {
      return {
        event,
        weather: null,
      };
    }

    // 3. 取最接近的測站資料
    const station = records[0];

    const weatherData = {
      stationName: station.StationName,
      obsTime: station.ObsTime?.DateTime,
      temperature: station.WeatherElement?.AirTemperature,
      humidity: station.WeatherElement?.RelativeHumidity,
      windSpeed: station.WeatherElement?.WindSpeed,
      windDirection: station.WeatherElement?.WindDirection,
      rainfall: station.WeatherElement?.Precipitation,
    };

    return {
      event,
      weather: weatherData,
    };
  } catch (error) {
    console.error("❌ getEventWeatherService 錯誤：", error);
    throw error;
  }
}
