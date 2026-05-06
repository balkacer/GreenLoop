import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import type { TransactionStatus } from '../types';
import { colors } from '../theme/colors';

interface Props {
  status: TransactionStatus;
}

const LABELS: Record<TransactionStatus, string> = {
  completed: 'Completado',
  pending: 'Pendiente',
  failed: 'Fallido',
  aborted: 'Cancelado',
};

export function StatusBadge({ status }: Props) {
  return (
    <View style={[styles.badge, bg(status)]}>
      <Text style={styles.text}>{LABELS[status]}</Text>
    </View>
  );
}

function bg(status: TransactionStatus) {
  switch (status) {
    case 'completed':
      return { backgroundColor: colors.success + '33' };
    case 'pending':
      return { backgroundColor: colors.warning + '33' };
    case 'failed':
      return { backgroundColor: colors.danger + '33' };
    default:
      return { backgroundColor: colors.textMuted + '33' };
  }
}

const styles = StyleSheet.create({
  badge: {
    alignSelf: 'flex-start',
    marginTop: 6,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 8,
  },
  text: { fontSize: 11, fontWeight: '600', color: colors.text },
});
