'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Kategori extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Kategori.hasMany(models.Blog)
    }
  }
  Kategori.init({
    Kategori: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'Kategori',
    timestamps: false
  });
  return Kategori;
};