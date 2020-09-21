'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class StudentLogs extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  };
  StudentLogs.init({
    studentId: DataTypes.INTEGER,
    login_date: {
      type : DataTypes.DATEONLY,
    },
    login_time: {
      type : DataTypes.TIME,
      defaultValue : sequelize.fn('NOW')
    },
  }, {
    sequelize,
    modelName: 'StudentLogs',
  });
  return StudentLogs;
};