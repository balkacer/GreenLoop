import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import React from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import type { RootStackParamList } from '../../../app/navigation/types';
import {
  AppButton,
  AppCard,
  AppScreen,
  PointsBadge,
} from '../../../shared/components';
import { useGetBalanceQuery } from '../../../api/greenloopApi';
import { colors } from '../../../shared/theme/colors';
import { spacing } from '../../../shared/theme/spacing';

export function DashboardScreen() {
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const { data, isLoading } = useGetBalanceQuery();

  return (
    <AppScreen>
      <ScrollView contentContainerStyle={styles.pad}>
        <Text style={styles.greeting}>Tu impacto hoy</Text>
        {isLoading ? (
          <Text style={styles.muted}>Cargando balance…</Text>
        ) : (
          <PointsBadge points={data?.balance ?? 0} />
        )}

        <AppCard style={styles.card}>
          <Text style={styles.section}>Accesos rápidos</Text>
          <View style={styles.grid}>
            <Quick
              label="Escanear QR"
              onPress={() => navigation.navigate('ScanQr')}
            />
            <Quick
              label="Contenedores"
              onPress={() =>
                navigation.navigate('Main', { screen: 'Mapa' })
              }
            />
            <Quick
              label="Ofertas"
              onPress={() => navigation.navigate('Merchants')}
            />
            <Quick
              label="Historial"
              onPress={() =>
                navigation.navigate('Main', { screen: 'Puntos' })
              }
            />
            <Quick
              label="Referir"
              onPress={() => navigation.navigate('Referrals')}
            />
            <Quick
              label="Donaciones"
              onPress={() => navigation.navigate('Foundations')}
            />
            <Quick
              label="Eventos"
              onPress={() => navigation.navigate('Events')}
            />
          </View>
        </AppCard>

        <AppCard>
          <Text style={styles.tipTitle}>Consejo</Text>
          <Text style={styles.tipBody}>
            Deposita envases limpios y secos para ganar más GreenPoints y mantener
            los contenedores en buen estado.
          </Text>
        </AppCard>
      </ScrollView>
    </AppScreen>
  );
}

function Quick({ label, onPress }: { label: string; onPress: () => void }) {
  return (
    <View style={styles.quickWrap}>
      <AppButton title={label} variant="outline" onPress={onPress} />
    </View>
  );
}

const styles = StyleSheet.create({
  pad: { padding: spacing.md, paddingBottom: spacing.xl },
  greeting: {
    fontSize: 22,
    fontWeight: '800',
    color: colors.text,
    marginBottom: spacing.sm,
  },
  muted: { color: colors.textMuted, marginBottom: spacing.md },
  card: { marginTop: spacing.lg },
  section: {
    fontSize: 16,
    fontWeight: '700',
    marginBottom: spacing.md,
    color: colors.text,
  },
  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm },
  quickWrap: { width: '48%' },
  tipTitle: { fontWeight: '700', fontSize: 15, marginBottom: spacing.xs },
  tipBody: { color: colors.textMuted, lineHeight: 20 },
});
