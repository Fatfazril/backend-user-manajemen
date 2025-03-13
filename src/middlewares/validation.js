const Joi = require('joi');

const taskValidation = (data) => {
  const schema = Joi.object({
    title: Joi.string().min(3).required(),
    description: Joi.string().optional(),
    status: Joi.string().valid('pending', 'in-progress', 'completed').optional(), // Pastikan status diizinkan
  });

  return schema.validate(data);
};

module.exports = { taskValidation };
