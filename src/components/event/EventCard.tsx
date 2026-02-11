import React from "react";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  type GestureResponderEvent,
} from "react-native";
import { Event } from "../../types/event";
import { Tag } from "../common/Tag";
import { useFavorites } from "../../hooks/useFavorites";

interface EventCardProps {
  event: Event;
  onPress: () => void;
  showFavorite?: boolean;
}

export const EventCard: React.FC<EventCardProps> = ({
  event,
  onPress,
  showFavorite = true,
}) => {
  const { isFavorite, toggleFavorite } = useFavorites();
  const favorited = isFavorite(event.id);

  const handleFavoritePress = (e: GestureResponderEvent) => {
    e.stopPropagation();
    void toggleFavorite(event);
  };

  return (
    <TouchableOpacity style={styles.card} onPress={onPress} activeOpacity={0.7}>
      <View style={styles.imageContainer}>
        <Image source={{ uri: event.thumbnailUrl }} style={styles.image} />
        <View style={styles.tagOverlay}>
          <Tag type={event.type} />
        </View>
        {showFavorite && (
          <TouchableOpacity
            style={styles.favoriteButton}
            onPress={handleFavoritePress}
            activeOpacity={0.85}
          >
            <Text
              style={[
                styles.favoriteIcon,
                favorited ? styles.favoriteIconActive : styles.favoriteIconIdle,
              ]}
            >
              {favorited ? "♥" : "♡"}
            </Text>
          </TouchableOpacity>
        )}
      </View>
      <View style={styles.content}>
        <Text style={styles.title} numberOfLines={1}>
          {event.title}
        </Text>
        {event.groupMember && (
          <View style={styles.row}>
            <Text style={styles.icon}>👤</Text>
            <Text style={styles.text}>{event.groupMember}</Text>
          </View>
        )}
        <View style={styles.row}>
          <Text style={styles.icon}>📅</Text>
          <Text style={styles.text}>
            {event.startDate}
            {event.endDate && ` ~ ${event.endDate}`}
          </Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.icon}>📍</Text>
          <Text style={styles.text} numberOfLines={2}>
            {event.location}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderRadius: 12,
    marginVertical: 8,
    marginHorizontal: 16,
    padding: 12,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  imageContainer: {
    position: 'relative',
    width: 100,
    height: 100,
    borderRadius: 8,
    overflow: 'hidden',
    marginRight: 12,
  },
  image: {
    width: '100%',
    height: '100%',
    backgroundColor: '#f3f4f6',
  },
  tagOverlay: {
    position: 'absolute',
    top: 4,
    left: 4,
  },
  favoriteButton: {
    position: 'absolute',
    top: 4,
    right: 4,
    width: 24,
    height: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  favoriteIcon: {
    fontSize: 18,
    fontWeight: "700",
  },
  favoriteIconIdle: {
    color: "#e5e7eb",
    textShadowColor: "rgba(0,0,0,0.35)",
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  favoriteIconActive: {
    color: "#ef4444",
  },
  content: {
    flex: 1,
    justifyContent: 'space-between',
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 8,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 4,
  },
  icon: {
    fontSize: 14,
    marginRight: 6,
    marginTop: 2,
  },
  text: {
    fontSize: 14,
    color: '#6b7280',
    flex: 1,
  },
});

