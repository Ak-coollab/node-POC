'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('Books_Issueds', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      issue_date: {
        type: Sequelize.DATE
      },
      due_date: {
        type: Sequelize.DATE
      },
      bookId: {
        type: Sequelize.INTEGER,
        // references: {
        //   model: 'Books',
        //   key: 'id'
        // },
        // onUpdate: 'cascade',
        // onDelete: 'cascade'
      },
      userId: {
        type: Sequelize.INTEGER,
        // references: {
        //   model: 'Users',
        //   key: 'id'
        // },
        // onUpdate: 'cascade',
        // onDelete: 'cascade'
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('Books_Issueds');
  }
};