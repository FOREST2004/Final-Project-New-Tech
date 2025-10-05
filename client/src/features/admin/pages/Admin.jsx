import React, { useState, useEffect } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import { categoryService, productService, apiClient, API_ENDPOINTS } from '../../../shared/services';
import { useAuth } from '../../../shared/context/AuthContext';
import Layout from '../../../shared/components/Layout';
import AdminDashboard from '../components/AdminDashboard';
import AdminCategoryForm from '../components/AdminCategoryForm';
import AdminCategoryTable from '../components/AdminCategoryTable';
import AdminProductForm from '../components/AdminProductForm';
import AdminProductTable from '../components/AdminProductTable';
import ConfirmDialog from '../../../shared/components/ConfirmDialog';

const Admin = () => {
  const { user, loading: authLoading, logout } = useAuth();
  const navigate = useNavigate();
  
  // Redirect if not admin
  if (!authLoading && (!user || user.role !== 'admin')) {
    return <Navigate to="/login" replace />;
  }

  // Show loading while checking auth
  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  const [activeTab, setActiveTab] = useState('dashboard');
  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

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

  // Confirmation dialog state
  const [confirmDialog, setConfirmDialog] = useState({
    isOpen: false,
    type: 'category', // 'category' | 'product'
    id: null,
    title: '',
    message: ''
  });

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
  const handleCategorySubmit = async () => {
    setLoading(true);
    setError('');
    setSuccess('');

    // Client-side validation
    if (!categoryForm.name.trim()) {
      setError('Tên danh mục không được để trống');
      setLoading(false);
      return;
    }

    try {
      if (editingCategory) {
        await categoryService.updateCategory(editingCategory.category_id, categoryForm);
        setSuccess('Cập nhật danh mục thành công');
      } else {
        await categoryService.createCategory(categoryForm);
        setSuccess('Thêm danh mục thành công');
      }
      setCategoryForm({ name: '', description: '' });
      setEditingCategory(null);
      fetchCategories();
    } catch (error) {
      console.error('Error saving category:', error);
      if (error.response?.data?.message) {
        setError(error.response.data.message);
      } else {
        setError(editingCategory ? 'Lỗi khi cập nhật danh mục' : 'Lỗi khi thêm danh mục');
      }
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

  const handleDeleteCategory = (id) => {
    const category = categories.find(cat => cat.category_id === id);
    setConfirmDialog({
      isOpen: true,
      type: 'category',
      id: id,
      title: 'Xóa danh mục',
      message: `Bạn có chắc chắn muốn xóa danh mục "${category?.name}"? Hành động này không thể hoàn tác.`
    });
  };

  const deleteCategory = async (id) => {
    try {
      await categoryService.deleteCategory(id);
      fetchCategories();
      setError('');
      setSuccess('Xóa danh mục thành công');
    } catch (error) {
      setError('Lỗi khi xóa danh mục');
      console.error('Error deleting category:', error);
    }
  };

  // Product CRUD
  const handleProductSubmit = async () => {
    setLoading(true);
    setError('');
    setSuccess('');

    // Client-side validation
    if (!productForm.name.trim()) {
      setError('Tên sản phẩm không được để trống');
      setLoading(false);
      return;
    }

    if (!productForm.category_id) {
      setError('Vui lòng chọn danh mục');
      setLoading(false);
      return;
    }

    if (!productForm.price || parseFloat(productForm.price) <= 0) {
      setError('Giá sản phẩm phải lớn hơn 0');
      setLoading(false);
      return;
    }

    if (!productForm.stock_quantity || parseInt(productForm.stock_quantity) < 0) {
      setError('Số lượng tồn kho không được âm');
      setLoading(false);
      return;
    }

    try {
      const productData = {
        ...productForm,
        price: parseFloat(productForm.price),
        stock_quantity: parseInt(productForm.stock_quantity),
        category_id: parseInt(productForm.category_id)
      };

      if (editingProduct) {
        await productService.updateProduct(editingProduct.product_id, productData);
        setSuccess('Cập nhật sản phẩm thành công');
      } else {
        await productService.createProduct(productData);
        setSuccess('Thêm sản phẩm thành công');
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
    } catch (error) {
      console.error('Error saving product:', error);
      if (error.response?.data?.message) {
        setError(error.response.data.message);
      } else {
        setError(editingProduct ? 'Lỗi khi cập nhật sản phẩm' : 'Lỗi khi thêm sản phẩm');
      }
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

  const handleDeleteProduct = (id) => {
    const product = products.find(prod => prod.product_id === id);
    setConfirmDialog({
      isOpen: true,
      type: 'product',
      id: id,
      title: 'Xóa sản phẩm',
      message: `Bạn có chắc chắn muốn xóa sản phẩm "${product?.name}"? Hành động này không thể hoàn tác.`
    });
  };

  const deleteProduct = async (id) => {
    try {
      await productService.deleteProduct(id);
      fetchProducts();
      setError('');
      setSuccess('Xóa sản phẩm thành công');
    } catch (error) {
      setError('Lỗi khi xóa sản phẩm');
      console.error('Error deleting product:', error);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-6 sm:py-8">
        {/* Header */}
        <div className="mb-6 sm:mb-8">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-2">
                Quản trị hệ thống
              </h1>
              <p className="text-gray-600 text-sm sm:text-base">
                Quản lý sản phẩm, danh mục và theo dõi hoạt động
              </p>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-gray-600 text-sm">
                Xin chào, <span className="font-medium">{user?.username}</span>
              </span>
              <button
                onClick={handleLogout}
                className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg transition duration-200 text-sm font-medium flex items-center space-x-2"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                </svg>
                <span>Đăng xuất</span>
              </button>
            </div>
          </div>
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
              onNavigate={setActiveTab}
            />
          )}

          {activeTab === 'categories' && (
            <div className="space-y-6">
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 sm:p-6">
                <h2 className="text-lg sm:text-xl font-semibold text-gray-800 mb-4 sm:mb-6">
                  {editingCategory ? 'Chỉnh sửa danh mục' : 'Thêm danh mục mới'}
                </h2>
                <AdminCategoryForm
                  categoryForm={categoryForm}
                  setCategoryForm={setCategoryForm}
                  onSubmit={handleCategorySubmit}
                  onCancel={cancelCategoryEdit}
                  loading={loading}
                  editingCategory={editingCategory}
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
                  onEdit={editCategory}
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
                  productForm={productForm}
                  setProductForm={setProductForm}
                  categories={categories}
                  onSubmit={handleProductSubmit}
                  onCancel={cancelProductEdit}
                  loading={loading}
                  editingProduct={editingProduct}
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
                  onEdit={editProduct}
                  onDelete={handleDeleteProduct}
                  loading={loading}
                />
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Confirmation Dialog */}
      <ConfirmDialog
        isOpen={confirmDialog.isOpen}
        onClose={() => setConfirmDialog({ ...confirmDialog, isOpen: false })}
        onConfirm={() => {
          if (confirmDialog.type === 'category') {
            deleteCategory(confirmDialog.id);
          } else if (confirmDialog.type === 'product') {
            deleteProduct(confirmDialog.id);
          }
          setConfirmDialog({ ...confirmDialog, isOpen: false });
        }}
        title={confirmDialog.title}
        message={confirmDialog.message}
        confirmText="Xóa"
        cancelText="Hủy"
        type="danger"
      />
    </div>
  );
};

export default Admin;