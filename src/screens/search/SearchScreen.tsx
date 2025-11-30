import React, { useState, useEffect, useMemo } from 'react';
import { View, Text, TextInput, FlatList, StyleSheet, TouchableOpacity } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useEvents } from '../../hooks/useEvents';
import { EventCard } from '../../components/event/EventCard';
import { MainTabsParamList } from '../../navigation/types';
import { Event, EventType } from '../../types/event';

type Props = NativeStackScreenProps<MainTabsParamList, 'Search'>;

export const SearchScreen: React.FC<Props> = ({ route, navigation }) => {
  const { searchEventsByKeyword, getEventsByType, allEvents } = useEvents();
  const [searchKeyword, setSearchKeyword] = useState('');
  const [displayEvents, setDisplayEvents] = useState<Event[]>(allEvents);
  const [filtersVisible, setFiltersVisible] = useState(false);
  const [typeFilter, setTypeFilter] = useState<EventType | 'all'>(route.params?.type || 'all');
  const [monthFilter, setMonthFilter] = useState<string>('all');

  const initialType = route.params?.type;

  useEffect(() => {
    if (initialType) {
      setTypeFilter(initialType);
      setDisplayEvents(getEventsByType(initialType));
    } else {
      setDisplayEvents(allEvents);
    }
  }, [initialType, allEvents, getEventsByType]);

  const months = useMemo(
    () => ['all', '01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12'],
    []
  );

  const applyFilters = (keyword = searchKeyword) => {
    let results = allEvents;

    if (typeFilter !== 'all') {
      results = results.filter((event) => event.type === typeFilter);
    }

    if (monthFilter !== 'all') {
      results = results.filter((event) => event.startDate.slice(5, 7) === monthFilter);
    }

    if (keyword.trim()) {
      const lowerKeyword = keyword.toLowerCase();
      results = results.filter((event) =>
        [event.title, event.location, event.host, event.groupMember || '']
          .join(' ')
          .toLowerCase()
          .includes(lowerKeyword)
      );
    }

    setDisplayEvents(results);
  };

  const handleSearch = () => {
    if (searchKeyword.trim()) {
      const results = searchEventsByKeyword(searchKeyword);
      const filtered = results.filter((event) =>
        (typeFilter === 'all' || event.type === typeFilter) &&
        (monthFilter === 'all' || event.startDate.slice(5, 7) === monthFilter)
      );
      setDisplayEvents(filtered);
    } else {
      applyFilters('');
    }
  };

  const handleEventPress = (eventId: string) => {
    navigation.getParent()?.navigate('EventDetail', { eventId });
  };

  const handleResetFilters = () => {
    setTypeFilter(initialType || 'all');
    setMonthFilter('all');
    setSearchKeyword('');
    setFiltersVisible(false);
    setDisplayEvents(initialType ? getEventsByType(initialType) : allEvents);
  };

  const handleApplyFilters = () => {
    applyFilters();
    setFiltersVisible(false);
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
        <TouchableOpacity style={styles.filterButton} onPress={() => setFiltersVisible(!filtersVisible)}>
          <Text style={styles.filterText}>筛选</Text>
        </TouchableOpacity>
      </View>

      {filtersVisible && (
        <View style={styles.filterPanel}>
          <View style={styles.filterRow}>
            <Text style={styles.filterLabel}>活动类型</Text>
            <View style={styles.filterOptions}>
              {[{ value: 'all', label: '不限' } as const]
                .concat(
                  [
                    { value: 'fan', label: '应援活动' },
                    { value: 'concert', label: '演唱会' },
                    { value: 'exhibition', label: '展览' },
                    { value: 'other', label: '其他活动' },
                  ]
                )
                .map((option) => (
                  <TouchableOpacity
                    key={option.value}
                    style={[styles.filterChip, typeFilter === option.value && styles.filterChipActive]}
                    onPress={() => setTypeFilter(option.value as EventType | 'all')}
                  >
                    <Text
                      style={[styles.filterChipText, typeFilter === option.value && styles.filterChipTextActive]}
                    >
                      {option.label}
                    </Text>
                  </TouchableOpacity>
                ))}
            </View>
          </View>

          <View style={styles.filterRow}>
            <Text style={styles.filterLabel}>月份</Text>
            <View style={styles.filterOptions}>
              {months.map((month) => (
                <TouchableOpacity
                  key={month}
                  style={[styles.filterChip, monthFilter === month && styles.filterChipActive]}
                  onPress={() => setMonthFilter(month)}
                >
                  <Text style={[styles.filterChipText, monthFilter === month && styles.filterChipTextActive]}>
                    {month === 'all' ? '不限' : `${Number(month)}月`}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          <View style={styles.filterActions}>
            <TouchableOpacity style={[styles.filterButtonBase, styles.resetButton]} onPress={handleResetFilters}>
              <Text style={styles.resetButtonText}>重置</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.filterButtonBase, styles.applyButton]} onPress={handleApplyFilters}>
              <Text style={styles.applyButtonText}>确认</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}

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
  filterPanel: {
    backgroundColor: '#fff',
    marginHorizontal: 16,
    padding: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  filterRow: {
    marginBottom: 12,
  },
  filterLabel: {
    fontSize: 14,
    color: '#6b7280',
    marginBottom: 8,
  },
  filterOptions: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  filterChip: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 16,
    backgroundColor: '#f3f4f6',
  },
  filterChipActive: {
    backgroundColor: '#eef2ff',
    borderWidth: 1,
    borderColor: '#6366f1',
  },
  filterChipText: {
    color: '#374151',
  },
  filterChipTextActive: {
    color: '#4f46e5',
    fontWeight: '700',
  },
  filterActions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 12,
    marginTop: 4,
  },
  filterButtonBase: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 12,
  },
  resetButton: {
    borderWidth: 1,
    borderColor: '#d1d5db',
    backgroundColor: '#fff',
  },
  applyButton: {
    backgroundColor: '#6366f1',
  },
  resetButtonText: {
    color: '#374151',
    fontWeight: '600',
  },
  applyButtonText: {
    color: '#fff',
    fontWeight: '700',
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

