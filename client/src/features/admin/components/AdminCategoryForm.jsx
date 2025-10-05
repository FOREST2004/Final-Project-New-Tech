import { useState } from 'react';

const AdminCategoryForm = ({ 
  categoryForm, 
  setCategoryForm, 
  onSubmit, 
  editingCategory, 
  onCancel, 
  loading 
}) => {
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCategoryForm(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(e);
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h3 className="text-lg font-semibold text-gray-800 mb-4">
        {editingCategory ? 'Chỉnh sửa danh mục' : 'Thêm danh mục mới'}
      </h3>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
            Tên danh mục *
          </label>
          <input
            type="text"
            id="name"
            name="name"
            value={categoryForm.name}
            onChange={handleInputChange}
            required
            disabled={loading}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:opacity-50"
            placeholder="Nhập tên danh mục"
          />
        </div>

        <div>
          <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
            Mô tả
          </label>
          <textarea
            id="description"
            name="description"
            value={categoryForm.description}
            onChange={handleInputChange}
            disabled={loading}
            rows={3}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:opacity-50"
            placeholder="Nhập mô tả danh mục"
          />
        </div>

        <div className="flex gap-3 pt-4">
          <button
            type="submit"
            disabled={loading || !categoryForm.name.trim()}
            className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? (
              <div className="flex items-center justify-center">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                {editingCategory ? 'Đang cập nhật...' : 'Đang thêm...'}
              </div>
            ) : (
              editingCategory ? 'Cập nhật' : 'Thêm danh mục'
            )}
          </button>
          
          {editingCategory && (
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

export default AdminCategoryForm;