import React, { type PropsWithChildren } from 'react';
import { StyleSheet, View, type ViewProps } from 'react-native';
import { colors } from '../theme/colors';
import { spacing } from '../theme/spacing';

export type AppCardVariant = 'default' | 'mint' | 'lime' | 'tealWash';

export interface AppCardProps extends ViewProps {
  variant?: AppCardVariant;
}

export function AppCard({
  children,
  style,
  variant = 'default',
  ...rest
}: PropsWithChildren<AppCardProps>) {
  return (
    <View style={[styles.card, variantStyles[variant], style]} {...rest}>
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 18,
    padding: spacing.md,
    shadowColor: '#000',
    shadowOpacity: 0.06,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 3 },
    elevation: 2,
  },
});

const variantStyles = StyleSheet.create({
  default: {
    backgroundColor: colors.surface,
  },
  mint: {
    backgroundColor: colors.mintSoft,
    borderWidth: 1,
    borderColor: colors.borderLight,
  },
  lime: {
    backgroundColor: colors.limeWash,
    borderWidth: 1,
    borderColor: colors.borderLight,
  },
  tealWash: {
    backgroundColor: colors.tealWash,
    borderWidth: 1,
    borderColor: colors.borderLight,
  },
});
