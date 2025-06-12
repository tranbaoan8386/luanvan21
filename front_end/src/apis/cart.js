import axiosClient from '../services/AxiosClient';

const cartApi = {
  // Thêm sản phẩm vào giỏ hàng
  addToCart: (body) => axiosClient.post('/carts', body),

  // Lấy toàn bộ giỏ hàng
  getCart: () => axiosClient.get('/carts'),

  // Cập nhật số lượng sản phẩm trong giỏ
  updateCart: (body) => axiosClient.patch('/carts', body),

  // Xoá sản phẩm khỏi giỏ hàng (dùng đúng endpoint)
  deleteProductCart: (body) =>
    axiosClient.delete('/carts', {
      data: body
    })
};

export default cartApi;
