"use client";

import { useEffect, useState } from "react";
import {
  Paper,
  Tabs,
  Title,
  Text,
  Group,
  Loader,
  Avatar,
  Rating,
  Divider,
  Textarea,
  Button,
} from "@mantine/core";

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

/* 評論資料型別 */
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

/* 取得登入狀態（user + token） */
function getAuth() {
  const token = localStorage.getItem("token");
  const user = JSON.parse(localStorage.getItem("user") || "{}");
  return { token, user };
}

export default function EventTabs({ eventId, description }: EventTabsProps) {
  /* 天氣狀態 */
  const [weather, setWeather] = useState<Weather | null>(null);
  const [loadingWeather, setLoadingWeather] = useState(false);
  const [weatherError, setWeatherError] = useState<string | null>(null);

  /* 評論狀態 */
  const [reviews, setReviews] = useState<Review[]>([]);
  const [avgRating, setAvgRating] = useState<number | null>(null);
  const [loadingReviews, setLoadingReviews] = useState(false);
  const [reviewError, setReviewError] = useState<string | null>(null);

  /* 新增評論 */
  const [newRating, setNewRating] = useState<number>(0);
  const [newComment, setNewComment] = useState<string>("");
  const [posting, setPosting] = useState(false);

  /* ---------------- WEATHER API ---------------- */
  useEffect(() => {
    if (!eventId) return;

    async function fetchWeather() {
      try {
        setLoadingWeather(true);
        setWeatherError(null);

        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/events/${eventId}/weather`
        );
        const json = await res.json();

        if (!json.success) {
          setWeatherError("天氣資料取得失敗");
          return;
        }

        setWeather(json.data.weather);
      } catch (err) {
        setWeatherError("無法連接伺服器");
      } finally {
        setLoadingWeather(false);
      }
    }

    fetchWeather();
  }, [eventId]);

  /* ---------------- REVIEWS GET API ---------------- */
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

  useEffect(() => {
    if (eventId) fetchReviews();
  }, [eventId]);

  /* ----------------⭐ POST 新增評論 ---------------- */
  async function handlePostReview() {
    if (!newRating || newComment.trim() === "") return;

    const { token, user } = getAuth();

    if (!token || !user.userId) {
      setReviewError("請先登入才能發表評論");
      return;
    }

    try {
      setPosting(true);
      setReviewError(null);

      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/ratings`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            eventId: eventId,       // ⭐ 後端要求 eventId（number）
            userId: user.userId,    // ⭐ 後端要求 userId（string）
            score: newRating,       // ⭐ 後端 schema 是 score，不是 rating
            comment: newComment,
          }),
        }
      );

      const json = await res.json();

      if (!json.data) {
        setReviewError(json.message ?? "新增評論失敗");
        return;
      }

      // 新增後重新拉取評論列表（最安全、避免重算錯誤）
      await fetchReviews();

      // 清空表單
      setNewRating(0);
      setNewComment("");
    } catch (err) {
      setReviewError("無法連接伺服器");
    } finally {
      setPosting(false);
    }
  }

  /* ---------------- JSX UI ---------------- */
  return (
    <Tabs defaultValue="intro" mt="xl">
      <Tabs.List>
        <Tabs.Tab value="intro">活動簡介</Tabs.Tab>
        <Tabs.Tab value="weather">活動天氣</Tabs.Tab>
        <Tabs.Tab value="comments">評論區</Tabs.Tab>
      </Tabs.List>

      {/* 活動簡介 */}
      <Tabs.Panel value="intro" pt="md">
        <Paper p={24} withBorder radius="md">
          <Title order={4}>活動簡介</Title>
          <Text mt="sm">{description}</Text>
        </Paper>
      </Tabs.Panel>

      {/* 活動天氣 */}
      <Tabs.Panel value="weather" pt="md">
        <Paper p={24} withBorder radius="md">
          <Title order={4}>活動天氣</Title>

          {loadingWeather && <Loader mt="md" />}
          {weatherError && <Text c="red">{weatherError}</Text>}

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

      {/* ⭐ 評論區 */}
      <Tabs.Panel value="comments" pt="md">
        <Paper p={24} withBorder radius="md">
          <Title order={4}>評論區</Title>

          {/* 平均分 */}
          {avgRating !== null && (
            <Group mt="md">
              <Rating value={avgRating} fractions={2} readOnly />
              <Text size="sm">平均評分：{avgRating}</Text>
            </Group>
          )}

          <Divider my="md" />

          {/* 新增評論 */}
          <Title order={5}>發表評論</Title>

          <Rating mt="sm" value={newRating} onChange={setNewRating} />

          <Textarea
            mt="sm"
            placeholder="寫下你的感想..."
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            minRows={3}
          />

          <Button
            mt="md"
            loading={posting}
            onClick={handlePostReview}
            disabled={!newRating || newComment.trim() === ""}
          >
            發表評論
          </Button>

          {reviewError && (
            <Text c="red" mt="sm">
              {reviewError}
            </Text>
          )}

          <Divider my="lg" />

          {/* 評論列表 */}
          {loadingReviews && <Loader mt="md" />}

          {!loadingReviews &&
            reviews.map((r) => (
              <Paper key={r.id} shadow="xs" p="md" mt="md" radius="md">
                <Group align="flex-start">
                  <Avatar
                    src={
                      r.user.avatar ??
                      "https://cdn-icons-png.flaticon.com/512/149/149071.png"
                    }
                    radius="xl"
                    size="lg"
                  />

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
