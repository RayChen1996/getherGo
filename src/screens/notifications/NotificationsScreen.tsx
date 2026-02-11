import React from "react";
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import { useRouter } from "expo-router";

import { useNotifications } from "../../hooks/useNotifications";

export const NotificationsScreen: React.FC = () => {
  const router = useRouter();
  const { inbox, unreadCount, markAllRead, markRead } = useNotifications();

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} activeOpacity={0.8}>
          <Text style={styles.back}>← 通知</Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => void markAllRead()}
          activeOpacity={0.8}
          disabled={unreadCount === 0}
        >
          <Text
            style={[
              styles.markAll,
              unreadCount === 0 && styles.markAllDisabled,
            ]}
          >
            全部標為已讀
          </Text>
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        {inbox.length === 0 ? (
          <View style={styles.empty}>
            <Text style={styles.emptyIcon}>🔔</Text>
            <Text style={styles.emptyTitle}>目前沒有通知</Text>
            <Text style={styles.emptySub}>收藏活動後會在這裡看到提醒</Text>
          </View>
        ) : (
          inbox.map((item) => (
            <TouchableOpacity
              key={item.id}
              style={[styles.item, !item.read && styles.itemUnread]}
              activeOpacity={0.85}
              onPress={() => {
                void markRead(item.id);
                if (item.eventId) {
                  router.push(`/event/${item.eventId}`);
                }
              }}
            >
              <View style={styles.itemIconWrap}>
                <Text style={styles.itemIcon}>🔔</Text>
              </View>
              <View style={styles.itemText}>
                <Text style={styles.itemTitle} numberOfLines={1}>
                  {item.title}
                </Text>
                <Text style={styles.itemBody} numberOfLines={2}>
                  {item.body}
                </Text>
              </View>
              {!item.read && <View style={styles.unreadDot} />}
            </TouchableOpacity>
          ))
        )}
      </ScrollView>
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
  markAll: {
    fontSize: 14,
    color: "#6366f1",
    fontWeight: "600",
  },
  markAllDisabled: {
    color: "#9ca3af",
  },
  content: {
    padding: 12,
  },
  empty: {
    paddingTop: 80,
    alignItems: "center",
  },
  emptyIcon: {
    fontSize: 40,
    marginBottom: 12,
  },
  emptyTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: "#111827",
    marginBottom: 6,
  },
  emptySub: {
    fontSize: 13,
    color: "#6b7280",
  },
  item: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 12,
    marginBottom: 10,
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#e5e7eb",
  },
  itemUnread: {
    borderColor: "#c7d2fe",
    backgroundColor: "#eef2ff",
  },
  itemIconWrap: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: "#e0e7ff",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 10,
  },
  itemIcon: {
    fontSize: 16,
  },
  itemText: {
    flex: 1,
  },
  itemTitle: {
    fontSize: 14,
    fontWeight: "700",
    color: "#111827",
    marginBottom: 2,
  },
  itemBody: {
    fontSize: 13,
    color: "#6b7280",
  },
  unreadDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: "#ef4444",
    marginLeft: 8,
  },
});
