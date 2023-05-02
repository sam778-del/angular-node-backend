'use strict';

const permissions = [
  { name: 'Place new orders, view and edit own files', createdAt: new Date(), updatedAt: new Date() },
  { name: 'View and edit all files placed by anyone on the shared account', createdAt: new Date(), updatedAt: new Date() },
  { name: 'View, add, and remove teammates', createdAt: new Date(), updatedAt: new Date() },
  { name: 'Promote Users to Manager', createdAt: new Date(), updatedAt: new Date() },
  { name: 'View billing and transaction history', createdAt: new Date(), updatedAt: new Date() },
  { name: 'Change billing', createdAt: new Date(), updatedAt: new Date() }
];

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.bulkInsert('Permissions', permissions, {});
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('Permissions', null, {});
  }
};
