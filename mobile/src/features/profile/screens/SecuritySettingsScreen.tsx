import React from 'react';
import { Alert, StyleSheet, Switch, Text, View } from 'react-native';
import { AppCard, AppScreen } from '../../../shared/components';
import { useUiStore } from '../../../app/store/uiStore';
import {
  clearSavedCredentials,
} from '../../../shared/services/biometrics';
import { colors } from '../../../shared/theme/colors';
import { spacing } from '../../../shared/theme/spacing';

export function SecuritySettingsScreen() {
  const biometricLoginEnabled = useUiStore(s => s.biometricLoginEnabled);
  const setBio = useUiStore(s => s.setBiometricLoginEnabled);

  return (
    <AppScreen scroll>
      <Text style={styles.lead}>
        La biometría usa Face ID o huella según tu dispositivo. Tus credenciales
        se guardan en el almacén seguro del teléfono.
      </Text>
      <AppCard>
        <View style={styles.row}>
          <View style={{ flex: 1 }}>
            <Text style={styles.label}>Inicio con biometría</Text>
            <Text style={styles.hint}>
              Tras activar, la próxima vez que inicies sesión con usuario y
              contraseña guardaremos el acceso de forma segura.
            </Text>
          </View>
          <Switch
            value={biometricLoginEnabled}
            onValueChange={async v => {
              setBio(v);
              if (!v) {
                await clearSavedCredentials();
              }
              Alert.alert(
                v ? 'Activado' : 'Desactivado',
                v
                  ? 'Inicia sesión una vez más para registrar tu huella o rostro.'
                  : 'Credenciales locales eliminadas.',
              );
            }}
          />
        </View>
      </AppCard>
      <Text style={styles.note}>
        Google, Apple y passkeys se configurarán cuando el backend formal esté
        listo.
      </Text>
    </AppScreen>
  );
}

const styles = StyleSheet.create({
  lead: {
    paddingHorizontal: spacing.md,
    marginBottom: spacing.md,
    color: colors.textMuted,
    lineHeight: 20,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
  },
  label: { fontWeight: '700', fontSize: 16, color: colors.text },
  hint: { marginTop: 4, fontSize: 13, color: colors.textMuted },
  note: {
    padding: spacing.md,
    fontSize: 13,
    color: colors.textMuted,
  },
});
