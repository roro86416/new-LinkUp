'use client';

// client/src/app/(organizer)/events/EventForm.tsx

import { useEffect, useState } from 'react';
import {
  Button,
  Grid,
  Group,
  Select,
  Stack,
  TextInput,
  Textarea,
  Title,
} from '@mantine/core';
import type { OrganizerEvent, EventStatus, EventType } from './eventTypes';

export type EventFormValues = {
  title: string;
  subtitle: string;
  description: string;
  cover_image: string;
  start_time: string; // local datetime string (input value)
  end_time: string;
  location_name: string;
  address: string;
  latitude: string;
  longitude: string;
  status: EventStatus;
  event_type: EventType;
  online_event_url: string;
  category_id: string;
};

export const toLocalInputValue = (iso: string | Date | null | undefined) => {
  if (!iso) return '';
  const d = typeof iso === 'string' ? new Date(iso) : iso;
  const pad = (n: number) => String(n).padStart(2, '0');
  const y = d.getFullYear();
  const m = pad(d.getMonth() + 1);
  const day = pad(d.getDate());
  const h = pad(d.getHours());
  const min = pad(d.getMinutes());
  return `${y}-${m}-${day}T${h}:${min}`;
};

export const fromLocalInputValue = (value: string) => {
  return new Date(value).toISOString();
};

interface EventFormProps {
  mode: 'create' | 'edit';
  initialEvent?: OrganizerEvent | null;
  submitting: boolean;
  onSubmit: (values: EventFormValues) => Promise<void> | void;
}

const emptyValues: EventFormValues = {
  title: '',
  subtitle: '',
  description: '',
  cover_image: '',
  start_time: '',
  end_time: '',
  location_name: '',
  address: '',
  latitude: '',
  longitude: '',
  status: 'PENDING',
  event_type: 'OFFLINE',
  online_event_url: '',
  category_id: '1',
};

export default function EventForm({
  mode,
  initialEvent,
  submitting,
  onSubmit,
}: EventFormProps) {
  const [values, setValues] = useState<EventFormValues>(emptyValues);

  useEffect(() => {
    if (!initialEvent) return;

    setValues({
      title: initialEvent.title ?? '',
      subtitle: initialEvent.subtitle ?? '',
      description: initialEvent.description ?? '',
      cover_image: initialEvent.cover_image ?? '',
      start_time: toLocalInputValue(initialEvent.start_time),
      end_time: toLocalInputValue(initialEvent.end_time),
      location_name: initialEvent.location_name ?? '',
      address: initialEvent.address ?? '',
      latitude: String(initialEvent.latitude ?? ''),
      longitude: String(initialEvent.longitude ?? ''),
      status: initialEvent.status ?? 'PENDING',
      event_type: initialEvent.event_type ?? 'OFFLINE',
      online_event_url: initialEvent.online_event_url ?? '',
      category_id: String(initialEvent.category_id ?? '1'),
    });
  }, [initialEvent]);

  const handleChange =
    (field: keyof EventFormValues) =>
    (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      setValues((prev) => ({ ...prev, [field]: event.target.value }));
    };

  const handleSelectChange =
    (field: keyof EventFormValues) => (value: string | null) => {
      setValues((prev) => ({ ...prev, [field]: value ?? '' }));
    };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onSubmit(values);
  };

  return (
    <form onSubmit={handleSubmit}>
      <Stack gap="lg">
        <Title order={3}>
          {mode === 'create' ? '建立新活動' : '編輯活動'}
        </Title>

        <Grid>
          <Grid.Col span={{ base: 12, md: 8 }}>
            <Stack gap="md">
              <TextInput
                label="活動名稱"
                required
                placeholder="例：LinkUp Demo 活動"
                value={values.title}
                onChange={handleChange('title')}
              />

              <TextInput
                label="副標題"
                placeholder="例：官方測試場次"
                value={values.subtitle}
                onChange={handleChange('subtitle')}
              />

              <Textarea
                label="活動說明"
                required
                minRows={4}
                placeholder="介紹這場活動的內容、亮點、流程..."
                value={values.description}
                onChange={handleChange('description')}
              />

              <TextInput
                label="封面圖片網址"
                placeholder="https://..."
                value={values.cover_image}
                onChange={handleChange('cover_image')}
              />
            </Stack>
          </Grid.Col>

          <Grid.Col span={{ base: 12, md: 4 }}>
            <Stack gap="md">
              <TextInput
                type="datetime-local"
                label="開始時間"
                required
                value={values.start_time}
                onChange={handleChange('start_time')}
              />

              <TextInput
                type="datetime-local"
                label="結束時間"
                required
                value={values.end_time}
                onChange={handleChange('end_time')}
              />

              <TextInput
                label="場地名稱"
                placeholder="例：松菸文創園區"
                value={values.location_name}
                onChange={handleChange('location_name')}
              />

              <TextInput
                label="地址"
                placeholder="例：台北市信義區光復南路 133 號"
                value={values.address}
                onChange={handleChange('address')}
              />

              <Group grow>
                <TextInput
                  label="緯度 (lat)"
                  value={values.latitude}
                  onChange={handleChange('latitude')}
                />
                <TextInput
                  label="經度 (lng)"
                  value={values.longitude}
                  onChange={handleChange('longitude')}
                />
              </Group>

              <Select
                label="活動狀態"
                data={[
                  { value: 'PENDING', label: '審核中' },
                  { value: 'APPROVED', label: '已審核' },
                  { value: 'REJECTED', label: '已退件' },
                ]}
                value={values.status}
                onChange={handleSelectChange('status')}
              />

              <Select
                label="活動型態"
                data={[
                  { value: 'OFFLINE', label: '實體活動' },
                  { value: 'ONLINE', label: '線上活動' },
                ]}
                value={values.event_type}
                onChange={handleSelectChange('event_type')}
              />

              <TextInput
                label="線上活動連結（如果是線上活動）"
                placeholder="https://..."
                value={values.online_event_url}
                onChange={handleChange('online_event_url')}
              />

              <TextInput
                label="分類 ID"
                value={values.category_id}
                onChange={handleChange('category_id')}
              />
            </Stack>
          </Grid.Col>
        </Grid>

        <Group justify="flex-end">
          <Button type="submit" radius="xl" loading={submitting}>
            {mode === 'create' ? '建立活動' : '儲存變更'}
          </Button>
        </Group>
      </Stack>
    </form>
  );
}