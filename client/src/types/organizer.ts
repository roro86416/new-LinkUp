// client/src/types/organizer.ts

export type EventStatus = 'PENDING' | 'APPROVED' | 'REJECTED';
export type EventType = 'OFFLINE' | 'ONLINE';

export type OrganizerEvent = {
  id: number;
  organizer_id: string;
  title: string;
  subtitle: string | null;
  description: string;
  cover_image: string;
  start_time: string; // ISO 字串
  end_time: string;   // ISO 字串
  location_name: string;
  address: string;
  latitude: string | number;
  longitude: string | number;
  status: EventStatus;
  event_type: EventType;
  online_event_url: string | null;
  category_id: number;
  created_at: string;
  updated_at: string;
};

export type OrganizerEventsResponse = {
  status: 'success';
  data: OrganizerEvent[];
};