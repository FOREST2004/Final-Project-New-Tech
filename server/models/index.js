import { Sequelize } from 'sequelize';
import sequelize from '../database/database.js';
import UserModel from './User.js';
import CategoryModel from './Category.js';
import ProductModel from './Product.js';
import CartModel from './Cart.js';
import CartItemModel from './CartItem.js';
import MessageModel from './Message.js';

// Initialize models
const User = UserModel(sequelize);
const Category = CategoryModel(sequelize);
const Product = ProductModel(sequelize);
const Cart = CartModel(sequelize);
const CartItem = CartItemModel(sequelize);
const Message = MessageModel(sequelize);

// Define associations
const models = { User, Category, Product, Cart, CartItem, Message };

// Set up associations
Object.keys(models).forEach(modelName => {
  if (models[modelName].associate) {
    models[modelName].associate(models);
  }
});

// Export sequelize instance and models
export default {
  sequelize,
  Sequelize,
  ...models
};