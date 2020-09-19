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
    return queryInterface.bulkInsert('Books', [
      {
      id: 1,
      book_name: "To Kill a Mockingbird",
      author_name : "Harper Lee",
      book_description : "There’s a reason why The Great Gatsby is commonly dubbed one of the greatest novels ever written"
      },
      {
        id: 2,
        book_name: "To Kill a Mockingbird",
        author_name : "Harper Lee",
        book_description : "There’s a reason why The Great Gatsby is commonly dubbed one of the greatest novels ever written"
      },
      {
        id: 3,
        book_name: "To Kill a Mockingbird",
        author_name : "Harper Lee",
        book_description : "There’s a reason why The Great Gatsby is commonly dubbed one of the greatest novels ever written"
      },
      {
        id: 4,
        book_name: "To Kill a Mockingbird",
        author_name : "Harper Lee",
        book_description : "There’s a reason why The Great Gatsby is commonly dubbed one of the greatest novels ever written"
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
    return queryInterface.bulkDelete('Books', null, {});
  }
};
