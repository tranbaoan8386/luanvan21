const { Op, Sequelize } = require('sequelize')
const Category = require('../models/Category')
const Product = require('../models/Product')

const ProductItem = require('../models/ProductItem')
const ApiResponse = require('../response/ApiResponse')
const Color = require('../models/Color')
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



    async createProduct(req, res, next) {
        try {
            const { id, name, description, price, sold, categoryId, productCouponId, colorId, unitlnStock } = req.body

            let image = ''
            if (req.file) {
                image = req.file.filename
            }


            const product = await Product.create({
                id,
                name,
                description,
                price,
                image,
                sold,
                categoryId,
                productCouponId
            })

            let productColor = []
            if (product) {
                // lặp qua màu, sau đó tạo ProductItem tương ứng với màu
                for (let i = 0; i < colorId.length; i++) {
                    const product_item = await ProductItem.create({
                        productId: product.id,
                        colorId: colorId[i],
                        unitlnStock: unitlnStock
                    })
                    productColor.push(product_item)
                }
            }


            const info_product = {
                ...product.dataValues,
                product_item: productColor
            }
            return ApiResponse.success(res, {
                status: 201,
                data: {
                    product: info_product,
                    message: 'Thêm sản phẩm thành công'
                }
            })
        } catch (err) {
            console.log(err)
            next(err)
        }
    }
    async updateProduct(req, res, next) {
        try {
            const { name, description, price, sold, categoryId, productCouponId, colorId, unitlnStock } = req.body;
            const { id: productId } = req.params;
            const product = await Product.findByPk(productId);

            if (!product) {
                return ApiResponse.success(res, {
                    status: 404,
                    data: {
                        message: 'Không tìm thấy sản phẩm'
                    }
                });
            }

            let image = product.image; // giữ lại ảnh cũ nếu không có ảnh mới
            if (req.file) {
                image = req.file.filename;
            }

            // Cập nhật thông tin sản phẩm
            product.name = name;
            product.description = description;
            product.price = price;
            product.sold = sold;
            product.image = image;
            product.categoryId = categoryId;
            product.productCouponId = productCouponId;
            await product.save();

            // Mảng để lưu các product items
            const productColor = [];

            // Xóa các ProductItem hiện có của sản phẩm để cập nhật mới
            await ProductItem.destroy({ where: { productId: product.id } });

            // Kiểm tra xem unitInStock có giá trị hợp lệ
            if (!unitlnStock && unitlnStock !== 0) {
                return ApiResponse.success(res, {
                    status: 400,
                    data: {
                        message: 'unitlnStock không hợp lệ'
                    }
                });
            }

            // Lặp qua các colorId để tạo các ProductItem tương ứng
            for (let i = 0; i < colorId.length; i++) {
                const product_item = await ProductItem.create({
                    productId: product.id,
                    colorId: colorId[i],
                    unitlnStock: unitlnStock // đảm bảo unitInStock không null
                });
                productColor.push(product_item);
            }

            const info_product = {
                ...product.dataValues,
                product_item: productColor
            };

            // Xóa các ảnh cũ của sản phẩm
            // await ProductImages.destroy({
            //     where: {
            //         productId: productId
            //     }
            // });

            // Thêm ảnh mới nếu có
            // if (req.files) {
            //     const imagePromises = req.files.map((file) => {
            //         return ProductImages.create({
            //             productId: product.id,
            //             url: file.filename
            //         });
            //     });

            //     // Chờ cho tất cả các promise hoàn thành
            //     await Promise.all(imagePromises);
            // }

            return ApiResponse.success(res, {
                status: 200,
                data: {
                    product: info_product,
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
