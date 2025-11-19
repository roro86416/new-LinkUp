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
    // 1. 這裡再讀 env（不要在檔案頂端讀）
    const apiKey = process.env.CWB_API_KEY;
    console.log("🔑 CWB_API_KEY in service =", apiKey);

    if (!apiKey) {
      console.error("❌ CWB_API_KEY 未設定");
      throw new Error("氣象署 API 金鑰未設定");
    }

    // 2. 找活動，取經緯度
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

    const eventLat = Number(event.latitude);
    const eventLon = Number(event.longitude);

    if (Number.isNaN(eventLat) || Number.isNaN(eventLon)) {
      throw new Error("活動經緯度格式錯誤");
    }

    // 3. 呼叫中央氣象署「全測站逐時」資料
    const baseUrl =
      "https://opendata.cwa.gov.tw/api/v1/rest/datastore/O-A0001-001";

    const url = `${baseUrl}?Authorization=${encodeURIComponent(
      apiKey
    )}&format=JSON`;

    console.log("📡 Fetch URL =", url);

    const response = await axios.get(url);

    console.log("📡 氣象署回應狀態碼 =", response.status);

    if (response.status !== 200) {
      console.error("📡 氣象署回應 headers =", response.headers);
      console.error("📡 氣象署錯誤內容 =", response.data);
      throw new Error("氣象署 API 回應錯誤");
    }

    const stations: any[] = response.data?.records?.Station ?? [];

    if (stations.length === 0) {
      console.warn("⚠️ records.Station 為空");
      return { event, weather: null };
    }

    // 4. 找離活動最近的測站
    let nearestStation: any | null = null;
    let minDistance = Infinity;

    for (const st of stations) {
      const coords: any[] = st.GeoInfo?.Coordinates ?? [];

      // 依你貼的 JSON：CoordinateName: "WGS84"
      const wgs84 =
        coords.find((c: any) => c.CoordinateName === "WGS84") ?? coords[0];

      if (!wgs84) continue;

      const sLat = Number(wgs84.StationLatitude);
      const sLon = Number(wgs84.StationLongitude);
      if (Number.isNaN(sLat) || Number.isNaN(sLon)) continue;

      const dLat = eventLat - sLat;
      const dLon = eventLon - sLon;
      const distSq = dLat * dLat + dLon * dLon;

      if (distSq < minDistance) {
        minDistance = distSq;
        nearestStation = st;
      }
    }

    if (!nearestStation) {
      console.warn("⚠️ 找不到帶有座標的測站");
      return { event, weather: null };
    }

    const coords: any[] = nearestStation.GeoInfo?.Coordinates ?? [];
    const wgs84 =
      coords.find((c: any) => c.CoordinateName === "WGS84") ?? coords[0];

    console.log("✅ 選到測站：", {
      eventId,
      eventLat,
      eventLon,
      stationName: nearestStation.StationName,
      stationId: nearestStation.StationId,
      stationLat: wgs84?.StationLatitude ?? null,
      stationLon: wgs84?.StationLongitude ?? null,
    });

    // 5. 整理回傳資料
    const weatherData = {
      stationName: nearestStation.StationName,
      obsTime: nearestStation.ObsTime?.DateTime,
      temperature: nearestStation.WeatherElement?.AirTemperature,
      humidity: nearestStation.WeatherElement?.RelativeHumidity,
      windSpeed: nearestStation.WeatherElement?.WindSpeed,
      windDirection: nearestStation.WeatherElement?.WindDirection,
      rainfall: nearestStation.WeatherElement?.Now?.Precipitation,
    };

    return {
      event,
      weather: weatherData,
    };
  } catch (error) {
    console.error("❌ getEventWeatherService 錯誤：", error);
    throw new Error("天氣查詢失敗");
  }
}
