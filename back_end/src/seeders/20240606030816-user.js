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
        const roles = await queryInterface.sequelize.query('SELECT name FROM roles;')
        const rolesRows = roles[0]
        await queryInterface.bulkInsert(
            'users',
            [
                {
                    name: 'Admin',
                    email: 'admin@gmail.com',
                    password: bcrypt.hashSync('123456'),
                    role: rolesRows.find((role) => role.name === 'Admin').name,
                    verified: true,
                    createdAt: new Date(),
                    updatedAt: new Date()
                },
                
                {
                    name: 'Customer',
                    email: 'customer@gmail.com',
                    password: bcrypt.hashSync('123456'),
                    role: rolesRows.find((role) => role.name === 'Customer').name,
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
