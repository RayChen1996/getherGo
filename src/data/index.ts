import eventsJson from "./events.json";
import profileJson from "./profile.json";

import type { Event, EventType } from "../types/event";
import type { User } from "../types/user";

export const mockEvents = eventsJson as Event[];

export interface ProfileMockData {
  user: User & { subtitle?: string; tags?: EventType[] };
  stats: {
    favoriteCount: number;
    uploadCount: number;
  };
  favorites: string[];
  recent: string[];
}

export const mockProfile = profileJson as unknown as ProfileMockData;
