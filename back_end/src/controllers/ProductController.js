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
      
       // Xử lý productCouponId
      if (productCouponId === "" || productCouponId == null) {
        productCouponId = null;
      } else {
        productCouponId = Number(productCouponId);
        if (isNaN(productCouponId)) {
          await t.rollback();
          return ApiResponse.error(res, {
            status: 400,
            data: { message: "Mã khuyến mãi không hợp lệ" }
          });
        }
      }
      
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
  
      // Tìm file avatar
      const avatarFile = req.files?.find((f) => f.fieldname === 'image');
      if (avatarFile) {
        avatar = avatarFile.filename;
      } else if (req.body.avatar) {
        avatar = req.body.avatar.replace(BASE_IMAGE_URL, '');
      } else if (Array.isArray(colors) && colors[0]?.images?.length > 0) {
        avatar = colors[0].images[0];
      }
  
      const existingProduct = await Product.findOne({
        where: { name },
        transaction: t
      });
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
            price,
            sold: 0,
            products_id: product.id,
            coupons_id: productCouponId || null,
            color_id: colorId,
            size_id: sizeId,
            materials_id: materialId || null
          }, { transaction: t });
  
          productItems.push(productItem);
          productItemIds.push(productItem.id);
        }
  
        if (images?.length > 0 && productItemIds.length > 0) {
          for (const img of images) {
            if (img) {
              await ProductImage.create({
                url: img,
                products_item_id: productItemIds[0] // Chỉ gắn vào 1 biến thể đầu tiên theo màu
              }, { transaction: t });
            }
          }
        }
      }
  
      await t.commit();
  
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
      await t.rollback();
      console.error(err);
      next(err);
    }
  }
  

  async updateProduct(req, res, next) {
    const t = await sequelize.transaction(); // ✅ Mở transaction
    try {
        const { name, description, price, categoryId, brandId, productCouponId, colors } = req.body;
        const { id: productId } = req.params;

        if (price % 1000 !== 0) {
            await t.rollback();
            return ApiResponse.error(res, {
                status: 400,
                data: { message: 'Giá sản phẩm phải là bội số của 1000' }
            });
        }

        let parsedColors = typeof colors === 'string' ? JSON.parse(colors) : colors;

        const product = await Product.findByPk(productId, { transaction: t });
        if (!product) {
            await t.rollback();
            return ApiResponse.error(res, {
                status: 404,
                message: 'Không tìm thấy sản phẩm'
            });
        }

        const BASE_IMAGE_URL = process.env.BASE_IMAGE_URL || 'http://localhost:8000/uploads/';
        let avatar = product.avatar;

        const avatarFile = req.files?.find(f => f.fieldname === 'image');
        if (avatarFile) {
            avatar = avatarFile.filename;
        } else if (req.body.avatar) {
            avatar = req.body.avatar.replace(BASE_IMAGE_URL, '');
        }

        // Cập nhật thông tin sản phẩm
        await product.update({
            name,
            description,
            price,
            categories_id: categoryId,
            brands_id: brandId,
            avatar
        }, { transaction: t });

        // Danh sách sản phẩm con cũ
        const existingProductItems = await ProductItem.findAll({ where: { products_id: productId }, transaction: t });
        const productItemsToKeep = [];

        for (const color of parsedColors) {
            const { colorId, materialId, sizes, images } = color;

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

                let productItem = existingProductItems.find(
                    item => item.color_id === colorId && item.size_id === sizeId && item.materials_id === materialId
                );

                if (productItem) {
                    await productItem.update({
                        unitInStock,
                        price,
                        coupons_id: +productCouponId || null
                    }, { transaction: t });
                } else {
                    productItem = await ProductItem.create({
                        unitInStock,
                        price,
                        coupons_id: +productCouponId || null,
                        products_id: productId,
                        color_id: colorId,
                        size_id: sizeId,
                        materials_id: materialId || null,
                        sold: 0
                    }, { transaction: t });
                }

                productItemsToKeep.push(productItem.id);

                // Xử lý ảnh
                if (images && Array.isArray(images)) {
                    await ProductImage.destroy({
                        where: { products_item_id: productItem.id },
                        transaction: t
                    });

                    for (const img of images) {
                        await ProductImage.create({
                            url: img,
                            products_item_id: productItem.id
                        }, { transaction: t });
                    }
                }
            }
        }

        // Xoá ProductItem không còn tồn tại
        const itemsToDelete = existingProductItems.filter(item => !productItemsToKeep.includes(item.id));
        for (const item of itemsToDelete) {
            await ProductImage.destroy({ where: { products_item_id: item.id }, transaction: t });
            await item.destroy({ transaction: t });
        }

        await t.commit(); // ✅ Commit mọi thay đổi

        const updatedProduct = await Product.findByPk(productId, {
            include: [
                {
                    model: ProductItem,
                    as: 'productItems',
                    include: [
                        { model: Color, as: 'color' },
                        { model: Size, as: 'size' },
                        { model: Material, as: 'material' },
                        { model: Coupon, as: 'coupon' },
                        {
                            model: ProductImage,
                            as: 'images',
                            attributes: ['url']
                        }
                    ]
                },
                { model: Category, as: 'category' },
                { model: Brand, as: 'brand' }
            ]
        });

        return ApiResponse.success(res, {
            status: 200,
            data: {
                product: updatedProduct,
                message: 'Cập nhật sản phẩm thành công'
            }
        });
    } catch (err) {
        await t.rollback(); // ❌ Rollback nếu lỗi
        console.error(err);
        next(err);
    }
}

    
  async deleteProduct(req, res, next) {
      try {
        const { id: productId } = req.params;
    
        // Kiểm tra sản phẩm có tồn tại không (kể cả soft deleted nếu cần)
        const product = await Product.findByPk(productId);
        if (!product) {
          return ApiResponse.error(res, {
            status: 404,
            message: 'Không tìm thấy sản phẩm'
          });
        }
    
        // Tìm tất cả ProductItem liên quan
        const productItems = await ProductItem.findAll({
          where: { products_id: productId }
        });
    
        // Soft-delete tất cả ProductImage và ProductItem (nếu đã cấu hình paranoid)
        for (const item of productItems) {
          await ProductImage.destroy({
            where: { products_item_id: item.id }
          });
        }
    
        await ProductItem.destroy({
          where: { products_id: productId }
        });
    
        // Soft-delete sản phẩm chính
        await product.destroy(); // Sequelize sẽ tự thêm deletedAt nhờ paranoid: true
    
        return ApiResponse.success(res, {
          status: 200,
          data: {
            product,
            message: 'Xoá sản phẩm thành công (soft delete)'
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
  const keywords = name.trim().split(/\s+/); // tách "áo nam" → ["áo", "nam"]

  whereProduct[Op.and] = keywords.map((word) => ({
    name: { [Op.like]: `%${word}%` }
  }));
}



    if (price_min && price_max) {
      whereItem.price = {
        [Op.between]: [parseInt(price_min), parseInt(price_max)]
      };
    } else if (price_min) {
      whereItem.price = { [Op.gte]: parseInt(price_min) };
    } else if (price_max) {
      whereItem.price = { [Op.lte]: parseInt(price_max) };
    }

    const orderArray = [];

if (sort_by === 'price' || sort_by === 'sold') {
  // Nếu muốn sắp xếp theo giá hoặc số lượng bán, phải đi qua bảng products_item
  orderArray.push([{ model: ProductItem, as: 'productItems' }, sort_by, order]);
} else {
  // Còn lại sắp xếp theo bảng products
  orderArray.push([sort_by, order]);
}


    const products = await Product.findAll({
  where: whereProduct,
  attributes: {
    include: [
      // 👇 Thêm tổng sold nếu sort_by === 'sold'
      ...(sort_by === 'sold'
        ? [
            [
              Sequelize.literal(`(
                SELECT SUM(pi.sold)
                FROM products_item AS pi
                WHERE pi.products_id = Product.id
              )`),
              'totalSold'
            ]
          ]
        : [])
    ]
  },
  include: [
    {
      model: ProductItem,
      as: 'productItems',
      required: false,
      attributes: ['id', 'price', 'sold'],
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
      attributes: ['name'],
      required: name ? true : false
    },
    {
      model: Brand,
      as: 'brand',
      attributes: ['name']
    }
  ],
  order:
    sort_by === 'sold'
      ? [[Sequelize.literal('totalSold'), order]]
      : orderArray,
  offset: (page - 1) * limit,
  limit: parseInt(limit),
  paranoid: true
});


    const mappedProducts = products.map((product) => {
      const productData = product.toJSON();

      const allSold = productData.productItems.reduce(
        (sum, item) => sum + (item.sold || 0),
        0
      );

      const itemWithImageOrSold =
        productData.productItems.find(
          (item) => item.sold > 0 || (item.images && item.images.length > 0)
        ) || productData.productItems[0];

      return {
        ...productData,
        price: itemWithImageOrSold?.price || 0,
        sold: allSold,
        thumbnail: itemWithImageOrSold?.images?.[0]?.url || productData.avatar
      };
    });

    const totalCount = await Product.count({
      where: whereProduct,
      include: [
        {
          model: Category,
          as: 'category',
          required: name ? true : false
        },
        ...(Object.keys(whereItem).length
          ? [
              {
                model: ProductItem,
                as: 'productItems',
                where: whereItem
              }
            ]
          : [])
      ],
      paranoid: true
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
    console.log('❌ getAllProduct error:', err);
    next(err);
  }
}

// ProductController.js
async getInventory(req, res, next) {
  try {
    const items = await ProductItem.findAll({
      include: [
        { model: Product, as: 'product', attributes: ['name','avatar'] },
        { model: Color, as: 'color', attributes: ['name'] },
        { model: Size, as: 'size', attributes: ['name'] },
      ],
      attributes: ['id', 'unitInStock', 'price', 'sold']
    });

    res.json(items);
  } catch (error) {
    console.error("Lỗi khi lấy tồn kho:", error);
    res.status(500).json({ error: "Lỗi server khi lấy tồn kho" });
  }
};



async updateStock(req, res, next) {
  const { id: productItemId } = req.params;
  const { unitInStock } = req.body;

  const productItem = await ProductItem.findByPk(productItemId);
  if (!productItem) return res.status(404).json({ message: 'Sản phẩm không tìm thấy' });

  productItem.unitInStock = unitInStock;
  await productItem.save();

  return res.status(200).json(productItem);
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
        {
          model: ProductItem,
          as: 'productItems',
         attributes: ['id', 'price', 'unitInStock', 'sold'],

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
            },
            {
              model: Coupon, // 👈 THÊM DÒNG NÀY
              as: 'coupon',
              attributes: ['id', 'code', 'price']
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
                        attributes: ['id', 'price', 'sold'],
 // Lấy ID và giá nếu cần
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
  
  async  getDeletedProducts(req, res, next) {
    try {
      const deletedProducts = await Product.findAll({
        where: {
          deletedAt: {
            [Op.ne]: null
          }
        },
        paranoid: false,
        include: [
          {
            model: ProductItem,
            as: 'productItems',
            required: false,
            attributes: ['id', 'price', 'sold'],
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
        ]
      });
  
      return ApiResponse.success(res, {
        status: 200,
        data: deletedProducts
      });
    } catch (err) {
      next(err);
    }
  }
  async  restoreDeletedProduct(req, res, next) {
    try {
      const { id } = req.params;
  
      const deletedProduct = await Product.findByPk(id, {
        paranoid: false
      });
  
      if (!deletedProduct || !deletedProduct.deletedAt) {
        return ApiResponse.error(res, {
          status: 404,
          message: 'Không tìm thấy sản phẩm đã bị xóa'
        });
      }
  
      await deletedProduct.restore();
  
      return ApiResponse.success(res, {
        status: 200,
        data: deletedProduct,
        message: 'Khôi phục sản phẩm thành công'
      });
    } catch (err) {
      next(err);
    }
  }
  

}

module.exports = new ProductController()
