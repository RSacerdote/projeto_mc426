import joi from "joi"

export const postTaskSchema = joi.object({
  title: joi.string().required(),
  description: joi.string().required(),
  credits: joi.number().integer().min(1).required(),
})

export const completeTaskSchema = joi.object({
  userEmail: joi.string().required(),
})

export const authSchema = joi.object({
  email: joi.string().required(),
  password: joi.string().required(),
})