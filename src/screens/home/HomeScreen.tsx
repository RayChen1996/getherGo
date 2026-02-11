import React from "react";
import {
  View,
  Text,
  ScrollView,
  Image,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import { useRouter } from "expo-router";
import { useEvents } from "../../hooks/useEvents";
import { useFavorites } from "../../hooks/useFavorites";
import { useNotifications } from "../../hooks/useNotifications";
import { EventCard } from "../../components/event/EventCard";
import { EventTypeChips } from "../../components/event/EventTypeChips";
import { EventType } from "../../types/event";
import { parseEventStartAt } from "../../utils/eventTime";

export const HomeScreen: React.FC = () => {
  const router = useRouter();
  const { allEvents } = useEvents();
  const { favoriteIds } = useFavorites();
  const { unreadCount } = useNotifications();
  const featuredEvent = allEvents[0];
  const monthlyEvents = allEvents.slice(0, 5);

  const handleBannerPress = () => {
    if (featuredEvent) {
      router.push(`/event/${featuredEvent.id}`);
    }
  };

  const handleTypeSelect = (type: EventType) => {
    router.push({ pathname: "/search", params: { type } });
  };

  const handleEventPress = (eventId: string) => {
    router.push(`/event/${eventId}`);
  };

  const upcomingBanner = React.useMemo(() => {
    // 找出收藏活動中「明天」要開始的活動
    const now = Date.now();
    const oneDayMs = 24 * 60 * 60 * 1000;

    const candidates = favoriteIds
      .map((id) => allEvents.find((e) => e.id === id))
      .filter(Boolean)
      .map((e) => ({ event: e!, startAt: parseEventStartAt(e!) }))
      .filter((x) => x.startAt && x.startAt.getTime() - now <= oneDayMs)
      .filter((x) => x.startAt && x.startAt.getTime() - now >= 0)
      .sort((a, b) => (a.startAt!.getTime() ?? 0) - (b.startAt!.getTime() ?? 0));

    if (candidates.length === 0) return null;
    const first = candidates[0].event;
    return {
      title: "明天就要參加活動囉！",
      body: `快確認「${first.title}」的時間與地點～`,
    };
  }, [allEvents, favoriteIds]);

  return (
    <ScrollView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>📍 GatherGO!</Text>
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

      {/* Banner */}
      {featuredEvent && (
        <View style={styles.bannerWrap}>
          {upcomingBanner && (
            <View style={styles.upcomingBanner}>
              <Text style={styles.upcomingTitle}>{upcomingBanner.title}</Text>
              <Text style={styles.upcomingBody} numberOfLines={1}>
                {upcomingBanner.body}
              </Text>
            </View>
          )}

          <TouchableOpacity
            style={styles.banner}
            onPress={handleBannerPress}
            activeOpacity={0.8}
          >
          <Image
            source={{ uri: featuredEvent.thumbnailUrl }}
            style={styles.bannerImage}
          />
          <View style={styles.bannerOverlay}>
            <View style={styles.bannerTag}>
              <Text style={styles.bannerTagText}>精选推荐</Text>
            </View>
            <Text style={styles.bannerTitle}>{featuredEvent.title}</Text>
            <Text style={styles.bannerSubtitle}>
              {featuredEvent.groupMember}
            </Text>
            <Text style={styles.bannerDate}>
              {featuredEvent.startDate} - {featuredEvent.endDate}
            </Text>
          </View>
          </TouchableOpacity>
        </View>
      )}

      {/* Activity Types */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>活动类型</Text>
        <EventTypeChips onTypeSelect={handleTypeSelect} />
      </View>

      {/* Monthly Activities */}
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>当月活动</Text>
          <TouchableOpacity onPress={() => router.push("/search")}>
            <Text style={styles.viewAll}>查看全部</Text>
          </TouchableOpacity>
        </View>
        {monthlyEvents.map((event) => (
          <EventCard
            key={event.id}
            event={event}
            onPress={() => handleEventPress(event.id)}
          />
        ))}
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
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#111827",
  },
  notificationIcon: {
    fontSize: 24,
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
  bannerWrap: {
    marginTop: 0,
  },
  upcomingBanner: {
    marginHorizontal: 16,
    marginTop: 16,
    marginBottom: -8,
    borderRadius: 12,
    padding: 12,
    backgroundColor: "#eef2ff",
    borderWidth: 1,
    borderColor: "#c7d2fe",
  },
  upcomingTitle: {
    fontSize: 14,
    fontWeight: "800",
    color: "#111827",
    marginBottom: 2,
  },
  upcomingBody: {
    fontSize: 12,
    color: "#4b5563",
  },
  banner: {
    height: 200,
    margin: 16,
    borderRadius: 12,
    overflow: "hidden",
    position: "relative",
  },
  bannerImage: {
    width: "100%",
    height: "100%",
    backgroundColor: "#e5e7eb",
  },
  bannerOverlay: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    padding: 16,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  bannerTag: {
    alignSelf: "flex-start",
    backgroundColor: "#6366f1",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    marginBottom: 8,
  },
  bannerTagText: {
    color: "#fff",
    fontSize: 12,
    fontWeight: "600",
  },
  bannerTitle: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 4,
  },
  bannerSubtitle: {
    color: "#fff",
    fontSize: 14,
    marginBottom: 4,
  },
  bannerDate: {
    color: "#fff",
    fontSize: 12,
  },
  section: {
    marginTop: 24,
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#111827",
  },
  viewAll: {
    fontSize: 14,
    color: "#6366f1",
  },
});
