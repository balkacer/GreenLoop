import 'dotenv/config';

export const config = {
  port: Number(process.env.PORT) || 4000,
  jwtSecret: process.env.JWT_SECRET || 'greenloop-dev-secret',
  jwtRefreshSecret: process.env.JWT_REFRESH_SECRET || 'greenloop-refresh-dev',
  referralBonusPoints: Number(process.env.REFERRAL_BONUS_POINTS) || 250,
  corsOrigin: process.env.CORS_ORIGIN || '*',
};
