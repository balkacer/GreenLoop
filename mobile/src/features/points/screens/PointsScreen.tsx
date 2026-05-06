import React, { useMemo, useState } from 'react';
import { FlatList, Pressable, StyleSheet, Text, View } from 'react-native';
import {
  AppScreen,
  EmptyState,
  ErrorState,
  LoadingState,
  TransactionItem,
} from '../../../shared/components';
import { useGetTransactionsQuery } from '../../../api/greenloopApi';
import type { TransactionType } from '../../../shared/types';
import { colors } from '../../../shared/theme/colors';
import { spacing } from '../../../shared/theme/spacing';

type Filter = 'all' | TransactionType;

export function PointsScreen() {
  const [filter, setFilter] = useState<Filter>('all');
  const { data, isLoading, isError, refetch } = useGetTransactionsQuery();

  const rows = useMemo(() => {
    const txs = data?.transactions ?? [];
    if (filter === 'all') return txs;
    return txs.filter(t => t.type === filter);
  }, [data, filter]);

  const earnedSum = useMemo(() => {
    return (data?.transactions ?? [])
      .filter(t => t.type === 'earned' && t.amount > 0)
      .reduce((a, t) => a + t.amount, 0);
  }, [data]);

  const redeemedSum = useMemo(() => {
    return (data?.transactions ?? [])
      .filter(t => t.type === 'redeemed')
      .reduce((a, t) => a + Math.abs(t.amount), 0);
  }, [data]);

  return (
    <AppScreen>
      <View style={{ flex: 1 }}>
      <View style={styles.summary}>
        <View style={styles.sumBox}>
          <Text style={styles.sumLabel}>Ganados</Text>
          <Text style={styles.sumVal}>+{earnedSum}</Text>
        </View>
        <View style={styles.sumBox}>
          <Text style={styles.sumLabel}>Canjeados</Text>
          <Text style={styles.sumVal}>-{redeemedSum}</Text>
        </View>
      </View>
      <View style={styles.filters}>
        {(['all', 'earned', 'redeemed', 'donated', 'referral_bonus'] as const).map(
          f => (
            <Pressable
              key={f}
              onPress={() => setFilter(f)}
              style={[styles.chip, filter === f && styles.chipOn]}>
              <Text style={[styles.chipTxt, filter === f && styles.chipTxtOn]}>
                {f === 'all'
                  ? 'Todos'
                  : f === 'referral_bonus'
                    ? 'Referidos'
                    : f === 'earned'
                      ? 'Ganados'
                      : f === 'redeemed'
                        ? 'Canjes'
                        : 'Donaciones'}
              </Text>
            </Pressable>
          ),
        )}
      </View>
      {isLoading ? <LoadingState /> : null}
      {isError ? (
        <ErrorState message="No se pudo cargar el historial." onRetry={refetch} />
      ) : null}
      {!isLoading && !isError && rows.length === 0 ? (
        <EmptyState title="Sin movimientos" subtitle="¡Haz tu primer depósito!" />
      ) : (
        <FlatList
          data={rows}
          keyExtractor={item => item.id}
          renderItem={({ item }) => <TransactionItem item={item} />}
          contentContainerStyle={{ paddingHorizontal: spacing.md }}
        />
      )}
      </View>
    </AppScreen>
  );
}

const styles = StyleSheet.create({
  summary: {
    flexDirection: 'row',
    gap: spacing.sm,
    padding: spacing.md,
  },
  sumBox: {
    flex: 1,
    backgroundColor: colors.surface,
    padding: spacing.md,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: colors.border,
  },
  sumLabel: { fontSize: 12, color: colors.textMuted, fontWeight: '600' },
  sumVal: { fontSize: 22, fontWeight: '800', color: colors.primary },
  filters: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
    paddingHorizontal: spacing.md,
    marginBottom: spacing.sm,
  },
  chip: {
    paddingHorizontal: spacing.sm,
    paddingVertical: 6,
    borderRadius: 999,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
  },
  chipOn: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  chipTxt: { fontSize: 12, color: colors.text },
  chipTxtOn: { color: '#fff', fontWeight: '700' },
});
