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

export interface User {
  id: string;
  email: string;
  username: string;
  name: string;
  phone?: string;
  cedula?: string;
  address?: string;
  referralCode: string;
  balance: number;
}

export interface PointsTransaction {
  id: string;
  userId: string;
  type: TransactionType;
  amount: number;
  description: string;
  status: TransactionStatus;
  meta?: Record<string, unknown>;
  createdAt: string;
}

export interface Merchant {
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

export interface Offer {
  id: string;
  merchantId: string;
  title: string;
  description: string;
  pointsCost: number;
  imageUrl: string;
  merchant?: Merchant;
}

export interface Container {
  id: string;
  name: string;
  address: string;
  status: ContainerStatus;
  capacityPercent: number;
  lat: number;
  lng: number;
  distanceKm?: number;
}

export interface SustainabilityEvent {
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

export interface Foundation {
  id: string;
  name: string;
  mission: string;
  imageUrl: string;
  address: string;
  lat: number;
  lng: number;
}

/** Pasos UI del flujo de depósito (antes de pantalla de éxito). */
export type DepositFlowStep =
  | 'connecting'
  | 'validating'
  | 'waiting_deposit'
  | 'measuring_volume_weight'
  | 'detecting_material'
  | 'calculating_points'
  | 'confirming_transaction';

export * from './depositPoints';
