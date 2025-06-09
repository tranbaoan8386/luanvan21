import * as yup from 'yup'
export const createCategory = yup
    .object({
        name: yup.string().required('Tên danh mục sản phẩm bắt buộc nhập')
    })
    .required()
