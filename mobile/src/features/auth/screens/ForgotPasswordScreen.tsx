import { zodResolver } from '@hookform/resolvers/zod';
import React from 'react';
import { Controller, useForm } from 'react-hook-form';
import { Alert, StyleSheet, Text } from 'react-native';
import { z } from 'zod';
import { useForgotPasswordMutation } from '../../../api/greenloopApi';
import {
  AppButton,
  AppInput,
  AppScreen,
} from '../../../shared/components';
import { getErrorMessage } from '../../../shared/utils/errorMessage';
import { colors } from '../../../shared/theme/colors';
import { spacing } from '../../../shared/theme/spacing';

const schema = z.object({
  email: z.string().email(),
});

type FormValues = z.infer<typeof schema>;

export function ForgotPasswordScreen() {
  const [forgot, { isLoading }] = useForgotPasswordMutation();
  const { control, handleSubmit, formState } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { email: '' },
  });

  const onSubmit = async (values: FormValues) => {
    try {
      const res = await forgot(values).unwrap();
      Alert.alert('Listo', res.message);
    } catch (e) {
      Alert.alert('Error', getErrorMessage(e));
    }
  };

  return (
    <AppScreen scroll>
      <Text style={styles.text}>
        En esta versión solo simulamos el envío. En producción recibirás un
        enlace para restablecer tu contraseña.
      </Text>
      <Controller
        control={control}
        name="email"
        render={({ field: { onChange, onBlur, value } }) => (
          <AppInput
            label="Correo registrado"
            autoCapitalize="none"
            keyboardType="email-address"
            onBlur={onBlur}
            onChangeText={onChange}
            value={value}
            error={formState.errors.email?.message}
          />
        )}
      />
      <AppButton
        title="Enviar instrucciones (mock)"
        loading={isLoading}
        onPress={handleSubmit(onSubmit)}
      />
    </AppScreen>
  );
}

const styles = StyleSheet.create({
  text: {
    marginBottom: spacing.md,
    color: colors.textMuted,
    fontSize: 15,
    lineHeight: 22,
  },
});
