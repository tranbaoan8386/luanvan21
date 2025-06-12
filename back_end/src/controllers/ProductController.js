const { Op, Sequelize, where } = require('sequelize')
const sequelize = require('../database/connectMysql');
const Category = require('../models/Category')
const Product = require('../models/Product')
const ProductImage = require('../models/ProductImages')
const ProductItem = require('../models/ProductItem')
const ApiResponse = require('../response/ApiResponse')
const Color = require('../models/Color')
const Coupon = require('../models/Coupon')
const Brand = require('../models/Brand')
const Size = require('../models/Size')
const Material = require('../models/Material');

class ProductController {

    async createProduct(req, res, next) {
        const t = await sequelize.transaction();
        try {
            let {
                id,
                name,
                description,
                price,
                categoryId,
                brandId,
                productCouponId,
                colors
            } = req.body;
    
            if (price % 1000 !== 0) {
                await t.rollback();
                return ApiResponse.error(res, {
                    status: 400,
                    data: { message: 'Giá sản phẩm phải là bội số của 1000' }
                });
            }
    
            if (typeof colors === 'string') {
                colors = JSON.parse(colors);
            }
    
            const BASE_IMAGE_URL = process.env.BASE_IMAGE_URL || 'http://localhost:8000/uploads/';
            let avatar = '';        
    
            const avatarFile = req.files.find((f) => f.fieldname === 'image');
            if (avatarFile) {
                avatar = avatarFile.filename; // ✅ Chỉ lưu tên file
            }else if (req.body.avatar) {
                avatar = req.body.avatar;
            } else if (
                Array.isArray(colors) &&
                colors.length > 0 &&
                Array.isArray(colors[0].images) &&
                colors[0].images.length > 0
            ) {
                avatar = colors[0].images[0];
            }
    
            const existingProduct = await Product.findOne({ where: { name }, transaction: t });
            if (existingProduct) {
                await t.rollback();
                return ApiResponse.error(res, {
                    status: 400,
                    data: { field: 'name', message: 'Tên sản phẩm đã bị trùng' }
                });
            }
    
            const product = await Product.create({
                id,
                name,
                description,
                categories_id: categoryId,
                brands_id: brandId,
                avatar
            }, { transaction: t });
    
            const productItems = [];
    
         for (const color of colors) {
    const { colorId, materialId, sizes, images } = color;

    const productItemIds = [];

    for (const size of sizes) {
        const { id: sizeId, unitInStock } = size;

        const sizeExists = await Size.findByPk(sizeId, { transaction: t });
        if (!sizeExists) {
            await t.rollback();
            return ApiResponse.error(res, {
                status: 400,
                message: `Kích thước với id ${sizeId} không tồn tại`
            });
        }

        const productItem = await ProductItem.create({
            unitInStock,
            products_id: product.id,
            coupons_id: productCouponId || null,
            price,
            sold: 0,
            color_id: colorId,
            size_id: sizeId,
            materials_id: materialId || null
        }, { transaction: t });

        productItems.push(productItem);
        productItemIds.push(productItem.id); // lưu lại để liên kết ảnh (nếu cần)
    }

    // ✅ Chỉ lưu ảnh 1 lần cho mỗi màu (chỉ gắn với 1 productItem thôi)
    if (images && Array.isArray(images) && images.length > 0 && productItemIds.length > 0) {
        for (const imgUrl of images) {
            if (imgUrl) {
                await ProductImage.create({
                    url: imgUrl,
                    products_item_id: productItemIds[0] // hoặc chọn item đại diện
                }, { transaction: t });
            }
        }
    }
}

            await t.commit(); // ✅ Xác nhận thành công
    
            return ApiResponse.success(res, {
                status: 201,
                data: {
                    product: {
                        ...product.dataValues,
                        productItems
                    },
                    message: 'Thêm sản phẩm thành công'
                }
            });
        } catch (err) {
            await t.rollback(); // ❌ Nếu có lỗi, hủy toàn bộ
            console.error(err);
            next(err);
        }
    }
    



    async updateProduct(req, res, next) {
        try {
            const { name, description, price, categoryId, brandId, productCouponId, colors } = req.body;
            const { id: productId } = req.params;
    
            // Kiểm tra giá có chia hết cho 1000 không
            if (price % 1000 !== 0) {
                return ApiResponse.error(res, {
                    status: 400,
                    data: { message: 'Giá sản phẩm phải là bội số của 1000' }
                });
            }
    
            // Parse colors nếu là string
            let parsedColors = typeof colors === 'string' ? JSON.parse(colors) : colors;
    
            // Tìm sản phẩm
            const product = await Product.findByPk(productId);
            if (!product) {
                return ApiResponse.error(res, {
                    status: 404,
                    message: 'Không tìm thấy sản phẩm'
                });
            }
    
            // Avatar
           // Avatar
            const BASE_IMAGE_URL = process.env.BASE_IMAGE_URL || 'http://localhost:8000/uploads/';
            let avatar = product.avatar;

            if (req.file) {
                avatar = BASE_IMAGE_URL + req.file.filename;
            } else if (req.body.avatar) {
                avatar = req.body.avatar;
            }


    
            // Cập nhật sản phẩm
            product.name = name;
            product.description = description;
            product.categories_id = categoryId;
            product.brands_id = brandId;
            product.avatar = avatar;
            await product.save();
    
            // Lấy danh sách sản phẩm con
            const existingProductItems = await ProductItem.findAll({
                where: { products_id: productId }
            });
    
            const productItemsToKeep = [];
    
            // Xử lý từng màu
            for (const color of parsedColors) {
                const { colorId, materialId, sizes, images } = color;
    
                for (const size of sizes) {
                    const { id: sizeId, unitInStock } = size;
    
                    const sizeExists = await Size.findByPk(sizeId);
                    if (!sizeExists) {
                        return ApiResponse.error(res, {
                            status: 400,
                            message: `Kích thước với id ${sizeId} không tồn tại`
                        });
                    }
    
                    let productItem = existingProductItems.find(
                        (item) =>
                            item.color_id === colorId &&
                            item.size_id === sizeId &&
                            item.materials_id === materialId
                    );
    
                    if (productItem) {
                        productItem.unitInStock = unitInStock;
                        productItem.price = price;
                        productItem.coupons_id = productCouponId || null;
                        await productItem.save();
                    } else {
                        productItem = await ProductItem.create({
                            unitInStock,
                            price,
                            coupons_id: productCouponId || null,
                            products_id: product.id,
                            color_id: colorId,
                            size_id: sizeId,
                            materials_id: materialId || null,
                            sold: 0
                        });
                    }
    
                    productItemsToKeep.push(productItem.id);
    
                    // Xóa ảnh cũ nếu cần, sau đó thêm ảnh mới
                    if (images && Array.isArray(images)) {
                        await ProductImage.destroy({ where: { products_item_id: productItem.id } });
    
                        for (const img of images) {
                            await ProductImage.create({
                                url: img,
                                products_item_id: productItem.id
                            });
                        }
                    }
                }
            }
    
            // Xóa product_items không còn tồn tại
            const itemsToDelete = existingProductItems.filter(
                (item) => !productItemsToKeep.includes(item.id)
            );
    
            for (const item of itemsToDelete) {
                await ProductImage.destroy({ where: { products_item_id: item.id } }); // Xóa ảnh liên quan
                await item.destroy(); // Xóa item
            }
    
            // Lấy lại thông tin sản phẩm
            const updatedProduct = await Product.findByPk(productId, {
                include: [{ model: ProductItem, as: 'productItems' }]
            });
    
            return ApiResponse.success(res, {
                status: 200,
                data: {
                    product: updatedProduct,
                    message: 'Cập nhật sản phẩm thành công'
                }
            });
        } catch (err) {
            console.log(err);
            next(err);
        }
    }
    

    async deleteProduct(req, res, next) {
        try {
            const { id: productId } = req.params;
    
            // Kiểm tra sản phẩm có tồn tại không
            const product = await Product.findByPk(productId);
            if (!product) {
                return ApiResponse.error(res, {
                    status: 404,
                    message: 'Không tìm thấy sản phẩm'
                });
            }
    
            // Lấy danh sách tất cả các product item liên quan
            const productItems = await ProductItem.findAll({
                where: { products_id: productId }
            });
    
            // Xóa ảnh liên quan đến từng product item
            for (const item of productItems) {
                await ProductImage.destroy({
                    where: { products_item_id: item.id }
                });
            }
    
            // Xóa các product item
            await ProductItem.destroy({
                where: { products_id: productId }
            });
    
            // Xóa sản phẩm chính
            await product.destroy();
    
            return ApiResponse.success(res, {
                status: 200,
                data: {
                    product,
                    message: 'Xóa sản phẩm thành công'
                }
            });
        } catch (err) {
            next(err);
        }
    }
    

    async getAllProduct(req, res, next) {
        try {
          const {
            page = 1,
            limit = 15,
            order = 'desc',
            sort_by = 'price',
            category,
            brand,
            price_max,
            price_min,
            name
          } = req.query;
      
          const whereProduct = {};
          const whereItem = {};
      
          if (category) {
            whereProduct.categories_id = category;
          }
      
          if (brand) {
            whereProduct.brands_id = brand;
          }
      
          if (name) {
            whereProduct.name = { [Op.like]: `%${name}%` };
          }
      
          if (price_min && price_max) {
            whereItem.price = { [Op.between]: [parseInt(price_min), parseInt(price_max)] };
          } else if (price_min) {
            whereItem.price = { [Op.gte]: parseInt(price_min) };
          } else if (price_max) {
            whereItem.price = { [Op.lte]: parseInt(price_max) };
          }
      
          const orderArray = [];
      
          if (sort_by === 'price') {
            orderArray.push([{ model: ProductItem, as: 'productItems' }, 'price', order]);
          } else {
            orderArray.push([sort_by, order]);
          }
      
          const products = await Product.findAll({
            where: whereProduct,
            include: [
              {
                model: ProductItem,
                as: 'productItems',
                required: false,
                attributes: ['id', 'price'],
                ...(Object.keys(whereItem).length ? { where: whereItem } : {}),
                include: [
                  {
                    model: ProductImage,
                    as: 'images',
                    attributes: ['url'],
                    required: false
                  }
                ]
              },
              {
                model: Category,
                as: 'category',
                attributes: ['name']
              },
              {
                model: Brand,
                as: 'brand',
                attributes: ['name']
              }
            ],
            order: orderArray,
            offset: (page - 1) * limit,
            limit: parseInt(limit)
          });
      
          // ✅ Tính giá thấp nhất từ productItems
          const mappedProducts = products.map((product) => {
            const productData = product.toJSON();
            const prices = productData.productItems.map((item) => item.price);
            const minPrice = prices.length > 0 ? Math.min(...prices) : null;
            return {
              ...productData,
              price: minPrice
            };
          });
      
          const totalCount = await Product.count({
            where: whereProduct,
            include: Object.keys(whereItem).length
              ? [
                  {
                    model: ProductItem,
                    as: 'productItems',
                    where: whereItem
                  }
                ]
              : []
          });
      
          const page_size = Math.ceil(totalCount / limit);
      
          return ApiResponse.success(res, {
            status: 200,
            data: {
              products: mappedProducts,
              pagination: {
                page: parseInt(page),
                limit: parseInt(limit),
                page_size
              }
            }
          });
        } catch (err) {
          console.log(err);
          next(err);
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
          attributes: ['id', 'name']
        },
        {
          model: Brand,
          as: 'brand',
          attributes: ['id', 'name']
        },
        // {
        //   model: Coupon,
        //   as: 'productCoupon',
        //   attributes: ['id', 'price']
        // },
        {
          model: ProductItem,
          as: 'productItems',
          attributes: ['id', 'price', 'unitInStock'],
          include: [
            {
              model: Color,
              as: 'color',
              attributes: ['id', 'name', 'colorCode']
            },
            {
              model: Size,
              as: 'size',
              attributes: ['id', 'name']
            },
            {
              model: Material,
              as: 'material',
              attributes: ['id', 'name']
            },
            {
              model: ProductImage,
              as: 'images',
              attributes: ['id', 'url']
            }
          ]
        }
      ]
    });

    if (!product) {
      return ApiResponse.error(res, {
        status: 404,
        data: { message: 'Không tìm thấy sản phẩm' }
      });
    }

    return ApiResponse.success(res, {
      status: 200,
      data: { product }
    });
  } catch (err) {
    console.error('❌ Lỗi getDetailProduct:', err);
    next(err);
  }
}


    
    

    
    async getProductWithImages(req, res, next) {
        try {
            const { id } = req.params;
    
            const product = await Product.findByPk(id, {
                include: [
                    // ✅ Không thể include trực tiếp ProductImage, vì ProductImage liên kết với ProductItem chứ không phải Product
                    {
                        model: ProductItem,
                        as: 'productItems', // Tên alias trong association
                        attributes: ['id', 'price'], // Lấy ID và giá nếu cần
                        include: [
                            {
                                model: ProductImage,
                                as: 'images', // Tên alias trong association
                                attributes: ['id', 'url'] // Chỉ lấy các trường cần thiết
                            }
                        ]
                    },
                    // ✅ Lấy thêm thông tin category nếu cần
                    {
                        model: Category,
                        as: 'category',
                        attributes: ['id', 'name']
                    },
                    // ✅ Lấy thêm thông tin brand nếu cần
                    {
                        model: Brand,
                        as: 'brand',
                        attributes: ['id', 'name']
                    }
                ]
            });
    
            if (!product) {
                return ApiResponse.error(res, {
                    status: 404,
                    data: { message: 'Không tìm thấy sản phẩm' }
                });
            }
    
            return ApiResponse.success(res, {
                status: 200,
                data: { product }
            });
    
        } catch (err) {
            console.error('Lỗi khi lấy sản phẩm với hình ảnh:', err);
            next(err);
        }
    }
    
    

}

module.exports = new ProductController()
