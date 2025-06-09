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
        await queryInterface.createTable('products_item', {
          id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        unitlnStock: {
            type: DataTypes.INTEGER,
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
        colorId: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: 'colors',
                key: 'id'
            }
        },
        sizeId: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: 'sizes',
                key: 'id'
            }
        }
        
        })
    },

    async down(queryInterface, Sequelize) {
        /**
         * Add reverting commands here.
         *
         * Example:
         * await queryInterface.dropTable('users');
         */
        await queryInterface.dropTable('products_item')
    }
}
