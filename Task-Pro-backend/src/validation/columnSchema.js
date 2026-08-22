import Joi from 'joi';

export const createColumnSchema = Joi.object({
  title: Joi.string().min(1).max(64).required().messages({
    'string.empty': 'Title is required',
  }),
  boardId: Joi.string().required(),
});

export const updateColumnSchema = Joi.object({
  title: Joi.string().min(1).max(64).required().messages({
    'string.empty': 'Title is required',
  }),
});
