import { useState, useEffect, useCallback } from 'react';

const SearchBar = ({ onSearch, placeholder = "Tìm kiếm sản phẩm...", isLoading = false }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [isFocused, setIsFocused] = useState(false);

  // Debounce search term - CHỈ phụ thuộc vào searchTerm
  useEffect(() => {
    const timer = setTimeout(() => {
      if (onSearch) {
        onSearch(searchTerm);
      }
    }, 500);

    return () => clearTimeout(timer);
  }, [searchTerm]); // Loại bỏ onSearch khỏi dependency array

  const handleClear = () => {
    setSearchTerm('');
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
      <div className="p-4">
        <div className={`relative transition-all duration-200 ${
          isFocused ? 'transform scale-105' : ''
        }`}>
          {/* Search Icon */}
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
            <div className={`transition-all duration-200 ${
              isLoading ? 'animate-spin' : ''
            }`}>
              <svg 
                className={`h-5 w-5 transition-colors duration-200 ${
                  isLoading ? 'text-blue-500' : 
                  isFocused ? 'text-blue-600' : 'text-gray-400'
                }`} 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                {isLoading ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                )}
              </svg>
            </div>
          </div>

          {/* Search Input */}
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            placeholder={placeholder}
            disabled={isLoading}
            className={`w-full pl-12 pr-12 py-4 border-2 rounded-xl transition-all duration-200 text-sm sm:text-base ${
              isFocused 
                ? 'border-blue-500 ring-4 ring-blue-100 shadow-lg' 
                : 'border-gray-200 hover:border-gray-300'
            } ${
              isLoading 
                ? 'opacity-50 cursor-not-allowed bg-gray-50' 
                : 'bg-white'
            } focus:outline-none`}
          />

          {/* Clear Button */}
          {searchTerm && (
            <button
              type="button"
              onClick={handleClear}
              disabled={isLoading}
              className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-red-500 disabled:opacity-50 transition-colors duration-200 group"
            >
              <div className="p-1 rounded-full group-hover:bg-red-50 transition-colors duration-200">
                <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </div>
            </button>
          )}
        </div>

        {/* Search Status */}
        {searchTerm && (
          <div className="mt-3 flex items-center justify-between">
            <div className="text-sm text-gray-600">
              {isLoading ? (
                <div className="flex items-center">
                  <div className="animate-spin rounded-full h-4 w-4 border-2 border-blue-600 border-t-transparent mr-2"></div>
                  <span>Đang tìm kiếm...</span>
                </div>
              ) : (
                <div className="flex items-center">
                  <svg className="w-4 h-4 mr-2 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span>Tìm kiếm: "<strong className="text-blue-600">{searchTerm}</strong>"</span>
                </div>
              )}
            </div>
            
            {/* Search suggestions or quick actions */}
            <div className="flex items-center space-x-2">
              <span className="text-xs text-gray-400">Enter để tìm</span>
            </div>
          </div>
        )}

        {/* Search Tips */}
        {!searchTerm && !isLoading && (
          <div className="mt-3 text-xs text-gray-500">
            <div className="flex items-center space-x-4">
              <span>💡 Mẹo: Thử tìm "cá", "thực vật", "đèn LED"</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SearchBar;