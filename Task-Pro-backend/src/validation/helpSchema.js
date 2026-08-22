import Joi from 'joi';

const emailRegexp = /^[\w.+-]+@[\w-]+\.[a-zA-Z]{2,}$/;

export const helpSchema = Joi.object({
  email: Joi.string().pattern(emailRegexp).required().messages({
    'string.empty': 'Email is required',
    'string.pattern.base': 'Email format is invalid',
  }),
  comment: Joi.string().min(1).max(2048).required().messages({
    'string.empty': 'Comment is required',
    'string.min': 'Comment must be at least 1 characters',
    'string.max': 'Comment cannot exceed 2048 characters',
  }),
});
