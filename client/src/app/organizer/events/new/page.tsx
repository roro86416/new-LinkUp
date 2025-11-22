// client/src/app/organizer/events/new/page.tsx
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Box, Card, Stack } from "@mantine/core";
import EventForm, { EventFormValues, fromLocalInputValue } from "../EventForm";
import { API_BASE_URL } from "../eventTypes";

export default function NewEventPage() {
  const [submitting, setSubmitting] = useState(false);
  const router = useRouter();

  const handleSubmit = async (values: EventFormValues) => {
  try {
    setSubmitting(true);

    const payload = {
      title: values.title,
      subtitle: values.subtitle || '',
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

      // 🔧 重點在這一行：永遠送 string，不送 null
      online_event_url:
        values.event_type === 'ONLINE'
          ? (values.online_event_url ?? '').trim()
          : '',

      category_id: Number(values.category_id),
    };

    const res = await fetch(`${API_BASE_URL}/api/v1/organizer/events`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify(payload),
    });

    if (!res.ok) {
      const text = await res.text();
      console.error('Create event failed:', text);
      throw new Error('建立活動失敗');
    }

    alert('建立活動成功');
    // 比方說導回活動列表
    router.push('/organizer/events');
  } catch (err) {
    console.error(err);
    alert(err instanceof Error ? err.message : '建立活動失敗');
  } finally {
    setSubmitting(false);
  }
};
  return (
    <Box p="xl">
      <Card shadow="sm" padding="xl" radius="md" withBorder>
        <Stack>
          <EventForm
            mode="create"
            submitting={submitting}
            onSubmit={handleSubmit}
          />
        </Stack>
      </Card>
    </Box>
  );
}
