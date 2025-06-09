import * as yup from 'yup'
export const createProductColorSchema = yup
    .object({
        name: yup.string().trim().required('Tên màu bắt buộc nhập'),
        colorCode: yup.string().trim().required('Mã màu bắt buộc nhập')
    })
    .required()
