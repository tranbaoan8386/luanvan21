'use strict'
const bcrypt = require('bcryptjs')
/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        /**
         * Add seed commands here.
         *
         * Example:
         * await queryInterface.bulkInsert('People', [{
         *   name: 'John Doe',
         *   isBetaMember: false
         * }], {});
         */
        const roles = await queryInterface.sequelize.query('SELECT slug FROM roles;')
        const rolesRows = roles[0]
        await queryInterface.bulkInsert(
            'users',
            [
                {
                    name: 'Admin',
                    email: 'admin@example.com',
                    password: bcrypt.hashSync('123456'),
                    role: rolesRows.find((role) => role.slug === 'admin').slug,
                    verified: true,
                    createdAt: new Date(),
                    updatedAt: new Date()
                },
                
                {
                    name: 'Customer',
                    email: 'customer@example.com',
                    password: bcrypt.hashSync('123456'),
                    role: rolesRows.find((role) => role.slug === 'customer').slug,
                    verified: true,
                    createdAt: new Date(),
                    updatedAt: new Date()
                }
            ],
            {}
        )
    },

    async down(queryInterface, Sequelize) {
        /**
         * Add commands to revert seed here.
         *
         * Example:
         * await queryInterface.bulkDelete('People', null, {});
         */
        await queryInterface.bulkDelete('users', null, {})
    }
}
