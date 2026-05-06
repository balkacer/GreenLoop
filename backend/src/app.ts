import cors from 'cors';
import express from 'express';
import { config } from './config.js';
import authRoutes from './routes/auth.js';
import containersRoutes from './routes/containers.js';
import eventsRoutes from './routes/events.js';
import foundationsRoutes from './routes/foundations.js';
import merchantsRoutes from './routes/merchants.js';
import offersRoutes from './routes/offers.js';
import pointsRoutes from './routes/points.js';
import referralsRoutes from './routes/referrals.js';
import userRoutes from './routes/user.js';

export function createApp() {
  const app = express();
  app.use(
    cors({
      origin: config.corsOrigin === '*' ? true : config.corsOrigin,
      credentials: true,
    }),
  );
  app.use(express.json());

  app.get('/health', (_req, res) => {
    res.json({ ok: true, service: 'greenloop-backend' });
  });

  app.use('/auth', authRoutes);
  app.use('/', userRoutes);
  app.use('/points', pointsRoutes);
  app.use('/referrals', referralsRoutes);
  app.use('/merchants', merchantsRoutes);
  app.use('/offers', offersRoutes);
  app.use('/containers', containersRoutes);
  app.use('/events', eventsRoutes);
  app.use('/foundations', foundationsRoutes);

  app.use(
    (
      err: Error,
      _req: express.Request,
      res: express.Response,
      _next: express.NextFunction,
    ) => {
      console.error(err);
      res.status(500).json({ message: 'Error interno' });
    },
  );

  return app;
}
