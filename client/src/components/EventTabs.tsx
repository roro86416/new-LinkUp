// client/src/components/EventTabs.tsx
"use client";

import { useEffect, useState } from "react";
import { Paper, Tabs, Title, Text, Group, Button, Loader } from "@mantine/core";
import { IconHeart, IconMail, IconShare } from "@tabler/icons-react";

/* ① Props 型別 */
interface EventTabsProps {
  eventId: number;
}

/* ② 天氣資料型別 */
type Weather = {
  stationName?: string;
  obsTime?: string;
  temperature?: string | number | null;
  humidity?: string | number | null;
  windSpeed?: string | number | null;
  windDirection?: string | null;
};

export default function EventTabs({ eventId }: EventTabsProps) {
  /* ③ useState 型別 */
  const [weather, setWeather] = useState<Weather | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  /* ④ useEffect 串天氣 API */
  useEffect(() => {
    if (!eventId) return;
    async function fetchWeather() {
      try {
        setLoading(true);
        setError(null);

        const res = await fetch(`/api/events/${eventId}/weather`);
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
    <Group justify="space-between" mt="xl" align="flex-start" w="100%">
      <Tabs defaultValue="intro">
        <Tabs.List>
          <Tabs.Tab value="intro">活動簡介</Tabs.Tab>
          <Tabs.Tab value="weather">活動天氣</Tabs.Tab>
          <Tabs.Tab value="comments">評論區</Tabs.Tab>
        </Tabs.List>

        {/* Intro */}
        <Tabs.Panel value="intro" pt="md">
          <Paper p={24} withBorder radius="md" mt="md">
            <Title order={4}>活動簡介</Title>
            <Text mt="sm">這裡以後會呈現 event.description，目前是 placeholder。</Text>
          </Paper>
        </Tabs.Panel>

        {/* Weather */}
        <Tabs.Panel value="weather" pt="md">
          <Paper p={24} withBorder radius="md" mt="md">
            <Title order={4}>活動天氣</Title>

            {loading && <Loader mt="md" />}
            {error && <Text c="red" mt="md">{error}</Text>}

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

        {/* Comments */}
        <Tabs.Panel value="comments" pt="md">
          <Paper p={24} withBorder radius="md" mt="md">
            <Title order={4}>評論區</Title>
            <Text mt="sm">未串接評論資料，目前為 Layout。</Text>
          </Paper>
        </Tabs.Panel>
      </Tabs>

      {/* Right side buttons */}
</Text>
          </Paper>
        </Tabs.Panel>
      </Tabs>

      {/* Right side buttons */}
      <Group>
        <Button variant="light">立即報名</Button>
        <Button variant="default"><IconHeart size={18} /></Button>
        <Button variant="default"><IconMail size={18} /></Button>
        <Button variant="default"><IconShare size={18} /></Button>
      </Group>
    </Group>
  );
}
