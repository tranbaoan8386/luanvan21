import axiosClient from '../services/AxiosClient';

const userApi = {
  logout: () => axiosClient.post('/users/logout'),
  getMe: () => axiosClient.get('/users/me'),

  // ✅ GET all users (hỗ trợ truyền deleted, search, page sau này)
  getAll: (params = {}) => axiosClient.get('/users', { params }),

  getUser: (id) => axiosClient.get(`/users/${id}`),

  // ✅ Xóa mềm tài khoản
  deleteUser: (id) => axiosClient.delete(`/users/delete/${id}`),

  // ✅ Khôi phục tài khoản đã xóa
  restoreUser: (id) => axiosClient.patch(`/users/restore/${id}`),

  // ✅ Cập nhật thông tin cá nhân
  update: (body) =>
    axiosClient.patch('/users/update', body, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    }),

  // ✅ Đổi mật khẩu
  updatePassword: (body) =>
    axiosClient.patch('/users/update-password', body),

  // ✅ Kích hoạt / Vô hiệu hóa tài khoản
  toggleActive: (id) =>
    axiosClient.patch(`/users/toggle-active/${id}`),
};

export default userApi;
