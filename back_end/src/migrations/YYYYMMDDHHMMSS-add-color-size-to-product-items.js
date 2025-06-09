'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('ProductItems', 'color', {
      type: Sequelize.STRING,
      allowNull: true
    });
    await queryInterface.addColumn('ProductItems', 'size', {
      type: Sequelize.STRING,
      allowNull: true
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('ProductItems', 'color');
    await queryInterface.removeColumn('ProductItems', 'size');
  }
}; 