import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import React from 'react';
import { Alert, Image, StyleSheet, Text, TextInput, View } from 'react-native';
import {
  AppButton,
  AppScreen,
  ErrorState,
  LoadingState,
  LocationCard,
} from '../../../shared/components';
import type { RootStackParamList } from '../../../app/navigation/types';
import {
  useDonatePointsMutation,
  useGetFoundationQuery,
} from '../../../api/greenloopApi';
import { useSessionStore } from '../../../app/store/sessionStore';
import { getErrorMessage } from '../../../shared/utils/errorMessage';
import { colors } from '../../../shared/theme/colors';
import { spacing } from '../../../shared/theme/spacing';

type Props = NativeStackScreenProps<RootStackParamList, 'FoundationDetail'>;

export function FoundationDetailScreen({ route }: Props) {
  const { foundationId } = route.params;
  const [amount, setAmount] = React.useState('50');
  const { data, isLoading, isError, refetch } = useGetFoundationQuery(foundationId);
  const [donate, { isLoading: donating }] = useDonatePointsMutation();
  const setUser = useSessionStore(s => s.setUser);

  if (isLoading) {
    return (
      <AppScreen>
        <LoadingState />
      </AppScreen>
    );
  }
  if (isError || !data) {
    return (
      <AppScreen>
        <ErrorState message="No encontrado" onRetry={refetch} />
      </AppScreen>
    );
  }

  const submit = async () => {
    const pts = parseInt(amount, 10);
    if (!pts || pts < 1) {
      Alert.alert('Monto inválido');
      return;
    }
    Alert.alert(
      'Confirmar donación',
      `¿Donar ${pts} GreenPoints a ${data.name}?`,
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Donar',
          onPress: async () => {
            try {
              const res = await donate({
                foundationId: data.id,
                amount: pts,
              }).unwrap();
              const u = useSessionStore.getState().user;
              if (u) setUser({ ...u, balance: res.balance });
              Alert.alert('Gracias', res.message);
            } catch (e) {
              Alert.alert('Error', getErrorMessage(e));
            }
          },
        },
      ],
    );
  };

  return (
    <AppScreen scroll>
      <Image source={{ uri: data.imageUrl }} style={styles.hero} />
      <Text style={styles.title}>{data.name}</Text>
      <Text style={styles.body}>{data.mission}</Text>
      <LocationCard
        title={data.name}
        address={data.address}
        lat={data.lat}
        lng={data.lng}
      />
      <View style={styles.row}>
        <Text style={styles.label}>Puntos a donar</Text>
        <TextInput
          keyboardType="number-pad"
          value={amount}
          onChangeText={setAmount}
          style={styles.input}
        />
      </View>
      <AppButton title="Donar GreenPoints" loading={donating} onPress={submit} />
    </AppScreen>
  );
}

const styles = StyleSheet.create({
  hero: {
    width: '100%',
    height: 200,
    borderRadius: 16,
    marginBottom: spacing.md,
  },
  title: { fontSize: 22, fontWeight: '900', color: colors.text },
  body: {
    marginVertical: spacing.md,
    fontSize: 16,
    lineHeight: 22,
    color: colors.textMuted,
  },
  row: { marginVertical: spacing.md },
  label: { fontWeight: '700', marginBottom: spacing.sm },
  input: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 12,
    padding: spacing.md,
    fontSize: 18,
    color: colors.text,
  },
});
