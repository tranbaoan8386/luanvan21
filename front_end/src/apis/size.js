import axiosClient from '../services/AxiosClient'

const sizeApi = {
    getAllSize: () => axiosClient.get('/sizes'),
    getSize: (id) => axiosClient.get(`/sizes/${id}`),
    create: (body) => axiosClient.post('/sizes', body),
    update: (id, body) => axiosClient.patch(`/sizes/${id}`, body),
    delete: (id) => axiosClient.delete(`/sizes/${id}`)
}
export default sizeApi
