import React from 'react';
import { View, TouchableOpacity, Text, StyleSheet } from 'react-native';
import { EventType } from '../../types/event';

interface EventTypeChipsProps {
  onTypeSelect: (type: EventType) => void;
}

const eventTypes: { type: EventType; label: string; icon: string }[] = [
  { type: 'fan', label: '应援活动', icon: '💝' },
  { type: 'concert', label: '演唱会', icon: '🎤' },
  { type: 'exhibition', label: '展览', icon: '🖼️' },
  { type: 'other', label: '其他活动', icon: '👥' },
];

export const EventTypeChips: React.FC<EventTypeChipsProps> = ({ onTypeSelect }) => {
  return (
    <View style={styles.container}>
      {eventTypes.map((item) => (
        <TouchableOpacity
          key={item.type}
          style={styles.chip}
          onPress={() => onTypeSelect(item.type)}
          activeOpacity={0.7}
        >
          <Text style={styles.icon}>{item.icon}</Text>
          <Text style={styles.label}>{item.label}</Text>
        </TouchableOpacity>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 16,
    paddingHorizontal: 16,
  },
  chip: {
    alignItems: 'center',
    justifyContent: 'center',
    width: 70,
  },
  icon: {
    fontSize: 32,
    marginBottom: 8,
  },
  label: {
    fontSize: 12,
    color: '#374151',
    textAlign: 'center',
  },
});

