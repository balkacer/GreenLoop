import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import React from 'react';
import { Alert, Image, StyleSheet, Text } from 'react-native';
import {
  AppButton,
  AppScreen,
  LocationCard,
} from '../../../shared/components';
import type { RootStackParamList } from '../../../app/navigation/types';
import {
  useGetOffersQuery,
  useRedeemOfferMutation,
} from '../../../api/greenloopApi';
import { useSessionStore } from '../../../app/store/sessionStore';
import { getErrorMessage } from '../../../shared/utils/errorMessage';
import { colors } from '../../../shared/theme/colors';
import { spacing } from '../../../shared/theme/spacing';

type Props = NativeStackScreenProps<RootStackParamList, 'OfferDetail'>;

export function OfferDetailScreen({ route }: Props) {
  const { offerId } = route.params;
  const { data } = useGetOffersQuery();
  const offer = data?.offers.find(o => o.id === offerId);
  const [redeem, { isLoading }] = useRedeemOfferMutation();
  const setUser = useSessionStore(s => s.setUser);

  if (!offer) {
    return (
      <AppScreen>
        <Text>Oferta no encontrada.</Text>
      </AppScreen>
    );
  }

  const merchant = offer.merchant;

  const onRedeem = async () => {
    Alert.alert(
      'Canjear GreenPoints',
      `¿Usar ${offer.pointsCost} puntos por: ${offer.title}?`,
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Canjear',
          onPress: async () => {
            try {
              const res = await redeem(offerId).unwrap();
              const prev = useSessionStore.getState().user;
              if (prev) setUser({ ...prev, balance: res.balance });
              Alert.alert('Éxito', res.message);
            } catch (e) {
              Alert.alert('No disponible', getErrorMessage(e));
            }
          },
        },
      ],
    );
  };

  return (
    <AppScreen scroll>
      <Image source={{ uri: offer.imageUrl }} style={styles.hero} />
      <Text style={styles.title}>{offer.title}</Text>
      <Text style={styles.desc}>{offer.description}</Text>
      <Text style={styles.cost}>{offer.pointsCost} GreenPoints</Text>
      {merchant ? (
        <LocationCard
          title={merchant.name}
          address={merchant.address}
          lat={merchant.lat}
          lng={merchant.lng}
        />
      ) : null}
      <AppButton title="Canjear oferta" loading={isLoading} onPress={onRedeem} />
    </AppScreen>
  );
}

const styles = StyleSheet.create({
  hero: {
    width: '100%',
    height: 220,
    borderRadius: 16,
    marginBottom: spacing.md,
  },
  title: { fontSize: 22, fontWeight: '900', color: colors.text },
  desc: {
    marginTop: spacing.sm,
    fontSize: 16,
    lineHeight: 22,
    color: colors.textMuted,
  },
  cost: {
    marginVertical: spacing.md,
    fontSize: 20,
    fontWeight: '800',
    color: colors.primary,
  },
});
