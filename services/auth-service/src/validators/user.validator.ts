import Joi from "joi";

export const updateUserSchema = Joi.object({
  username: Joi.string().min(3).max(30).optional(),
  firstname: Joi.string().min(3).max(50).optional(),
  lastname: Joi.string().min(3).max(50).optional(),
  middlename: Joi.string().min(3).max(50).optional(),
  location: Joi.string().max(50).optional(),
  bio: Joi.string().max(120).optional(),
  dateOfBirth: Joi.date().iso().required().optional(),
});

export const changeEmailSchema = Joi.object({
  email: Joi.string().email().required(),
});

export const savePostSchema = Joi.object({
  postId: Joi.string().required(),
});

export const unsavePostSchema = Joi.object({
  postId: Joi.string().required(),
});

// export const changePhoneNumberSchema = Joi.object({
//   phoneNumber: Joi.string().required(),
// });
