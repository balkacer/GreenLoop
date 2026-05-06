import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import React from 'react';
import { FlatList, Image, Pressable, StyleSheet, Text, View } from 'react-native';
import type { RootStackParamList } from '../../../app/navigation/types';
import {
  AppScreen,
  EmptyState,
  ErrorState,
  LoadingState,
} from '../../../shared/components';
import { useGetOffersQuery } from '../../../api/greenloopApi';
import { colors } from '../../../shared/theme/colors';
import { spacing } from '../../../shared/theme/spacing';

export function MerchantsScreen() {
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const { data, isLoading, isError, refetch } = useGetOffersQuery();

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
        <ErrorState message="No se pudieron cargar las ofertas." onRetry={refetch} />
      </AppScreen>
    );
  }

  const offers = data?.offers ?? [];
  if (offers.length === 0) {
    return (
      <AppScreen>
        <EmptyState title="Sin ofertas" subtitle="Vuelve pronto." />
      </AppScreen>
    );
  }

  return (
    <AppScreen>
      <FlatList
        data={offers}
        keyExtractor={item => item.id}
        contentContainerStyle={{ padding: spacing.md }}
        renderItem={({ item }) => (
          <Pressable
            onPress={() =>
              navigation.navigate('OfferDetail', { offerId: item.id })
            }
            style={styles.row}>
            <Image source={{ uri: item.imageUrl }} style={styles.img} />
            <View style={styles.body}>
              <Text style={styles.title}>{item.title}</Text>
              <Text style={styles.merchant}>
                {item.merchant?.name ?? 'Comercio aliado'}
              </Text>
              <Text style={styles.cost}>{item.pointsCost} pts</Text>
            </View>
          </Pressable>
        )}
      />
    </AppScreen>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    backgroundColor: colors.surface,
    borderRadius: 14,
    marginBottom: spacing.md,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: colors.border,
  },
  img: { width: 100, height: 100 },
  body: { flex: 1, padding: spacing.sm, justifyContent: 'center' },
  title: { fontWeight: '800', fontSize: 16, color: colors.text },
  merchant: { fontSize: 13, color: colors.textMuted, marginTop: 4 },
  cost: {
    marginTop: 8,
    fontWeight: '700',
    color: colors.primary,
    fontSize: 15,
  },
});
