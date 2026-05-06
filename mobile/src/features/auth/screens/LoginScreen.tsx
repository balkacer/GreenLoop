import { zodResolver } from '@hookform/resolvers/zod';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import React from 'react';
import { Controller, useForm } from 'react-hook-form';
import { Alert, StyleSheet, Text, View } from 'react-native';
import { z } from 'zod';
import { useLoginMutation } from '../../../api/greenloopApi';
import type { RootStackParamList } from '../../../app/navigation/types';
import { useSessionStore } from '../../../app/store/sessionStore';
import { useUiStore } from '../../../app/store/uiStore';
import {
  AppButton,
  AppInput,
  AppScreen,
  GreenLoopLogo,
} from '../../../shared/components';
import {
  isBiometricAvailable,
  loadCredentialsWithBiometric,
  saveCredentialsForBiometric,
  simplePrompt,
} from '../../../shared/services/biometrics';
import { getErrorMessage } from '../../../shared/utils/errorMessage';
import { colors } from '../../../shared/theme/colors';
import { spacing } from '../../../shared/theme/spacing';

const schema = z.object({
  identifier: z.string().min(1, 'Requerido'),
  password: z.string().min(1, 'Requerido'),
});

type FormValues = z.infer<typeof schema>;

export function LoginScreen() {
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const setSession = useSessionStore(s => s.setSession);
  const biometricPref = useUiStore(s => s.biometricLoginEnabled);
  const [login, { isLoading }] = useLoginMutation();

  const { control, handleSubmit, formState } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { identifier: '', password: '' },
  });

  const onSubmit = async (values: FormValues) => {
    try {
      const res = await login(values).unwrap();
      setSession({
        accessToken: res.accessToken,
        refreshToken: res.refreshToken,
        user: res.user,
      });
      if (biometricPref) {
        try {
          await saveCredentialsForBiometric(values.identifier, values.password);
        } catch {
          /* keychain opcional */
        }
      }
      navigation.reset({ index: 0, routes: [{ name: 'Main' }] });
    } catch (e) {
      Alert.alert('No se pudo iniciar sesión', getErrorMessage(e));
    }
  };

  const biometricLogin = async () => {
    const okSensor = await isBiometricAvailable();
    if (!okSensor || !biometricPref) {
      Alert.alert(
        'Biometría',
        'Activa el inicio biométrico en Seguridad después de iniciar sesión.',
      );
      return;
    }
    const prompted = await simplePrompt('Desbloquea para entrar a GreenLoop');
    if (!prompted) return;
    try {
      const creds = await loadCredentialsWithBiometric();
      if (!creds) {
        Alert.alert(
          'Credenciales',
          'No hay credenciales guardadas. Inicia sesión con usuario y contraseña.',
        );
        return;
      }
      const res = await login({
        identifier: creds.username,
        password: creds.password,
      }).unwrap();
      setSession({
        accessToken: res.accessToken,
        refreshToken: res.refreshToken,
        user: res.user,
      });
      navigation.reset({ index: 0, routes: [{ name: 'Main' }] });
    } catch (e) {
      Alert.alert('Error', getErrorMessage(e));
    }
  };

  return (
    <AppScreen scroll>
      <View style={styles.hero}>
        <GreenLoopLogo variant="symbol_green" width={200} style={styles.logoMark} />
        <Text style={styles.tag}>Menos basura, más recompensas.</Text>
      </View>

      <Controller
        control={control}
        name="identifier"
        render={({ field: { onChange, onBlur, value } }) => (
          <AppInput
            label="Correo o usuario"
            autoCapitalize="none"
            keyboardType="email-address"
            onBlur={onBlur}
            onChangeText={onChange}
            value={value}
            error={formState.errors.identifier?.message}
          />
        )}
      />
      <Controller
        control={control}
        name="password"
        render={({ field: { onChange, onBlur, value } }) => (
          <AppInput
            label="Contraseña"
            secureTextEntry
            onBlur={onBlur}
            onChangeText={onChange}
            value={value}
            error={formState.errors.password?.message}
          />
        )}
      />

      <AppButton
        title="Entrar"
        loading={isLoading}
        onPress={handleSubmit(onSubmit)}
      />

      <AppButton
        title="Entrar con biometría"
        variant="secondary"
        onPress={biometricLogin}
      />

      <AppButton
        title="Continuar con Google"
        variant="outline"
        onPress={() =>
          Alert.alert(
            'Google',
            'OAuth estará disponible cuando conectemos el backend formal.',
          )
        }
      />
      <AppButton
        title="Continuar con Apple"
        variant="outline"
        onPress={() =>
          Alert.alert(
            'Apple',
            'Sign in with Apple se habilitará en una siguiente iteración.',
          )
        }
      />
      <AppButton
        title="Usar passkey"
        variant="outline"
        onPress={() =>
          Alert.alert(
            'Passkeys',
            'Aquí irá WebAuthn / passkeys cuando el backend lo soporte.',
          )
        }
      />

      <AppButton
        title="Crear cuenta"
        variant="outline"
        onPress={() => navigation.navigate('Register')}
      />
      <AppButton
        title="¿Olvidaste tu contraseña?"
        variant="outline"
        onPress={() => navigation.navigate('ForgotPassword')}
      />

      <Text style={styles.demo}>
        Demo: demo@greenloop.do / demo1234 o usuario demo_greenloop
      </Text>
    </AppScreen>
  );
}

const styles = StyleSheet.create({
  hero: { marginBottom: spacing.lg, alignItems: 'center' },
  logoMark: { alignSelf: 'center' },
  tag: {
    marginTop: spacing.md,
    fontSize: 16,
    color: colors.textMuted,
    textAlign: 'center',
  },
  demo: {
    marginTop: spacing.lg,
    fontSize: 12,
    color: colors.textMuted,
    textAlign: 'center',
  },
});
