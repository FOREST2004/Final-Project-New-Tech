import models from '../models/index.js';

const { Product, Category } = models;

// Get all products (for users and admin)
export const getAllProducts = async (req, res) => {
  try {
    const { page = 1, limit = 1000, category_id, search } = req.query;
    const offset = (page - 1) * limit;

    const whereClause = {};
    
    // Filter by category if provided
    if (category_id) {
      whereClause.category_id = category_id;
    }

    // Search by name if provided
    if (search) {
      whereClause.name = {
        [models.Sequelize.Op.iLike]: `%${search}%`
      };
    }

    const { count, rows: products } = await Product.findAndCountAll({
      where: whereClause,
      include: [
        {
          model: Category,
          as: 'category',
          attributes: ['category_id', 'name']
        }
      ],
      limit: parseInt(limit),
      offset: parseInt(offset),
      order: [['created_at', 'DESC']]
    });

    res.json({
      success: true,
      data: {
        products,
        pagination: {
          currentPage: parseInt(page),
          totalPages: Math.ceil(count / limit),
          totalItems: count,
          itemsPerPage: parseInt(limit)
        }
      }
    });
  } catch (error) {
    console.error('Error fetching products:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching products',
      error: error.message
    });
  }
};

// Get product by ID
export const getProductById = async (req, res) => {
  try {
    const { id } = req.params;

    const product = await Product.findByPk(id, {
      include: [
        {
          model: Category,
          as: 'category',
          attributes: ['category_id', 'name', 'description']
        }
      ]
    });

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }

    res.json({
      success: true,
      data: product
    });
  } catch (error) {
    console.error('Error fetching product:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching product',
      error: error.message
    });
  }
};

// Create new product (Admin only)
export const createProduct = async (req, res) => {
  try {
    const { name, description, price, stock_quantity, category_id, image_url } = req.body;

    // Validation
    if (!name || !price) {
      return res.status(400).json({
        success: false,
        message: 'Name and price are required'
      });
    }

    // Check if category exists
    if (category_id) {
      const category = await Category.findByPk(category_id);
      if (!category) {
        return res.status(400).json({
          success: false,
          message: 'Category not found'
        });
      }
    }

    const newProduct = await Product.create({
      name,
      description,
      price,
      stock_quantity: stock_quantity || 0,
      category_id,
      image_url
    });

    // Fetch the created product with category details
    const productWithCategory = await Product.findByPk(newProduct.product_id, {
      include: [
        {
          model: Category,
          as: 'category',
          attributes: ['category_id', 'name']
        }
      ]
    });

    res.status(201).json({
      success: true,
      message: 'Product created successfully',
      data: productWithCategory
    });
  } catch (error) {
    console.error('Error creating product:', error);
    
    if (error.name === 'SequelizeValidationError') {
      return res.status(400).json({
        success: false,
        message: 'Validation error',
        errors: error.errors.map(err => ({
          field: err.path,
          message: err.message
        }))
      });
    }

    res.status(500).json({
      success: false,
      message: 'Error creating product',
      error: error.message
    });
  }
};

// Update product (Admin only)
export const updateProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description, price, stock_quantity, category_id, image_url } = req.body;

    const product = await Product.findByPk(id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }

    // Check if category exists (if being updated)
    if (category_id && category_id !== product.category_id) {
      const category = await Category.findByPk(category_id);
      if (!category) {
        return res.status(400).json({
          success: false,
          message: 'Category not found'
        });
      }
    }

    await product.update({
      name: name || product.name,
      description: description !== undefined ? description : product.description,
      price: price || product.price,
      stock_quantity: stock_quantity !== undefined ? stock_quantity : product.stock_quantity,
      category_id: category_id || product.category_id,
      image_url: image_url !== undefined ? image_url : product.image_url
    });

    // Fetch updated product with category
    const updatedProduct = await Product.findByPk(id, {
      include: [
        {
          model: Category,
          as: 'category',
          attributes: ['category_id', 'name']
        }
      ]
    });

    res.json({
      success: true,
      message: 'Product updated successfully',
      data: updatedProduct
    });
  } catch (error) {
    console.error('Error updating product:', error);
    
    if (error.name === 'SequelizeValidationError') {
      return res.status(400).json({
        success: false,
        message: 'Validation error',
        errors: error.errors.map(err => ({
          field: err.path,
          message: err.message
        }))
      });
    }

    res.status(500).json({
      success: false,
      message: 'Error updating product',
      error: error.message
    });
  }
};

// Delete product (Admin only)
export const deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;

    const product = await Product.findByPk(id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }

    await product.destroy();

    res.json({
      success: true,
      message: 'Product deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting product:', error);
    res.status(500).json({
      success: false,
      message: 'Error deleting product',
      error: error.message
    });
  }
};