import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { EventType } from '../../types/event';

interface TagProps {
  type: EventType;
  style?: object;
}

const typeLabels: Record<EventType, string> = {
  fan: '应援活动',
  concert: '演唱会',
  exhibition: '展览',
  other: '其他活动',
};

const typeColors: Record<EventType, { bg: string; text: string }> = {
  fan: { bg: '#fef3c7', text: '#92400e' },
  concert: { bg: '#dbeafe', text: '#1e40af' },
  exhibition: { bg: '#e9d5ff', text: '#6b21a8' },
  other: { bg: '#d1fae5', text: '#065f46' },
};

export const Tag: React.FC<TagProps> = ({ type, style }) => {
  const colors = typeColors[type];
  return (
    <View style={[styles.tag, { backgroundColor: colors.bg }, style]}>
      <Text style={[styles.text, { color: colors.text }]}>{typeLabels[type]}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  tag: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    alignSelf: 'flex-start',
  },
  text: {
    fontSize: 12,
    fontWeight: '600',
  },
});

