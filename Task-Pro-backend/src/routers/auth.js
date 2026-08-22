import { Router } from 'express';
import { upload } from '../middlewares/upload.js';
import { validateBody } from '../middlewares/validateBody.js';
import { ctrlWrapper } from '../utils/ctrlWrapper.js';
import { authenticate } from '../middlewares/authenticate.js';
import {
  loginUserSchema,
  loginWithGoogleOAuthSchema,
  registerUserSchema,
  requestResetEmailSchema,
  resetPasswordSchema,
  updateUserSchema,
  updateThemeSchema,
} from '../validation/userSchema.js';
import {
  getCurrentUserController,
  getGoogleOAuthUrlController,
  loginUserController,
  loginWithGoogleController,
  logoutUserController,
  registerUserController,
  requestResetEmailController,
  resetPasswordController,
  updateProfileController,
  updateThemeController,
} from '../controllers/auth.js';

const router = Router();

router.post(
  '/register',
  validateBody(registerUserSchema),
  ctrlWrapper(registerUserController),
);

router.post(
  '/login',
  validateBody(loginUserSchema),
  ctrlWrapper(loginUserController),
);

router.post('/logout', authenticate, ctrlWrapper(logoutUserController));

router.get('/current', authenticate, ctrlWrapper(getCurrentUserController));

router.patch(
  '/me',
  upload.single('avatar'),
  authenticate,
  validateBody(updateUserSchema),
  ctrlWrapper(updateProfileController),
);

router.patch(
  '/theme',
  authenticate,
  validateBody(updateThemeSchema),
  ctrlWrapper(updateThemeController),
);

router.post(
  '/request-reset-email',
  validateBody(requestResetEmailSchema),
  ctrlWrapper(requestResetEmailController),
);

router.post(
  '/reset-password',
  validateBody(resetPasswordSchema),
  ctrlWrapper(resetPasswordController),
);

router.get('/get-oauth-url', ctrlWrapper(getGoogleOAuthUrlController));

router.post(
  '/confirm-google-auth',
  validateBody(loginWithGoogleOAuthSchema),
  ctrlWrapper(loginWithGoogleController),
);

export default router;
