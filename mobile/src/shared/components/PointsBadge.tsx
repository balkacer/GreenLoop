import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { colors } from '../theme/colors';
import { spacing } from '../theme/spacing';

interface Props {
  points: number;
  compact?: boolean;
}

export function PointsBadge({ points, compact }: Props) {
  return (
    <View style={[styles.wrap, compact && styles.compact]}>
      <Text style={styles.label}>GreenPoints</Text>
      <Text style={styles.value}>{points.toLocaleString('es-DO')}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    alignSelf: 'flex-start',
    backgroundColor: colors.accent + '44',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: 999,
  },
  compact: { paddingHorizontal: spacing.sm, paddingVertical: spacing.xs },
  label: {
    fontSize: 11,
    fontWeight: '600',
    color: colors.primaryDark,
    textTransform: 'uppercase',
  },
  value: {
    fontSize: 20,
    fontWeight: '800',
    color: colors.primary,
  },
});
