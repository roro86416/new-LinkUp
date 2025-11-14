// client/src/app/%28organizer%29/dashboard/page.tsx
'use client';

import {
  Tabs, Title, Button, Group, Stack, Card, Image, Text, Badge, Menu, ActionIcon, rem,
} from '@mantine/core';
import { IoAdd, IoEllipsisVertical, IoPencil, IoCopy, IoTrash } from 'react-icons/io5';
import Link from 'next/link';

type OrganizerEventStatus = 'DRAFT' | 'PENDING' | 'APPROVED' | 'ENDED';

interface EventSummary {
  registrants: number;
  sales: number;
}

interface OrganizerEvent {
  id: number;
  title: string;
  status: OrganizerEventStatus;
  start_time: string;
  cover_image: string;
  summary: EventSummary;
}

const MOCK_EVENTS_DATA: OrganizerEvent[] = [
  {
    id: 1,
    title: '我的第一個模擬活動 (草稿)',
    status: 'DRAFT',
    start_time: '2025-12-15T10:00:00Z',
    cover_image: 'https://placehold.co/600x400/999/white?text=Draft+Event',
    summary: { registrants: 0, sales: 0 },
  },
  {
    id: 2,
    title: '已發布的科技研討會',
    status: 'APPROVED',
    start_time: '2025-11-20T14:00:00Z',
    cover_image: 'https://placehold.co/600x400/blue/white?text=Published',
    summary: { registrants: 120, sales: 50000 },
  },
  {
    id: 3,
    title: '等待審核的行銷講座',
    status: 'PENDING',
    start_time: '2025-11-25T18:00:00Z',
    cover_image: 'https://placehold.co/600x400/orange/white?text=Pending',
    summary: { registrants: 10, sales: 1500 },
  },
];

const getStatusColor = (status: OrganizerEventStatus) => {
  switch (status) {
    case 'APPROVED':
      return 'green';
    case 'PENDING':
      return 'orange';
    case 'ENDED':
      return 'gray';

    case 'DRAFT':
    default:
      return 'gray';
  }
};

export default function OrganizerDashboard() {
  const events = MOCK_EVENTS_DATA;

  const eventCards = events.map((event) => (
    <Card shadow="sm" padding="lg" radius="md" withBorder key={event.id}>
      <Card.Section>
        <Image src={event.cover_image} height={160} alt={`封面圖: ${event.title}`} />
      </Card.Section>

      <Group justify="space-between" mt="md" mb="xs">
        <Text fw={500} truncate>{event.title}</Text>
        <Badge color={getStatusColor(event.status)}>{event.status}</Badge>
      </Group>

      <Text size="sm" c="dimmed">
        {new Date(event.start_time).toLocaleString('zh-TW')}
      </Text>

      <Group justify="space-between" mt="md" c="dimmed">
        <Text size="sm">報名人數: {event.summary.registrants}</Text>
        <Text size="sm">銷售: ${event.summary.sales.toLocaleString()}</Text>
      </Group>

      <Group justify="flex-end" mt="md">
        <Menu shadow="md" width={200}>
          <Menu.Target>
            <ActionIcon variant="light" color="gray">
              <IoEllipsisVertical style={{ width: rem(16), height: rem(16) }} />
            </ActionIcon>
          </Menu.Target>
          <Menu.Dropdown>
            <Menu.Item leftSection={<IoPencil style={{ width: rem(14), height: rem(14) }} />}>
              編輯
            </Menu.Item>
            <Menu.Item leftSection={<IoCopy style={{ width: rem(14), height: rem(14) }} />}>
              複製
            </Menu.Item>
            <Menu.Item color="red" leftSection={<IoTrash style={{ width: rem(14), height: rem(14) }} />}>
              刪除
            </Menu.Item>
          </Menu.Dropdown>
        </Menu>
      </Group>
    </Card>
  ));

  return (
    <Stack>
      <Group justify="space-between">
        <Title order={2}>活動列表</Title>
        <Button leftSection={<IoAdd size={14} />} component={Link} href="/events/new">
          建立新活動
        </Button>
      </Group>

      <Tabs defaultValue="all">
        <Tabs.List>
          <Tabs.Tab value="draft">草稿</Tabs.Tab>
          <Tabs.Tab value="pending">審核中</Tabs.Tab>
          <Tabs.Tab value="published">已發布</Tabs.Tab>
          <Tabs.Tab value="ended">已結束</Tabs.Tab>
          <Tabs.Tab value="all">全部</Tabs.Tab>
        </Tabs.List>

        <Tabs.Panel value="all" pt="md">
          <Stack>{eventCards}</Stack>
        </Tabs.Panel>
      </Tabs>
    </Stack>
  );
}