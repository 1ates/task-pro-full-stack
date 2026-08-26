import { Router } from 'express';
import { authenticate } from '../middlewares/authenticate.js';
import { validateBody } from '../middlewares/validateBody.js';
import { ctrlWrapper } from '../utils/ctrlWrapper.js';
import {
  deleteColumnController,
  updateColumnController,
} from '../controllers/column.js';
import { createCardsController } from '../controllers/cards.js';
import { updateColumnSchema } from '../validation/columnSchema.js';
import { createCardSchema } from '../validation/cardSchema.js';

const router = Router();

router.use(authenticate);

router.patch(
  '/:columnId',
  validateBody(updateColumnSchema),
  ctrlWrapper(updateColumnController),
);

router.delete('/:columnId', ctrlWrapper(deleteColumnController));

router.post(
  '/:columnId/cards',
  validateBody(createCardSchema),
  ctrlWrapper(createCardsController),
);

export default router;
