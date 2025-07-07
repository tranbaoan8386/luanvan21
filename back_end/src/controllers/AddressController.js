const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const Address = require('../models/Address');
const ApiResponse = require('../response/ApiResponse');
const { env } = require('../config/env');
const { Op } = require('sequelize');

class AddressController {
  // Tạo hoặc cập nhật địa chỉ
  async createAddress(req, res, next) {
    const { address_line, city, ward, phone, name } = req.body;
    const { id: userId } = req.user;

    try {
      console.log('User ID:', userId);
      let address = await Address.findOne({ where: { users_id: userId } });
      console.log('Existing Address:', address);

      if (address) {
        // Cập nhật địa chỉ hiện tại
        address.address_line = address_line || address.address_line;
        address.city = city || address.city;
        address.ward = ward || address.ward;
        address.phone = phone || address.phone;
        address.name = name || address.name;
        await address.save();

        return res.json({ message: 'Cập nhật địa chỉ thành công', address });
      } else {
        // Tạo mới nếu chưa có
        address = await Address.create({
          users_id: userId,
          address_line,
          city,
          ward,
          phone,
          name,
          is_default: false
        });

        return res.json({ message: 'Thêm địa chỉ thành công', address });
      }
    } catch (error) {
      console.error('Lỗi xử lý địa chỉ:', error);
      res.status(500).json({ message: 'Lỗi server khi lưu địa chỉ' });
    }
  }

  // Lấy địa chỉ theo user
  async getAddressById(req, res) {
    const { id: userId } = req.user;

    try {
      const address = await Address.findOne({ where: { users_id: userId } });

      if (!address) {
        return res.status(404).json({ message: 'Không tìm thấy địa chỉ' });
      }

      return res.json({ address });
    } catch (error) {
      console.error('Lỗi lấy địa chỉ:', error);
      res.status(500).json({ message: 'Lỗi server' });
    }
  }

  // Cập nhật địa chỉ
  async updateAddress(req, res) {
    const { id: userId } = req.user;
    const { address_line, city, ward, phone, name } = req.body;

    try {
      let address = await Address.findOne({ where: { users_id: userId } });

      if (!address) {
        return res.status(404).json({ message: 'Không tìm thấy địa chỉ' });
      }

      address.address_line = address_line || address.address_line;
      address.city = city || address.city;
      address.ward = ward || address.ward;
      address.phone = phone || address.phone;
      address.name = name || address.name;
      await address.save();

      return res.json({ message: 'Cập nhật địa chỉ thành công', address });
    } catch (error) {
      console.error('Lỗi cập nhật địa chỉ:', error);
      res.status(500).json({ message: 'Lỗi server' });
    }
  }
}

module.exports = new AddressController();
