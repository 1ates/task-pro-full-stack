import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import { randomBytes } from 'crypto';
import handlebars from 'handlebars';
import path from 'node:path';
import fs from 'node:fs/promises';

import { UsersCollection } from '../db/models/user.js';
import { SessionsCollection } from '../db/models/session.js';

import createHttpError from 'http-errors';

import { HOUR, MONTH, SMTP, TEMPLATES_DIR } from '../constants/index.js';
import { env } from '../utils/env.js';

import { saveFileToCloudinary } from '../utils/SaveFileToCloudinary.js';
import { saveFileToUploadDir } from '../utils/saveFileToUploadDir.js';

import { sendPasswordEmail } from '../utils/sendEmail.js';

import {
  getFullNameFromGoogleTokenPayload,
  validateCode,
} from '../utils/googleOAuth2.js';

const createTokens = (userId) => {
  const subject = userId.toString();
  const accessToken = jwt.sign(
    { sub: subject, type: 'access' },
    env('JWT_SECRET'),
    {
      expiresIn: HOUR,
    },
  );

  const refreshToken = jwt.sign(
    { sub: subject, type: 'refresh' },
    env('JWT_SECRET'),
    {
      expiresIn: MONTH,
    },
  );

  return { accessToken, refreshToken };
};

const createSession = async (userId) => {
  const { accessToken, refreshToken } = createTokens(userId);

  const sessionData = {
    userId,
    accessToken,
    refreshToken,
    accessTokenValidUntil: new Date(Date.now() + HOUR),
    refreshTokenValidUntil: new Date(Date.now() + MONTH),
  };

  const session = await SessionsCollection.findOneAndUpdate(
    {
      userId,
    },
    sessionData,
    { new: true, upsert: true, runvalidators: true, setDefaultsOnInsert: true },
  );

  return { session, accessToken, refreshToken };
};

export const registerUser = async (payload) => {
  const user = await UsersCollection.findOne({ email: payload.email });
  if (user) throw createHttpError(409, 'Email in use!');

  const encryptedPassword = await bcrypt.hash(payload.password, 10);

  const newUser = await UsersCollection.create({
    ...payload,
    password: encryptedPassword,
  });

  const { accessToken, refreshToken } = await createSession(newUser._id);

  return { user: newUser, accessToken, refreshToken };
};

export const loginUser = async (payload) => {
  const user = await UsersCollection.findOne({ email: payload.email });
  if (!user) {
    throw createHttpError(404, 'Email or password is wrong');
  }
  const passwordMatches = await bcrypt.compare(payload.password, user.password);
  if (!passwordMatches) {
    throw createHttpError(401, 'Email or password is wrong');
  }

  const { accessToken, refreshToken } = await createSession(user._id);

  return { user, accessToken, refreshToken };
};

export const refreshSession = async (refreshToken) => {
  let payload;
  try {
    payload = jwt.verify(refreshToken, env('JWT_SECRET'));
  } catch {
    throw createHttpError(401, 'Invalid or expired refresh token');
  }

  if (payload.type !== 'refresh') {
    throw createHttpError(401, 'Invalid refresh token');
  }

  const session = await SessionsCollection.findOne({
    refreshToken,
  });

  if (!session || session.refreshTokenValidUntil < new Date()) {
    throw createHttpError(401, 'Invalid or expired refresh token');
  }

  const user = await UsersCollection.findById(session.userId);

  if (!user) {
    await SessionsCollection.deleteOne({ _id: session._id });
    throw createHttpError(401, 'User not found');
  }

  const tokens = createTokens(user._id);

  session.accessToken = tokens.accessToken;
  session.refreshToken = tokens.refreshToken;
  session.accessTokenValidUntil = new Date(Date.now() + HOUR);
  session.refreshTokenValidUntil = new Date(Date.now() + MONTH);

  await session.save();

  return {
    user,
    accessToken: tokens.accessToken,
    refreshToken: tokens.refreshToken,
  };
};

export const logoutUser = async (sessionId) => {
  await SessionsCollection.deleteOne({ _id: sessionId });
};

export const currentUser = async (userId) => {
  const user = await UsersCollection.findById(userId);
  if (!user) {
    throw createHttpError(404, 'User not found!');
  }
  return user;
};

export const updateProfile = async (userId, payload, avatar) => {
  const user = await UsersCollection.findById(userId);
  if (!user) {
    throw createHttpError(404, 'User not found!');
  }

  const { password, ...rest } = payload;
  const updateData = { ...rest };

  if (updateData.email && updateData.email !== user.email) {
    const existingUser = await UsersCollection.findOne({
      email: updateData.email,
      _id: { $ne: userId },
    });
    if (existingUser) {
      throw createHttpError(409, 'Email is already in use');
    }
  }

  if (password) {
    updateData.password = await bcrypt.hash(password, 10);
  }

  if (avatar) {
    const avatarUrl =
      env('ENABLE_CLOUDINARY') === 'true'
        ? await saveFileToCloudinary(avatar, 'taskpro/users')
        : await saveFileToUploadDir(avatar, 'avatar');
    updateData.avatarURL = avatarUrl;
  }

  return await UsersCollection.findByIdAndUpdate(userId, updateData, {
    new: true,
    runValidators: true,
  });
};

export const updateTheme = async (userId, theme) => {
  const updatedUser = await UsersCollection.findByIdAndUpdate(
    userId,
    { theme },
    { new: true, runValidators: true },
  );
  if (!updatedUser) {
    throw createHttpError(404, 'User not found!');
  }
  return updatedUser;
};

export const requestResetToken = async (email) => {
  const user = await UsersCollection.findOne({ email });
  if (!user) {
    return;
  }

  const resetTokenValidUntil = new Date(Date.now() + HOUR);

  const resetToken = jwt.sign(
    {
      sub: user._id.toString(),
      email: user.email,
      type: 'password-reset',
    },
    env('JWT_SECRET'),
    {
      expiresIn: HOUR,
    },
  );

  const resetPasswordTemplatePath = path.join(
    TEMPLATES_DIR,
    'reset-password-email.html',
  );

  const templateSource = (
    await fs.readFile(resetPasswordTemplatePath)
  ).toString();

  const template = handlebars.compile(templateSource);

  const html = template({
    name: user.name,
    link: `${env('APP_DOMAIN', 'http://localhost:5173/task-pro')}/reset-password?token=${resetToken}`,
  });

  await sendPasswordEmail({
    from: env(SMTP.SMTP_FROM),
    to: user.email,
    subject: 'Reset your password!',
    html,
  });

  await UsersCollection.updateOne(
    { _id: user._id },
    { resetToken, resetTokenValidUntil },
  );
};

export const resetPassword = async (payload) => {
  let entries;

  try {
    entries = jwt.verify(payload.token, env('JWT_SECRET'));
  } catch (err) {
    console.error('Password reset token verification failed: ', err.message);
    throw createHttpError(401, 'Invalid or expired reset token!');
  }

  if (entries.type !== 'password-reset') {
    throw createHttpError(401, 'Invalid reset token!');
  }

  const user = await UsersCollection.findOne({
    email: entries.email,
    _id: entries.sub,
    resetToken: payload.token,
  });

  if (!user) {
    throw createHttpError(401, 'Invalid reset token!');
  }

  if (!user.resetTokenValidUntil || user.resetTokenValidUntil < new Date()) {
    throw createHttpError(401, 'Reset token expired!');
  }

  const encryptedPassword = await bcrypt.hash(payload.password, 10);

  await UsersCollection.updateOne(
    { _id: user._id },
    {
      password: encryptedPassword,
      resetToken: null,
      resetTokenValidUntil: null,
    },
  );

  await SessionsCollection.deleteMany({ userId: user._id });
};

export const loginOrSignupWithGoogle = async (code) => {
  const loginTicket = await validateCode(code);
  const payload = loginTicket.getPayload();
  if (!payload?.email) throw createHttpError(401, 'Unauthorized');

  let user = await UsersCollection.findOne({ email: payload.email });
  if (!user) {
    const password = await bcrypt.hash(randomBytes(32).toString('hex'), 10);
    user = await UsersCollection.create({
      email: payload.email,
      name: getFullNameFromGoogleTokenPayload(payload),
      password,
    });
  }

  const { accessToken, refreshToken } = await createSession(user._id);

  return { user: user.toPublicJSON(), accessToken, refreshToken };
};
