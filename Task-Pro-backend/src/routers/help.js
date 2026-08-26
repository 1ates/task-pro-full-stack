import { Router } from 'express';
import { sendHelpController } from '../controllers/help.js';
import { authenticate } from '../middlewares/authenticate.js';
import { validateBody } from '../middlewares/validateBody.js';
import { ctrlWrapper } from '../utils/ctrlWrapper.js';
import { helpSchema } from '../validation/helpSchema.js';

const router = Router();

router.post(
  '/',
  authenticate,
  validateBody(helpSchema),
  ctrlWrapper(sendHelpController),
);

export default router;
