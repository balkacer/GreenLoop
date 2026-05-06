import { zodResolver } from '@hookform/resolvers/zod';
import React from 'react';
import { Controller, useForm } from 'react-hook-form';
import { Alert } from 'react-native';
import { z } from 'zod';
import {
  useGetMeQuery,
  usePatchMeMutation,
} from '../../../api/greenloopApi';
import { useSessionStore } from '../../../app/store/sessionStore';
import {
  AppButton,
  AppInput,
  AppScreen,
} from '../../../shared/components';
import { getErrorMessage } from '../../../shared/utils/errorMessage';

const schema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  phone: z.string().optional(),
  cedula: z.string().optional(),
  address: z.string().optional(),
});

type FormValues = z.infer<typeof schema>;

export function EditProfileScreen() {
  const setUser = useSessionStore(s => s.setUser);
  const { data } = useGetMeQuery();
  const [patch, { isLoading }] = usePatchMeMutation();

  const { control, handleSubmit, reset, formState } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      name: '',
      email: '',
      phone: '',
      cedula: '',
      address: '',
    },
  });

  React.useEffect(() => {
    if (data) {
      reset({
        name: data.name,
        email: data.email,
        phone: data.phone ?? '',
        cedula: data.cedula ?? '',
        address: data.address ?? '',
      });
    }
  }, [data, reset]);

  const onSubmit = async (values: FormValues) => {
    try {
      const updated = await patch({
        name: values.name,
        email: values.email,
        phone: values.phone || undefined,
        cedula: values.cedula || undefined,
        address: values.address || undefined,
      }).unwrap();
      setUser(updated);
      Alert.alert('Guardado', 'Tus datos fueron actualizados.');
    } catch (e) {
      Alert.alert('Error', getErrorMessage(e));
    }
  };

  return (
    <AppScreen scroll>
      <Controller
        control={control}
        name="name"
        render={({ field: { onChange, onBlur, value } }) => (
          <AppInput label="Nombre" onBlur={onBlur} onChangeText={onChange} value={value} />
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
          />
        )}
      />
      <Controller
        control={control}
        name="phone"
        render={({ field: { onChange, onBlur, value } }) => (
          <AppInput
            label="Teléfono"
            keyboardType="phone-pad"
            onBlur={onBlur}
            onChangeText={onChange}
            value={value}
          />
        )}
      />
      <Controller
        control={control}
        name="cedula"
        render={({ field: { onChange, onBlur, value } }) => (
          <AppInput
            label="Cédula (opcional)"
            onBlur={onBlur}
            onChangeText={onChange}
            value={value}
          />
        )}
      />
      <Controller
        control={control}
        name="address"
        render={({ field: { onChange, onBlur, value } }) => (
          <AppInput
            label="Dirección (opcional)"
            onBlur={onBlur}
            onChangeText={onChange}
            value={value}
          />
        )}
      />
      <AppButton
        title="Guardar"
        loading={isLoading}
        onPress={handleSubmit(onSubmit)}
      />
    </AppScreen>
  );
}
