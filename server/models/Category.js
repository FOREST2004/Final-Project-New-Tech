import { DataTypes } from 'sequelize';

const CategoryModel = (sequelize) => {
  const Category = sequelize.define('Category', {
    category_id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    name: {
      type: DataTypes.STRING(100),
      allowNull: false,
      validate: {
        notEmpty: true,
        len: [1, 100]
      }
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    created_at: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW
    }
  }, {
    tableName: 'categories',
    timestamps: false
  });

  // Associations
  Category.associate = (models) => {
    Category.hasMany(models.Product, {
      foreignKey: 'category_id',
      as: 'products'
    });
  };

  return Category;
};

export default CategoryModel;