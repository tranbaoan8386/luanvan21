import axiosClient from '../services/AxiosClient'

const cartApi = {
    addToCart: (body) => axiosClient.post('/carts', body),
    getCart: () => axiosClient.get('/carts'),
    updateCart: (body) => axiosClient.patch('/carts', body),
    deleteProductFromCart: (body) =>
        axiosClient.delete('/carts', {
            data: body
        }),
    deleteProductCart: (body) =>
        axiosClient.delete('/carts/carts', {
            data: body
        })
}
export default cartApi
