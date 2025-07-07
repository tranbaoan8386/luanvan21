const Joi = require('joi');

class AddressSchema {
    get createAddress() {
  return Joi.object({
    address_line: Joi.string().required().messages({
      'string.empty': 'Tên đường không được để trống',
      'any.required': 'Tên đường là bắt buộc'
    }),
    ward: Joi.string().required().messages({
      'string.empty': 'Tên phường/xã không được để trống',
      'any.required': 'Tên phường/xã là trường bắt buộc'
    }),
    city: Joi.string().required().messages({
      'string.empty': 'Tên tỉnh/thành phố không được để trống',
      'any.required': 'Tên tỉnh/thành phố là trường bắt buộc'
    }),
    phone: Joi.string().required().messages({
      'string.empty': 'Số điện thoại không được để trống',
      'any.required': 'Số điện thoại là trường bắt buộc'
    }),
    name: Joi.string().required().messages({
      'string.empty': 'Họ tên không được để trống',
      'any.required': 'Họ tên là trường bắt buộc'
    })
  });
}


    get updateAddress() {
        return this.createAddress; // Dùng lại validate giống create
    }
}

module.exports = new AddressSchema();
