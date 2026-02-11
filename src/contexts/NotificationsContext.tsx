import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { Platform } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as Notifications from "expo-notifications";

import type { Event } from "../types/event";
import type { InboxItem, NotificationSettings } from "../types/notifications";
import { defaultNotificationSettings } from "../types/notifications";
import { parseEventStartAt } from "../utils/eventTime";

const SETTINGS_KEY = "notifications:settings";
const INBOX_KEY = "notifications:inbox";
const SCHEDULED_KEY = "notifications:scheduledByEvent";

type ScheduledByEvent = Record<
  string,
  {
    signup?: string;
    dayBefore?: string;
    minutesBefore?: string;
  }
>;

interface NotificationsContextValue {
  isReady: boolean;
  settings: NotificationSettings;
  updateSettings: (partial: Partial<NotificationSettings>) => Promise<void>;

  inbox: InboxItem[];
  unreadCount: number;
  markAllRead: () => Promise<void>;
  markRead: (id: string) => Promise<void>;

  ensurePermissions: () => Promise<boolean>;

  scheduleRemindersForEvent: (event: Event) => Promise<void>;
  cancelRemindersForEvent: (eventId: string) => Promise<void>;
  rescheduleRemindersForEvents: (events: Event[]) => Promise<void>;
}

const NotificationsContext = createContext<NotificationsContextValue | null>(
  null
);

const safeParseJson = <T,>(value: string | null): T | null => {
  if (!value) return null;
  try {
    return JSON.parse(value) as T;
  } catch {
    return null;
  }
};

const clampInt = (value: number, min: number, max: number) => {
  const v = Math.floor(value);
  return Math.max(min, Math.min(max, v));
};

const addDays = (date: Date, days: number) =>
  new Date(date.getTime() + days * 24 * 60 * 60 * 1000);

const addMinutes = (date: Date, minutes: number) =>
  new Date(date.getTime() + minutes * 60 * 1000);

const setHour = (date: Date, hour: number) => {
  const d = new Date(date);
  d.setHours(hour, 0, 0, 0);
  return d;
};

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: false,
    shouldSetBadge: false,
  }),
});

export const NotificationsProvider: React.FC<React.PropsWithChildren> = ({
  children,
}) => {
  const [isReady, setIsReady] = useState(false);
  const [settings, setSettings] = useState<NotificationSettings>(
    defaultNotificationSettings
  );
  const [inbox, setInbox] = useState<InboxItem[]>([]);
  const receivingListenerRef = useRef<Notifications.Subscription | null>(null);

  const unreadCount = useMemo(
    () => inbox.reduce((acc, item) => acc + (item.read ? 0 : 1), 0),
    [inbox]
  );

  const persistInbox = useCallback(async (next: InboxItem[]) => {
    await AsyncStorage.setItem(INBOX_KEY, JSON.stringify(next));
  }, []);

  const persistSettings = useCallback(async (next: NotificationSettings) => {
    await AsyncStorage.setItem(SETTINGS_KEY, JSON.stringify(next));
  }, []);

  const loadInitial = useCallback(async () => {
    const [storedSettingsRaw, storedInboxRaw] = await Promise.all([
      AsyncStorage.getItem(SETTINGS_KEY),
      AsyncStorage.getItem(INBOX_KEY),
    ]);

    const storedSettings = safeParseJson<NotificationSettings>(storedSettingsRaw);
    const storedInbox = safeParseJson<InboxItem[]>(storedInboxRaw);

    setSettings((prev) => ({
      ...prev,
      ...(storedSettings ?? {}),
    }));
    setInbox(Array.isArray(storedInbox) ? storedInbox : []);
    setIsReady(true);
  }, []);

  const ensurePermissions = useCallback(async () => {
    const current = await Notifications.getPermissionsAsync();
    if (current.granted) return true;

    const requested = await Notifications.requestPermissionsAsync();
    return requested.granted;
  }, []);

  const ensureAndroidChannel = useCallback(async () => {
    if (Platform.OS !== "android") return;
    await Notifications.setNotificationChannelAsync("default", {
      name: "default",
      importance: Notifications.AndroidImportance.DEFAULT,
    });
  }, []);

  const loadScheduledMap = useCallback(async (): Promise<ScheduledByEvent> => {
    const raw = await AsyncStorage.getItem(SCHEDULED_KEY);
    return safeParseJson<ScheduledByEvent>(raw) ?? {};
  }, []);

  const saveScheduledMap = useCallback(async (map: ScheduledByEvent) => {
    await AsyncStorage.setItem(SCHEDULED_KEY, JSON.stringify(map));
  }, []);

  const cancelRemindersForEvent = useCallback(
    async (eventId: string) => {
      const map = await loadScheduledMap();
      const scheduled = map[eventId];
      if (scheduled) {
        const ids = [scheduled.signup, scheduled.dayBefore, scheduled.minutesBefore]
          .filter(Boolean)
          .map((v) => v as string);
        await Promise.all(ids.map((id) => Notifications.cancelScheduledNotificationAsync(id)));
        delete map[eventId];
        await saveScheduledMap(map);
      }
    },
    [loadScheduledMap, saveScheduledMap]
  );

  const scheduleSingle = useCallback(
    async (event: Event, when: Date, title: string, body: string) => {
      // If it's already in the past (or too close), skip.
      if (when.getTime() <= Date.now() + 30 * 1000) return null;

      return Notifications.scheduleNotificationAsync({
        content: {
          title,
          body,
          data: {
            eventId: event.id,
          },
        },
        trigger: { date: when },
      });
    },
    []
  );

  const scheduleRemindersForEvent = useCallback(
    async (event: Event) => {
      if (!settings.enabled) return;

      const hasPermission = await ensurePermissions();
      if (!hasPermission) return;

      await ensureAndroidChannel();

      const startAt = parseEventStartAt(event);
      if (!startAt) return;

      // Always cancel existing reminders first to avoid duplicates.
      await cancelRemindersForEvent(event.id);

      const nextMap = await loadScheduledMap();
      const scheduled: ScheduledByEvent[string] = {};

      if (settings.signupReminderEnabled) {
        const leadDays = clampInt(settings.signupLeadDays, 0, 365);
        const signupAt = addDays(startAt, -leadDays);
        const id = await scheduleSingle(
          event,
          signupAt,
          "報名提醒",
          `「${event.title}」即將開始報名/預約，別錯過！`
        );
        if (id) scheduled.signup = id;
      }

      if (settings.dayBeforeEnabled) {
        const hour = clampInt(settings.dayBeforeHour, 0, 23);
        const dayBeforeAt = setHour(addDays(startAt, -1), hour);
        const id = await scheduleSingle(
          event,
          dayBeforeAt,
          "活動提醒",
          `明天要參加「${event.title}」囉！`
        );
        if (id) scheduled.dayBefore = id;
      }

      if (settings.minutesBeforeEnabled) {
        const minutes = clampInt(settings.minutesBefore, 1, 24 * 60);
        const minutesBeforeAt = addMinutes(startAt, -minutes);
        const id = await scheduleSingle(
          event,
          minutesBeforeAt,
          "活動提醒",
          `「${event.title}」即將開始（${minutes} 分鐘後）`
        );
        if (id) scheduled.minutesBefore = id;
      }

      if (scheduled.signup || scheduled.dayBefore || scheduled.minutesBefore) {
        nextMap[event.id] = scheduled;
        await saveScheduledMap(nextMap);
      }
    },
    [
      cancelRemindersForEvent,
      ensureAndroidChannel,
      ensurePermissions,
      loadScheduledMap,
      saveScheduledMap,
      scheduleSingle,
      settings,
    ]
  );

  const rescheduleRemindersForEvents = useCallback(
    async (events: Event[]) => {
      await Promise.all(events.map((e) => scheduleRemindersForEvent(e)));
    },
    [scheduleRemindersForEvent]
  );

  const updateSettings = useCallback(
    async (partial: Partial<NotificationSettings>) => {
      const next: NotificationSettings = {
        ...settings,
        ...partial,
      };
      setSettings(next);
      await persistSettings(next);
    },
    [persistSettings, settings]
  );

  const markAllRead = useCallback(async () => {
    setInbox((prev) => {
      const next = prev.map((n) => ({ ...n, read: true }));
      void persistInbox(next);
      return next;
    });
  }, [persistInbox]);

  const markRead = useCallback(
    async (id: string) => {
      setInbox((prev) => {
        const next = prev.map((n) => (n.id === id ? { ...n, read: true } : n));
        void persistInbox(next);
        return next;
      });
    },
    [persistInbox]
  );

  const pushInboxItem = useCallback(
    (item: InboxItem) => {
      setInbox((prev) => {
        if (prev.some((x) => x.id === item.id)) return prev;
        const next = [item, ...prev].slice(0, 200);
        void persistInbox(next);
        return next;
      });
    },
    [persistInbox]
  );

  useEffect(() => {
    void loadInitial();
  }, [loadInitial]);

  useEffect(() => {
    if (!isReady) return;

    // Foreground received notifications.
    receivingListenerRef.current?.remove();
    receivingListenerRef.current = Notifications.addNotificationReceivedListener(
      (notification) => {
        const id = notification.request.identifier;
        const title = notification.request.content.title ?? "通知";
        const body = notification.request.content.body ?? "";
        const data = notification.request.content.data as { eventId?: string };

        pushInboxItem({
          id,
          title,
          body,
          createdAt: Date.now(),
          read: false,
          type: "reminder",
          eventId: data?.eventId,
        });
      }
    );

    return () => {
      receivingListenerRef.current?.remove();
      receivingListenerRef.current = null;
    };
  }, [isReady, pushInboxItem]);

  const value: NotificationsContextValue = {
    isReady,
    settings,
    updateSettings,

    inbox,
    unreadCount,
    markAllRead,
    markRead,

    ensurePermissions,

    scheduleRemindersForEvent,
    cancelRemindersForEvent,
    rescheduleRemindersForEvents,
  };

  return (
    <NotificationsContext.Provider value={value}>
      {children}
    </NotificationsContext.Provider>
  );
};

export const useNotifications = (): NotificationsContextValue => {
  const ctx = useContext(NotificationsContext);
  if (!ctx) {
    throw new Error("useNotifications must be used within NotificationsProvider");
  }
  return ctx;
};
