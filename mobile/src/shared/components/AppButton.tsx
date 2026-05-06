import React from 'react';
import {
  ActivityIndicator,
  Pressable,
  StyleSheet,
  Text,
  type PressableProps,
  type StyleProp,
  type ViewStyle,
} from 'react-native';
import { colors } from '../theme/colors';
import { spacing } from '../theme/spacing';

type Variant = 'primary' | 'secondary' | 'outline' | 'danger';

export interface AppButtonProps extends Omit<PressableProps, 'style'> {
  title: string;
  loading?: boolean;
  variant?: Variant;
  style?: StyleProp<ViewStyle>;
}

export function AppButton({
  title,
  loading,
  variant = 'primary',
  disabled,
  style,
  ...rest
}: AppButtonProps) {
  const v = stylesForVariant(variant);
  return (
    <Pressable
      accessibilityRole="button"
      disabled={disabled || loading}
      style={({ pressed }) => [
        styles.base,
        v.container,
        (disabled || loading) && styles.disabled,
        pressed && styles.pressed,
        style,
      ]}
      {...rest}>
      {loading ? (
        <ActivityIndicator color={v.spinnerColor} />
      ) : (
        <Text style={[styles.label, v.label]}>{title}</Text>
      )}
    </Pressable>
  );
}

function stylesForVariant(variant: Variant) {
  switch (variant) {
    case 'secondary':
      return {
        container: { backgroundColor: colors.accent },
        label: { color: colors.text },
        spinnerColor: colors.text,
      };
    case 'outline':
      return {
        container: {
          backgroundColor: 'transparent',
          borderWidth: 2,
          borderColor: colors.primary,
        },
        label: { color: colors.primary },
        spinnerColor: colors.primary,
      };
    case 'danger':
      return {
        container: { backgroundColor: colors.danger },
        label: { color: '#fff' },
        spinnerColor: '#fff',
      };
    default:
      return {
        container: { backgroundColor: colors.primary },
        label: { color: '#fff' },
        spinnerColor: '#fff',
      };
  }
}

const styles = StyleSheet.create({
  base: {
    minHeight: 52,
    paddingHorizontal: spacing.lg,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  label: {
    fontSize: 17,
    fontWeight: '600',
  },
  disabled: { opacity: 0.55 },
  pressed: { opacity: 0.85 },
});
