export type TransactionType =
  | 'earned'
  | 'redeemed'
  | 'donated'
  | 'referral_bonus';

export type TransactionStatus = 'completed' | 'pending' | 'failed' | 'aborted';

export type ContainerStatus =
  | 'available'
  | 'full'
  | 'maintenance'
  | 'offline';

export interface UserRecord {
  id: string;
  email: string;
  username: string;
  passwordHash: string;
  name: string;
  phone?: string;
  cedula?: string;
  address?: string;
  referralCode: string;
  referredByUserId?: string;
  balance: number;
  createdAt: string;
}

export interface PointsTransactionRecord {
  id: string;
  userId: string;
  type: TransactionType;
  amount: number;
  description: string;
  status: TransactionStatus;
  meta?: Record<string, unknown>;
  createdAt: string;
}

export interface DepositSessionRecord {
  id: string;
  userId: string;
  containerId: string;
  status: 'active' | 'completed' | 'aborted' | 'failed';
  createdAt: string;
  updatedAt: string;
}

export interface MerchantRecord {
  id: string;
  name: string;
  category: string;
  imageUrl: string;
  address: string;
  hours: string;
  phone: string;
  lat: number;
  lng: number;
}

export interface OfferRecord {
  id: string;
  merchantId: string;
  title: string;
  description: string;
  pointsCost: number;
  imageUrl: string;
}

export interface ContainerRecord {
  id: string;
  name: string;
  address: string;
  status: ContainerStatus;
  capacityPercent: number;
  lat: number;
  lng: number;
}

export interface EventRecord {
  id: string;
  title: string;
  description: string;
  organizer: string;
  startsAt: string;
  address: string;
  lat: number;
  lng: number;
  imageUrl: string;
}

export interface FoundationRecord {
  id: string;
  name: string;
  mission: string;
  imageUrl: string;
  address: string;
  lat: number;
  lng: number;
}
