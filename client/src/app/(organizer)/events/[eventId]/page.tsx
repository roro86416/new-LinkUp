import {
  Badge,
  Box,
  Card,
  Divider,
  Group,
  Image,
  Stack,
  Text,
  Title,
  Button,
} from '@mantine/core';
import Link from 'next/link';
import {
  API_BASE_URL,
  OrganizerEvent,
  formatDateTime,
  statusToLabel,
} from '../eventTypes';

interface PageProps {
  params: {
    eventId: string;
  };
}

async function fetchEventDetail(id: number): Promise<OrganizerEvent | null> {
  const res = await fetch(`${API_BASE_URL}/api/v1/organizer/events`, {
    cache: 'no-store',
  });

  if (!res.ok) {
    console.error('載入活動列表失敗');
    return null;
  }

  const json = await res.json();
  const list = (json.data ?? []) as OrganizerEvent[];
  return list.find((e) => e.id === id) ?? null;
}

export default async function OrganizerEventDetailPage({ params }: PageProps) {
  const id = Number(params.eventId);
  const event = !Number.isNaN(id) ? await fetchEventDetail(id) : null;

  return (
    <Box p="xl">
      {!event ? (
        <Card shadow="sm" padding="xl" radius="md" withBorder>
          <Stack gap="md">
            <Title order={3}>找不到此活動</Title>
            <Text c="dimmed" size="sm">
              請確認網址是否正確，或回到活動列表重新選擇一筆活動。
            </Text>
            <Group>
              <Button component={Link} href="/events" variant="light">
                回活動列表
              </Button>
              <Button component={Link} href="/dashboard" variant="subtle">
                回主辦方儀表板
              </Button>
            </Group>
          </Stack>
        </Card>
      ) : (
        <Stack gap="xl">
          {/* 頂部：標題 + 狀態 + 操作 */}
          <Group justify="space-between" align="flex-start">
            <div>
              <Title order={2}>{event.title}</Title>
              {event.subtitle && (
                <Text c="dimmed" mt={4}>
                  {event.subtitle}
                </Text>
              )}

              <Group mt="md" gap="xs">
                <Badge
                  variant="light"
                  color={
                    event.status === 'APPROVED'
                      ? 'green'
                      : event.status === 'PENDING'
                      ? 'yellow'
                      : 'red'
                  }
                >
                  {statusToLabel(event.status)}
                </Badge>

                <Badge variant="outline">
                  {event.event_type === 'ONLINE' ? '線上活動' : '實體活動'}
                </Badge>
              </Group>
            </div>

            <Group gap="xs">
              <Button
                variant="outline"
                component={Link}
                href={`/events/${event.id}/edit`}
              >
                編輯活動
              </Button>
              <Button component={Link} href="/events" variant="light">
                回活動列表
              </Button>
            </Group>
          </Group>

          {/* 主要內容卡片 */}
          <Card shadow="sm" padding="lg" radius="md" withBorder>
            <Stack gap="lg">
              {/* 封面 */}
              {event.cover_image && (
                <Image
                  src={event.cover_image}
                  alt={event.title}
                  radius="md"
                  mah={320}
                  fit="cover"
                />
              )}

              {/* 時間 + 地點 */}
              <Group align="flex-start" grow>
                <Stack gap={4}>
                  <Text size="sm" c="dimmed">
                    活動時間
                  </Text>
                  <Text fw={500}>
                    {formatDateTime(event.start_time)}
                    <br />~ {formatDateTime(event.end_time)}
                  </Text>
                </Stack>

                <Stack gap={4}>
                  <Text size="sm" c="dimmed">
                    活動地點
                  </Text>
                  <Text fw={500}>{event.location_name}</Text>
                  <Text size="sm" c="dimmed">
                    {event.address}
                  </Text>
                </Stack>

                {event.event_type === 'ONLINE' && event.online_event_url && (
                  <Stack gap={4}>
                    <Text size="sm" c="dimmed">
                      線上活動連結
                    </Text>
                    <Text
                      size="sm"
                      component="a"
                      href={event.online_event_url}
                      target="_blank"
                      rel="noreferrer"
                      c="blue"
                    >
                      {event.online_event_url}
                    </Text>
                  </Stack>
                )}
              </Group>

              <Divider />

              {/* 活動說明 */}
              <Stack gap={6}>
                <Text size="sm" c="dimmed">
                  活動說明
                </Text>
                <Text size="sm" style={{ whiteSpace: 'pre-wrap' }}>
                  {event.description}
                </Text>
              </Stack>

              {/* 預留：未來可以放報名統計、票種資訊等等 */}
              <Divider />
              <Text size="xs" c="dimmed">
                ※ 之後可以在此區塊加上報名人數、票券設定、銷售統計等資訊。
              </Text>
            </Stack>
          </Card>
        </Stack>
      )}
    </Box>
  );
}