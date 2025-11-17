import Image from "next/image";
import { Container, Paper, Stack, Title, Text, Group, Button } from "@mantine/core";
import { IconHeart, IconTag, IconPin, IconCalendar } from "@tabler/icons-react";
import EventTabs from "../../../components/EventTabs";

interface PageParams {
  id: string;
}

interface PageProps {
  params: Promise<PageParams>;
}

export default async function EventDetailPage({ params }: PageProps) {
  const { id: eventId } = await params;

  // -------------------------------------------------
  // A. 取得 Event API 資料
  // -------------------------------------------------
  const res = await fetch(
  `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/v1/events/${eventId}`,
  {
    cache: "no-store",
  }
);

  if (!res.ok) {
    return <div>找不到活動資料</div>;
  }

  const json = await res.json();
  const event = json.data; // ← 正確取得 data

  function formatDate(dateString: string) { // 日期格式轉換，去掉 .000Z），並改為台灣時間
  const d = new Date(dateString);
  return d.toLocaleString("zh-TW", {
    timeZone: "Asia/Taipei",
    hour12: false
  });
}


  return (
    <Container size="lg" py={40}>
      <Paper shadow="md" p={32} radius="md" withBorder>

        {/* ------------------------------------------------- */}
        {/* 1. Breadcrumb（目前沒有實作，所以留空即可） */}
        {/* ------------------------------------------------- */}

        {/* ------------------------------------------------- */}
        {/* 2. 活動 Cover（大 Banner 圖） ← ★ 新增區塊 */}
        {/* ------------------------------------------------- */}
        <Paper
          mt="md"
          radius="md"
          withBorder
          p={0}
          style={{ overflow: "hidden" }}
        >
          <Image
          src={event.cover_image}
          alt={event.title}
          width={1200}
          height={600}
          style={{ width: "100%", height: "auto", borderRadius: "8px" }}
        />
      </Paper>

        {/* ------------------------------------------------- */}
        {/* 3. 活動標題區（大標 + 標籤 + 收藏數量） */}
        {/* ------------------------------------------------- */}
        <Stack gap="sm" mt="xl">
          <Title order={1}>{event.title}</Title>
          <Title order={2}>{event.subtitle}</Title>

          <Group gap="xs">
            <Text size="sm">{event.is_online ? "線上活動" : "線下活動"}</Text>
            <Text size="sm">{event.category_name}</Text>
            <Group gap={4}>
              <IconHeart size={18} />
              <Text size="sm">{event.favorites_count ?? 0}</Text>
            </Group>
          </Group>
        </Stack>

        {/* ------------------------------------------------- */}
        {/* 4. 活動名片區（左：活動資訊 / 右：主辦方） */}
        {/* ------------------------------------------------- */}
        <Paper mt="xl" p={24} radius="md" withBorder>
          <Group justify="space-between" align="flex-start">
            
            {/* 左側：活動資訊 */}
            <Stack gap="xs">
              <Group gap="xs">
                <IconCalendar size={18} />
                <Text fw={500}>開始日期：{formatDate(event.start_time)}</Text>
              </Group>
              <Group gap="xs">
                <IconCalendar size={18} />
                <Text fw={500}>結束日期：{formatDate(event.end_time)}</Text>
              </Group>
              <Group gap="xs">
                <IconPin size={18} />
                <Text fw={600} size="md">地點：</Text>
                <Text fw={500} size="md">{event.address}</Text>
              </Group>
              <Text fw={500} size="sm" c="gray.7">{event.location_name}</Text>
              <Text fw={500}>相關連結：</Text>

              <Group gap="xs">
                <Text fw={500}><IconTag size={18} /></Text>
                <Text>Tags：</Text>
                {event.tags?.map((tag: string) => (
                  <Text key={tag}>#{tag}</Text>
                ))}
              </Group>
              <Text fw={500}>{event.description}</Text>

              <Button mt="md" variant="light">進入活動商城</Button>
            </Stack>

            {/* 右側：主辦方 */}
            <Stack align="center">
              <Paper radius="xl" p="md" withBorder>
                {event.organizer.avatar}
              </Paper>
              <Text fw={600}>{event.organizer.name}</Text>
            </Stack>
          </Group>
        </Paper>

        {/* ------------------------------------------------- */}
        {/* 5. Tabs 區域（整段改用 EventTabs client component） */}
        {/* ------------------------------------------------- */}
        <EventTabs event={event} />

      </Paper>
    </Container>
  );
}
