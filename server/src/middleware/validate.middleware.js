const Joi = require('joi');

const BLOCKED_PROTOCOLS = ['javascript:', 'data:', 'vbscript:', 'file:'];

const schemas = {
  register: Joi.object({
    email:    Joi.string().email().required(),
    password: Joi.string().min(6).required()
  }),
  login: Joi.object({
    email:    Joi.string().email().required(),
    password: Joi.string().required()
  }),
  shorten: Joi.object({
    originalUrl: Joi.string().uri({ scheme: ['http', 'https'] }).required()
      .custom((value, helpers) => {
        const lower = value.toLowerCase();
        if (BLOCKED_PROTOCOLS.some(p => lower.startsWith(p))) {
          return helpers.error('any.invalid');
        }
        return value;
      }),
    customAlias: Joi.string().alphanum().min(3).max(20).optional(),
    expiresAt:   Joi.date().greater('now').optional()
  })
};

module.exports = function validate(schemaName) {
  return (req, res, next) => {
    const { error } = schemas[schemaName].validate(req.body);
    if (error) return res.status(400).json({ error: error.details[0].message });
    next();
  };
};