import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { AppButton } from './AppButton';
import { AppCard } from './AppCard';
import { showMapsPicker } from '../services/maps';
import { shareText } from '../services/sharing';
import { colors } from '../theme/colors';
import { spacing } from '../theme/spacing';

interface Props {
  title: string;
  address: string;
  lat: number;
  lng: number;
}

export function LocationCard({ title, address, lat, lng }: Props) {
  return (
    <AppCard>
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.addr}>{address}</Text>
      <View style={styles.row}>
        <AppButton
          title="Cómo llegar"
          variant="secondary"
          style={styles.btn}
          onPress={() => showMapsPicker(lat, lng, title)}
        />
        <AppButton
          title="Compartir"
          variant="outline"
          style={styles.btn}
          onPress={() =>
            shareText(title, `${title}\n${address}\nhttps://maps.google.com/?q=${lat},${lng}`)
          }
        />
      </View>
    </AppCard>
  );
}

const styles = StyleSheet.create({
  title: { fontSize: 17, fontWeight: '700', color: colors.text },
  addr: { marginTop: spacing.xs, color: colors.textMuted, marginBottom: spacing.md },
  row: { flexDirection: 'row', gap: spacing.sm },
  btn: { flex: 1 },
});
