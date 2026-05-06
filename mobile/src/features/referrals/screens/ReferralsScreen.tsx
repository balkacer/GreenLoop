import React from 'react';
import { Alert, StyleSheet, Text } from 'react-native';
import {
  AppButton,
  AppCard,
  AppScreen,
  AppInput,
} from '../../../shared/components';
import {
  useGetReferralCodeQuery,
  useInviteReferralMutation,
} from '../../../api/greenloopApi';
import { shareText } from '../../../shared/services/sharing';
import { getErrorMessage } from '../../../shared/utils/errorMessage';
import { colors } from '../../../shared/theme/colors';
import { spacing } from '../../../shared/theme/spacing';

export function ReferralsScreen() {
  const { data, isLoading } = useGetReferralCodeQuery();
  const [invite] = useInviteReferralMutation();
  const [email, setEmail] = React.useState('');
  const [phone, setPhone] = React.useState('');

  const share = async () => {
    if (!data) return;
    await shareText(
      'Únete a GreenLoop',
      `Usa mi código ${data.code} o abre ${data.shareUrl}`,
    );
  };

  const sendInvite = async () => {
    try {
      const res = await invite({
        email: email.trim() || undefined,
        phone: phone.trim() || undefined,
      }).unwrap();
      Alert.alert('Invitación', res.message);
    } catch (e) {
      Alert.alert('Error', getErrorMessage(e));
    }
  };

  return (
    <AppScreen scroll>
      <Text style={styles.lead}>
        Comparte tu código y gana puntos cuando alguien se registre con él.
      </Text>
      <AppCard>
        <Text style={styles.label}>Tu código</Text>
        <Text style={styles.code}>
          {isLoading ? '…' : data?.code ?? '—'}
        </Text>
        <Text style={styles.bonus}>
          Bonificación actual: {data?.bonusPoints ?? '—'} pts (config servidor)
        </Text>
      </AppCard>
      <AppButton title="Compartir enlace" onPress={share} />
      <AppInput
        label="Correo de invitado (opcional)"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
      />
      <AppInput
        label="Teléfono de invitado (opcional)"
        value={phone}
        onChangeText={setPhone}
        keyboardType="phone-pad"
      />
      <AppButton title="Registrar invitación (mock)" onPress={sendInvite} />
    </AppScreen>
  );
}

const styles = StyleSheet.create({
  lead: {
    paddingHorizontal: spacing.md,
    marginBottom: spacing.md,
    color: colors.textMuted,
    fontSize: 15,
    lineHeight: 22,
  },
  label: { fontSize: 13, fontWeight: '700', color: colors.textMuted },
  code: {
    fontSize: 28,
    fontWeight: '900',
    color: colors.primary,
    marginVertical: spacing.sm,
    letterSpacing: 1,
  },
  bonus: { fontSize: 13, color: colors.textMuted },
});
