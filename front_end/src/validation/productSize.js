import * as yup from 'yup'
export const createProductSizeSchema = yup
    .object({
        name: yup.string().required('Tên size bắt buộc nhập')
    })
    .required()
