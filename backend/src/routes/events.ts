import { Router } from 'express';
import { memoryStore } from '../db/memoryStore.js';

const router = Router();

router.get('/', (_req, res) => {
  res.json({ events: memoryStore.events });
});

router.get('/:id', (req, res) => {
  const e = memoryStore.events.find(x => x.id === req.params.id);
  if (!e) {
    res.status(404).json({ message: 'No encontrado' });
    return;
  }
  res.json(e);
});

export default router;
