import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, FlatList, StyleSheet, TouchableOpacity } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useEvents } from '../../hooks/useEvents';
import { EventCard } from '../../components/event/EventCard';
import { MainTabsParamList } from '../../navigation/types';
import { Event } from '../../types/event';

type Props = NativeStackScreenProps<MainTabsParamList, 'Search'>;

export const SearchScreen: React.FC<Props> = ({ route, navigation }) => {
  const { searchEventsByKeyword, getEventsByType, allEvents } = useEvents();
  const [searchKeyword, setSearchKeyword] = useState('');
  const [displayEvents, setDisplayEvents] = useState<Event[]>(allEvents);

  const initialType = route.params?.type;

  useEffect(() => {
    if (initialType) {
      // 如果从首页活动类型按钮进入，显示该类型活动
      setDisplayEvents(getEventsByType(initialType));
    } else {
      setDisplayEvents(allEvents);
    }
  }, [initialType, allEvents, getEventsByType]);

  const handleSearch = () => {
    if (searchKeyword.trim()) {
      const results = searchEventsByKeyword(searchKeyword);
      setDisplayEvents(results);
    } else {
      if (initialType) {
        setDisplayEvents(getEventsByType(initialType));
      } else {
        setDisplayEvents(allEvents);
      }
    }
  };

  const handleEventPress = (eventId: string) => {
    navigation.getParent()?.navigate('EventDetail', { eventId });
  };

  return (
    <View style={styles.container}>
      <View style={styles.searchBar}>
        <TextInput
          style={styles.input}
          placeholder="搜寻偶像、团体或咖啡厅名称..."
          value={searchKeyword}
          onChangeText={setSearchKeyword}
          onSubmitEditing={handleSearch}
          returnKeyType="search"
        />
      </View>

      <View style={styles.header}>
        <Text style={styles.resultCount}>共{displayEvents.length}个活动</Text>
        <TouchableOpacity style={styles.filterButton}>
          <Text style={styles.filterText}>筛选</Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={displayEvents}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <EventCard event={item} onPress={() => handleEventPress(item.id)} />
        )}
        contentContainerStyle={styles.list}
        ListEmptyComponent={
          <View style={styles.empty}>
            <Text style={styles.emptyText}>没有找到相关活动</Text>
          </View>
        }
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9fafb',
  },
  searchBar: {
    padding: 16,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  input: {
    backgroundColor: '#f3f4f6',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
  },
  resultCount: {
    fontSize: 16,
    color: '#6366f1',
    fontWeight: '600',
  },
  filterButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  filterText: {
    fontSize: 16,
    color: '#6366f1',
  },
  list: {
    paddingBottom: 16,
  },
  empty: {
    padding: 32,
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 16,
    color: '#9ca3af',
  },
});

