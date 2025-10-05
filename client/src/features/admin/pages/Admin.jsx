import React, { useState, useEffect } from 'react';
import { categoryService, productService, apiClient, API_ENDPOINTS } from '../../../shared/services';
import Layout from '../../../shared/components/Layout';
import AdminDashboard from '../components/AdminDashboard';
import AdminCategoryForm from '../components/AdminCategoryForm';
import AdminCategoryTable from '../components/AdminCategoryTable';
import AdminProductForm from '../components/AdminProductForm';
import AdminProductTable from '../components/AdminProductTable';

const Admin = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Category form state
  const [categoryForm, setCategoryForm] = useState({
    name: '',
    description: ''
  });
  const [editingCategory, setEditingCategory] = useState(null);

  // Product form state
  const [productForm, setProductForm] = useState({
    name: '',
    description: '',
    price: '',
    stock_quantity: '',
    category_id: '',
    image_url: ''
  });
  const [editingProduct, setEditingProduct] = useState(null);

  useEffect(() => {
    fetchCategories();
    fetchProducts();
  }, []);

  const fetchCategories = async () => {
    try {
      setLoading(true);
      setError('');
      const response = await categoryService.getCategories();
      setCategories(response || []);
    } catch (error) {
      setError('Lỗi khi tải danh mục');
      console.error('Error fetching categories:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchProducts = async () => {
    try {
      setLoading(true);
      setError('');
      const response = await productService.getProducts();
      setProducts(response || []);
    } catch (error) {
      setError('Lỗi khi tải sản phẩm');
      console.error('Error fetching products:', error);
    } finally {
      setLoading(false);
    }
  };

  // Category CRUD
  const handleCategorySubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (editingCategory) {
        await apiClient.put(`${API_ENDPOINTS.CATEGORIES}/${editingCategory.category_id}`, categoryForm);
      } else {
        await apiClient.post(API_ENDPOINTS.CATEGORIES, categoryForm);
      }
      setCategoryForm({ name: '', description: '' });
      setEditingCategory(null);
      fetchCategories();
      setError('');
    } catch (error) {
      setError('Lỗi khi lưu danh mục');
      console.error('Error saving category:', error);
    }
    setLoading(false);
  };

  const editCategory = (category) => {
    setCategoryForm({
      name: category.name,
      description: category.description || ''
    });
    setEditingCategory(category);
  };

  const cancelCategoryEdit = () => {
    setCategoryForm({ name: '', description: '' });
    setEditingCategory(null);
  };

  const deleteCategory = async (id) => {
    if (window.confirm('Bạn có chắc muốn xóa danh mục này?')) {
      try {
        await apiClient.delete(`${API_ENDPOINTS.CATEGORIES}/${id}`);
        fetchCategories();
        setError('');
      } catch (error) {
        setError('Lỗi khi xóa danh mục');
        console.error('Error deleting category:', error);
      }
    }
  };

  // Product CRUD
  const handleProductSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const productData = {
        ...productForm,
        price: parseFloat(productForm.price),
        stock_quantity: parseInt(productForm.stock_quantity),
        category_id: parseInt(productForm.category_id)
      };

      if (editingProduct) {
        await apiClient.put(`${API_ENDPOINTS.PRODUCTS}/${editingProduct.product_id}`, productData);
      } else {
        await apiClient.post(API_ENDPOINTS.PRODUCTS, productData);
      }
      
      setProductForm({
        name: '',
        description: '',
        price: '',
        stock_quantity: '',
        category_id: '',
        image_url: ''
      });
      setEditingProduct(null);
      fetchProducts();
      setError('');
    } catch (error) {
      setError('Lỗi khi lưu sản phẩm');
      console.error('Error saving product:', error);
    }
    setLoading(false);
  };

  const editProduct = (product) => {
    setProductForm({
      name: product.name,
      description: product.description || '',
      price: product.price.toString(),
      stock_quantity: product.stock_quantity.toString(),
      category_id: product.category_id.toString(),
      image_url: product.image_url || ''
    });
    setEditingProduct(product);
  };

  const cancelProductEdit = () => {
    setProductForm({
      name: '',
      description: '',
      price: '',
      stock_quantity: '',
      category_id: '',
      image_url: ''
    });
    setEditingProduct(null);
  };

  const deleteProduct = async (id) => {
    if (window.confirm('Bạn có chắc muốn xóa sản phẩm này?')) {
      try {
        await apiClient.delete(`${API_ENDPOINTS.PRODUCTS}/${id}`);
        fetchProducts();
        setError('');
      } catch (error) {
        setError('Lỗi khi xóa sản phẩm');
        console.error('Error deleting product:', error);
      }
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-6 sm:py-8">
        {/* Header */}
        <div className="mb-6 sm:mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-2">
            Quản trị hệ thống
          </h1>
          <p className="text-gray-600 text-sm sm:text-base">
            Quản lý sản phẩm, danh mục và theo dõi hoạt động
          </p>
        </div>

        {/* Error Display */}
        {error && (
          <div className="mb-6 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
            <div className="flex items-center">
              <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
              {error}
            </div>
          </div>
        )}

        {/* Success Display */}
        {success && (
          <div className="mb-6 bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg">
            <div className="flex items-center">
              <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              {success}
            </div>
          </div>
        )}

        {/* Navigation Tabs */}
        <div className="mb-6 sm:mb-8">
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex space-x-4 sm:space-x-8 overflow-x-auto">
              {[
                { id: 'dashboard', label: 'Dashboard', icon: '📊' },
                { id: 'categories', label: 'Danh mục', icon: '📁' },
                { id: 'products', label: 'Sản phẩm', icon: '🛍️' }
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`whitespace-nowrap py-2 px-1 border-b-2 font-medium text-sm sm:text-base transition-colors duration-200 ${
                    activeTab === tab.id
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <span className="inline-flex items-center">
                    <span className="mr-2">{tab.icon}</span>
                    <span className="hidden sm:inline">{tab.label}</span>
                    <span className="sm:hidden">{tab.label.split(' ')[0]}</span>
                  </span>
                </button>
              ))}
            </nav>
          </div>
        </div>

        {/* Tab Content */}
        <div className="space-y-6">
          {activeTab === 'dashboard' && (
            <AdminDashboard 
              products={products}
              categories={categories}
              loading={loading}
            />
          )}

          {activeTab === 'categories' && (
            <div className="space-y-6">
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 sm:p-6">
                <h2 className="text-lg sm:text-xl font-semibold text-gray-800 mb-4 sm:mb-6">
                  {editingCategory ? 'Chỉnh sửa danh mục' : 'Thêm danh mục mới'}
                </h2>
                <AdminCategoryForm
                  category={editingCategory}
                  onSubmit={editingCategory ? handleUpdateCategory : handleAddCategory}
                  onCancel={() => setEditingCategory(null)}
                  loading={loading}
                />
              </div>

              <div className="bg-white rounded-lg shadow-sm border border-gray-200">
                <div className="p-4 sm:p-6 border-b border-gray-200">
                  <h2 className="text-lg sm:text-xl font-semibold text-gray-800">
                    Danh sách danh mục
                  </h2>
                </div>
                <AdminCategoryTable
                  categories={categories}
                  onEdit={setEditingCategory}
                  onDelete={handleDeleteCategory}
                  loading={loading}
                />
              </div>
            </div>
          )}

          {activeTab === 'products' && (
            <div className="space-y-6">
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 sm:p-6">
                <h2 className="text-lg sm:text-xl font-semibold text-gray-800 mb-4 sm:mb-6">
                  {editingProduct ? 'Chỉnh sửa sản phẩm' : 'Thêm sản phẩm mới'}
                </h2>
                <AdminProductForm
                  product={editingProduct}
                  categories={categories}
                  onSubmit={editingProduct ? handleUpdateProduct : handleAddProduct}
                  onCancel={() => setEditingProduct(null)}
                  loading={loading}
                />
              </div>

              <div className="bg-white rounded-lg shadow-sm border border-gray-200">
                <div className="p-4 sm:p-6 border-b border-gray-200">
                  <h2 className="text-lg sm:text-xl font-semibold text-gray-800">
                    Danh sách sản phẩm
                  </h2>
                </div>
                <AdminProductTable
                  products={products}
                  categories={categories}
                  onEdit={setEditingProduct}
                  onDelete={handleDeleteProduct}
                  loading={loading}
                />
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Admin;