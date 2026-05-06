import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import React, { useMemo } from 'react';
import type { LucideIcon } from 'lucide-react-native';
import {
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import {
  Calendar,
  Gift,
  History,
  Leaf,
  Cloud,
  MapPin,
  QrCode,
  Sparkles,
  Store,
  Users,
} from 'lucide-react-native';
import type { RootStackParamList } from '../../../app/navigation/types';
import { useSessionStore } from '../../../app/store/sessionStore';
import {
  AppCard,
  AppScreen,
  QuickActionTile,
} from '../../../shared/components';
import { useGetBalanceQuery } from '../../../api/greenloopApi';
import { colors } from '../../../shared/theme/colors';
import { spacing } from '../../../shared/theme/spacing';

export function DashboardScreen() {
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const { data, isLoading } = useGetBalanceQuery();
  const user = useSessionStore(s => s.user);

  const greeting = useMemo(() => {
    const h = new Date().getHours();
    const part =
      h < 12 ? 'Buenos días' : h < 19 ? 'Buenas tardes' : 'Buenas noches';
    const name = user?.name?.trim()?.split(/\s+/)[0] ?? 'GreenLooper';
    return { part, name };
  }, [user?.name]);

  const points = data?.balance ?? 0;

  return (
    <AppScreen>
      <ScrollView
        contentContainerStyle={styles.pad}
        showsVerticalScrollIndicator={false}>
        <LinearGradient
          colors={[colors.mintSoft, colors.background]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.hero}>
          <Text style={styles.heroKicker}>Tu impacto</Text>
          <Text style={styles.heroTitle}>
            {greeting.part},{' '}
            <Text style={styles.heroAccent}>{greeting.name}</Text>
          </Text>
          <Text style={styles.heroSub}>
            Sigue sumando GreenPoints con cada depósito correcto.
          </Text>
        </LinearGradient>

        <View style={styles.statsRow}>
          <StatMini
            icon={Leaf}
            label="Material"
            value="Pronto"
            hint="kg estimados"
          />
          <StatMini
            icon={Cloud}
            label="CO₂ evitado"
            value="Pronto"
            hint="gramos"
          />
          <StatMini
            icon={Sparkles}
            label="GreenPoints"
            value={
              isLoading ? '…' : points.toLocaleString('es-DO')
            }
            hint="balance"
          />
        </View>

        <AppCard variant="mint" style={styles.card}>
          <View style={styles.sectionHead}>
            <Text style={styles.section}>Accesos rápidos</Text>
            <QrCode color={colors.brandTeal} size={20} />
          </View>
          <View style={styles.grid}>
            <QuickActionTile
              tint="mint"
              icon={QrCode}
              title="Escanear QR"
              onPress={() => navigation.navigate('ScanQr')}
            />
            <QuickActionTile
              tint="lime"
              icon={MapPin}
              title="Contenedores"
              onPress={() =>
                navigation.navigate('Main', { screen: 'Mapa' })
              }
            />
            <QuickActionTile
              tint="mint"
              icon={Store}
              title="Ofertas"
              onPress={() => navigation.navigate('Merchants')}
            />
            <QuickActionTile
              tint="lime"
              icon={History}
              title="Historial"
              onPress={() =>
                navigation.navigate('Main', { screen: 'Puntos' })
              }
            />
            <QuickActionTile
              tint="mint"
              icon={Users}
              title="Referir"
              onPress={() => navigation.navigate('Referrals')}
            />
            <QuickActionTile
              tint="lime"
              icon={Gift}
              title="Donaciones"
              onPress={() => navigation.navigate('Foundations')}
            />
            <QuickActionTile
              tint="mint"
              icon={Calendar}
              title="Eventos"
              onPress={() => navigation.navigate('Events')}
            />
          </View>
        </AppCard>

        <AppCard variant="tealWash">
          <Text style={styles.tipTitle}>Consejo del día</Text>
          <Text style={styles.tipBody}>
            Deposita envases limpios y secos para maximizar puntos y mantener los
            contenedores listos para la comunidad.
          </Text>
        </AppCard>
      </ScrollView>
    </AppScreen>
  );
}

function StatMini({
  icon: Icon,
  label,
  value,
  hint,
}: {
  icon: LucideIcon;
  label: string;
  value: string;
  hint: string;
}) {
  return (
    <View style={styles.statCard}>
      <View style={styles.statIcon}>
        <Icon color={colors.brandGreen} size={18} />
      </View>
      <Text style={styles.statLabel}>{label}</Text>
      <Text style={styles.statValue}>{value}</Text>
      <Text style={styles.statHint}>{hint}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  pad: {
    paddingHorizontal: spacing.md,
    paddingBottom: spacing.xl,
  },
  hero: {
    borderRadius: 20,
    padding: spacing.md,
    marginBottom: spacing.md,
  },
  heroKicker: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.brandTeal,
    marginBottom: 4,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  heroTitle: {
    fontSize: 24,
    fontWeight: '800',
    color: colors.text,
    marginBottom: spacing.xs,
  },
  heroAccent: { color: colors.brandGreen },
  heroSub: {
    fontSize: 15,
    lineHeight: 21,
    color: colors.textMuted,
  },
  statsRow: {
    flexDirection: 'row',
    gap: spacing.sm,
    marginBottom: spacing.lg,
  },
  statCard: {
    flex: 1,
    backgroundColor: colors.surface,
    borderRadius: 16,
    paddingVertical: spacing.sm,
    paddingHorizontal: 8,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.borderLight,
    shadowColor: '#000',
    shadowOpacity: 0.04,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
    elevation: 1,
  },
  statIcon: {
    marginBottom: 6,
  },
  statLabel: {
    fontSize: 11,
    fontWeight: '700',
    color: colors.textMuted,
    marginBottom: 2,
    textAlign: 'center',
  },
  statValue: {
    fontSize: 15,
    fontWeight: '800',
    color: colors.text,
    textAlign: 'center',
  },
  statHint: {
    fontSize: 10,
    color: colors.textMuted,
    marginTop: 2,
    textAlign: 'center',
  },
  card: { marginBottom: spacing.md },
  sectionHead: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: spacing.md,
  },
  section: {
    fontSize: 17,
    fontWeight: '800',
    color: colors.text,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
    justifyContent: 'space-between',
  },
  tipTitle: {
    fontWeight: '800',
    fontSize: 16,
    marginBottom: spacing.xs,
    color: colors.brandTeal,
  },
  tipBody: {
    color: colors.textMuted,
    lineHeight: 22,
    fontSize: 15,
  },
});
