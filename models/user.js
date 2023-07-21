'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      User.hasMany(models.Blog)
      User.hasMany(models.Likes)
    }
  }
  User.init({
    username: {
      type : DataTypes.STRING,
      unique: true,
      allowNull : false
     },
     email: {
       type : DataTypes.STRING,
       unique : true,
       allowNull : false
       
     },
     phone: {
      type : DataTypes.STRING,
      unique : true,
      allowNull : false
      
    },
    imgProfile: {
      type : DataTypes.STRING,
    },
     password: {
       type : DataTypes.STRING
     },
     isVerified: {
       type : DataTypes.BOOLEAN,
       defaultValue : false
     },
     token: {
      type: DataTypes.STRING,
     }
  }, {
    sequelize,
    modelName: 'User',
  });
  return User;
};