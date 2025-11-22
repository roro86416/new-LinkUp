// client/src/app/(organizer)/events/eventTypes.ts

export const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:3001';

export type EventStatus = 'PENDING' | 'APPROVED' | 'REJECTED';

export type EventType = 'OFFLINE' | 'ONLINE';

export interface OrganizerEvent {
  id: number;
  organizer_id: string;
  title: string;
  subtitle?: string | null;
  description: string;
  cover_image: string;
  start_time: string; // ISO string
  end_time: string;   // ISO string
  location_name: string;
  address: string;
  latitude: string | number;
  longitude: string | number;
  status: EventStatus;
  event_type: EventType;
  online_event_url?: string | null;
  category_id: number;
  created_at?: string;
  updated_at?: string;
}

export const statusToLabel = (status: EventStatus) => {
  switch (status) {
    case 'APPROVED':
      return '已審核';
    case 'PENDING':
      return '審核中';
    case 'REJECTED':
      return '已退件';
    default:
      return status;
  }
};

export const formatDateTime = (value: string | Date) => {
  if (!value) return '';
  const d = typeof value === 'string' ? new Date(value) : value;
  return d.toLocaleString('zh-TW', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
  });
};