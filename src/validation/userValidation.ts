import Joi from 'joi';

export const registerSchema = Joi.object({
  username: Joi.string()
    .alphanum()
    .min(3)
    .max(30)
    .required()
    .messages({
      'string.alphanum': 'El nombre de usuario solo puede contener letras y números',
      'string.min': 'El nombre de usuario debe tener al menos 3 caracteres',
      'string.max': 'El nombre de usuario no puede tener más de 30 caracteres',
      'any.required': 'El nombre de usuario es requerido'
    }),

  email: Joi.string()
    .email()
    .required()
    .messages({
      'string.email': 'El email debe tener un formato válido',
      'any.required': 'El email es requerido'
    }),

  password: Joi.string()
    .min(8)
    .pattern(new RegExp('(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)'))
    .required()
    .messages({
      'string.min': 'La contraseña debe tener al menos 8 caracteres',
      'string.pattern.base': 'La contraseña debe contener al menos una minúscula, una mayúscula y un número',
      'any.required': 'La contraseña es requerida'
    }),

  firstName: Joi.string()
    .min(2)
    .max(50)
    .optional()
    .messages({
      'string.min': 'El nombre debe tener al menos 2 caracteres',
      'string.max': 'El nombre no puede tener más de 50 caracteres'
    }),

  lastName: Joi.string()
    .min(2)
    .max(50)
    .optional()
    .messages({
      'string.min': 'El apellido debe tener al menos 2 caracteres',
      'string.max': 'El apellido no puede tener más de 50 caracteres'
    })
});

export const loginSchema = Joi.object({
  email: Joi.string()
    .email()
    .required()
    .messages({
      'string.email': 'El email debe tener un formato válido',
      'any.required': 'El email es requerido'
    }),

  password: Joi.string()
    .required()
    .messages({
      'any.required': 'La contraseña es requerida'
    })
});

export const updateProfileSchema = Joi.object({
  firstName: Joi.string()
    .min(2)
    .max(50)
    .optional()
    .messages({
      'string.min': 'El nombre debe tener al menos 2 caracteres',
      'string.max': 'El nombre no puede tener más de 50 caracteres'
    }),

  lastName: Joi.string()
    .min(2)
    .max(50)
    .optional()
    .messages({
      'string.min': 'El apellido debe tener al menos 2 caracteres',
      'string.max': 'El apellido no puede tener más de 50 caracteres'
    }),

  email: Joi.string()
    .email()
    .optional()
    .messages({
      'string.email': 'El email debe tener un formato válido'
    })
});

// Schema para validar parámetros JWT
export const jwtPayloadSchema = Joi.object({
  userId: Joi.string().required(),
  email: Joi.string().email().required(),
  iat: Joi.number().optional(),
  exp: Joi.number().optional()
});