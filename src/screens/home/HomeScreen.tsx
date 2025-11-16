import React from 'react';
import { View, Text, ScrollView, Image, TouchableOpacity, StyleSheet } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useEvents } from '../../hooks/useEvents';
import { EventCard } from '../../components/event/EventCard';
import { EventTypeChips } from '../../components/event/EventTypeChips';
import { MainTabsParamList } from '../../navigation/types';
import { EventType } from '../../types/event';

type Props = NativeStackScreenProps<MainTabsParamList, 'Home'>;

export const HomeScreen: React.FC<Props> = ({ navigation }) => {
  const { allEvents } = useEvents();
  const featuredEvent = allEvents[0];
  const monthlyEvents = allEvents.slice(0, 5);

  const handleBannerPress = () => {
    if (featuredEvent) {
      navigation.getParent()?.navigate('EventDetail', { eventId: featuredEvent.id });
    }
  };

  const handleTypeSelect = (type: EventType) => {
    navigation.navigate('Search', { type });
  };

  const handleEventPress = (eventId: string) => {
    navigation.getParent()?.navigate('EventDetail', { eventId });
  };

  return (
    <ScrollView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>📍 GatherGO!</Text>
        <TouchableOpacity>
          <Text style={styles.notificationIcon}>🔔</Text>
        </TouchableOpacity>
      </View>

      {/* Banner */}
      {featuredEvent && (
        <TouchableOpacity style={styles.banner} onPress={handleBannerPress} activeOpacity={0.8}>
          <Image source={{ uri: featuredEvent.thumbnailUrl }} style={styles.bannerImage} />
          <View style={styles.bannerOverlay}>
            <View style={styles.bannerTag}>
              <Text style={styles.bannerTagText}>精选推荐</Text>
            </View>
            <Text style={styles.bannerTitle}>{featuredEvent.title}</Text>
            <Text style={styles.bannerSubtitle}>{featuredEvent.groupMember}</Text>
            <Text style={styles.bannerDate}>
              {featuredEvent.startDate} - {featuredEvent.endDate}
            </Text>
          </View>
        </TouchableOpacity>
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
          <TouchableOpacity onPress={() => navigation.navigate('Search')}>
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
    backgroundColor: '#f9fafb',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#fff',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#111827',
  },
  notificationIcon: {
    fontSize: 24,
  },
  banner: {
    height: 200,
    margin: 16,
    borderRadius: 12,
    overflow: 'hidden',
    position: 'relative',
  },
  bannerImage: {
    width: '100%',
    height: '100%',
    backgroundColor: '#e5e7eb',
  },
  bannerOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: 16,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  bannerTag: {
    alignSelf: 'flex-start',
    backgroundColor: '#6366f1',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    marginBottom: 8,
  },
  bannerTagText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600',
  },
  bannerTitle: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  bannerSubtitle: {
    color: '#fff',
    fontSize: 14,
    marginBottom: 4,
  },
  bannerDate: {
    color: '#fff',
    fontSize: 12,
  },
  section: {
    marginTop: 24,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#111827',
  },
  viewAll: {
    fontSize: 14,
    color: '#6366f1',
  },
});

