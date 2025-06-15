const Joi = require("joi");

// Registration validation schema
const registerSchema = Joi.object({
  // Change from username to fullName to match what frontend is sending
  fullName: Joi.string().min(3).max(30).required().messages({
    "string.min": "Full name must be at least 3 characters",
    "string.max": "Full name cannot exceed 30 characters",
    "string.empty": "Full name is required",
  }),

  email: Joi.string()
    .email({ tlds: { allow: false } })
    .required()
    .messages({
      "string.email": "Please enter a valid email address",
      "string.empty": "Email is required",
    }),

  password: Joi.string()
    .min(6)
    .pattern(new RegExp("^[a-zA-Z0-9]{6,30}$"))
    .required()
    .messages({
      "string.min": "Password must be at least 6 characters",
      "string.pattern.base": "Password can only contain letters and numbers",
      "string.empty": "Password is required",
    }),
});

// Login validation schema
const loginSchema = Joi.object({
  email: Joi.string()
    .email({ tlds: { allow: false } })
    .required()
    .messages({
      "string.email": "Please enter a valid email address",
      "string.empty": "Email is required",
    }),

  password: Joi.string().required().messages({
    "string.empty": "Password is required",
  }),
});

// Add missing export for updateUserSchema
const updateUserSchema = Joi.object({
  fullName: Joi.string().min(3).max(30),
  email: Joi.string().email({ tlds: { allow: false } }),
  password: Joi.string().min(6).pattern(new RegExp("^[a-zA-Z0-9]{6,30}$")),
  currentPassword: Joi.string().when("password", {
    is: Joi.exist(),
    then: Joi.required(),
    otherwise: Joi.optional(),
  }),
});

module.exports = {
  registerSchema,
  loginSchema,
  updateUserSchema,
};
