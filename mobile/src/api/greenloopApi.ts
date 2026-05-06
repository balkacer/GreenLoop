import {
  createApi,
  fetchBaseQuery,
  type BaseQueryFn,
  type FetchArgs,
  type FetchBaseQueryError,
} from '@reduxjs/toolkit/query/react';
import { API_BASE_URL } from '../shared/constants/config';
import { useSessionStore } from '../app/store/sessionStore';
import type { DepositCalculationSnapshot } from '../shared/types/depositPoints';
import type {
  Container,
  DepositBonusType,
  DepositVolumeRange,
  Foundation,
  MaterialQuality,
  MaterialType,
  Merchant,
  Offer,
  PointsTransaction,
  SustainabilityEvent,
  User,
} from '../shared/types';

const rawBaseQuery = fetchBaseQuery({
  baseUrl: API_BASE_URL,
  prepareHeaders: headers => {
    const token = useSessionStore.getState().accessToken;
    if (token) headers.set('Authorization', `Bearer ${token}`);
    headers.set('Content-Type', 'application/json');
    return headers;
  },
});

const baseQueryWithRefresh: BaseQueryFn<
  string | FetchArgs,
  unknown,
  FetchBaseQueryError
> = async (args, api, extraOptions) => {
  let result = await rawBaseQuery(args, api, extraOptions);
  if (result.error && result.error.status === 401) {
    const refresh = useSessionStore.getState().refreshToken;
    if (refresh) {
      const refreshResult = await rawBaseQuery(
        {
          url: '/auth/refresh',
          method: 'POST',
          body: { refreshToken: refresh },
        },
        api,
        extraOptions,
      );
      if (refreshResult.data && typeof refreshResult.data === 'object') {
        const data = refreshResult.data as { accessToken?: string };
        if (data.accessToken) {
          useSessionStore.getState().setTokens({ accessToken: data.accessToken });
          result = await rawBaseQuery(args, api, extraOptions);
        }
      }
    }
  }
  return result;
};

export const greenloopApi = createApi({
  reducerPath: 'greenloopApi',
  baseQuery: baseQueryWithRefresh,
  tagTypes: [
    'User',
    'Balance',
    'Transactions',
    'Merchants',
    'Offers',
    'Containers',
    'Events',
    'Foundations',
  ],
  endpoints: build => ({
    login: build.mutation<
      { accessToken: string; refreshToken: string; user: User },
      { identifier: string; password: string }
    >({
      query: body => ({ url: '/auth/login', method: 'POST', body }),
    }),
    register: build.mutation<
      { accessToken: string; refreshToken: string; user: User },
      {
        email: string;
        username: string;
        password: string;
        name: string;
        phone?: string;
        referralCode?: string;
      }
    >({
      query: body => ({ url: '/auth/register', method: 'POST', body }),
    }),
    forgotPassword: build.mutation<{ message: string }, { email: string }>({
      query: body => ({ url: '/auth/forgot-password', method: 'POST', body }),
    }),
    getMe: build.query<User, void>({
      query: () => '/me',
      providesTags: ['User'],
    }),
    patchMe: build.mutation<
      User,
      Partial<{
        name: string;
        phone: string;
        email: string;
        cedula: string;
        address: string;
      }>
    >({
      query: body => ({ url: '/me', method: 'PATCH', body }),
      invalidatesTags: ['User', 'Balance', 'Transactions'],
    }),
    getBalance: build.query<{ balance: number }, void>({
      query: () => '/points/balance',
      providesTags: ['Balance'],
    }),
    getTransactions: build.query<{ transactions: PointsTransaction[] }, void>({
      query: () => '/points/transactions',
      providesTags: ['Transactions'],
    }),
    donatePoints: build.mutation<
      { balance: number; message: string },
      { foundationId: string; amount: number }
    >({
      query: body => ({
        url: '/points/donate',
        method: 'POST',
        body,
      }),
      invalidatesTags: ['Balance', 'Transactions', 'User'],
    }),
    redeemPointsGeneric: build.mutation<
      { balance: number },
      { merchantId: string; points: number; description?: string }
    >({
      query: body => ({ url: '/points/redeem', method: 'POST', body }),
      invalidatesTags: ['Balance', 'Transactions'],
    }),
    getReferralCode: build.query<
      { code: string; shareUrl: string; bonusPoints: number },
      void
    >({
      query: () => '/referrals/code',
    }),
    inviteReferral: build.mutation<
      { message: string },
      { email?: string; phone?: string }
    >({
      query: body => ({ url: '/referrals/invite', method: 'POST', body }),
    }),
    getMerchants: build.query<{ merchants: Merchant[] }, void>({
      query: () => '/merchants',
      providesTags: ['Merchants'],
    }),
    getMerchant: build.query<Merchant, string>({
      query: id => `/merchants/${id}`,
    }),
    getOffers: build.query<{ offers: Offer[] }, void>({
      query: () => '/offers',
      providesTags: ['Offers'],
    }),
    redeemOffer: build.mutation<
      { balance: number; message: string; offer: Offer },
      string
    >({
      query: offerId => ({
        url: `/offers/${offerId}/redeem`,
        method: 'POST',
        body: {},
      }),
      invalidatesTags: ['Offers', 'Balance', 'Transactions', 'User'],
    }),
    getContainers: build.query<{ containers: Container[] }, void>({
      query: () => '/containers',
      providesTags: ['Containers'],
    }),
    getNearbyContainers: build.query<
      { containers: Container[] },
      { lat: number; lng: number; radius?: number }
    >({
      query: ({ lat, lng, radius }) => ({
        url: '/containers/nearby',
        params: { lat, lng, radius },
      }),
      providesTags: ['Containers'],
    }),
    getContainer: build.query<Container, string>({
      query: id => `/containers/${id}`,
    }),
    startDeposit: build.mutation<
      { sessionId: string; container: Container; message: string },
      string
    >({
      query: id => ({
        url: `/containers/${id}/start-deposit`,
        method: 'POST',
        body: {},
      }),
    }),
    completeDeposit: build.mutation<
      {
        transactionId: string;
        pointsEarned: number;
        newBalance: number;
        calculation: DepositCalculationSnapshot;
        message?: string;
      },
      {
        id: string;
        depositSessionId: string;
        volumeRange: DepositVolumeRange;
        estimatedWeightKg: number;
        materialType: MaterialType;
        materialQuality: MaterialQuality;
        isEventActive: boolean;
        bonuses: DepositBonusType[];
      }
    >({
      query: ({
        id,
        depositSessionId,
        volumeRange,
        estimatedWeightKg,
        materialType,
        materialQuality,
        isEventActive,
        bonuses,
      }) => ({
        url: `/containers/${id}/complete-deposit`,
        method: 'POST',
        body: {
          depositSessionId,
          volumeRange,
          estimatedWeightKg,
          materialType,
          materialQuality,
          isEventActive,
          bonuses,
        },
      }),
      invalidatesTags: ['Balance', 'Transactions', 'User'],
    }),
    abortDeposit: build.mutation<
      { message: string },
      { id: string; sessionId: string }
    >({
      query: ({ id, sessionId }) => ({
        url: `/containers/${id}/abort-deposit`,
        method: 'POST',
        body: { sessionId },
      }),
      invalidatesTags: ['Transactions'],
    }),
    getEvents: build.query<{ events: SustainabilityEvent[] }, void>({
      query: () => '/events',
      providesTags: ['Events'],
    }),
    getEvent: build.query<SustainabilityEvent, string>({
      query: id => `/events/${id}`,
    }),
    getFoundations: build.query<{ foundations: Foundation[] }, void>({
      query: () => '/foundations',
      providesTags: ['Foundations'],
    }),
    getFoundation: build.query<Foundation, string>({
      query: id => `/foundations/${id}`,
    }),
  }),
});

export const {
  useLoginMutation,
  useRegisterMutation,
  useForgotPasswordMutation,
  useGetMeQuery,
  usePatchMeMutation,
  useGetBalanceQuery,
  useGetTransactionsQuery,
  useDonatePointsMutation,
  useRedeemPointsGenericMutation,
  useGetReferralCodeQuery,
  useInviteReferralMutation,
  useGetMerchantsQuery,
  useGetMerchantQuery,
  useGetOffersQuery,
  useRedeemOfferMutation,
  useGetContainersQuery,
  useGetNearbyContainersQuery,
  useGetContainerQuery,
  useStartDepositMutation,
  useCompleteDepositMutation,
  useAbortDepositMutation,
  useGetEventsQuery,
  useGetEventQuery,
  useGetFoundationsQuery,
  useGetFoundationQuery,
} = greenloopApi;
