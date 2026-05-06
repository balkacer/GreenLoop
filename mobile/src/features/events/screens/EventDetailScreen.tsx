import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import React from 'react';
import { Image, StyleSheet, Text } from 'react-native';
import {
  AppButton,
  AppScreen,
  ErrorState,
  LoadingState,
  LocationCard,
} from '../../../shared/components';
import type { RootStackParamList } from '../../../app/navigation/types';
import { useGetEventQuery } from '../../../api/greenloopApi';
import { shareText } from '../../../shared/services/sharing';
import { colors } from '../../../shared/theme/colors';
import { spacing } from '../../../shared/theme/spacing';

type Props = NativeStackScreenProps<RootStackParamList, 'EventDetail'>;

export function EventDetailScreen({ route }: Props) {
  const { eventId } = route.params;
  const { data, isLoading, isError, refetch } = useGetEventQuery(eventId);

  if (isLoading) {
    return (
      <AppScreen>
        <LoadingState />
      </AppScreen>
    );
  }
  if (isError || !data) {
    return (
      <AppScreen>
        <ErrorState message="Evento no encontrado" onRetry={refetch} />
      </AppScreen>
    );
  }

  return (
    <AppScreen scroll>
      <Image source={{ uri: data.imageUrl }} style={styles.hero} />
      <Text style={styles.title}>{data.title}</Text>
      <Text style={styles.meta}>
        {new Date(data.startsAt).toLocaleString('es-DO')}
      </Text>
      <Text style={styles.meta}>Por {data.organizer}</Text>
      <Text style={styles.body}>{data.description}</Text>
      <LocationCard
        title="Ubicación"
        address={data.address}
        lat={data.lat}
        lng={data.lng}
      />
      <AppButton
        title="Compartir evento"
        variant="outline"
        onPress={() =>
          shareText(data.title, `${data.description}\n${data.address}`)
        }
      />
    </AppScreen>
  );
}

const styles = StyleSheet.create({
  hero: {
    width: '100%',
    height: 200,
    borderRadius: 16,
    marginBottom: spacing.md,
  },
  title: { fontSize: 22, fontWeight: '900', color: colors.text },
  meta: { marginTop: 6, color: colors.textMuted },
  body: {
    marginTop: spacing.md,
    fontSize: 16,
    lineHeight: 22,
    color: colors.text,
  },
});
