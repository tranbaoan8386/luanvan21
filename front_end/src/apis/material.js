import axiosClient from '../services/AxiosClient'

const materialApi = {
  getAllMaterial: () => axiosClient.get('/materials'),
  getMaterial: (id) => axiosClient.get(`/materials/${id}`),
  create: (body) => axiosClient.post('/materials', body),
  update: (id, body) => axiosClient.patch(`/materials/${id}`, body),
  delete: (id) => axiosClient.delete(`/materials/${id}`)
}

export default materialApi
