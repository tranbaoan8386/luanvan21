import axiosClient from '../services/AxiosClient'

const colorApi = {
    getAllColor: () => axiosClient.get('/colors'),
    getColor: (id) => axiosClient.get(`/colors/${id}`),
    create: (body) => axiosClient.post('/colors', body),
    update: (id, body) => axiosClient.patch(`/colors/${id}`, body),
    delete: (id) => axiosClient.delete(`/colors/${id}`)
}
export default colorApi
