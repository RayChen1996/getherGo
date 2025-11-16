export type EventType = 'fan' | 'concert' | 'exhibition' | 'other';

export type EventStatus = 'pending' | 'approved' | 'rejected';

export interface Event {
  id: string;
  title: string;
  type: EventType;
  location: string;
  startDate: string;
  endDate?: string;
  host: string;
  thumbnailUrl: string;
  description?: string;
  status?: EventStatus;
  groupMember?: string;
}

