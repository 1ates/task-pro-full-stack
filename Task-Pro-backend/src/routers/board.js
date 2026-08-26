import { Router } from 'express';
import {
  getAllBoardController,
  getByIdBoardController,
  createBoardController,
  updateBoardController,
  deleteBoardController,
  updateBoardBackgroundController,
} from '../controllers/board.js';
import { upload } from '../middlewares/multer.js';
import { createColumnController } from '../controllers/column.js';
import { authenticate } from '../middlewares/authenticate.js';
import { validateBody } from '../middlewares/validateBody.js';
import { ctrlWrapper } from '../utils/ctrlWrapper.js';
import {
  createBoardSchema,
  updateBoardSchema,
} from '../validation/boardSchema.js';
import { createColumnSchema } from '../validation/columnSchema.js';

const router = Router();

router.use(authenticate);

router.get('/', ctrlWrapper(getAllBoardController));

router.post(
  '/',
  validateBody(createBoardSchema),
  ctrlWrapper(createBoardController),
);

router.get('/:boardId', ctrlWrapper(getByIdBoardController));

router.patch(
  '/:boardId',
  validateBody(updateBoardSchema),
  ctrlWrapper(updateBoardController),
);

router.delete('/:boardId', ctrlWrapper(deleteBoardController));

router.patch(
  '/:boardId/background',
  upload.single('background'),
  ctrlWrapper(updateBoardBackgroundController),
);

router.post(
  '/:boardId/columns',
  validateBody(createColumnSchema),
  ctrlWrapper(createColumnController),
);

export default router;
