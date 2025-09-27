import Joi from "joi";

export const signupSchema = Joi.object({
  email: Joi.string().email().required(),
  username: Joi.string().min(3).max(30).required(),
  firstname: Joi.string().min(3).max(50).required(),
  lastname: Joi.string().min(3).max(50).required(),
  password: Joi.string().min(8).required(),
  middlename: Joi.string().min(3).max(50).optional(),
  dateOfBirth: Joi.date().iso().required(),
  signInType: Joi.string().valid(`default`, `google`, `apple`).required(),
});

export const signinSchema = Joi.object({
  email: Joi.string().email().optional(),
  username: Joi.string().min(3).max(30).optional(),
  password: Joi.string().min(8).required(),
})
  .xor(`email`, `username`)
  .messages({
    "object.xor": `You must provide either an email or a username, but not both`,
  });

export const signoutSchema = Joi.object({
  refreshToken: Joi.string()
    .optional()
    .min(1) // must have at least one character if provided
    .messages({
      "string.min": `Refresh token cannot be empty`,
    }),
});

export const refreshTokenSchema = Joi.object({
  refreshToken: Joi.string().required(),
});
