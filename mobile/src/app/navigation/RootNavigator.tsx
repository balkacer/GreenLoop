import { createNativeStackNavigator } from '@react-navigation/native-stack';
import React from 'react';
import { ActivityIndicator, StyleSheet, View } from 'react-native';
import { useSessionStore } from '../store/sessionStore';
import { useUiStore } from '../store/uiStore';
import { OnboardingScreen } from '../../features/onboarding/screens/OnboardingScreen';
import { LoginScreen } from '../../features/auth/screens/LoginScreen';
import { RegisterScreen } from '../../features/auth/screens/RegisterScreen';
import { ForgotPasswordScreen } from '../../features/auth/screens/ForgotPasswordScreen';
import { ScanQrScreen } from '../../features/deposit/screens/ScanQrScreen';
import { DepositFlowScreen } from '../../features/deposit/screens/DepositFlowScreen';
import { DepositSuccessScreen } from '../../features/deposit/screens/DepositSuccessScreen';
import { MerchantsScreen } from '../../features/merchants/screens/MerchantsScreen';
import { MerchantDetailScreen } from '../../features/merchants/screens/MerchantDetailScreen';
import { OfferDetailScreen } from '../../features/merchants/screens/OfferDetailScreen';
import { EventsScreen } from '../../features/events/screens/EventsScreen';
import { EventDetailScreen } from '../../features/events/screens/EventDetailScreen';
import { FoundationsScreen } from '../../features/foundations/screens/FoundationsScreen';
import { FoundationDetailScreen } from '../../features/foundations/screens/FoundationDetailScreen';
import { ReferralsScreen } from '../../features/referrals/screens/ReferralsScreen';
import { EditProfileScreen } from '../../features/profile/screens/EditProfileScreen';
import { SecuritySettingsScreen } from '../../features/profile/screens/SecuritySettingsScreen';
import { colors } from '../../shared/theme/colors';
import { MainTabs } from './MainTabs';
import type { RootStackParamList } from './types';

const Stack = createNativeStackNavigator<RootStackParamList>();

export function RootNavigator() {
  const onboardingCompleted = useUiStore(s => s.onboardingCompleted);
  const accessToken = useSessionStore(s => s.accessToken);
  const [hydrated, setHydrated] = React.useState(
    () => useSessionStore.persist.hasHydrated?.() ?? true,
  );

  React.useEffect(() => {
    const unsub = useSessionStore.persist.onFinishHydration?.(() =>
      setHydrated(true),
    );
    if (useSessionStore.persist.hasHydrated?.()) setHydrated(true);
    return typeof unsub === 'function' ? unsub : undefined;
  }, []);

  if (!hydrated) {
    return (
      <View style={styles.splash}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  const initialRouteName: keyof RootStackParamList = !onboardingCompleted
    ? 'Onboarding'
    : !accessToken
      ? 'Login'
      : 'Main';

  return (
    <Stack.Navigator
      initialRouteName={initialRouteName}
      screenOptions={{
        headerTitleAlign: 'center',
        contentStyle: { backgroundColor: colors.background },
      }}>
      <Stack.Screen
        name="Onboarding"
        component={OnboardingScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="Login"
        component={LoginScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="Register"
        component={RegisterScreen}
        options={{ title: 'Crear cuenta' }}
      />
      <Stack.Screen
        name="ForgotPassword"
        component={ForgotPasswordScreen}
        options={{ title: 'Recuperar contraseña' }}
      />
      <Stack.Screen
        name="Main"
        component={MainTabs}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="ScanQr"
        component={ScanQrScreen}
        options={{ title: 'Escanear contenedor' }}
      />
      <Stack.Screen
        name="DepositFlow"
        component={DepositFlowScreen}
        options={{ title: 'Depósito', headerBackTitle: 'Atrás' }}
      />
      <Stack.Screen
        name="DepositSuccess"
        component={DepositSuccessScreen}
        options={{ title: 'Éxito', headerLeft: () => null }}
      />
      <Stack.Screen
        name="Merchants"
        component={MerchantsScreen}
        options={{ title: 'Comercios y ofertas' }}
      />
      <Stack.Screen
        name="MerchantDetail"
        component={MerchantDetailScreen}
        options={{ title: 'Comercio' }}
      />
      <Stack.Screen
        name="OfferDetail"
        component={OfferDetailScreen}
        options={{ title: 'Oferta' }}
      />
      <Stack.Screen
        name="Events"
        component={EventsScreen}
        options={{ title: 'Eventos' }}
      />
      <Stack.Screen
        name="EventDetail"
        component={EventDetailScreen}
        options={{ title: 'Evento' }}
      />
      <Stack.Screen
        name="Foundations"
        component={FoundationsScreen}
        options={{ title: 'Donaciones' }}
      />
      <Stack.Screen
        name="FoundationDetail"
        component={FoundationDetailScreen}
        options={{ title: 'Fundación' }}
      />
      <Stack.Screen
        name="Referrals"
        component={ReferralsScreen}
        options={{ title: 'Referidos' }}
      />
      <Stack.Screen
        name="EditProfile"
        component={EditProfileScreen}
        options={{ title: 'Editar perfil' }}
      />
      <Stack.Screen
        name="SecuritySettings"
        component={SecuritySettingsScreen}
        options={{ title: 'Seguridad' }}
      />
    </Stack.Navigator>
  );
}

const styles = StyleSheet.create({
  splash: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.background,
  },
});
