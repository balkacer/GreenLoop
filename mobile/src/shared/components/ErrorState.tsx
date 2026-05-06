import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { AppButton } from './AppButton';
import { colors } from '../theme/colors';
import { spacing } from '../theme/spacing';

interface Props {
  message: string;
  onRetry?: () => void;
}

export function ErrorState({ message, onRetry }: Props) {
  return (
    <View style={styles.wrap}>
      <Text style={styles.msg}>{message}</Text>
      {onRetry ? (
        <AppButton title="Reintentar" variant="outline" onPress={onRetry} />
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { padding: spacing.lg, alignItems: 'center', gap: spacing.md },
  msg: { color: colors.danger, textAlign: 'center', fontSize: 15 },
});
