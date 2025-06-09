import axiosClient from '../services/AxiosClient';

const reviewApi = {
    getAllReviewProduct: (id) => axiosClient.get(`/reviews/product/${id}`),
    createReview: (body) => axiosClient.post(`/reviews`, body),
    createReply: (id, body) => axiosClient.post(`/reviews/reply`, body)
};

export default reviewApi;
