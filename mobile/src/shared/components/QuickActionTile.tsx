import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import type { LucideIcon } from 'lucide-react-native';
import { colors } from '../theme/colors';
import { spacing } from '../theme/spacing';

interface Props {
  title: string;
  onPress: () => void;
  icon: LucideIcon;
  /** Alterna verde menta / lima como en referencias */
  tint?: 'mint' | 'lime';
}

export function QuickActionTile({
  title,
  onPress,
  icon: Icon,
  tint = 'mint',
}: Props) {
  const bg =
    tint === 'lime' ? colors.limeWash : colors.mintSoft;
  const iconColor =
    tint === 'lime' ? colors.brandBrown : colors.brandTeal;
  return (
    <Pressable
      accessibilityRole="button"
      onPress={onPress}
      style={({ pressed }) => [
        styles.wrap,
        { backgroundColor: bg },
        pressed && styles.pressed,
      ]}>
      <View style={styles.iconCircle}>
        <Icon color={iconColor} size={22} strokeWidth={2.2} />
      </View>
      <Text style={styles.title} numberOfLines={2}>
        {title}
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  wrap: {
    width: '48%',
    borderRadius: 16,
    padding: spacing.sm,
    minHeight: 92,
    justifyContent: 'flex-start',
    borderWidth: 1,
    borderColor: colors.borderLight,
  },
  pressed: { opacity: 0.92 },
  iconCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.sm,
  },
  title: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.text,
    lineHeight: 18,
  },
});
