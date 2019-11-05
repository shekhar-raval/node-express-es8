const Joi = require('joi');

module.exports = {
  // POST /v1/auth/login
  Login: {
    body: {
      email: Joi.string().email().required(),
      password: Joi.string().required().min(6).max(128),
    },
  },

  // POST /v1/auth/register
  Register: {
    body: {
      name: Joi.string().required().min(2).max(30),
      email: Joi.string().email().required(),
      password: Joi.string().required().min(6).max(128),
    },
  },
};
