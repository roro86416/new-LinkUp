'use client';

import { useState, useEffect } from 'react';
import type { EventStatus, EventType } from '../../types/organizer';

export type EventFormValues = {
  title: string;
  subtitle: string;
  description: string;
  cover_image: string;
  start_time: string; // datetime-local 格式
  end_time: string;
  location_name: string;
  address: string;
  status: EventStatus;
  event_type: EventType;
};

type Props = {
  mode: 'create' | 'edit';
  initialValues?: Partial<EventFormValues>;
  onSubmit: (values: EventFormValues) => Promise<void> | void;
  loading?: boolean;
};

const defaultValues: EventFormValues = {
  title: '',
  subtitle: '',
  description: '',
  cover_image: 'https://picsum.photos/1200/630',
  start_time: '',
  end_time: '',
  location_name: '',
  address: '',
  status: 'PENDING',
  event_type: 'OFFLINE',
};

export function OrganizerEventForm({
  mode,
  initialValues,
  onSubmit,
  loading,
}: Props) {
  const [values, setValues] = useState<EventFormValues>(defaultValues);
  const [submitting, setSubmitting] = useState(false);
  const isSubmitting = submitting || !!loading;

  useEffect(() => {
    setValues((prev) => ({ ...prev, ...(initialValues || {}) }));
  }, [initialValues]);

  const handleChange =
    (field: keyof EventFormValues) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
      setValues((prev) => ({ ...prev, [field]: e.target.value }));
    };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await onSubmit(values);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="max-w-3xl mx-auto space-y-6 bg-white p-6 rounded-xl shadow-sm"
    >
      <h1 className="text-2xl font-semibold">
        {mode === 'create' ? '建立活動' : '編輯活動'}
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <label className="flex flex-col gap-1">
          <span className="text-sm font-medium">活動名稱 *</span>
          <input
            className="border rounded-md px-3 py-2"
            value={values.title}
            onChange={handleChange('title')}
            required
          />
        </label>

        <label className="flex flex-col gap-1">
          <span className="text-sm font-medium">副標題</span>
          <input
            className="border rounded-md px-3 py-2"
            value={values.subtitle}
            onChange={handleChange('subtitle')}
          />
        </label>
      </div>

      <label className="flex flex-col gap-1">
        <span className="text-sm font-medium">活動說明 *</span>
        <textarea
          className="border rounded-md px-3 py-2 min-h-[120px]"
          value={values.description}
          onChange={handleChange('description')}
          required
        />
      </label>

      <label className="flex flex-col gap-1">
        <span className="text-sm font-medium">封面圖片 URL *</span>
        <input
          className="border rounded-md px-3 py-2"
          value={values.cover_image}
          onChange={handleChange('cover_image')}
          required
        />
      </label>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <label className="flex flex-col gap-1">
          <span className="text-sm font-medium">開始時間 *</span>
          <input
            type="datetime-local"
            className="border rounded-md px-3 py-2"
            value={values.start_time}
            onChange={handleChange('start_time')}
            required
          />
        </label>

        <label className="flex flex-col gap-1">
          <span className="text-sm font-medium">結束時間 *</span>
          <input
            type="datetime-local"
            className="border rounded-md px-3 py-2"
            value={values.end_time}
            onChange={handleChange('end_time')}
            required
          />
        </label>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <label className="flex flex-col gap-1">
          <span className="text-sm font-medium">地點名稱 *</span>
          <input
            className="border rounded-md px-3 py-2"
            value={values.location_name}
            onChange={handleChange('location_name')}
            required
          />
        </label>

        <label className="flex flex-col gap-1">
          <span className="text-sm font-medium">地址 *</span>
          <input
            className="border rounded-md px-3 py-2"
            value={values.address}
            onChange={handleChange('address')}
            required
          />
        </label>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <label className="flex flex-col gap-1">
          <span className="text-sm font-medium">活動狀態</span>
          <select
            className="border rounded-md px-3 py-2"
            value={values.status}
            onChange={handleChange('status')}
          >
            <option value="PENDING">PENDING（審核中）</option>
            <option value="APPROVED">APPROVED（已核准）</option>
            <option value="REJECTED">REJECTED（已退回）</option>
          </select>
        </label>

        <label className="flex flex-col gap-1">
          <span className="text-sm font-medium">活動形式</span>
          <select
            className="border rounded-md px-3 py-2"
            value={values.event_type}
            onChange={handleChange('event_type')}
          >
            <option value="OFFLINE">實體活動</option>
            <option value="ONLINE">線上活動</option>
          </select>
        </label>
      </div>

      <div className="flex justify-end gap-3">
        <button
          type="submit"
          disabled={isSubmitting}
          className="px-4 py-2 rounded-md bg-black text-white disabled:opacity-60"
        >
          {isSubmitting ? '處理中…' : mode === 'create' ? '建立活動' : '儲存變更'}
        </button>
      </div>
    </form>
  );
}

export default OrganizerEventForm;