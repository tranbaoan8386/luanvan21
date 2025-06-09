'use strict'

const { DataTypes } = require('sequelize')




/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        /**
         * Add altering commands here.
         *
         * Example:
         * await queryInterface.createTable('users', { id: Sequelize.INTEGER });
         */
        await queryInterface.createTable('reviews', {
          
            id: {
                type: DataTypes.INTEGER,
                autoIncrement: true,
                primaryKey: true
            },
            comment: {
                type: DataTypes.TEXT,
                allowNull: false
            },
            rating: {
                type: DataTypes.FLOAT,
                allowNull: false
            },
            productId: {
                type: DataTypes.INTEGER,
                allowNull: false,
                references: {
                    model: 'products',
                    key: 'id'
                }
            },
            userId: {
                type: DataTypes.INTEGER,
                allowNull: false,
                references: {
                    model: 'users',
                    key: 'id'
                }
            },
            // Thêm trường parentId
            parentId: {
                type: DataTypes.INTEGER,
                allowNull: true,  // parentId có thể null nếu bình luận không phải là trả lời
                references: {
                    model: 'reviews',  // Dẫn tới bảng reviews để tạo quan hệ với bình luận cha
                    key: 'id'
                }
            },       
        })
    },

    async down(queryInterface, Sequelize) {
        /**
         * Add reverting commands here.
         *
         * Example:
         * await queryInterface.dropTable('users');
         */
        await queryInterface.dropTable('reviews')
    }
}
