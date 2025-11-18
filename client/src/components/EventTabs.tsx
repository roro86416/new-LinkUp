// client/src/components/EventTabs.tsx
"use client";

import { useEffect, useState } from "react";
import { Paper, Tabs, Title, Text, Group, Loader } from "@mantine/core";

/* Props：接受 eventId、eventDescription */
interface EventTabsProps {
  eventId: number;
  description: string;
}

/* 天氣資料型別 */
type Weather = {
  stationName?: string;
  obsTime?: string;
  temperature?: string | number | null;
  humidity?: string | number | null;
  windSpeed?: string | number | null;
  windDirection?: string | null;
};

export default function EventTabs({ eventId, description }: EventTabsProps) {
  const [weather, setWeather] = useState<Weather | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  /* -----------------------------
   * 天氣 API 串接
   * ----------------------------- */
  useEffect(() => {
    if (!eventId) return;

    async function fetchWeather() {
      try {
        setLoading(true);
        setError(null);

        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/events/${eventId}/weather`
        );

        const json = await res.json();

        if (!json.success) {
          setError("天氣資料取得失敗");
          return;
        }

        setWeather(json.data.weather);
      } catch (err) {
        setError("無法連接伺服器");
      } finally {
        setLoading(false);
      }
    }

    fetchWeather();
  }, [eventId]);


  return (
    <Tabs defaultValue="intro" mt="xl">
      <Tabs.List>
        <Tabs.Tab value="intro">活動簡介</Tabs.Tab>
        <Tabs.Tab value="weather">活動天氣</Tabs.Tab>
        <Tabs.Tab value="comments">評論區</Tabs.Tab>
      </Tabs.List>

      {/* ---------------- Intro：活動簡介 ---------------- */}
      <Tabs.Panel value="intro" pt="md">
        <Paper p={24} withBorder radius="md" mt="md">
          <Title order={4}>活動簡介</Title>
          <Text mt="sm">{description}</Text>
        </Paper>
      </Tabs.Panel>

      {/* ---------------- Weather：活動天氣 ---------------- */}
      <Tabs.Panel value="weather" pt="md">
        <Paper p={24} withBorder radius="md" mt="md">
          <Title order={4}>活動天氣</Title>

          {loading && <Loader mt="md" />}
          {error && (
            <Text c="red" mt="md">
              {error}
            </Text>
          )}

          {weather && (
            <div style={{ marginTop: "1rem" }}>
              <Text>氣象站：{weather.stationName}</Text>
              <Text>觀測時間：{weather.obsTime}</Text>
              <Text>氣溫：{weather.temperature} °C</Text>
              <Text>濕度：{weather.humidity} %</Text>
              <Text>風速：{weather.windSpeed} m/s</Text>
              <Text>風向：{weather.windDirection}°</Text>
            </div>
          )}
        </Paper>
      </Tabs.Panel>

      {/* ---------------- Comments（之後再串）---------------- */}
      <Tabs.Panel value="comments" pt="md">
        <Paper p={24} withBorder radius="md" mt="md">
          <Title order={4}>評論區</Title>
          <Text mt="sm">評論功能將在下一步串接。</Text>
        </Paper>
      </Tabs.Panel>
    </Tabs>
  );
}

