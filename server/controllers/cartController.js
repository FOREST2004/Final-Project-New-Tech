import models from '../models/index.js';

const { Cart, CartItem, Product, Category } = models;

// Get user's cart
export const getCart = async (req, res) => {
  try {
    // Check if user is authenticated
    if (!req.user || !req.user.id) {
      return res.status(401).json({
        success: false,
        message: 'User not authenticated'
      });
    }
    
    const userId = req.user.id;

    // Find or create cart for user
    let cart = await Cart.findOne({
      where: { user_id: userId },
      include: [
        {
          model: CartItem,
          as: 'cart_items',
          include: [
            {
              model: Product,
              as: 'product',
              include: [
                {
                  model: Category,
                  as: 'category',
                  attributes: ['category_id', 'name']
                }
              ]
            }
          ]
        }
      ]
    });

    if (!cart) {
      cart = await Cart.create({ user_id: userId });
      cart.cart_items = [];
    }

    // Calculate total
    const total = cart.cart_items.reduce((sum, item) => {
      return sum + (parseFloat(item.product.price) * item.quantity);
    }, 0);

    res.json({
      success: true,
      data: {
        cart_id: cart.cart_id,
        items: cart.cart_items,
        total: total.toFixed(2),
        item_count: cart.cart_items.reduce((sum, item) => sum + item.quantity, 0)
      }
    });
  } catch (error) {
    console.error('Error fetching cart:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching cart',
      error: error.message
    });
  }
};

// Add item to cart
export const addToCart = async (req, res) => {
  try {
    const userId = req.user.id;
    const { product_id, quantity = 1 } = req.body;

    // Validation
    if (!product_id) {
      return res.status(400).json({
        success: false,
        message: 'Product ID is required'
      });
    }

    if (quantity <= 0) {
      return res.status(400).json({
        success: false,
        message: 'Quantity must be greater than 0'
      });
    }

    // Check if product exists and has enough stock
    const product = await Product.findByPk(product_id);
    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }

    if (product.stock_quantity < quantity) {
      return res.status(400).json({
        success: false,
        message: 'Not enough stock available'
      });
    }

    // Find or create cart
    let cart = await Cart.findOne({ where: { user_id: userId } });
    if (!cart) {
      cart = await Cart.create({ user_id: userId });
    }

    // Check if item already exists in cart
    let cartItem = await CartItem.findOne({
      where: {
        cart_id: cart.cart_id,
        product_id: product_id
      }
    });

    if (cartItem) {
      // Update quantity
      const newQuantity = cartItem.quantity + quantity;
      
      if (product.stock_quantity < newQuantity) {
        return res.status(400).json({
          success: false,
          message: 'Not enough stock available for this quantity'
        });
      }

      await cartItem.update({ quantity: newQuantity });
    } else {
      // Create new cart item
      cartItem = await CartItem.create({
        cart_id: cart.cart_id,
        product_id: product_id,
        quantity: quantity
      });
    }

    // Fetch updated cart item with product details
    const updatedCartItem = await CartItem.findByPk(cartItem.cart_item_id, {
      include: [
        {
          model: Product,
          as: 'product',
          include: [
            {
              model: Category,
              as: 'category',
              attributes: ['category_id', 'name']
            }
          ]
        }
      ]
    });

    res.json({
      success: true,
      message: 'Item added to cart successfully',
      data: updatedCartItem
    });
  } catch (error) {
    console.error('Error adding to cart:', error);
    res.status(500).json({
      success: false,
      message: 'Error adding item to cart',
      error: error.message
    });
  }
};

// Update cart item quantity
export const updateCartItem = async (req, res) => {
  try {
    const userId = req.user.id;
    const { cart_item_id } = req.params;
    const { quantity } = req.body;

    // Validation
    if (!quantity || quantity <= 0) {
      return res.status(400).json({
        success: false,
        message: 'Valid quantity is required'
      });
    }

    // Find cart item and verify ownership
    const cartItem = await CartItem.findOne({
      where: { cart_item_id },
      include: [
        {
          model: Cart,
          as: 'cart',
          where: { user_id: userId }
        },
        {
          model: Product,
          as: 'product'
        }
      ]
    });

    if (!cartItem) {
      return res.status(404).json({
        success: false,
        message: 'Cart item not found'
      });
    }

    // Check stock availability
    if (cartItem.product.stock_quantity < quantity) {
      return res.status(400).json({
        success: false,
        message: 'Not enough stock available'
      });
    }

    await cartItem.update({ quantity });

    // Fetch updated cart item with full details
    const updatedCartItem = await CartItem.findByPk(cart_item_id, {
      include: [
        {
          model: Product,
          as: 'product',
          include: [
            {
              model: Category,
              as: 'category',
              attributes: ['category_id', 'name']
            }
          ]
        }
      ]
    });

    res.json({
      success: true,
      message: 'Cart item updated successfully',
      data: updatedCartItem
    });
  } catch (error) {
    console.error('Error updating cart item:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating cart item',
      error: error.message
    });
  }
};

// Remove item from cart
export const removeFromCart = async (req, res) => {
  try {
    const userId = req.user.id;
    const { cart_item_id } = req.params;

    // Find cart item and verify ownership
    const cartItem = await CartItem.findOne({
      where: { cart_item_id },
      include: [
        {
          model: Cart,
          as: 'cart',
          where: { user_id: userId }
        }
      ]
    });

    if (!cartItem) {
      return res.status(404).json({
        success: false,
        message: 'Cart item not found'
      });
    }

    await cartItem.destroy();

    res.json({
      success: true,
      message: 'Item removed from cart successfully'
    });
  } catch (error) {
    console.error('Error removing from cart:', error);
    res.status(500).json({
      success: false,
      message: 'Error removing item from cart',
      error: error.message
    });
  }
};

// Clear cart
export const clearCart = async (req, res) => {
  try {
    const userId = req.user.id;

    const cart = await Cart.findOne({ where: { user_id: userId } });

    if (!cart) {
      return res.status(404).json({
        success: false,
        message: 'Cart not found'
      });
    }

    await CartItem.destroy({ where: { cart_id: cart.cart_id } });

    res.json({
      success: true,
      message: 'Cart cleared successfully'
    });
  } catch (error) {
    console.error('Error clearing cart:', error);
    res.status(500).json({
      success: false,
      message: 'Error clearing cart',
      error: error.message
    });
  }
};