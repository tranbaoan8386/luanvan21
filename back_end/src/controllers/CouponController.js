const { Sequelize } = require('sequelize');
const Coupon = require('../models/Coupon');
const ApiResponse = require('../response/ApiResponse');
const ErrorResponse = require('../response/ErrorResponse');

class CouponController {
  // Lấy tất cả coupon còn hạn
  async getAllCoupon(req, res, next) {
    try {
      const currentDate = new Date();
      const validCoupons = await Coupon.findAll({
        where: {
          endDate: { [Sequelize.Op.gte]: currentDate }
        }
      });

      return new ApiResponse(res, {
        status: 200,
        data: validCoupons
      });
    } catch (err) {
      next(err);
    }
  }

  // Áp mã giảm giá (theo code, dùng ở FE/cart)
  async getCoupon(req, res, next) {
    try {
      const currentDate = new Date();
      const { id: code } = req.params; // code được truyền ở URL như /check/SALE10K
      const { totalCart } = req.query;

      const validCoupon = await Coupon.findOne({
        where: {
          code,
          endDate: { [Sequelize.Op.gte]: currentDate },
          startDate: { [Sequelize.Op.lte]: currentDate }
        }
      });

      if (!validCoupon) {
        return ApiResponse.error(res, {
          status: 400,
          message: "Mã giảm giá không tồn tại hoặc đã hết hạn!"
        });
      }

      if (totalCart && validCoupon.price > Number(totalCart)) {
        return ApiResponse.error(res, {
          status: 400,
          message: `Mã giảm ${validCoupon.price} lớn hơn tổng giỏ hàng ${totalCart}`
        });
      }

      return ApiResponse.success(res, {
        status: 200,
        data: { coupon: validCoupon }
      });
    } catch (err) {
      next(err);
    }
  }

  // Lấy mã khuyến mãi theo ID (dùng cho admin)
  async getCouponById(req, res, next) {
    try {
      const { id } = req.params;

      if (!id || isNaN(id)) {
        return ApiResponse.error(res, {
          status: 400,
          message: 'ID không hợp lệ'
        });
      }

      const coupon = await Coupon.findByPk(id);

      if (!coupon) {
        return ApiResponse.error(res, {
          status: 404,
          message: 'Không tìm thấy mã khuyến mãi'
        });
      }

      return ApiResponse.success(res, {
        status: 200,
        data: { coupon }
      });
    } catch (err) {
      next(err);
    }
  }

  // Tạo mã mới
  async createCoupon(req, res, next) {
    try {
      const { code, price, startDate } = req.body;
      let endDate = req.body.endDate;

      const existedCode = await Coupon.findOne({ where: { code } });
      if (existedCode) {
        throw new ErrorResponse(400, 'Mã khuyến mãi đã tồn tại');
      }

      if (!endDate) {
        endDate = new Date();
        endDate.setDate(endDate.getDate() + 3);
      }

      const newCoupon = await Coupon.create({
        code,
        price,
        startDate: startDate || new Date(),
        endDate
      });

      return new ApiResponse(res, {
        status: 201,
        data: newCoupon
      });
    } catch (err) {
      next(err);
    }
  }

  // Cập nhật mã
  async updateCoupon(req, res, next) {
    try {
      const { id: couponId } = req.params;
      const { code, price, startDate, endDate } = req.body;
  
      const coupon = await Coupon.findOne({ where: { id: couponId } });
      if (!coupon) {
        return res.status(404).json({ message: 'Không tìm thấy khuyến mãi' });
      }
  
      coupon.code = code;
      coupon.price = price;
      coupon.startDate = startDate;
      coupon.endDate = endDate;
  
      await coupon.save();
  
      return res.status(200).json({ success: true, data: coupon });
    } catch (err) {
      // ✅ In chi tiết lỗi Sequelize validation
      console.error("🔥 Sequelize Error:", err);
      if (err.name === 'SequelizeValidationError' || err.name === 'SequelizeUniqueConstraintError') {
        return res.status(422).json({ message: err.errors?.[0]?.message || 'Lỗi dữ liệu không hợp lệ' });
      }
      return res.status(500).json({ message: 'Lỗi máy chủ không xác định' });
    }
  }
  
  

  // Xoá mã
  async deleteCoupon(req, res, next) {
    try {
      const { id: couponId } = req.params;

      const coupon = await Coupon.findOne({ where: { id: couponId } });
      if (!coupon) {
        throw new ErrorResponse(404, 'Không tìm thấy khuyến mãi');
      }

      await coupon.destroy();

      return new ApiResponse(res, {
        status: 200,
        data: coupon
      });
    } catch (err) {
      next(err);
    }
  }
}

module.exports = new CouponController();
