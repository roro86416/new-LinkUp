// client/src/app/(organizer)/events/[eventId]/page.tsx
'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import {
  OrganizerEventForm,
  EventFormValues,
} from '../../../../components/organizer/OrganizerEventForm';
import { apiFetch } from '../../../../utils/api';
import type {
  OrganizerEvent,
  OrganizerEventsResponse,
} from '../../../../types/organizer';

export default function EditEventPage() {
  const { eventId } = useParams<{ eventId: string }>();
  const router = useRouter();
  const [event, setEvent] = useState<OrganizerEvent | null>(null);
  const [loading, setLoading] = useState(true);

  // 因為後端沒有 GET /events/:id，只好先拿列表再找那一筆
  useEffect(() => {
    const load = async () => {
      try {
        const res = await apiFetch<OrganizerEventsResponse>(
          '/api/v1/organizer/events'
        );
        const found = res.data.find(
          (e) => e.id === Number(eventId)
        );
        if (!found) {
          alert('找不到這個活動');
          router.push('/organizer/events');
          return;
        }
        setEvent(found);
      } catch (err) {
        console.error(err);
        alert('載入活動資料失敗');
        router.push('/organizer/events');
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [eventId, router]);

  const handleSubmit = async (values: EventFormValues) => {
    if (!event) return;

    const body = {
      title: values.title,
      subtitle: values.subtitle || null,
      description: values.description,
      cover_image: values.cover_image,
      start_time: new Date(values.start_time).toISOString(),
      end_time: new Date(values.end_time).toISOString(),
      location_name: values.location_name,
      address: values.address,
      latitude: 25.033964,
      longitude: 121.564468,
      status: values.status,
      event_type: values.event_type,
      online_event_url: null,
      category_id: event.category_id ?? 1,
    };

    await apiFetch(`/api/v1/organizer/events/${event.id}`, {
      method: 'PUT',
      body: JSON.stringify(body),
    });

    alert('儲存成功');
    router.push('/organizer/events');
  };

  if (loading) {
    return (
      <div className="px-8 py-6">
        <p>載入中…</p>
      </div>
    );
  }

  if (!event) return null;

  const initialValues: Partial<EventFormValues> = {
    title: event.title,
    subtitle: event.subtitle ?? '',
    description: event.description,
    cover_image: event.cover_image,
    start_time: event.start_time.slice(0, 16), // 轉成 datetime-local 格式
    end_time: event.end_time.slice(0, 16),
    location_name: event.location_name,
    address: event.address,
    status: event.status,
    event_type: event.event_type,
  };

  return (
    <div className="px-8 py-6">
      <OrganizerEventForm
        mode="edit"
        initialValues={initialValues}
        onSubmit={handleSubmit}
      />
    </div>
  );
}