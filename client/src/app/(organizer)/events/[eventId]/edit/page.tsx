'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { Box, Card, LoadingOverlay, Text } from '@mantine/core';

// 共用：建立 / 編輯活動都用同一個表單 & type
import EventForm, {
  EventFormValues,
  fromLocalInputValue,
} from '../../EventForm';

import {
  API_BASE_URL,
  OrganizerEvent,
} from '../../eventTypes';

export default function EditEventPage() {
  // 用 useParams 拿動態路由參數（/events/[eventId]/edit）
  const params = useParams<{ eventId: string }>();
  const router = useRouter();
  const id = Number(params?.eventId);

  const [event, setEvent] = useState<OrganizerEvent | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // 先把這筆活動抓回來，塞進表單初始值
  useEffect(() => {
    if (!id || Number.isNaN(id)) {
      setError('不合法的活動編號');
      setLoading(false);
      return;
    }

    const fetchEvent = async () => {
      try {
        setLoading(true);
        setError(null);

        // 後端目前沒有單筆詳細 API，所以先抓全部再 find
        const res = await fetch(`${API_BASE_URL}/api/v1/organizer/events`, {
          credentials: 'include',
        });

        if (!res.ok) {
          throw new Error('載入活動失敗');
        }

        const json = await res.json();
        const found = (json.data as OrganizerEvent[]).find(
          (e) => e.id === id,
        );

        if (!found) {
          setError('找不到此活動');
          setEvent(null);
        } else {
          setEvent(found);
        }
      } catch (err: unknown) {
        console.error(err);
        const message =
          err instanceof Error
            ? err.message
            : typeof err === 'string'
            ? err
            : String(err);
        setError(message || '載入活動失敗');
      } finally {
        setLoading(false);
      }
    };

    fetchEvent();
  }, [id]);

  // 送出更新
  const handleSubmit = async (values: EventFormValues) => {
    if (!id || Number.isNaN(id)) {
      alert('不合法的活動編號');
      return;
    }

    const isOnline = values.event_type === 'ONLINE';
    const onlineUrl = (values.online_event_url ?? '').trim();

    // 線上活動：一定要填連結
    if (isOnline && !onlineUrl) {
      alert('線上活動請輸入「線上活動連結」。');
      return;
    }

    // 組 payload（注意：實體活動就不要放 online_event_url 這個欄位）
    const payload: any = {
      title: values.title,
      subtitle: values.subtitle ?? '',
      description: values.description,
      cover_image: values.cover_image,
      start_time: fromLocalInputValue(values.start_time),
      end_time: fromLocalInputValue(values.end_time),
      location_name: values.location_name,
      address: values.address,
      latitude: Number(values.latitude),
      longitude: Number(values.longitude),
      status: values.status,
      event_type: values.event_type,
      category_id: Number(values.category_id),
    };

    // 只有線上活動而且有填 URL 才加進 payload
    if (isOnline && onlineUrl) {
      payload.online_event_url = onlineUrl;
    }
    // 實體活動完全不放 online_event_url，讓它變成 undefined → JSON 不會帶這個 key

    try {
      setSubmitting(true);

      const res = await fetch(
        `${API_BASE_URL}/api/v1/organizer/events/${id}`,
        {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          credentials: 'include',
          body: JSON.stringify(payload),
        },
      );

      if (!res.ok) {
        const text = await res.text();
        console.error('Update event failed:', text);
        throw new Error('更新活動失敗');
      }

      alert('更新活動成功');
      // 回活動列表
      router.push('/events');
    } catch (err: unknown) {
      console.error(err);
      alert(
        err instanceof Error ? err.message : '更新活動失敗',
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Box p="xl" pos="relative">
      <Card shadow="sm" padding="xl" radius="md" withBorder pos="relative">
        <LoadingOverlay visible={loading} />

        {error && (
          <Text c="red" mb="md">
            {error}
          </Text>
        )}

        {event && (
          <EventForm
            mode="edit"
            initialEvent={event}
            submitting={submitting}
            onSubmit={handleSubmit}
          />
        )}
      </Card>
    </Box>
  );
}