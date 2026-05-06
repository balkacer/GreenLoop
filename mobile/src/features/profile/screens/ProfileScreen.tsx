import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import React from 'react';
import { Alert, StyleSheet, Text, View } from 'react-native';
import type { RootStackParamList } from '../../../app/navigation/types';
import { useSessionStore } from '../../../app/store/sessionStore';
import {
  AppButton,
  AppCard,
  AppScreen,
  PointsBadge,
} from '../../../shared/components';
import { useGetMeQuery } from '../../../api/greenloopApi';
import { colors } from '../../../shared/theme/colors';
import { spacing } from '../../../shared/theme/spacing';

export function ProfileScreen() {
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const logout = useSessionStore(s => s.logout);
  const cached = useSessionStore(s => s.user);
  const { data } = useGetMeQuery(undefined, {
    refetchOnMountOrArgChange: true,
  });
  const user = data ?? cached;

  return (
    <AppScreen scroll>
      <Text style={styles.title}>Perfil</Text>
      {user ? (
        <>
          <PointsBadge points={user.balance} />
          <AppCard style={styles.card}>
            <Text style={styles.name}>{user.name}</Text>
            <Text style={styles.meta}>{user.email}</Text>
            <Text style={styles.meta}>@{user.username}</Text>
            {user.phone ? (
              <Text style={styles.meta}>Tel: {user.phone}</Text>
            ) : null}
            {user.cedula ? (
              <Text style={styles.meta}>Cédula: {user.cedula}</Text>
            ) : null}
            {user.address ? (
              <Text style={styles.meta}>{user.address}</Text>
            ) : null}
          </AppCard>
        </>
      ) : (
        <Text style={styles.meta}>Cargando perfil…</Text>
      )}

      <AppButton
        title="Editar datos"
        onPress={() => navigation.navigate('EditProfile')}
      />
      <AppButton
        title="Seguridad y biometría"
        variant="outline"
        onPress={() => navigation.navigate('SecuritySettings')}
      />
      <AppButton
        title="Cerrar sesión"
        variant="danger"
        onPress={() => {
          Alert.alert('Cerrar sesión', '¿Seguro que deseas salir?', [
            { text: 'Cancelar', style: 'cancel' },
            {
              text: 'Salir',
              style: 'destructive',
              onPress: () => {
                logout();
                navigation.reset({
                  index: 0,
                  routes: [{ name: 'Login' }],
                });
              },
            },
          ]);
        }}
      />
    </AppScreen>
  );
}

const styles = StyleSheet.create({
  title: {
    fontSize: 24,
    fontWeight: '800',
    marginBottom: spacing.md,
    color: colors.text,
  },
  card: { marginVertical: spacing.md },
  name: { fontSize: 20, fontWeight: '800', color: colors.text },
  meta: { marginTop: 6, color: colors.textMuted, fontSize: 14 },
});
