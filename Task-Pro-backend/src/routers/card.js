import { Router } from 'express';
import {
  updateCardsController,
  deleteCardsController,
  moveCardsController,
} from '../controllers/cards.js';
import { authenticate } from '../middlewares/authenticate.js';
import { validateBody } from '../middlewares/validateBody.js';
import { moveCardSchema, updateCardSchema } from '../validation/cardSchema.js';
import { ctrlWrapper } from '../utils/ctrlWrapper.js';

const router = Router();

router.use(authenticate);

router.patch(
  '/:cardId',
  validateBody(updateCardSchema),
  ctrlWrapper(updateCardsController),
);
router.delete('/:cardId', ctrlWrapper(deleteCardsController));

router.patch(
  '/:cardId/move',
  validateBody(moveCardSchema),
  ctrlWrapper(moveCardsController),
);

export default router;
