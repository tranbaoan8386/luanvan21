import axiosClient from '../services/AxiosClient'

const authApi = {
    register: (body) => axiosClient.post('/auth/register', body),
    login: (body) => axiosClient.post('/auth/login', body),
    forgotPassword: (body) => axiosClient.post('/auth/forgot-password', body),
    resetPasswords: (body) => axiosClient.post('/auth/reset-passwords', body)
}

export default authApi
