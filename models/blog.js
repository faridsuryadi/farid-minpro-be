'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Blog extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Blog.belongsTo(models.User)
      Blog.belongsTo(models.Kategori)
      Blog.hasOne(models.Likes)
    }
  }
  Blog.init({
    judul: {
      type: DataTypes.STRING(500),
      allowNull: true,
    },
    imgBlog: {
      type: DataTypes.STRING,
      allowNull: true,

    },
    konten: {
      type: DataTypes.TEXT,
      allowNull: true,

    },
    link: {
      type: DataTypes.STRING,
      allowNull: true,
      
    },
    keyword: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    negara: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    isDeleted: {
      type: DataTypes.BOOLEAN,
    },
  }, {
    sequelize,
    modelName: 'Blog',
  });
  return Blog;
};