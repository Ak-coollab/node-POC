'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    /**
     * Add seed commands here.
     *
     * Example:
     * await queryInterface.bulkInsert('People', [{
     *   name: 'John Doe',
     *   isBetaMember: false
     * }], {});
    */
    return queryInterface.bulkInsert('Classes', [
      {
       id: 1,
       class: "I"
      },
      {
        id: 2,
        class: "II"
      },
      {
        id: 3,
        class: "III"
      },
      {
        id: 4,
        class: "IV"
      },
      {
        id: 5,
        class: "V"
      },
      {
        id: 6,
        class: "VI"
      },
      {
        id: 7,
        class: "VII"
      },
      {
        id: 8,
        class: "VIII"
      },
      {
        id: 9,
        class: "IX"
      },
      {
        id: 10,
        class: "X"
      }
    ], {});
  },

  down: async (queryInterface, Sequelize) => {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
    return queryInterface.bulkDelete('Classes', null, {});
  }
};
