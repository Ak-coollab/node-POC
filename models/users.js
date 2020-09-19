'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Users extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Users.belongsToMany(models.role, { through: 'user_roles', foreignKey: 'userId', otherKey: 'roleId'});
    }
  };
  Users.init({
    // id: {
    //   type: DataTypes.INTEGER,
    //   primaryKey: true,
    // },
    name: DataTypes.STRING,
    username: DataTypes.STRING,
    email: DataTypes.STRING,
    password: DataTypes.STRING,
    image: DataTypes.STRING,
    base64Content: DataTypes.BLOB
  }, {
    sequelize,
    modelName: 'Users',
    tableName : 'users'
  });
  return Users;
};