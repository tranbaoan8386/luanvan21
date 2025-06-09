import axiosClient from '../services/AxiosClient'

const addressApi = {
    getAddressById: (id) => axiosClient.get(`/address/${id}`),
    createAddress: (body) => axiosClient.post('/address', body),
    updateAddress: (id, body) => axiosClient.patch(`/address/${id}`, body),

}
export default addressApi
