import * as yup from 'yup'
// Function to check if the product name already exists
const checkProductNameUnique = async (name) => {
    const response = await productApi.checkProductName({ name });
    return response.data.isUnique;
};
export const filterPriceSchema = yup
    .object({
        price_min: yup.string().test({
            name: 'price-not-allowed',
            message: 'Giá không phù hợp',
            test: function (value) {
                const price_min = value
                const { price_max } = this.parent
                if (price_min !== '' && price_max !== '') {
                    return Number(price_max) >= Number(price_min)
                }
                return price_min !== '' || price_max !== ''
            }
        }),
        price_max: yup.string().test({
            name: yup
                .string()
                .required("Tên sản phẩm là bắt buộc")
                .test("unique", "Tên sản phẩm đã tồn tại", async (value) => {
                    if (!value) return true; // Bypass the test if value is empty (handled by required validation)
                    const isUnique = await checkProductNameUnique(value);
                    return isUnique;
                }),
            message: 'Giá không phù hợp',
            test: function (value) {
                const price_max = value
                const { price_min } = this.parent
                if (price_min !== '' && price_max !== '') {
                    return Number(price_max) >= Number(price_min)
                }
                return price_min !== '' || price_max !== ''
            }
        })
    })
    .required()

export const searchSchema = yup
    .object({
        name: yup.string().trim().required()
    })
    .required()
export const createProductSchema = yup.object().shape({
    name: yup.string().required("Tên sản phẩm là bắt buộc"),
    price: yup.number().required("Giá tiền là bắt buộc").positive("Giá tiền phải lớn hơn 0"),
    
    productCouponId: yup
    .number()
    // Chuyển "" (chuỗi rỗng) thành null để không lỗi NaN
    .transform((value, originalValue) => originalValue === "" ? null : Number(originalValue))
    .nullable() // Cho phép null (không chọn mã)
    .typeError("Mã khuyến mãi không hợp lệ"),
    categoryId: yup.string().required("Loại sản phẩm là bắt buộc"),
    brandId: yup.string().required("Thương hiệu là bắt buộc"),
    colorId: yup.array().of(yup.string()),
    colors: yup.array().of(
        yup.object().shape({
            colorId: yup.string().required(),
            unitInStock: yup
                .number()
                .min(0, "Số lượng tồn không được nhỏ hơn 0")
                .required("Số lượng tồn là bắt buộc"),
        })
    ),
    sizeId: yup.array().of(yup.string()),
    sizes: yup.array().of(
        yup.object().shape({
            sizeId: yup.string().required(),
            unitInStock: yup
                .number()
                .min(0, "Số lượng tồn không được nhỏ hơn 0")
                .required("Số lượng tồn là bắt buộc"),
        })
    ),

});