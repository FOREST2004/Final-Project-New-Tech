import { useState, useEffect } from 'react';

const AdminProductForm = ({ 
  productForm, 
  setProductForm, 
  categories, 
  onSubmit, 
  editingProduct, 
  onCancel, 
  loading 
}) => {
  const handleInputChange = (e) => {
    const { name, value, type } = e.target;
    setProductForm(prev => ({
      ...prev,
      [name]: type === 'number' ? parseFloat(value) || 0 : value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit();
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h3 className="text-lg font-semibold text-gray-800 mb-4">
        {editingProduct ? 'Chỉnh sửa sản phẩm' : 'Thêm sản phẩm mới'}
      </h3>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
              Tên sản phẩm *
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={productForm.name}
              onChange={handleInputChange}
              required
              disabled={loading}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:opacity-50"
              placeholder="Nhập tên sản phẩm"
            />
          </div>

          <div>
            <label htmlFor="category_id" className="block text-sm font-medium text-gray-700 mb-1">
              Danh mục *
            </label>
            <select
              id="category_id"
              name="category_id"
              value={productForm.category_id}
              onChange={handleInputChange}
              required
              disabled={loading}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:opacity-50"
            >
              <option value="">Chọn danh mục</option>
              {categories.map(category => (
                <option key={category.category_id} value={category.category_id}>
                  {category.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div>
          <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
            Mô tả
          </label>
          <textarea
            id="description"
            name="description"
            value={productForm.description}
            onChange={handleInputChange}
            disabled={loading}
            rows={3}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:opacity-50"
            placeholder="Nhập mô tả sản phẩm"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="price" className="block text-sm font-medium text-gray-700 mb-1">
              Giá (VNĐ) *
            </label>
            <input
              type="number"
              id="price"
              name="price"
              value={productForm.price}
              onChange={handleInputChange}
              required
              min="0"
              step="1000"
              disabled={loading}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:opacity-50"
              placeholder="0"
            />
          </div>

          <div>
            <label htmlFor="stock_quantity" className="block text-sm font-medium text-gray-700 mb-1">
              Số lượng tồn kho *
            </label>
            <input
              type="number"
              id="stock_quantity"
              name="stock_quantity"
              value={productForm.stock_quantity}
              onChange={handleInputChange}
              required
              min="0"
              disabled={loading}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:opacity-50"
              placeholder="0"
            />
          </div>
        </div>

        <div>
          <label htmlFor="image_url" className="block text-sm font-medium text-gray-700 mb-1">
            URL hình ảnh
          </label>
          <input
            type="url"
            id="image_url"
            name="image_url"
            value={productForm.image_url}
            onChange={handleInputChange}
            disabled={loading}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:opacity-50"
            placeholder="https://example.com/image.jpg"
          />
        </div>

        <div className="flex gap-3 pt-4">
          <button
            type="submit"
            disabled={loading || !productForm.name.trim() || !productForm.category_id || !productForm.price}
            className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? (
              <div className="flex items-center justify-center">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                {editingProduct ? 'Đang cập nhật...' : 'Đang thêm...'}
              </div>
            ) : (
              editingProduct ? 'Cập nhật' : 'Thêm sản phẩm'
            )}
          </button>
          
          {editingProduct && (
            <button
              type="button"
              onClick={onCancel}
              disabled={loading}
              className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50"
            >
              Hủy
            </button>
          )}
        </div>
      </form>
    </div>
  );
};

export default AdminProductForm;