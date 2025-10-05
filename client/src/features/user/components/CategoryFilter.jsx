const CategoryFilter = ({ categories, selectedCategory, onCategoryChange, loading }) => {
  const handleCategoryClick = (categoryId) => {
    onCategoryChange(categoryId);
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
      <div className="p-4 bg-gradient-to-r from-blue-50 to-indigo-50 border-b border-gray-200">
        <h3 className="text-lg font-semibold text-gray-800 flex items-center">
          <svg className="w-5 h-5 mr-2 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14-7l2 2-2 2m0 8l2 2-2 2" />
          </svg>
          Danh mục sản phẩm
        </h3>
      </div>
      
      <div className="p-4">
        <div className="space-y-2">
          <button
            onClick={() => handleCategoryClick('')}
            disabled={loading}
            className={`w-full text-left px-4 py-3 rounded-lg transition-all duration-200 flex items-center justify-between group ${
              selectedCategory === ''
                ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-md'
                : 'bg-gray-50 text-gray-700 hover:bg-gray-100 hover:shadow-sm'
            } ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            <div className="flex items-center">
              <svg className={`w-4 h-4 mr-3 ${selectedCategory === '' ? 'text-white' : 'text-gray-500'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14-7l2 2-2 2m0 8l2 2-2 2" />
              </svg>
              <span className="font-medium">Tất cả sản phẩm</span>
            </div>
            {selectedCategory === '' && (
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            )}
          </button>
          
          {categories.map((category) => {
            const isSelected = Number(selectedCategory) === Number(category.category_id);
            
            return (
              <button
                key={category.category_id}
                onClick={() => handleCategoryClick(category.category_id)}
                disabled={loading}
                className={`w-full text-left px-4 py-3 rounded-lg transition-all duration-200 flex items-center justify-between group ${
                  isSelected
                    ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-md'
                    : 'bg-gray-50 text-gray-700 hover:bg-gray-100 hover:shadow-sm'
                } ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
              >
                <div className="flex items-center">
                  <div className={`w-3 h-3 rounded-full mr-3 ${
                    isSelected 
                      ? 'bg-white' 
                      : 'bg-blue-400'
                  }`}></div>
                  <div className="flex flex-col">
                    <span className="font-medium">{category.name}</span>
                    {category.description && (
                      <span className={`text-xs ${
                        isSelected 
                          ? 'text-blue-100' 
                          : 'text-gray-500'
                      }`}>
                        {category.description}
                      </span>
                    )}
                  </div>
                </div>
                
                <div className="flex items-center space-x-2">
                  {category.product_count !== undefined && (
                    <span className={`text-xs px-2 py-1 rounded-full font-medium ${
                      isSelected 
                        ? 'bg-white bg-opacity-20 text-white' 
                        : 'bg-blue-100 text-blue-600'
                    }`}>
                      {category.product_count}
                    </span>
                  )}
                  {isSelected && (
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  )}
                </div>
              </button>
            );
          })}
        </div>
        
        {loading && (
          <div className="mt-4 flex items-center justify-center py-4">
            <div className="animate-spin rounded-full h-6 w-6 border-2 border-blue-600 border-t-transparent mr-3"></div>
            <span className="text-sm text-gray-600">Đang tải danh mục...</span>
          </div>
        )}
        
        {!loading && categories.length === 0 && (
          <div className="mt-4 text-center py-8">
            <svg className="w-12 h-12 mx-auto text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14-7l2 2-2 2m0 8l2 2-2 2" />
            </svg>
            <p className="text-gray-500 text-sm">Không có danh mục nào</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default CategoryFilter;