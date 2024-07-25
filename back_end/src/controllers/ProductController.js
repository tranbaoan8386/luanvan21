const { Op, Sequelize } = require('sequelize')
const Category = require('../models/Category')
const Product = require('../models/Product')
const ProductImage = require('../models/ProductImages')
const ProductItem = require('../models/ProductItem')
const ApiResponse = require('../response/ApiResponse')
const Color = require('../models/Color')
const Coupon = require('../models/Coupon')
class ProductController {
    async getAllProduct(req, res, next) {
        try {
            // Destructure các tham số từ query string
            const {
                page = 1,
                limit = 15,
                order = 'desc',
                sort_by = 'price',
                category,
                price_max,
                price_min,
                name,
            } = req.query

            const whereCondition = {}

            if (category) {
                whereCondition.categoryId = category
            }

            if (price_max && price_min) {

                whereCondition.price = {
                    [Op.between]: [price_min, price_max]
                }
            } else {

                if (price_max) {
                    whereCondition.price = { [Op.lte]: price_max }
                }

                if (price_min) {
                    whereCondition.price = { [Op.gte]: price_min }
                }
            }

            if (name) {
                whereCondition.name = { [Op.like]: `%${name}%` }
            }

            // Sắp xếp theo trường được chọn và thứ tự được chỉ định
            const orderArray = [[sort_by, order]]

            // Thực hiện truy vấn sử dụng các điều kiện và tham số
            let products

            products = await Product.findAll({
                where: whereCondition,
                include: [
                    {
                        model: Category,
                        as: 'category',
                        attributes: ['name']
                    },
                ],
                order: orderArray,
                offset: (page - 1) * limit,
                limit: parseInt(limit)
            })

            // Đếm tổng số sản phẩm để tính số trang
            const totalCount = await Product.count({
                where: whereCondition
            })

            // Tính toán số trang và kích thước trang
            const page_size = Math.ceil(totalCount / limit)


            return ApiResponse.success(res, {
                status: 200,
                data: {
                    products,
                    pagination: { page, limit: parseInt(limit), page_size }
                }
            })
        } catch (err) {
            next(err)
        }
    }

    async getDetailProduct(req, res, next) {
        try {
            const { id: productId } = req.params;
            const product = await Product.findByPk(productId, {
                include: [
                    {
                        model: Category,
                        as: 'category',
                        attributes: ['name']
                    },

                    {
                        model: Coupon,
                        as: 'productCoupon', // Make sure this alias matches the association in your models
                        attributes: ['price']
                    }
                    ,
                    {
                        model: ProductItem,
                        as: 'productsDetail'
                    }
                ]
            });

            // Nếu không tìm thấy sản phẩm thì trả về
            if (!product) {
                return ApiResponse.error(res, {
                    status: 404,
                    data: {
                        message: 'Không tìm thấy sản phẩm'
                    }
                });
            }

            // Tìm trong bảng ProductItem tất cả bản ghi có chứa productId
            const productItems = await ProductItem.findAll({
                where: { productId },
                attributes: ['id', 'unitlnStock', 'productId', 'colorId'],
                raw: true
            });

            let colorProducts = [];
            for (const item of productItems) {
                const color = await Color.findOne({
                    where: { id: item.colorId },
                    attributes: ['id', 'name'], // Chỉ định các thuộc tính cần lấy
                    raw: true // Lấy dữ liệu ở dạng raw, không có siêu dữ liệu của Sequelize
                });
                if (color) {
                    colorProducts.push(color);
                }
            }

            return ApiResponse.success(res, {
                status: 200,
                data: {
                    product: { ...product.toJSON(), productItems, colorProducts }
                }
            });
        } catch (err) {
            next(err);
        }
    }
    async getProductWithImages(req, res, next) {
        try {
            const { id } = req.params;
            console.log('id:', id); // Kiểm tra giá trị productId

            const product = await Product.findByPk(id, {
                include: [
                    {
                        model: ProductImage,
                        as: 'images'
                    }
                ]
            });

            if (!product) {
                return res.status(404).json({ message: 'Product not found' });
            }

            return res.status(200).json(product);
        } catch (err) {
            next(err);
        }
    }



    async createProduct(req, res, next) {
        try {
            let { id, name, description, price, categoryId, productCouponId, colors } = req.body;
            colors = JSON.parse(colors)
            let image = '';

            if (req.file) {
                image = req.file.filename;
            }

            const product = await Product.create({
                id,
                name,
                description,
                price,
                image,
                categoryId,
                productCouponId: productCouponId || null
            });

            const productItems = [];
            // Lặp qua từng màu và tạo ProductItem tương ứng
            for (let i = 0; i < colors.length; i++) {
                const { colorId, unitlnStock } = colors[i];
                const productItem = await ProductItem.create({
                    productId: product.id,
                    colorId,
                    unitlnStock
                });
                productItems.push(productItem);
            }

            const info_product = {
                ...product.dataValues,
                productItems
            };

            return ApiResponse.success(res, {
                status: 201,
                data: {
                    product: info_product,
                    message: 'Thêm sản phẩm thành công'
                }
            });
        } catch (err) {
            console.log(err);
            next(err);
        }
    }



    async updateProduct(req, res, next) {
        try {
            const { name, description, price, categoryId, productCouponId, colors } = req.body;
            const { id: productId } = req.params;

            // Kiểm tra và phân tích cú pháp dữ liệu colors nếu nó là chuỗi
            let parsedColors;
            if (typeof colors === 'string') {
                parsedColors = JSON.parse(colors);
            } else {
                parsedColors = colors;
            }

            // Tìm sản phẩm cần cập nhật
            const product = await Product.findByPk(productId);

            if (!product) {
                return ApiResponse.error(res, {
                    status: 404,
                    message: 'Không tìm thấy sản phẩm'
                });
            }

            // Lưu lại ảnh cũ hoặc cập nhật ảnh mới nếu có
            let image = product.image;
            if (req.file) {
                image = req.file.filename;
            }

            // Cập nhật thông tin sản phẩm
            product.name = name;
            product.description = description;
            product.price = price;
            product.image = image;
            product.categoryId = categoryId;
            product.productCouponId = productCouponId;

            // Lưu thông tin sản phẩm đã cập nhật
            await product.save();

            // Lấy các ProductItem hiện có của sản phẩm
            const existingProductItems = await ProductItem.findAll({ where: { productId: productId } });

            // Lấy danh sách các colorId hiện có
            const existingColorIds = existingProductItems.map(item => item.colorId);

            // Lấy danh sách các colorId mới
            const newColorIds = parsedColors.map(color => color.colorId);

            // Xóa các màu không còn trong danh sách mới
            const colorIdsToRemove = existingColorIds.filter(colorId => !newColorIds.includes(colorId));
            await ProductItem.destroy({
                where: {
                    productId: productId,
                    colorId: colorIdsToRemove
                }
            });

            // Thêm hoặc cập nhật các ProductItem cho từng màu sắc
            for (const color of parsedColors) {
                const { colorId, unitlnStock } = color;

                // Kiểm tra xem ProductItem đã tồn tại hay chưa
                const existingProductItem = existingProductItems.find(item => item.colorId === colorId);

                if (existingProductItem) {
                    // Nếu tồn tại, cập nhật số lượng tồn kho
                    existingProductItem.unitlnStock = unitlnStock;
                    await existingProductItem.save();
                } else {
                    // Nếu không tồn tại, tạo mới ProductItem
                    await ProductItem.create({
                        productId: product.id,
                        colorId,
                        unitlnStock
                    });
                }
            }

            // Lấy thông tin sản phẩm sau khi đã cập nhật
            const updatedProduct = await Product.findByPk(productId, {
                include: [{ model: ProductItem, as: 'productsDetail' }]
            });

            return ApiResponse.success(res, {
                status: 200,
                data: {
                    product: updatedProduct,
                    message: 'Cập nhật sản phẩm thành công'
                }
            });
        } catch (err) {
            next(err);
        }
    }






    async deleteProduct(req, res, next) {
        try {
            const { id: productId } = req.params
            const product = await Product.findByPk(productId)

            if (!product) {
                return ApiResponse.success(res, {
                    status: 404,
                    data: {
                        message: 'Không tìm thấy sản phẩm'
                    }
                })
            }

            await product.destroy()

            return ApiResponse.success(res, {
                status: 200,
                data: {
                    product,
                    message: 'Xóa sản phẩm thành công'
                }
            })
        } catch (err) {
            next(err)
        }
    }
}

module.exports = new ProductController()
