import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import React from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import type { RootStackParamList } from '../../../app/navigation/types';
import {
  AppButton,
  AppCard,
  AppScreen,
} from '../../../shared/components';
import { colors } from '../../../shared/theme/colors';
import { spacing } from '../../../shared/theme/spacing';

type Props = NativeStackScreenProps<RootStackParamList, 'DepositSuccess'>;

export function DepositSuccessScreen({ route }: Props) {
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const {
    containerId,
    containerName,
    pointsEarned,
    newBalance,
    calculation,
    completedAt,
  } = route.params;

  const dateLabel = new Date(completedAt).toLocaleString('es-DO');

  const lines = calculation.breakdown.filter(
    l => l.label !== 'Total ganado',
  );

  return (
    <AppScreen>
      <ScrollView contentContainerStyle={styles.pad}>
        <Text style={styles.celebrate}>¡Depósito completado!</Text>
        <Text style={styles.points}>
          Ganaste{' '}
          <Text style={styles.pointsStrong}>{pointsEarned}</Text> GreenPoints
        </Text>
        <Text style={styles.sub}>
          Nuevo saldo: {newBalance.toLocaleString('es-DO')} GP
        </Text>

        <AppCard style={styles.card}>
          <Text style={styles.cardTitle}>Resumen</Text>
          <Text style={styles.rowMuted}>
            Contenedor: {containerName ?? containerId}
          </Text>
          <Text style={styles.rowMuted}>Fecha y hora: {dateLabel}</Text>
        </AppCard>

        <Text style={styles.section}>Desglose del cálculo</Text>
        <AppCard>
          {lines.map((line, i) => (
            <View
              key={`${line.label}-${i}`}
              style={styles.breakRow}>
              <Text style={styles.breakLabel}>{line.label}</Text>
              <Text style={styles.breakVal}>{line.value}</Text>
            </View>
          ))}
          <View style={[styles.breakRow, styles.totalRow]}>
            <Text style={styles.totalLabel}>Total ganado</Text>
            <Text style={styles.totalVal}>+{pointsEarned} GP</Text>
          </View>
        </AppCard>

        <AppButton
          title="Ver historial de puntos"
          variant="secondary"
          onPress={() =>
            navigation.reset({
              index: 0,
              routes: [
                {
                  name: 'Main',
                  params: { screen: 'Puntos' },
                },
              ],
            })
          }
        />
        <AppButton
          title="Volver al inicio"
          variant="outline"
          onPress={() =>
            navigation.reset({
              index: 0,
              routes: [
                {
                  name: 'Main',
                  params: { screen: 'Inicio' },
                },
              ],
            })
          }
        />
      </ScrollView>
    </AppScreen>
  );
}

const styles = StyleSheet.create({
  pad: { padding: spacing.md, paddingBottom: spacing.xl },
  celebrate: {
    fontSize: 22,
    fontWeight: '900',
    color: colors.primaryDark,
    textAlign: 'center',
  },
  points: {
    marginTop: spacing.md,
    fontSize: 18,
    textAlign: 'center',
    color: colors.text,
  },
  pointsStrong: {
    fontSize: 28,
    fontWeight: '900',
    color: colors.primary,
  },
  sub: {
    marginTop: spacing.sm,
    textAlign: 'center',
    color: colors.textMuted,
    marginBottom: spacing.lg,
  },
  card: { marginBottom: spacing.md },
  cardTitle: {
    fontWeight: '800',
    fontSize: 16,
    marginBottom: spacing.sm,
    color: colors.text,
  },
  rowMuted: { fontSize: 14, color: colors.textMuted, marginBottom: 4 },
  section: {
    fontWeight: '800',
    fontSize: 16,
    marginBottom: spacing.sm,
    color: colors.text,
  },
  breakRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: spacing.sm,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderColor: colors.border,
  },
  breakLabel: { flex: 1, color: colors.text, fontSize: 14 },
  breakVal: { fontWeight: '700', color: colors.primaryDark, fontSize: 14 },
  totalRow: {
    borderBottomWidth: 0,
    marginTop: spacing.xs,
    paddingTop: spacing.sm,
  },
  totalLabel: { fontWeight: '900', fontSize: 16, color: colors.text },
  totalVal: { fontWeight: '900', fontSize: 18, color: colors.primary },
});
