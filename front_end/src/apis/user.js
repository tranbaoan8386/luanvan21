import axiosClient from '../services/AxiosClient'

const userApi = {
    logout: () => axiosClient.post('/users/logout'),
    getMe: () => axiosClient.get('/users/me'),
    getAll: () => axiosClient.get('/users'),
    getUser: (id) => axiosClient.get(`/users/${id}`),
    deleteUser: (id) => axiosClient.delete(`/users/delete/${id}`),
    update: (body) =>
        axiosClient.patch('/users/update', body, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        }),
    updatePassword: (body) => axiosClient.patch('/users/update-password', body),
    getAllOrder: () => axiosClient.get('/users'),
    toggleActive: (id) => axiosClient.patch(`/users/toggle-active/${id}`)
}

export default userApi
