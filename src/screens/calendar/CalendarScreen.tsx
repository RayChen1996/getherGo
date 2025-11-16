import React, { useEffect } from 'react';
import { View, Text, FlatList, StyleSheet, Alert, SectionList } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useAuth } from '../../hooks/useAuth';
import { useEvents } from '../../hooks/useEvents';
import { EventCard } from '../../components/event/EventCard';
import { MainTabsParamList } from '../../navigation/types';
import { Event } from '../../types/event';

type Props = NativeStackScreenProps<MainTabsParamList, 'Calendar'>;

interface SectionData {
  title: string;
  data: Event[];
}

export const CalendarScreen: React.FC<Props> = ({ navigation }) => {
  const { isLoggedIn } = useAuth();
  const { allEvents } = useEvents();

  useEffect(() => {
    if (!isLoggedIn) {
      Alert.alert('需要登入', '此功能需登入，请先登入或注册', [
        {
          text: '取消',
          style: 'cancel',
          onPress: () => navigation.navigate('Home'),
        },
        {
          text: '登入',
          onPress: () => {
            navigation.getParent()?.navigate('Auth', { screen: 'Login' });
          },
        },
      ]);
    }
  }, [isLoggedIn, navigation]);

  // 模拟收藏的活动（实际应该从用户数据获取）
  const favoriteEvents = allEvents.slice(0, 3);

  // 按日期分组
  const groupedEvents: SectionData[] = favoriteEvents.reduce((acc, event) => {
    const date = event.startDate;
    const existingSection = acc.find((section) => section.title === date);
    if (existingSection) {
      existingSection.data.push(event);
    } else {
      acc.push({ title: date, data: [event] });
    }
    return acc;
  }, [] as SectionData[]);

  // 按日期排序
  groupedEvents.sort((a, b) => a.title.localeCompare(b.title));

  if (!isLoggedIn) {
    return (
      <View style={styles.container}>
        <Text style={styles.message}>此功能需登入，请先登入或注册</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>行事历</Text>
      </View>

      {groupedEvents.length === 0 ? (
        <View style={styles.empty}>
          <Text style={styles.emptyText}>暂无收藏的活动</Text>
        </View>
      ) : (
        <SectionList
          sections={groupedEvents}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <EventCard
              event={item}
              onPress={() => navigation.getParent()?.navigate('EventDetail', { eventId: item.id })}
            />
          )}
          renderSectionHeader={({ section }) => (
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>{section.title}</Text>
            </View>
          )}
          contentContainerStyle={styles.list}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9fafb',
  },
  header: {
    padding: 16,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#111827',
  },
  list: {
    paddingBottom: 16,
  },
  sectionHeader: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: '#f3f4f6',
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#374151',
  },
  empty: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 16,
    color: '#9ca3af',
  },
  message: {
    fontSize: 16,
    color: '#6b7280',
    textAlign: 'center',
    marginTop: 32,
  },
});

