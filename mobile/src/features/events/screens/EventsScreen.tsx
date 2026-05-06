import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import React from 'react';
import { FlatList, Image, Pressable, StyleSheet, Text } from 'react-native';
import type { RootStackParamList } from '../../../app/navigation/types';
import {
  AppScreen,
  EmptyState,
  ErrorState,
  LoadingState,
} from '../../../shared/components';
import { useGetEventsQuery } from '../../../api/greenloopApi';
import { colors } from '../../../shared/theme/colors';
import { spacing } from '../../../shared/theme/spacing';

export function EventsScreen() {
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const { data, isLoading, isError, refetch } = useGetEventsQuery();

  if (isLoading) {
    return (
      <AppScreen>
        <LoadingState />
      </AppScreen>
    );
  }
  if (isError) {
    return (
      <AppScreen>
        <ErrorState message="Error al cargar eventos." onRetry={refetch} />
      </AppScreen>
    );
  }

  const events = data?.events ?? [];
  if (events.length === 0) {
    return (
      <AppScreen>
        <EmptyState title="Sin eventos próximos" />
      </AppScreen>
    );
  }

  return (
    <AppScreen>
      <FlatList
        data={events}
        keyExtractor={item => item.id}
        contentContainerStyle={{ padding: spacing.md }}
        renderItem={({ item }) => (
          <Pressable
            style={styles.card}
            onPress={() =>
              navigation.navigate('EventDetail', { eventId: item.id })
            }>
            <Image source={{ uri: item.imageUrl }} style={styles.img} />
            <Text style={styles.title}>{item.title}</Text>
            <Text style={styles.date}>
              {new Date(item.startsAt).toLocaleString('es-DO')}
            </Text>
            <Text style={styles.org}>{item.organizer}</Text>
          </Pressable>
        )}
      />
    </AppScreen>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.surface,
    borderRadius: 14,
    padding: spacing.md,
    marginBottom: spacing.md,
    borderWidth: 1,
    borderColor: colors.border,
  },
  img: {
    width: '100%',
    height: 140,
    borderRadius: 12,
    marginBottom: spacing.sm,
  },
  title: { fontSize: 17, fontWeight: '800', color: colors.text },
  date: { marginTop: 4, color: colors.primary },
  org: { marginTop: 4, color: colors.textMuted, fontSize: 13 },
});
