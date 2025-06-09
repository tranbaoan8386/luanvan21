const Joi = require('joi');

class MaterialSchema {
  get createMaterial() {
    return Joi.object({
      name: Joi.string().required().messages({
        'string.base': 'Tên chất liệu phải là chuỗi',
        'string.empty': 'Tên chất liệu không được để trống',
        'any.required': 'Tên chất liệu là bắt buộc'
      })
    });
  }

  get updateMaterial() {
    return Joi.object({
      name: Joi.string().messages({
        'string.base': 'Tên chất liệu phải là chuỗi',
        'string.empty': 'Tên chất liệu không được để trống'
      })
    });
  }
}

module.exports = new MaterialSchema();
