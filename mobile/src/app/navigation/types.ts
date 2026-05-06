import type { NavigatorScreenParams } from '@react-navigation/native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { DepositCalculationSnapshot } from '../../shared/types/depositPoints';
import type { MainTabParamList } from './MainTabs';

export type RootStackParamList = {
  Onboarding: undefined;
  Login: undefined;
  Register: undefined;
  ForgotPassword: undefined;
  Main: NavigatorScreenParams<MainTabParamList> | undefined;
  ScanQr: undefined;
  DepositFlow: {
    containerId: string;
    sessionId: string;
    containerName?: string;
  };
  DepositSuccess: {
    containerId: string;
    containerName?: string;
    transactionId: string;
    pointsEarned: number;
    newBalance: number;
    calculation: DepositCalculationSnapshot;
    completedAt: string;
  };
  Merchants: undefined;
  MerchantDetail: { merchantId: string };
  OfferDetail: { offerId: string };
  Events: undefined;
  EventDetail: { eventId: string };
  Foundations: undefined;
  FoundationDetail: { foundationId: string };
  Referrals: undefined;
  EditProfile: undefined;
  SecuritySettings: undefined;
};

export type RootNavProps<T extends keyof RootStackParamList> =
  NativeStackScreenProps<RootStackParamList, T>;
