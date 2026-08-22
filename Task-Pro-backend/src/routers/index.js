import { Router } from 'express';
import authRouter from './auth.js';
import boardRoutes from './board.js';
import columnRoutes from './column.js';
import cardRoutes from './card.js';
import helpRouter from './help.js';

const router = Router();

router.use('/api/auth', authRouter);
router.use('/api/boards', boardRoutes);
router.use('/api/columns', columnRoutes);
router.use('/api/cards', cardRoutes);
router.use('/api/help', helpRouter);

export default router;
