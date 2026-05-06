import { Router } from 'express';
import { memoryStore } from '../db/memoryStore.js';

const router = Router();

router.get('/', (_req, res) => {
  res.json({ foundations: memoryStore.foundations });
});

router.get('/:id', (req, res) => {
  const f = memoryStore.foundations.find(x => x.id === req.params.id);
  if (!f) {
    res.status(404).json({ message: 'No encontrado' });
    return;
  }
  res.json(f);
});

export default router;
