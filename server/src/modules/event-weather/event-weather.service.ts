// server/src/modules/event-weather/event-weather.service.ts
import prisma from "../../utils/prisma-only.js";
import axios from "axios";

// 工具：計算兩點距離
function getDistance(lat1: number, lon1: number, lat2: number, lon2: number) {
  const R = 6371; 
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c; 
}

// 工具：提取縣市名稱
function getCityFromAddress(address: string): string {
  if (!address || address.length < 3) return "臺北市";
  let city = address.substring(0, 3).replace("台", "臺");
  if (city === '桃園縣') city = '桃園市';
  return city;
}

// 1. 取得即時觀測 (Observation) - 當預報抓不到時的備案
async function getObservationWeather(lat: number, lon: number, apiKey: string) {
  const URL = `https://opendata.cwa.gov.tw/api/v1/rest/datastore/O-A0001-001`;
  
  const response = await axios.get(URL, {
    params: { Authorization: apiKey, format: "JSON" },
  });

  const stations = response.data?.records?.Station || [];
  if (stations.length === 0) return null;

  // 找最近測站
  let nearestStation = null;
  let minDist = Infinity;
  for (const station of stations) {
    const sLat = station.GeoInfo?.Coordinates?.[0]?.StationLatitude;
    const sLon = station.GeoInfo?.Coordinates?.[0]?.StationLongitude;
    if (sLat && sLon) {
      const dist = getDistance(lat, lon, sLat, sLon);
      if (dist < minDist) {
        minDist = dist;
        nearestStation = station;
      }
    }
  }
  
  if (!nearestStation) return null;
  const station = nearestStation;
  
  let rainVal = 0;
  const rawRain = station.WeatherElement?.Precipitation ?? station.WeatherElement?.Now;
  if (typeof rawRain === 'object' && rawRain !== null) {
     rainVal = Number(Object.values(rawRain)[0] ?? 0);
  } else {
     rainVal = Number(rawRain ?? 0);
  }
  if (rainVal < 0) rainVal = 0;

  let temp = Number(station.WeatherElement?.AirTemperature ?? -99);
  if (temp < -50) temp = 0;

  return {
    isForecast: false,
    stationName: station.StationName,
    obsTime: station.ObsTime?.DateTime,
    temperature: temp,
    humidity: Number(station.WeatherElement?.RelativeHumidity ?? 0),
    windSpeed: Number(station.WeatherElement?.WindSpeed ?? 0),
    rainfall: rainVal,
    weatherDesc: "即時觀測", 
  };
}

// 2. 取得未來預報 (Forecast) - 升級為 F-C0032-005 (7天預報)
async function getForecastWeather(city: string, targetTime: Date, apiKey: string) {
  // F-C0032-005: 全臺各縣市鄉鎮未來1週逐12小時天氣預報
  // 註：氣象局 OpenData 對於 7 天預報，通常使用 F-D0047-091 (鄉鎮) 或 F-C0032-005 (縣市)
  // 這裡使用 F-C0032-005 (縣市一週) 比較穩定且好對應
  const URL = `https://opendata.cwa.gov.tw/api/v1/rest/datastore/F-C0032-005`;
  
  const response = await axios.get(URL, {
    params: { 
        Authorization: apiKey, 
        format: "JSON",
        locationName: city,
    },
  });

  const locationData = response.data?.records?.location?.[0];
  if (!locationData) return null;

  // 尋找對應時間段
  // weatherElement: Wx(天氣現象), PoP12h(降雨機率), MinT, MaxT
  const wxEl = locationData.weatherElement.find((e: any) => e.elementName === 'Wx');
  const popEl = locationData.weatherElement.find((e: any) => e.elementName === 'PoP12h');
  const minTEl = locationData.weatherElement.find((e: any) => e.elementName === 'MinT');
  const maxTEl = locationData.weatherElement.find((e: any) => e.elementName === 'MaxT');

  if (!wxEl) return null;

  const targetTs = targetTime.getTime();
  
  // 找到包含 targetTime 的時段
  const matchIdx = wxEl.time.findIndex((t: any) => {
    const start = new Date(t.startTime).getTime();
    const end = new Date(t.endTime).getTime();
    return targetTs >= start && targetTs <= end;
  });

  // 如果找不到 (例如超過 7 天)，回傳 null，切換回即時觀測
  if (matchIdx === -1) return null;

  const wx = wxEl.time[matchIdx].elementValue[0].value;
  // 降雨機率有時會是 " " (空字串)，要轉 0
  const popStr = popEl?.time[matchIdx]?.elementValue[0]?.value;
  const pop = (popStr && popStr !== " ") ? Number(popStr) : 0;
  
  const minT = Number(minTEl.time[matchIdx].elementValue[0].value);
  const maxT = Number(maxTEl.time[matchIdx].elementValue[0].value);
  const avgT = Math.round((minT + maxT) / 2);

  return {
    isForecast: true,
    stationName: city,
    obsTime: wxEl.time[matchIdx].startTime,
    temperature: avgT,
    humidity: 0, // 7天預報無濕度
    windSpeed: 0, // 7天預報無風速
    rainfall: pop, // 降雨機率 %
    weatherDesc: wx,
  };
}

// --- 主服務函式 ---
export async function getEventWeatherService(eventId: number) {
  try {
    const apiKey = process.env.CWB_API_KEY;

    const event = await prisma.event.findUnique({
      where: { id: eventId },
      select: {
        id: true,
        start_time: true,
        latitude: true,
        longitude: true,
        address: true,
      },
    });

    if (!event || !event.latitude || !event.longitude) {
      throw new Error("活動資料不完整");
    }

    const lat = Number(event.latitude);
    const lon = Number(event.longitude);

    // --- 智慧判斷邏輯 ---
    const now = new Date();
    const startTime = new Date(event.start_time);
    // 計算天數差距
    const diffDays = (startTime.getTime() - now.getTime()) / (1000 * 60 * 60 * 24);

    let weatherData = null;

    // 1. 如果活動在未來 0 ~ 7 天內，嘗試抓「一週預報」(F-C0032-005)
    if (diffDays >= 0 && diffDays <= 7) {
        try {
            const city = getCityFromAddress(event.address);
            weatherData = await getForecastWeather(city, startTime, apiKey!);
        } catch (e) {
            console.warn("預報抓取失敗，切換至即時觀測:", e);
        }
    }

    // 2. 如果沒抓到預報 (例如超過 7 天、或 API 失敗、或當天已開始)，抓「即時」(O-A0001-001)
    if (!weatherData) {
        weatherData = await getObservationWeather(lat, lon, apiKey!);
    }

    return {
      event: { id: event.id },
      weather: weatherData,
    };

  } catch (error) {
    console.error("❌ getEventWeatherService 錯誤：", error);
    return { event: null, weather: null };
  }
}