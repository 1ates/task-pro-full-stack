import Joi from 'joi';

const emailRegexp = /^[\w.+-]+@[\w-]+\.[a-zA-Z]{2,}$/;
const passwordRegexp = /^[\w!@#$%^&*()\-+=]+$/;
const themeColor = ['light', 'dark', 'violet'];

export const registerUserSchema = Joi.object({
  name: Joi.string().min(2).max(32).required().messages({
    'string.empty': 'Name is required',
    'string.min': 'Name must be at least 2 characters long',
    'string.max': 'Name must be at most 32 characters long',
  }),
  email: Joi.string().pattern(emailRegexp).required().messages({
    'string.empty': 'Email is required',
    'string.pattern.base': 'Email format is invalid',
  }),
  password: Joi.string()
    .min(8)
    .max(64)
    .pattern(passwordRegexp)
    .required()
    .messages({
      'string.empty': 'Password is required',
      'string.min': 'Password must be at least 8 characters long',
      'string.max': 'Password must be at most 64 characters long',
      'string.pattern.base':
        'Password may contain only letters, numbers and symbols, no spaces',
    }),
});

export const loginUserSchema = Joi.object({
  email: Joi.string().pattern(emailRegexp).required().messages({
    'string.empty': 'Email is required',
    'string.pattern.base': 'Email format is invalid',
  }),
  password: Joi.string().min(8).max(64).required().messages({
    'string.empty': 'Password is required',
  }),
});

export const updateUserSchema = Joi.object({
  name: Joi.string().min(2).max(32),
  email: Joi.string().pattern(emailRegexp),
  password: Joi.string().min(8).max(64).pattern(passwordRegexp).messages({
    'string.min': 'Password must be at least 8 characters long',
    'string.max': 'Password must be at most 64 characters long',
    'string.pattern.base':
      'Password may contain only letters, numbers and symbols, no spaces',
  }),
  avatar: Joi.string()
    .max(2 * 1024 * 1024)
    .allow(null, '')
    .optional()
    .messages({
      'string.max': 'Avatar image is too large',
    }),
  theme: Joi.string().valid(themeColor).optional(),
}).min(1);

export const updateThemeSchema = Joi.object({
  theme: Joi.string().valid(themeColor).required(),
});

export const requestResetEmailSchema = Joi.object({
  email: Joi.string().pattern(emailRegexp).required().messages({
    'string.empty': 'Email is required',
    'string.pattern.base': 'Email format is invalid',
  }),
});

export const resetPasswordSchema = Joi.object({
  password: Joi.string()
    .min(8)
    .max(64)
    .pattern(passwordRegexp)
    .required()
    .messages({
      'string.empty': 'Password is required',
      'string.min': 'Password must be at least 8 characters long',
      'string.max': 'Password must be at most 64 characters long',
      'string.pattern.base':
        'Password may contain only letters, numbers and symbols, no spaces',
    }),
  token: Joi.string().required(),
});

export const loginWithGoogleOAuthSchema = Joi.object({
  code: Joi.string().required(),
});
