import React, { useMemo, useState } from "react";
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  Switch,
  TextInput,
  TouchableOpacity,
} from "react-native";
import { useRouter } from "expo-router";

import { useNotifications } from "../../hooks/useNotifications";
import { useFavorites } from "../../hooks/useFavorites";
import { useEvents } from "../../hooks/useEvents";

const toInt = (value: string, fallback: number) => {
  const n = Number(value);
  return Number.isFinite(n) ? Math.floor(n) : fallback;
};

export const NotificationSettingsScreen: React.FC = () => {
  const router = useRouter();
  const { getEventById } = useEvents();
  const { favoriteIds } = useFavorites();
  const {
    settings,
    updateSettings,
    ensurePermissions,
    rescheduleRemindersForEvents,
  } = useNotifications();

  const [enabled, setEnabled] = useState(settings.enabled);
  const [autoSchedule, setAutoSchedule] = useState(
    settings.autoScheduleOnFavorite
  );

  const [signupEnabled, setSignupEnabled] = useState(settings.signupReminderEnabled);
  const [signupLeadDays, setSignupLeadDays] = useState(String(settings.signupLeadDays));

  const [dayBeforeEnabled, setDayBeforeEnabled] = useState(settings.dayBeforeEnabled);
  const [dayBeforeHour, setDayBeforeHour] = useState(String(settings.dayBeforeHour));

  const [minutesBeforeEnabled, setMinutesBeforeEnabled] = useState(settings.minutesBeforeEnabled);
  const [minutesBefore, setMinutesBefore] = useState(String(settings.minutesBefore));

  const favoriteEvents = useMemo(
    () => favoriteIds.map((id) => getEventById(id)).filter(Boolean),
    [favoriteIds, getEventById]
  );

  const handleSave = async () => {
    const next = {
      enabled,
      autoScheduleOnFavorite: autoSchedule,
      signupReminderEnabled: signupEnabled,
      signupLeadDays: toInt(signupLeadDays, settings.signupLeadDays),
      dayBeforeEnabled,
      dayBeforeHour: toInt(dayBeforeHour, settings.dayBeforeHour),
      minutesBeforeEnabled,
      minutesBefore: toInt(minutesBefore, settings.minutesBefore),
    };

    if (next.enabled) {
      await ensurePermissions();
    }

    await updateSettings(next);
    await rescheduleRemindersForEvents(favoriteEvents as any);
    router.back();
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} activeOpacity={0.8}>
          <Text style={styles.back}>← 通知設定</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => void handleSave()} activeOpacity={0.8}>
          <Text style={styles.save}>儲存</Text>
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.sectionTitle}>一般</Text>

        <Row
          title="啟用通知"
          subtitle="允許本機提醒與通知列表"
          right={
            <Switch value={enabled} onValueChange={setEnabled} />
          }
        />

        <Row
          title="收藏後自動建立提醒"
          subtitle="點♡收藏活動時自動排程"
          right={
            <Switch value={autoSchedule} onValueChange={setAutoSchedule} />
          }
        />

        <Text style={styles.sectionTitle}>報名 / 預約</Text>

        <Row
          title="報名提醒"
          subtitle="在活動開始前 N 天提醒（用於報名/預約）"
          right={
            <Switch value={signupEnabled} onValueChange={setSignupEnabled} />
          }
        />
        <InputRow
          label="提前天數"
          value={signupLeadDays}
          onChangeText={setSignupLeadDays}
          placeholder="7"
          enabled={signupEnabled}
        />

        <Text style={styles.sectionTitle}>活動提醒</Text>

        <Row
          title="活動前一天提醒"
          subtitle="在活動開始前 1 天提醒"
          right={
            <Switch value={dayBeforeEnabled} onValueChange={setDayBeforeEnabled} />
          }
        />
        <InputRow
          label="提醒小時（0-23）"
          value={dayBeforeHour}
          onChangeText={setDayBeforeHour}
          placeholder="9"
          enabled={dayBeforeEnabled}
        />

        <Row
          title="活動前幾分鐘提醒"
          subtitle="在活動開始前 X 分鐘提醒"
          right={
            <Switch
              value={minutesBeforeEnabled}
              onValueChange={setMinutesBeforeEnabled}
            />
          }
        />
        <InputRow
          label="提前分鐘"
          value={minutesBefore}
          onChangeText={setMinutesBefore}
          placeholder="60"
          enabled={minutesBeforeEnabled}
        />

        <Text style={styles.note}>
          目前活動資料只有日期（YYYY-MM-DD），系統會以當天 12:00 作為活動開始時間來計算提醒。
        </Text>
      </ScrollView>
    </View>
  );
};

const Row: React.FC<{
  title: string;
  subtitle?: string;
  right: React.ReactNode;
}> = ({ title, subtitle, right }) => {
  return (
    <View style={styles.row}>
      <View style={styles.rowText}>
        <Text style={styles.rowTitle}>{title}</Text>
        {!!subtitle && <Text style={styles.rowSub}>{subtitle}</Text>}
      </View>
      <View style={styles.rowRight}>{right}</View>
    </View>
  );
};

const InputRow: React.FC<{
  label: string;
  value: string;
  placeholder?: string;
  enabled: boolean;
  onChangeText: (v: string) => void;
}> = ({ label, value, placeholder, enabled, onChangeText }) => {
  return (
    <View style={styles.inputRow}>
      <Text style={[styles.inputLabel, !enabled && styles.disabled]}>
        {label}
      </Text>
      <TextInput
        style={[styles.input, !enabled && styles.inputDisabled]}
        value={value}
        placeholder={placeholder}
        onChangeText={onChangeText}
        keyboardType="number-pad"
        editable={enabled}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f9fafb",
  },
  header: {
    height: 56,
    backgroundColor: "#fff",
    borderBottomWidth: 1,
    borderBottomColor: "#e5e7eb",
    paddingHorizontal: 16,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  back: {
    fontSize: 16,
    color: "#6366f1",
    fontWeight: "600",
  },
  save: {
    fontSize: 16,
    color: "#111827",
    fontWeight: "700",
  },
  content: {
    padding: 16,
    paddingBottom: 40,
  },
  sectionTitle: {
    marginTop: 18,
    marginBottom: 10,
    fontSize: 14,
    fontWeight: "800",
    color: "#111827",
  },
  row: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 12,
    borderWidth: 1,
    borderColor: "#e5e7eb",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 10,
  },
  rowText: {
    flex: 1,
    paddingRight: 12,
  },
  rowTitle: {
    fontSize: 14,
    fontWeight: "700",
    color: "#111827",
    marginBottom: 2,
  },
  rowSub: {
    fontSize: 12,
    color: "#6b7280",
  },
  rowRight: {
    alignItems: "flex-end",
  },
  inputRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 6,
    marginBottom: 10,
  },
  inputLabel: {
    fontSize: 13,
    color: "#374151",
    fontWeight: "600",
  },
  input: {
    width: 90,
    height: 38,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#e5e7eb",
    paddingHorizontal: 10,
    backgroundColor: "#fff",
    textAlign: "right",
    color: "#111827",
  },
  inputDisabled: {
    backgroundColor: "#f3f4f6",
    color: "#9ca3af",
  },
  disabled: {
    color: "#9ca3af",
  },
  note: {
    marginTop: 14,
    fontSize: 12,
    color: "#6b7280",
    lineHeight: 18,
  },
});
