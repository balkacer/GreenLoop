import { zodResolver } from '@hookform/resolvers/zod';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import React from 'react';
import { Controller, useForm } from 'react-hook-form';
import { Alert, StyleSheet, Text } from 'react-native';
import { z } from 'zod';
import { useRegisterMutation } from '../../../api/greenloopApi';
import type { RootStackParamList } from '../../../app/navigation/types';
import { useSessionStore } from '../../../app/store/sessionStore';
import {
  AppButton,
  AppInput,
  AppScreen,
} from '../../../shared/components';
import { getErrorMessage } from '../../../shared/utils/errorMessage';
import { colors } from '../../../shared/theme/colors';
import { spacing } from '../../../shared/theme/spacing';

const schema = z
  .object({
    name: z.string().min(2, 'Nombre muy corto'),
    email: z.string().email('Correo inválido'),
    username: z
      .string()
      .min(3, 'Mínimo 3 caracteres')
      .regex(/^[a-zA-Z0-9._-]+$/, 'Solo letras, números y ._-'),
    password: z.string().min(6, 'Mínimo 6 caracteres'),
    referralCode: z.string().optional(),
  })
  .strict();

type FormValues = z.infer<typeof schema>;

export function RegisterScreen() {
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const setSession = useSessionStore(s => s.setSession);
  const [registerUser, { isLoading }] = useRegisterMutation();

  const { control, handleSubmit, formState } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      name: '',
      email: '',
      username: '',
      password: '',
      referralCode: '',
    },
  });

  const onSubmit = async (values: FormValues) => {
    try {
      const res = await registerUser({
        name: values.name,
        email: values.email,
        username: values.username,
        password: values.password,
        referralCode: values.referralCode?.trim() || undefined,
      }).unwrap();
      setSession({
        accessToken: res.accessToken,
        refreshToken: res.refreshToken,
        user: res.user,
      });
      navigation.reset({ index: 0, routes: [{ name: 'Main' }] });
    } catch (e) {
      Alert.alert('Registro', getErrorMessage(e));
    }
  };

  return (
    <AppScreen scroll>
      <Text style={styles.lead}>
        Puedes usar tu correo como identificador principal. La cédula como
        usuario será opcional más adelante.
      </Text>
      <Controller
        control={control}
        name="name"
        render={({ field: { onChange, onBlur, value } }) => (
          <AppInput
            label="Nombre completo"
            onBlur={onBlur}
            onChangeText={onChange}
            value={value}
            error={formState.errors.name?.message}
          />
        )}
      />
      <Controller
        control={control}
        name="email"
        render={({ field: { onChange, onBlur, value } }) => (
          <AppInput
            label="Correo"
            autoCapitalize="none"
            keyboardType="email-address"
            onBlur={onBlur}
            onChangeText={onChange}
            value={value}
            error={formState.errors.email?.message}
          />
        )}
      />
      <Controller
        control={control}
        name="username"
        render={({ field: { onChange, onBlur, value } }) => (
          <AppInput
            label="Usuario"
            autoCapitalize="none"
            onBlur={onBlur}
            onChangeText={onChange}
            value={value}
            error={formState.errors.username?.message}
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
      <Controller
        control={control}
        name="referralCode"
        render={({ field: { onChange, onBlur, value } }) => (
          <AppInput
            label="Código de referido (opcional)"
            autoCapitalize="characters"
            onBlur={onBlur}
            onChangeText={onChange}
            value={value}
            error={formState.errors.referralCode?.message}
          />
        )}
      />
      <AppButton
        title="Registrarme"
        loading={isLoading}
        onPress={handleSubmit(onSubmit)}
      />
    </AppScreen>
  );
}

const styles = StyleSheet.create({
  lead: {
    marginBottom: spacing.md,
    color: colors.textMuted,
    fontSize: 14,
    lineHeight: 20,
  },
});
