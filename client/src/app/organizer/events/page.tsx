'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import {
  Badge,
  Box,
  Button,
  Card,
  Group,
  LoadingOverlay,
  Stack,
  Table,
  Text,
  Title,
} from '@mantine/core';
import {
  API_BASE_URL,
  OrganizerEvent,
  formatDateTime,
  statusToLabel,
} from './eventTypes';

export default function OrganizerEventsPage() {
  const [events, setEvents] = useState<OrganizerEvent[]>([]);
  const [loading, setLoading] = useState(false);
  const [deletingId, setDeletingId] = useState<number | null>(null);
  const [copyingId, setCopyingId] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);

  const fetchEvents = async () => {
    try {
      setLoading(true);
      setError(null);

      const res = await fetch(`${API_BASE_URL}/api/v1/organizer/events`, {
        credentials: 'include',
      });

      if (!res.ok) throw new Error('載入活動失敗');

      const json = await res.json();
      setEvents(json.data ?? []);
    } catch (err: unknown) {
      console.error(err);
      setError(err instanceof Error ? err.message : '載入活動失敗');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  const handleDelete = async (id: number) => {
    if (!window.confirm('確定要刪除此活動嗎？')) return;

    try {
      setDeletingId(id);

      const res = await fetch(
        `${API_BASE_URL}/api/v1/organizer/events/${id}`,
        { method: 'DELETE', credentials: 'include' }
      );

      if (!res.ok) throw new Error('刪除失敗');

      await fetchEvents();
      alert('刪除成功');
    } catch (err: unknown) {
      console.error(err);
      alert(err instanceof Error ? err.message : '刪除失敗');
    } finally {
      setDeletingId(null);
    }
  };

  const handleCopy = async (id: number) => {
    try {
      setCopyingId(id);

      const res = await fetch(
        `${API_BASE_URL}/api/v1/organizer/events/${id}/copy`,
        { method: 'POST', credentials: 'include' }
      );

      if (!res.ok) throw new Error('複製失敗');

      await fetchEvents();
      alert('複製成功');
    } catch (err: unknown) {
      console.error(err);
      alert(err instanceof Error ? err.message : '複製失敗');
    } finally {
      setCopyingId(null);
    }
  };

  return (
    <Box p="xl">
      <Stack gap="xl">
        <Group justify="space-between">
          <div>
            <Title order={2}>活動管理</Title>
            <Text c="dimmed" size="sm" mt={4}>
              管理你建立的所有活動，進行編輯、刪除或複製。
            </Text>
          </div>

          <Button
            component={Link}
            href="/organizer/events/new"
            radius="xl"
            size="md"
          >
            ＋ 建立新活動
          </Button>
        </Group>

        <Card shadow="sm" padding="lg" radius="md" withBorder pos="relative">
          <LoadingOverlay visible={loading} />

          {error && (
            <Text c="red" mb="sm">
              {error}
            </Text>
          )}

          <Table striped highlightOnHover verticalSpacing="sm">
            <Table.Thead>
              <Table.Tr>
                <Table.Th style={{ width: 60 }}>ID</Table.Th>
                <Table.Th>活動名稱</Table.Th>
                <Table.Th>時間</Table.Th>
                <Table.Th>地點</Table.Th>
                <Table.Th style={{ width: 100 }}>狀態</Table.Th>
                <Table.Th style={{ width: 260 }}>操作</Table.Th>
              </Table.Tr>
            </Table.Thead>

            <Table.Tbody>
              {events.length === 0 && !loading && (
                <Table.Tr>
                  <Table.Td colSpan={6}>
                    <Text ta="center" c="dimmed">
                      尚無活動，點右上角「建立新活動」開始吧！
                    </Text>
                  </Table.Td>
                </Table.Tr>
              )}

              {events.map((event) => (
                <Table.Tr key={event.id}>
                  <Table.Td>{event.id}</Table.Td>

                  <Table.Td>
                    <Text fw={500}>{event.title}</Text>
                    {event.subtitle && (
                      <Text c="dimmed" size="xs">
                        {event.subtitle}
                      </Text>
                    )}
                  </Table.Td>

                  <Table.Td>
                    <Text size="sm">
                      {formatDateTime(event.start_time)} ~
                      <br />
                      {formatDateTime(event.end_time)}
                    </Text>
                  </Table.Td>

                  <Table.Td>
                    <Text size="sm">{event.location_name}</Text>
                    <Text c="dimmed" size="xs">
                      {event.address}
                    </Text>
                  </Table.Td>

                  <Table.Td>
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
                  </Table.Td>

                  <Table.Td>
                    <Group gap="xs" justify="flex-start" wrap="wrap">
                      <Button
                        size="xs"
                        variant="outline"
                        radius="xl"
                        component={Link}
                        href={`/organizer/events/${event.id}/edit`}
                      >
                        編輯
                      </Button>

                      <Button
                        size="xs"
                        variant="outline"
                        radius="xl"
                        color="red"
                        loading={deletingId === event.id}
                        onClick={() => handleDelete(event.id)}
                      >
                        刪除
                      </Button>

                      <Button
                        size="xs"
                        variant="outline"
                        radius="xl"
                        loading={copyingId === event.id}
                        onClick={() => handleCopy(event.id)}
                      >
                        複製
                      </Button>
                    </Group>
                  </Table.Td>
                </Table.Tr>
              ))}
            </Table.Tbody>
          </Table>
        </Card>
      </Stack>
    </Box>
  );
}