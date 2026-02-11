import React, { useMemo, useState } from "react";
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Alert,
} from "react-native";
import { useRouter } from "expo-router";

import { useAuth } from "../../hooks/useAuth";
import { useEvents } from "../../hooks/useEvents";
import { useFavorites } from "../../hooks/useFavorites";
import { useNotifications } from "../../hooks/useNotifications";
import { mockProfile } from "../../data";

import { Button } from "../../components/common/Button";
import { EventCard } from "../../components/event/EventCard";
import { Tag } from "../../components/common/Tag";
import type { EventType } from "../../types/event";

type Segment = "favorites" | "recent";

export const ProfileScreen: React.FC = () => {
  const router = useRouter();
  const { isLoggedIn, user, logout } = useAuth();
  const { getEventById } = useEvents();
  const { favoriteIds } = useFavorites();
  const { unreadCount } = useNotifications();
  const [segment, setSegment] = useState<Segment>("favorites");

  const displayUser = user ?? mockProfile.user;
  const subtitle =
    (displayUser as typeof mockProfile.user).subtitle ??
    mockProfile.user.subtitle ??
    "";
  const tags = ((displayUser as typeof mockProfile.user).tags ??
    mockProfile.user.tags ??
    []) as EventType[];

  const favorites = useMemo(() => {
    return favoriteIds.map((id) => getEventById(id)).filter(Boolean);
  }, [favoriteIds, getEventById]);

  const recent = useMemo(() => {
    return mockProfile.recent.map((id) => getEventById(id)).filter(Boolean);
  }, [getEventById]);

  const favoriteCount = favorites.length;
  const uploadCount = mockProfile.stats.uploadCount ?? 0;

  const handleLogout = () => {
    Alert.alert("確認登出", "確定要登出嗎？", [
      { text: "取消", style: "cancel" },
      {
        text: "登出",
        style: "destructive",
        onPress: () => {
          logout();
          router.replace("/intro");
        },
      },
    ]);
  };

  if (!isLoggedIn) {
    return (
      <ScrollView style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>📍 Gether Go!</Text>
          <TouchableOpacity
            onPress={() => router.push("/notifications")}
            activeOpacity={0.85}
            style={styles.bellWrap}
          >
            <Text style={styles.notificationIcon}>🔔</Text>
            {unreadCount > 0 && (
              <View style={styles.badge}>
                <Text style={styles.badgeText} numberOfLines={1}>
                  {unreadCount > 99 ? "99+" : String(unreadCount)}
                </Text>
              </View>
            )}
          </TouchableOpacity>
        </View>

        <View style={styles.notLoggedInContainer}>
          <Text style={styles.notLoggedInTitle}>尚未登入</Text>
          <Text style={styles.notLoggedInText}>登入後可以使用更多功能</Text>
          <Button
            title="登入"
            onPress={() => router.push("/login")}
            variant="primary"
            style={styles.button}
          />
          <Button
            title="建立帳號"
            onPress={() => router.push("/register")}
            variant="outline"
            style={styles.button}
          />
        </View>
      </ScrollView>
    );
  }

  const list = segment === "favorites" ? favorites : recent;

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>📍 Gether Go!</Text>
        <TouchableOpacity
          onPress={() => router.push("/notifications")}
          activeOpacity={0.85}
          style={styles.bellWrap}
        >
          <Text style={styles.notificationIcon}>🔔</Text>
          {unreadCount > 0 && (
            <View style={styles.badge}>
              <Text style={styles.badgeText} numberOfLines={1}>
                {unreadCount > 99 ? "99+" : String(unreadCount)}
              </Text>
            </View>
          )}
        </TouchableOpacity>
      </View>

      <View style={styles.profileCard}>
        <View style={styles.profileTopRow}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>
              {displayUser?.name?.[0] || "U"}
            </Text>
          </View>
          <View style={styles.profileText}>
            <Text style={styles.userName}>{displayUser?.name || "用戶"}</Text>
            {!!subtitle && <Text style={styles.userSubtitle}>{subtitle}</Text>}
            {!!tags.length && (
              <View style={styles.tagsRow}>
                {tags.slice(0, 3).map((t) => (
                  <Tag key={t} type={t} style={styles.tagSpacing} />
                ))}
              </View>
            )}
          </View>

          <TouchableOpacity style={styles.editButton}>
            <Text style={styles.editIcon}>✎</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.statsRow}>
          <View style={styles.statItem}>
            <Text style={styles.statIcon}>♡</Text>
            <Text style={styles.statLabel}>收藏數</Text>
            <Text style={styles.statValue}>{favoriteCount}</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statItem}>
            <Text style={styles.statIcon}>⤴︎</Text>
            <Text style={styles.statLabel}>活動上傳</Text>
            <Text style={styles.statValue}>{uploadCount}</Text>
          </View>
        </View>
      </View>

      <View style={styles.segmentRow}>
        <TouchableOpacity
          style={[
            styles.segmentButton,
            segment === "favorites" && styles.segmentButtonActive,
          ]}
          onPress={() => setSegment("favorites")}
          activeOpacity={0.8}
        >
          <Text
            style={[
              styles.segmentText,
              segment === "favorites" && styles.segmentTextActive,
            ]}
          >
            ♡ 我的收藏
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.segmentButton,
            segment === "recent" && styles.segmentButtonActive,
          ]}
          onPress={() => setSegment("recent")}
          activeOpacity={0.8}
        >
          <Text
            style={[
              styles.segmentText,
              segment === "recent" && styles.segmentTextActive,
            ]}
          >
            🕒 最近瀏覽
          </Text>
        </TouchableOpacity>
      </View>

      {list.length === 0 ? (
        <View style={styles.emptyState}>
          <Text style={styles.emptyIcon}>♡</Text>
          <Text style={styles.emptyTitle}>尚未有收藏的活動</Text>
          <Text style={styles.emptySubtitle}>
            點擊活動上的愛心來收藏喜歡的活動吧!
          </Text>
        </View>
      ) : (
        <View style={styles.listSection}>
          {list.map((event) => (
            <EventCard
              key={event!.id}
              event={event!}
              showFavorite={false}
              onPress={() => router.push(`/event/${event!.id}`)}
            />
          ))}
        </View>
      )}

      <View style={styles.settingsCard}>
        <Text style={styles.settingsTitle}>設定</Text>

        <TouchableOpacity
          style={styles.settingsItem}
          onPress={() => router.push("/settings/notifications")}
        >
          <Text style={styles.settingsIcon}>🔔</Text>
          <View style={styles.settingsTextBlock}>
            <Text style={styles.settingsItemTitle}>通知設定</Text>
            <Text style={styles.settingsItemSub}>收藏後的報名/預約提醒</Text>
          </View>
          <Text style={styles.settingsArrow}>›</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.settingsItem}>
          <Text style={styles.settingsIcon}>⚙️</Text>
          <View style={styles.settingsTextBlock}>
            <Text style={styles.settingsItemTitle}>成為小幫手</Text>
            <Text style={styles.settingsItemSub}>協助管理社群內容</Text>
          </View>
          <Text style={styles.settingsArrow}>›</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.settingsItem}>
          <Text style={styles.settingsIcon}>💬</Text>
          <View style={styles.settingsTextBlock}>
            <Text style={styles.settingsItemTitle}>意見反饋</Text>
            <Text style={styles.settingsItemSub}>告訴我們更好的想法</Text>
          </View>
          <Text style={styles.settingsArrow}>›</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.settingsItem, styles.settingsItemLast]}
          onPress={handleLogout}
        >
          <Text style={styles.settingsIcon}>⎋</Text>
          <View style={styles.settingsTextBlock}>
            <Text style={styles.settingsItemTitle}>登出</Text>
            <Text style={styles.settingsItemSub}>登出您的帳號</Text>
          </View>
          <Text style={styles.settingsArrow}>›</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f9fafb",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 16,
    backgroundColor: "#fff",
    borderBottomWidth: 1,
    borderBottomColor: "#e5e7eb",
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#111827",
  },
  notificationIcon: {
    fontSize: 20,
  },
  bellWrap: {
    position: "relative",
    padding: 4,
  },
  badge: {
    position: "absolute",
    right: 0,
    top: 0,
    minWidth: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: "#ef4444",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 4,
  },
  badgeText: {
    color: "#fff",
    fontSize: 10,
    fontWeight: "800",
  },
  profileCard: {
    margin: 16,
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: "#eef2ff",
  },
  profileTopRow: {
    flexDirection: "row",
    alignItems: "flex-start",
  },
  avatar: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: "#e5e7eb",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },
  avatarText: {
    fontSize: 24,
    fontWeight: "700",
    color: "#111827",
  },
  profileText: {
    flex: 1,
    paddingRight: 12,
  },
  userName: {
    fontSize: 18,
    fontWeight: "700",
    color: "#111827",
    marginBottom: 4,
  },
  userSubtitle: {
    fontSize: 12,
    color: "#6366f1",
  },
  tagsRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginTop: 8,
  },
  tagSpacing: {
    marginRight: 6,
    marginBottom: 6,
  },
  editButton: {
    width: 32,
    height: 32,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "#e5e7eb",
    backgroundColor: "#fff",
  },
  editIcon: {
    fontSize: 16,
    color: "#6366f1",
  },
  statsRow: {
    flexDirection: "row",
    marginTop: 16,
    borderTopWidth: 1,
    borderTopColor: "#eef2ff",
    paddingTop: 12,
  },
  statItem: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
  },
  statIcon: {
    fontSize: 18,
    color: "#6366f1",
  },
  statLabel: {
    fontSize: 12,
    color: "#6b7280",
  },
  statValue: {
    fontSize: 16,
    fontWeight: "700",
    color: "#111827",
  },
  statDivider: {
    width: 1,
    backgroundColor: "#eef2ff",
  },
  segmentRow: {
    flexDirection: "row",
    gap: 12,
    paddingHorizontal: 16,
    marginBottom: 16,
  },
  segmentButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: "#e5e7eb",
    backgroundColor: "#fff",
    alignItems: "center",
  },
  segmentButtonActive: {
    backgroundColor: "#6366f1",
    borderColor: "#6366f1",
  },
  segmentText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#6b7280",
  },
  segmentTextActive: {
    color: "#fff",
  },
  emptyState: {
    alignItems: "center",
    paddingHorizontal: 24,
    paddingVertical: 24,
  },
  emptyIcon: {
    fontSize: 44,
    color: "#c7d2fe",
    marginBottom: 8,
  },
  emptyTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: "#6366f1",
    marginBottom: 8,
  },
  emptySubtitle: {
    fontSize: 12,
    color: "#6b7280",
    textAlign: "center",
  },
  listSection: {
    marginTop: 4,
  },
  settingsCard: {
    margin: 16,
    backgroundColor: "#fff",
    borderRadius: 12,
    paddingVertical: 8,
    borderWidth: 1,
    borderColor: "#eef2ff",
  },
  settingsTitle: {
    fontSize: 14,
    fontWeight: "700",
    color: "#111827",
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 8,
  },
  settingsItem: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: "#f3f4f6",
  },
  settingsItemLast: {
    borderBottomLeftRadius: 12,
    borderBottomRightRadius: 12,
  },
  settingsIcon: {
    fontSize: 22,
    width: 36,
    textAlign: "center",
    marginRight: 8,
  },
  settingsTextBlock: {
    flex: 1,
  },
  settingsItemTitle: {
    fontSize: 14,
    fontWeight: "700",
    color: "#111827",
    marginBottom: 2,
  },
  settingsItemSub: {
    fontSize: 12,
    color: "#6b7280",
  },
  settingsArrow: {
    fontSize: 24,
    color: "#9ca3af",
  },
  notLoggedInContainer: {
    alignItems: "center",
    padding: 32,
    marginTop: 64,
  },
  notLoggedInTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#111827",
    marginBottom: 12,
  },
  notLoggedInText: {
    fontSize: 16,
    color: "#6b7280",
    marginBottom: 32,
    textAlign: "center",
  },
  button: {
    width: "100%",
    marginBottom: 12,
  },
});
