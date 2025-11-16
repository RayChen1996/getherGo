import React from 'react';
import { View, Text, ScrollView, Image, StyleSheet, TouchableOpacity } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useEvents } from '../../hooks/useEvents';
import { Tag } from '../../components/common/Tag';
import { RootStackParamList } from '../../navigation/types';

type Props = NativeStackScreenProps<RootStackParamList, 'EventDetail'>;

export const EventDetailScreen: React.FC<Props> = ({ route, navigation }) => {
  const { eventId } = route.params;
  const { getEventById } = useEvents();
  const event = getEventById(eventId);

  if (!event) {
    return (
      <View style={styles.container}>
        <Text>活动不存在</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>活动详情</Text>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={styles.closeButton}>✕</Text>
        </TouchableOpacity>
      </View>

      <Image source={{ uri: event.thumbnailUrl }} style={styles.image} />

      <View style={styles.content}>
        <View style={styles.tags}>
          <Tag type={event.type} />
        </View>

        <Text style={styles.title}>{event.title}</Text>
        {event.description && <Text style={styles.description}>{event.description}</Text>}

        <View style={styles.infoRow}>
          <Text style={styles.label}>上传者：</Text>
          <Text style={styles.value}>{event.host}</Text>
        </View>

        {event.groupMember && (
          <View style={styles.infoRow}>
            <Text style={styles.label}>偶像团体及成员：</Text>
            <Text style={styles.value}>{event.groupMember}</Text>
          </View>
        )}

        <View style={styles.infoRow}>
          <Text style={styles.label}>活动日期：</Text>
          <Text style={styles.value}>
            {event.startDate}
            {event.endDate && ` ~ ${event.endDate}`}
          </Text>
        </View>

        <View style={styles.infoRow}>
          <Text style={styles.label}>活动地点：</Text>
          <Text style={styles.value}>{event.location}</Text>
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#111827',
  },
  closeButton: {
    fontSize: 24,
    color: '#6b7280',
  },
  image: {
    width: '100%',
    height: 250,
    backgroundColor: '#e5e7eb',
  },
  content: {
    padding: 16,
  },
  tags: {
    marginBottom: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#111827',
    marginBottom: 12,
  },
  description: {
    fontSize: 16,
    color: '#6b7280',
    lineHeight: 24,
    marginBottom: 16,
  },
  infoRow: {
    flexDirection: 'row',
    marginBottom: 12,
    flexWrap: 'wrap',
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: '#374151',
  },
  value: {
    fontSize: 16,
    color: '#6b7280',
    flex: 1,
  },
});

