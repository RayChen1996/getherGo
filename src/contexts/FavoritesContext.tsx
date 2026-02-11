import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

import type { Event } from "../types/event";
import { useNotifications } from "./NotificationsContext";

const FAVORITES_KEY = "favorites:eventIds";

interface FavoritesContextValue {
  isReady: boolean;
  favoriteIds: string[];
  isFavorite: (eventId: string) => boolean;
  toggleFavorite: (event: Event) => Promise<void>;
  setFavorite: (event: Event, value: boolean) => Promise<void>;
}

const FavoritesContext = createContext<FavoritesContextValue | null>(null);

const safeParseJson = <T,>(value: string | null): T | null => {
  if (!value) return null;
  try {
    return JSON.parse(value) as T;
  } catch {
    return null;
  }
};

export const FavoritesProvider: React.FC<React.PropsWithChildren> = ({
  children,
}) => {
  const [isReady, setIsReady] = useState(false);
  const [favoriteIds, setFavoriteIds] = useState<string[]>([]);
  const { settings, scheduleRemindersForEvent, cancelRemindersForEvent } =
    useNotifications();

  const favoritesSet = useMemo(() => new Set(favoriteIds), [favoriteIds]);

  const persist = useCallback(async (next: string[]) => {
    await AsyncStorage.setItem(FAVORITES_KEY, JSON.stringify(next));
  }, []);

  useEffect(() => {
    const load = async () => {
      const raw = await AsyncStorage.getItem(FAVORITES_KEY);
      const parsed = safeParseJson<string[]>(raw);
      setFavoriteIds(Array.isArray(parsed) ? parsed : []);
      setIsReady(true);
    };
    void load();
  }, []);

  const isFavorite = useCallback(
    (eventId: string) => favoritesSet.has(eventId),
    [favoritesSet]
  );

  const setFavorite = useCallback(
    async (event: Event, value: boolean) => {
      setFavoriteIds((prev) => {
        const nextSet = new Set(prev);
        if (value) nextSet.add(event.id);
        else nextSet.delete(event.id);
        const next = Array.from(nextSet);
        void persist(next);
        return next;
      });

      if (!settings.enabled || !settings.autoScheduleOnFavorite) return;

      if (value) {
        await scheduleRemindersForEvent(event);
      } else {
        await cancelRemindersForEvent(event.id);
      }
    },
    [
      cancelRemindersForEvent,
      persist,
      scheduleRemindersForEvent,
      settings.autoScheduleOnFavorite,
      settings.enabled,
    ]
  );

  const toggleFavorite = useCallback(
    async (event: Event) => {
      const next = !favoritesSet.has(event.id);
      await setFavorite(event, next);
    },
    [favoritesSet, setFavorite]
  );

  const value: FavoritesContextValue = {
    isReady,
    favoriteIds,
    isFavorite,
    toggleFavorite,
    setFavorite,
  };

  return (
    <FavoritesContext.Provider value={value}>
      {children}
    </FavoritesContext.Provider>
  );
};

export const useFavorites = (): FavoritesContextValue => {
  const ctx = useContext(FavoritesContext);
  if (!ctx) {
    throw new Error("useFavorites must be used within FavoritesProvider");
  }
  return ctx;
};
