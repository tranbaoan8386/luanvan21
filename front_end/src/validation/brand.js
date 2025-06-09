import * as yup from 'yup'
export const createBrand = yup
    .object({
        name: yup.string().required('Tên thương hiệu sản phẩm bắt buộc nhập')
    })
    .required()
