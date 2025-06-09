const ProductImages = require('../models/ProductImages')
const ApiResponse = require('../response/ApiResponse')
class ProductImageController {


    async createProductImage(req, res, next) {

        try {
            const { productId } = req.body;
            const files = req.files; // 👈 array of files
        
            if (!files || files.length === 0) {
              return ApiResponse.error(res, {
                status: 400,
                data: { message: 'Không có ảnh nào được gửi lên.' }
              });
            }
        
            const savedImages = [];
        
            for (const file of files) {
              const productImage = await ProductImages.create({
                url: file.filename,
                productId
              });
              savedImages.push(productImage);
            }
        
            return ApiResponse.success(res, {
              status: 201,
              data: {
                message: 'Thêm nhiều ảnh thành công',
                productImages: savedImages
              }
            });
          } catch (err) {
            console.log(err);
            next(err);
          }

    }


}

module.exports = new ProductImageController()
