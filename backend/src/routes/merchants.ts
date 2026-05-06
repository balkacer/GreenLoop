import { Router } from 'express';
import { memoryStore } from '../db/memoryStore.js';

const router = Router();

router.get('/', (_req, res) => {
  res.json({ merchants: memoryStore.merchants });
});

router.get('/:id', (req, res) => {
  const m = memoryStore.merchants.find(x => x.id === req.params.id);
  if (!m) {
    res.status(404).json({ message: 'No encontrado' });
    return;
  }
  res.json(m);
});

export default router;
