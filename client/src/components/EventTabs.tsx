// client/src/components/EventTabs.tsx
"use client";

import { useEffect, useState } from "react";
import { Paper, Tabs, Title, Text, Group, Loader, Avatar, Rating, Divider, } from "@mantine/core";

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

/* ⭐ 評論資料型別 */
interface Review {
  id: number;
  rating: number;
  comment: string;
  created_at: string;
  user: {
    name: string;
    avatar: string | null;
  };
}

/* ---------------- Component ---------------- */
export default function EventTabs({ eventId, description }: EventTabsProps) {/* 天氣 */
  const [weather, setWeather] = useState<Weather | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  /* ⭐ 評論狀態 */
  const [reviews, setReviews] = useState<Review[]>([]);
  const [avgRating, setAvgRating] = useState<number | null>(null);
  const [loadingReviews, setLoadingReviews] = useState<boolean>(false);
  const [reviewError, setReviewError] = useState<string | null>(null);

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

    /* -----------------------------
   * ⭐ 評論 API 串接
   * ----------------------------- */
  useEffect(() => {
    if (!eventId) return;

    async function fetchReviews() {
      try {
        setLoadingReviews(true);
        setReviewError(null);

        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/ratings/${eventId}`
        );

        const json = await res.json();
        if (!json.success) {
          setReviewError("評論資料取得失敗");
          return;
        }

        setReviews(json.data);
        setAvgRating(json.averageRating ?? null);
      } catch (err) {
        setReviewError("無法連接伺服器");
      } finally {
        setLoadingReviews(false);
      }
    }

    fetchReviews();
  }, [eventId]);

    /* ---------------- JSX ---------------- */
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

      {/* ---------------- ⭐ Comments (GET) ---------------- */}
      <Tabs.Panel value="comments" pt="md">
        <Paper p={24} withBorder radius="md">
          <Title order={4}>評論區</Title>

          {/* 平均評分 */}
          {avgRating !== null && (
            <Group mt="md">
              <Rating value={avgRating} fractions={2} readOnly />
              <Text size="sm">平均評分：{avgRating}</Text>
            </Group>
          )}

          {/* Loading */}
          {loadingReviews && <Loader mt="md" />}

          {/* Error */}
          {reviewError && (
            <Text c="red" mt="md">
              {reviewError}
            </Text>
          )}

          {/* 評論列表 */}
          {!loadingReviews &&
            reviews.map((r) => (
              <Paper key={r.id} shadow="xs" p="md" mt="md" radius="md">
                <Group align="flex-start">
                  {/* 大頭貼 */}
                  <Avatar
                    src={
                      r.user.avatar ??
                      "https://cdn-icons-png.flaticon.com/512/149/149071.png"
                    }
                    radius="xl"
                    size="lg"
                  />

                  {/* 右側內容 */}
                  <div style={{ flex: 1 }}>
                    <Group justify="space-between">
                      <Text fw={600}>{r.user.name}</Text>
                      <Rating value={r.rating} readOnly />
                    </Group>

                    <Text mt="sm">{r.comment}</Text>

                    <Text size="xs" mt="xs" c="gray.6">
                      {new Date(r.created_at).toLocaleString("zh-TW")}
                    </Text>
                  </div>
                </Group>
              </Paper>
            ))}

          {!loadingReviews && reviews.length === 0 && (
            <Text mt="md">尚無評論</Text>
          )}
        </Paper>
      </Tabs.Panel>
    </Tabs>
  );
}

