const Joi = require("joi");

exports.createAdminSchema = Joi.object({
  username: Joi.string().alphanum().min(3).max(30).required(),
  password: Joi.string().min(6).required(),
  pin: Joi.string().length(6).required(),
});

exports.loginAdminSchema = Joi.object({
  username: Joi.string().alphanum().min(3).max(30).required(),
  password: Joi.string().min(6).required()
});
