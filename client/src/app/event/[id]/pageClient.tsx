// client/src/app/event/[id]/pageClient.tsx
"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import {
  Container,
  Paper,
  Stack,
  Title,
  Text,
  Group,
  Button,
  Loader,
} from "@mantine/core";
import { IconCalendar, IconPin } from "@tabler/icons-react";
import EventTabs from "../../../components/EventTabs";

interface EventDetail {
  id: number;
  title: string;
  subtitle: string;
  description: string;
  cover_image: string;
  start_time: string;
  end_time: string;
  location_name: string;
  address: string;
  organizer: {
    name: string;
    avatar: string | null;
  };
  ticketTypes: any[];
  products: any[];
}

export default function EventDetailPageClient({
  eventId,
}: {
  eventId: number;
}) {
  const baseURL = process.env.NEXT_PUBLIC_API_BASE_URL;

  const [event, setEvent] = useState<EventDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  /* ----------------------------
   *  fetch 單一活動資料
   * ---------------------------- */
  useEffect(() => {
    async function fetchEvent() {
      try {
        const res = await fetch(`${baseURL}/api/v1/events/${eventId}`, {
          cache: "no-store",
        });

        if (!res.ok) {
          setError("活動資料取得失敗");
          return;
        }

        const json = await res.json();
        setEvent(json.data);
      } catch (err) {
        setError("無法連接伺服器");
      } finally {
        setLoading(false);
      }
    }

    fetchEvent();
  }, [eventId, baseURL]);

  /* ----------------------------
   *  Loading、Error 狀態
   * ---------------------------- */
  if (loading)
    return (
      <Container size="lg" py={40}>
        <Loader />
      </Container>
    );

  if (error || !event)
    return (
      <Container size="lg" py={40}>
        <Text c="red">{error ?? "找不到活動資料"}</Text>
      </Container>
    );

  /* ----------------------------
   *  時間格式（ex: 2025/01/05 18:00）
   * ---------------------------- */
  function formatDate(dateString: string) {
    const d = new Date(dateString);
    return d.toLocaleString("zh-TW", {
      timeZone: "Asia/Taipei",
      hour12: false,
    });
  }

  /* ----------------------------
   *  Page UI
   * ---------------------------- */
  return (
    <Container size="lg" py={40}>
      <Paper shadow="md" p={32} radius="md" withBorder>
        {/* Banner */}
        <Paper mt="md" radius="md" withBorder p={0} style={{ overflow: "hidden" }}>
          <Image
            src={event.cover_image}
            alt={event.title}
            width={1200}
            height={600}
            style={{ width: "100%", height: "auto", borderRadius: "8px" }}
          />
        </Paper>

        {/* 標題 */}
        <Stack gap="sm" mt="xl">
          <Title order={1}>{event.title}</Title>
          <Title order={2}>{event.subtitle}</Title>
        </Stack>

        {/* 活動資訊 */}
        <Paper mt="xl" p={24} radius="md" withBorder>
          <Group justify="space-between" align="flex-start">
            <Stack gap="xs">
              <Group gap="xs">
                <IconCalendar size={18} />
                <Text fw={500}>開始時間：{formatDate(event.start_time)}</Text>
              </Group>

              <Group gap="xs">
                <IconCalendar size={18} />
                <Text fw={500}>結束時間：{formatDate(event.end_time)}</Text>
              </Group>

              <Group gap="xs">
                <IconPin size={18} />
                <Text fw={600}>地點：</Text>
                <Text fw={500}>{event.address}</Text>
              </Group>

              <Text fw={500} size="sm" c="gray.7">
                {event.location_name}
              </Text>

              <Text fw={500} mt="md">
                {event.description}
              </Text>

              <Button mt="md" variant="light">
                進入活動商城
              </Button>
            </Stack>

            {/* 主辦方 */}
            <Stack align="center">
              <Paper radius="xl" p="md" withBorder>
                {event.organizer.avatar ?? "無頭貼"}
              </Paper>
              <Text fw={600}>{event.organizer.name}</Text>
            </Stack>
          </Group>
        </Paper>

        {/* Tabs 區域 */}
        <EventTabs eventId={event.id} />
      </Paper>
    </Container>
  );
}
