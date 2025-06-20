// coupon.js
import axiosClient from '../services/AxiosClient';

const couponApi = {
  // ✅ Gửi code (SALE10K) và totalCart (số tiền giỏ hàng) → dùng /check/:id
  applyCoupon: (code, totalCart) =>
    axiosClient.get(`/coupons/check/${code}`, {
      params: { totalCart }
    }),

  // ✅ Lấy tất cả coupon (dành cho admin hoặc hiển thị danh sách)
  getAllCoupon: () => axiosClient.get('/coupons'),

  // ✅ Lấy coupon theo ID (admin sửa mã khuyến mãi)
  getCouponById: (id) => axiosClient.get(`/coupons/${id}`),

  // Thêm mới
  createCoupon: (body) => axiosClient.post('/coupons', body),

  // Cập nhật
  updateCoupon: (id, body) => axiosClient.patch(`/coupons/${id}`, body),

  // Xoá
  deleteCoupon: (id) => axiosClient.delete(`/coupons/${id}`)
};

export default couponApi;
