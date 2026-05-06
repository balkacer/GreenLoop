import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import React from 'react';
import { Image, StyleSheet, Text } from 'react-native';
import {
  AppScreen,
  ErrorState,
  LoadingState,
  LocationCard,
} from '../../../shared/components';
import type { RootStackParamList } from '../../../app/navigation/types';
import { useGetMerchantQuery } from '../../../api/greenloopApi';
import { colors } from '../../../shared/theme/colors';
import { spacing } from '../../../shared/theme/spacing';

type Props = NativeStackScreenProps<RootStackParamList, 'MerchantDetail'>;

export function MerchantDetailScreen({ route }: Props) {
  const { merchantId } = route.params;
  const { data, isLoading, isError, refetch } = useGetMerchantQuery(merchantId);

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
        <ErrorState message="No encontrado" onRetry={refetch} />
      </AppScreen>
    );
  }

  return (
    <AppScreen scroll>
      <Image source={{ uri: data.imageUrl }} style={styles.hero} />
      <Text style={styles.name}>{data.name}</Text>
      <Text style={styles.cat}>{data.category}</Text>
      <Text style={styles.meta}>📞 {data.phone}</Text>
      <Text style={styles.meta}>🕐 {data.hours}</Text>
      <LocationCard
        title={data.name}
        address={data.address}
        lat={data.lat}
        lng={data.lng}
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
  name: { fontSize: 22, fontWeight: '900', color: colors.text },
  cat: { color: colors.primary, fontWeight: '700', marginBottom: spacing.sm },
  meta: { marginBottom: 6, color: colors.textMuted },
});
