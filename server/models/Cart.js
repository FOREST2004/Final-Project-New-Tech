import { DataTypes } from 'sequelize';

const CartModel = (sequelize) => {
  const Cart = sequelize.define('Cart', {
    cart_id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'users',
        key: 'user_id'
      }
    },
    created_at: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW
    }
  }, {
    tableName: 'carts',
    timestamps: false
  });

  // Associations
  Cart.associate = (models) => {
    Cart.belongsTo(models.User, {
      foreignKey: 'user_id',
      as: 'user'
    });
    Cart.hasMany(models.CartItem, {
      foreignKey: 'cart_id',
      as: 'cart_items'
    });
  };

  return Cart;
};

export default CartModel;