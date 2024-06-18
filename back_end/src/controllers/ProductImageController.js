const ProductImages = require('../models/ProductImages')
const ApiResponse = require('../response/ApiResponse')
class ProductImageController {


    async createProductImage(req, res, next) {

        try {
            const { productId } = req.body

            let url = ''
            if (req.file) {
                url = req.file.filename
            }


            const productImage = await ProductImages.create({
                url,

                productId
            })

            return ApiResponse.success(res, {
                status: 201,
                data: {
                    productImage,
                    message: 'Thêm hình thành công'
                }
            })
        } catch (err) {
            console.log(err)
            next(err)
        }

    }


}

module.exports = new ProductImageController()
