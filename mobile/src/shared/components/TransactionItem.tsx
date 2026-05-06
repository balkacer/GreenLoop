import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import type { PointsTransaction } from '../types';
import { colors } from '../theme/colors';
import { spacing } from '../theme/spacing';
import { StatusBadge } from './StatusBadge';

interface Props {
  item: PointsTransaction;
}

export function TransactionItem({ item }: Props) {
  const sign = item.amount >= 0 ? '+' : '';
  return (
    <View style={styles.row}>
      <View style={styles.main}>
        <Text style={styles.desc}>{item.description}</Text>
        <Text style={styles.date}>
          {new Date(item.createdAt).toLocaleString('es-DO')}
        </Text>
        <StatusBadge status={item.status} />
      </View>
      <Text
        style={[
          styles.amount,
          item.amount >= 0 ? styles.positive : styles.negative,
        ]}>
        {sign}
        {item.amount}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: spacing.md,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderColor: colors.border,
  },
  main: { flex: 1, paddingRight: spacing.sm },
  desc: { fontSize: 15, fontWeight: '600', color: colors.text },
  date: { fontSize: 12, color: colors.textMuted, marginTop: 4 },
  amount: { fontSize: 16, fontWeight: '800' },
  positive: { color: colors.success },
  negative: { color: colors.text },
});
