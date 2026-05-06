import bcrypt from 'bcryptjs';
import { nanoid } from 'nanoid';
import type {
  ContainerRecord,
  DepositSessionRecord,
  EventRecord,
  FoundationRecord,
  MerchantRecord,
  OfferRecord,
  PointsTransactionRecord,
  UserRecord,
} from '../types.js';

export const memoryStore = {
  users: [] as UserRecord[],
  refreshTokens: new Map<string, string>(),
  transactions: [] as PointsTransactionRecord[],
  depositSessions: [] as DepositSessionRecord[],
  merchants: [] as MerchantRecord[],
  offers: [] as OfferRecord[],
  containers: [] as ContainerRecord[],
  events: [] as EventRecord[],
  foundations: [] as FoundationRecord[],
  invites: [] as { id: string; fromUserId: string; channel: string; target: string; createdAt: string }[],
};

export function seedDatabase(): void {
  if (memoryStore.merchants.length > 0) return;

  memoryStore.merchants.push(
    {
      id: 'm1',
      name: 'Supermercado Nacional — Zona Colonial',
      category: 'Supermercado',
      imageUrl: 'https://picsum.photos/seed/gl1/800/450',
      address: 'Calle El Conde 123, Santo Domingo',
      hours: 'L–S 8:00–21:00',
      phone: '+1 809 555 0101',
      lat: 18.4734,
      lng: -69.8845,
    },
    {
      id: 'm2',
      name: 'Farmacia Carol — Piantini',
      category: 'Salud',
      imageUrl: 'https://picsum.photos/seed/gl2/800/450',
      address: 'Av. Abraham Lincoln 456, Santo Domingo',
      hours: 'L–D 7:00–22:00',
      phone: '+1 809 555 0202',
      lat: 18.4861,
      lng: -69.9312,
    },
  );

  memoryStore.offers.push(
    {
      id: 'o1',
      merchantId: 'm1',
      title: 'Bolsa reutilizable GreenLoop',
      description: 'Canjea una bolsa reutilizable al retirar en caja.',
      pointsCost: 120,
      imageUrl: 'https://picsum.photos/seed/offer1/800/450',
    },
    {
      id: 'o2',
      merchantId: 'm2',
      title: 'Kit de primeros auxilios mini',
      description: 'Incluye vendas y antiséptico; sujeto a disponibilidad.',
      pointsCost: 300,
      imageUrl: 'https://picsum.photos/seed/offer2/800/450',
    },
  );

  memoryStore.containers.push(
    {
      id: 'c1',
      name: 'Contenedor Parque Independencia',
      address: 'Av. Independencia, Santo Domingo',
      status: 'available',
      capacityPercent: 42,
      lat: 18.4766,
      lng: -69.8934,
    },
    {
      id: 'c2',
      name: 'Contenedor Malecón',
      address: 'George Washington, Santo Domingo',
      status: 'full',
      capacityPercent: 96,
      lat: 18.465,
      lng: -69.901,
    },
    {
      id: 'c3',
      name: 'Contenedor Naco',
      address: 'Av. Tiradentes, Santo Domingo',
      status: 'maintenance',
      capacityPercent: 0,
      lat: 18.488,
      lng: -69.939,
    },
    {
      id: 'c4',
      name: 'Contenedor Arroyo Hondo',
      address: 'Av. Charles Sumner, Santo Domingo',
      status: 'offline',
      capacityPercent: 55,
      lat: 18.505,
      lng: -69.915,
    },
  );

  memoryStore.events.push(
    {
      id: 'e1',
      title: 'Jornada de limpieza costera',
      description:
        'Únete a voluntarios locales para limpiar playas y aprender sobre reciclaje.',
      organizer: 'Fundación Azul RD',
      startsAt: new Date(Date.now() + 86400000 * 5).toISOString(),
      address: 'Playa Güibia, Santo Domingo',
      lat: 18.461,
      lng: -69.898,
      imageUrl: 'https://picsum.photos/seed/ev1/800/450',
    },
    {
      id: 'e2',
      title: 'Taller: compostaje en casa',
      description: 'Demostración práctica para familias y apartamentos.',
      organizer: 'GreenLoop Edu',
      startsAt: new Date(Date.now() + 86400000 * 12).toISOString(),
      address: 'Centro Cultural Naco',
      lat: 18.487,
      lng: -69.935,
      imageUrl: 'https://picsum.photos/seed/ev2/800/450',
    },
  );

  memoryStore.foundations.push(
    {
      id: 'f1',
      name: 'Reforestemos RD',
      mission: 'Plantación de árboles nativos en cuencas prioritarias.',
      imageUrl: 'https://picsum.photos/seed/f1/800/450',
      address: 'Santo Domingo',
      lat: 18.47,
      lng: -69.9,
    },
    {
      id: 'f2',
      name: 'Agua Limpia Sureste',
      mission: 'Filtros comunitarios y educación en higiene del agua.',
      imageUrl: 'https://picsum.photos/seed/f2/800/450',
      address: 'La Romana',
      lat: 18.427,
      lng: -68.965,
    },
  );

  const demoId = nanoid();
  memoryStore.users.push({
    id: demoId,
    email: 'demo@greenloop.do',
    username: 'demo_greenloop',
    passwordHash: bcrypt.hashSync('demo1234', 10),
    name: 'Usuario Demo',
    phone: '+1 809 555 9999',
    cedula: '402-1234567-8',
    address: 'Santo Domingo, DN',
    referralCode: 'GREEN-DEMO',
    balance: 480,
    createdAt: new Date().toISOString(),
  });

  memoryStore.transactions.push(
    {
      id: nanoid(),
      userId: demoId,
      type: 'earned',
      amount: 120,
      description: 'Depósito en contenedor Parque Independencia',
      status: 'completed',
      createdAt: new Date(Date.now() - 86400000 * 3).toISOString(),
    },
    {
      id: nanoid(),
      userId: demoId,
      type: 'redeemed',
      amount: -80,
      description: 'Canje: bolsa reutilizable — Supermercado Nacional',
      status: 'completed',
      meta: { offerId: 'o1', merchantId: 'm1' },
      createdAt: new Date(Date.now() - 86400000).toISOString(),
    },
    {
      id: nanoid(),
      userId: demoId,
      type: 'donated',
      amount: -50,
      description: 'Donación a Reforestemos RD',
      status: 'completed',
      meta: { foundationId: 'f1' },
      createdAt: new Date(Date.now() - 3600000 * 6).toISOString(),
    },
  );
}

export function findUserById(id: string): UserRecord | undefined {
  return memoryStore.users.find(u => u.id === id);
}

export function findUserByEmail(email: string): UserRecord | undefined {
  return memoryStore.users.find(u => u.email.toLowerCase() === email.toLowerCase());
}

export function findUserByUsername(username: string): UserRecord | undefined {
  return memoryStore.users.find(
    u => u.username.toLowerCase() === username.toLowerCase(),
  );
}

export function findUserByReferralCode(code: string): UserRecord | undefined {
  return memoryStore.users.find(
    u => u.referralCode.toLowerCase() === code.trim().toLowerCase(),
  );
}

/** True si el usuario ya completó al menos un depósito con puntos registrados. */
export function userHasPriorSuccessfulDeposit(userId: string): boolean {
  return memoryStore.transactions.some(
    t =>
      t.userId === userId &&
      t.type === 'earned' &&
      t.status === 'completed' &&
      t.amount > 0 &&
      (t.meta as { kind?: string } | undefined)?.kind === 'deposit',
  );
}

export function addTransaction(
  tx: Omit<PointsTransactionRecord, 'id' | 'createdAt'>,
): PointsTransactionRecord {
  const full: PointsTransactionRecord = {
    ...tx,
    id: nanoid(),
    createdAt: new Date().toISOString(),
  };
  memoryStore.transactions.unshift(full);
  return full;
}
