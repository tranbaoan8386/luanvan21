const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const User = require('../models/User')
const Address = require('../models/Address')
const ApiResponse = require('../response/ApiResponse')
const { env } = require('../config/env')
const { Op } = require('sequelize')

class AddressController {
    async createAddress(req, res, next) {
        const { street, district, village, province, phone } = req.body;
        const { id: userId } = req.user;
        try {
            console.log('User ID:', userId); // Log chi tiết về user ID
            let address = await Address.findOne({ where: { userId } });
            console.log('Existing Address:', address); // Log chi tiết về địa chỉ hiện có (nếu có)

            if (address) {
                address.street = street || address.street;
                address.district = district || address.district;
                address.village = village || address.village;
                address.province = province || address.province;
                address.phone = phone || address.phone;
                await address.save();

                return res.json({ message: 'Address updated successfully', address });
            } else {
                address = await Address.create({
                    userId,
                    street,
                    district,
                    village,
                    province,
                    phone
                });

                return res.json({ message: 'Address added successfully', address });
            }
        } catch (error) {
            console.error('Address error:', error); // Log chi tiết về lỗi
            res.status(500).json({ message: 'Internal server error' });
        }
    }
    async getAddressById(req, res) {
        const { id: userId } = req.user;

        try {
            const address = await Address.findOne({ where: { userId } });

            if (!address) {
                return res.status(404).json({ message: 'Address not found' });
            }

            return res.json({ address });
        } catch (error) {
            console.error('Address retrieval error:', error);
            res.status(500).json({ message: 'Internal server error' });
        }
    }
    async updateAddress(req, res) {
        const { id: userId } = req.user;
        const { street, district, village, province, phone } = req.body;

        try {
            let address = await Address.findOne({ where: { userId } });

            if (!address) {
                return res.status(404).json({ message: 'Address not found' });
            }

            address.street = street || address.street;
            address.district = district || address.district;
            address.village = village || address.village;
            address.province = province || address.province;
            address.phone = phone || address.phone;
            await address.save();

            return res.json({ message: 'Address updated successfully', address });
        } catch (error) {
            console.error('Address update error:', error);
            res.status(500).json({ message: 'Internal server error' });
        }
    }
}
module.exports = new AddressController()

