'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Books_Issued extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Books_Issued.belongsTo(models.Books, {
        as: 'books',
        foreignKey: 'bookId',
        onDelete: 'CASCADE',
      });

      Books_Issued.belongsTo(models.Users, {
        as: 'user',
        foreignKey: 'userId',
        onDelete: 'CASCADE',
      });
    }
  };
  Books_Issued.init({
    issue_date: DataTypes.DATE,
    due_date: DataTypes.DATE,
    bookId: DataTypes.INTEGER,
    userId: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'Books_Issued',
  });
  return Books_Issued;
};