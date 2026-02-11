import { useState, useMemo } from "react";
import { Event, EventType } from "../types/event";

import { mockEvents } from "../data";

export const useEvents = () => {
  const [events] = useState<Event[]>(mockEvents);

  const allEvents = useMemo(() => events, [events]);

  const getEventsByType = (type: EventType): Event[] => {
    return events.filter((event) => event.type === type);
  };

  const searchEventsByKeyword = (keyword: string): Event[] => {
    if (!keyword.trim()) {
      return events;
    }
    const lowerKeyword = keyword.toLowerCase();
    return events.filter(
      (event) =>
        event.title.toLowerCase().includes(lowerKeyword) ||
        event.location.toLowerCase().includes(lowerKeyword) ||
        event.host.toLowerCase().includes(lowerKeyword) ||
        event.groupMember?.toLowerCase().includes(lowerKeyword)
    );
  };

  const getEventById = (id: string): Event | undefined => {
    return events.find((event) => event.id === id);
  };

  return {
    allEvents,
    getEventsByType,
    searchEventsByKeyword,
    getEventById,
  };
};
