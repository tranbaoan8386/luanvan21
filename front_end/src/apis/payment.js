import axiosClient from '../services/AxiosClient';

const paymentApi = {
    getConfig: () => axiosClient.get('payments/config')
};

export default paymentApi;
