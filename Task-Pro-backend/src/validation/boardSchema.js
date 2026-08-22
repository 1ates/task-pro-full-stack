import Joi from 'joi';

export const createBoardSchema = Joi.object({
  title: Joi.string().min(1).max(64).required().messages({
    'string.empty': 'Title is required',
  }),
  icon: Joi.string().max(64),
  background: Joi.string().max(64).allow(null),
  userId: Joi.string().required(),
});

export const updateBoardSchema = Joi.object({
  title: Joi.string().min(1).max(64),
  icon: Joi.string().max(64),
  background: Joi.string().max(64).allow(null),
}).min(1);
