import joi from 'joi';

export const postTaskSchema = joi.object({
  title: joi.string().required(),
  description: joi.string().required(),
  credits: joi.number().integer().min(1).required(),
});

export const completeTaskSchema = joi.object({
  userEmail: joi.string().required(),
});

export const authSchema = joi.object({
  email: joi.string().required(),
  password: joi.string().required(),
});

export const physicalRewardSchema = joi.object({
  name: joi.string().required(),
  pointsRequired: joi.number().integer().min(1).required(),
  startDate: joi.date().required(),
  endDate: joi.date().required(),
  shippingAddress: joi.string().required(),
});

export const digitalRewardSchema = joi.object({
  name: joi.string().required(),
  pointsRequired: joi.number().integer().min(1).required(),
  startDate: joi.date().required(),
  endDate: joi.date().required(),
  email: joi.string().email().required(),
});