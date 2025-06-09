import axiosClient from '../services/AxiosClient'

const orderApi = {
    createOrder: (body) => axiosClient.post('orders', body),
    getAllOrder: () => axiosClient.get('/orders', {
        headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
        }
    }),
    getSale: () => axiosClient.get('orders/sale'),
    getMonthlyRevenue: () => axiosClient.get('orders/salemonth'),
    getAnnualRevenue: () => axiosClient.get('orders/saleannual'),
    getOrderById: (id) => axiosClient.get(`orders/${id}`),
    updateCancelled: (id) => axiosClient.patch(`orders/cancel/${id}`),
    setShipperOrder: (id) => axiosClient.patch(`orders/shipper/${id}`),
    setDeliveredOrder: (id) => axiosClient.patch(`orders/delivered/${id}`),
    setCancelledOrder: (id) => axiosClient.patch(`orders/cancelled/${id}`),
    setPaymentOrder: (id) => axiosClient.patch(`orders/payment/${id}`),
    cancelOrderById: (id) => axiosClient.patch(`orders/cancel/${id}`),
    getStatistics: () => axiosClient.get('/orders/statistics', {
        headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
        }
    }),
}
export default orderApi
