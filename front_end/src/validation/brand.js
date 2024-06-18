import * as yup from 'yup'
export const createBrandSchema = yup
    .object({
        name: yup.string().trim().required('Tên màu bắt buộc nhập')
    })
    .required()
