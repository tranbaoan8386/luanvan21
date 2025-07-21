import axiosClient from '../services/AxiosClient'

const productApi = {
    getAllProduct: (params = {}) =>
        axiosClient.get('/products', {
            params
        }),

    getProductWithImages: (id) => axiosClient.get(`/products/${id}`),

    getDetailProduct: (id) => axiosClient.get(`/products/${id}`),

    createProduct: (body) =>
        axiosClient.post('/products', body, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        }),

    updateProduct: (id, body) =>
        axiosClient.patch(`/products/${id}`, body, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        }),

    deleteProduct: (id) => axiosClient.delete(`/products/${id}`),

    getDeletedProducts: () => axiosClient.get('/products/deleted'),

    restoreProduct: (id) => axiosClient.patch(`/products/restore/${id}`),

    getInventory: () => axiosClient.get('/products/inventory'),
    updateInventory: (id, unitInStock) =>
    axiosClient.patch(`/products/inventory/${id}`, { unitInStock }),

}

export default productApi
