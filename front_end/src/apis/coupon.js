import axiosClient from '../services/AxiosClient';

const couponApi = {
  addCoupon: (body) => axiosClient.post('coupons/add', body),
  getCoupon: (id) => axiosClient.get(`coupons/${id}`),
  getAllCoupon: () => axiosClient.get('coupons'),

  // 👉 Thêm dòng này:
  applyCoupon: (code) => axiosClient.get(`/coupons/${code}`)

};

export default couponApi;
