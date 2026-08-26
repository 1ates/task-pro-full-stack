import {
  loginOrSignupWithGoogle,
  loginUser,
  logoutUser,
  refreshSession,
  updateProfile,
  updateTheme,
  registerUser,
  requestResetToken,
  resetPassword,
  currentUser,
} from '../services/auth.js';
import { generateAuthUrl } from '../utils/googleOAuth2.js';
import createHttpError from 'http-errors';

const buildAuthResponse = ({ user, accessToken, refreshToken }) => {
  return {
    user: user.toPublicJSON(),
    accessToken,
    refreshToken,
  };
};

export const registerUserController = async (req, res) => {
  const result = await registerUser(req.body);

  res.status(201).json({
    status: 201,
    message: 'Successfully registered a user!',
    data: buildAuthResponse(result),
  });
};

export const loginUserController = async (req, res) => {
  const result = await loginUser(req.body);

  res.status(200).json({
    status: 200,
    message: 'Successfully logged in an user!',
    data: buildAuthResponse(result),
  });
};

export const refreshSessionController = async (req, res) => {
  const result = await refreshSession(req.body.refreshToken);

  res.status(200).json({
    status: 200,
    message: 'Access token refreshed successfully!',
    data: buildAuthResponse(result),
  });
};

export const logoutUserController = async (req, res) => {
  await logoutUser(req.session._id);

  res.status(204).send();
};

export const currentUserController = async (req, res) => {
  const user = await currentUser(req.user._id);
  res.status(200).json({
    status: 200,
    message: 'Current user retrieved successfully',
    data: user.toPublicJSON(),
  });
};

export const updateProfileController = async (req, res) => {
  if (!req.file && Object.keys(req.body).length === 0) {
    throw createHttpError(
      400,
      'At least one profile field is required to update',
    );
  }

  const updatedUser = await updateProfile(req.user._id, req.body, req.file);
  res.status(200).json({
    status: 200,
    message: 'Profile updated successfully',
    data: updatedUser.toPublicJSON(),
  });
};

export const updateThemeController = async (req, res) => {
  const updatedUser = await updateTheme(req.user._id, req.body.theme);
  res.status(200).json({
    status: 200,
    message: 'Theme updated successfully',
    data: updatedUser.toPublicJSON(),
  });
};

export const requestResetEmailController = async (req, res) => {
  await requestResetToken(req.body.email);
  res.status(200).json({
    status: 200,
    message: 'If the account exists, a reset email has been sent.',
    data: {},
  });
};

export const resetPasswordController = async (req, res) => {
  await resetPassword(req.body);
  res.status(200).json({
    status: 200,
    message: 'Password was successfully reset!',
    data: {},
  });
};

export const getGoogleOAuthUrlController = async (req, res) => {
  const url = generateAuthUrl();
  res.status(200).json({
    status: 200,
    message: 'Successfully get Google OAuth url!',
    data: { url },
  });
};

export const loginWithGoogleController = async (req, res) => {
  const result = await loginOrSignupWithGoogle(req.body.code);

  res.status(200).json({
    status: 200,
    message: 'Successfully logged in via Google OAuth!',
    data: buildAuthResponse(result),
  });
};
