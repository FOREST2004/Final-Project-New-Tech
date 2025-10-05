const ProductCard = ({ product, onAddToCart, isLoading }) => {
  return (
    <div className="group bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 border border-gray-100 flex flex-col h-full">
      <div className="relative overflow-hidden">
        <img
          src={product.image_url || '/placeholder-image.jpg'}
          alt={product.name}
          className="w-full h-56 object-cover group-hover:scale-110 transition-transform duration-500"
        />
        
        {/* Stock Status Overlay */}
        {product.stock_quantity === 0 && (
          <div className="absolute inset-0 bg-black bg-opacity-60 flex items-center justify-center">
            <div className="bg-red-500 text-white px-4 py-2 rounded-full font-bold text-sm">
              Hết hàng
            </div>
          </div>
        )}
        
        {/* Discount Badge */}
        {product.discount && (
          <div className="absolute top-4 left-4 bg-red-500 text-white px-3 py-1 rounded-full text-xs font-bold">
            -{product.discount}%
          </div>
        )}
        
        {/* Category Badge */}
        {product.category && (
          <div className="absolute top-4 right-4 bg-white bg-opacity-90 backdrop-blur-sm text-gray-700 px-3 py-1 rounded-full text-xs font-medium">
            {product.category.name}
          </div>
        )}
      </div>
      
      <div className="p-6 flex flex-col flex-grow">
        {/* Product Name */}
        <h3 className="text-lg font-bold text-gray-900 mb-2 line-clamp-2 group-hover:text-blue-600 transition-colors">
          {product.name}
        </h3>
        
        {/* Product Description */}
        <p className="text-gray-600 text-sm mb-4 line-clamp-3 leading-relaxed flex-grow">
          {product.description}
        </p>
        
        {/* Price and Stock Info */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex flex-col">
            <span className="text-2xl font-bold text-blue-600">
              {new Intl.NumberFormat('vi-VN', {
                style: 'currency',
                currency: 'VND'
              }).format(product.price)}
            </span>
            {product.original_price && product.original_price > product.price && (
              <span className="text-sm text-gray-400 line-through">
                {new Intl.NumberFormat('vi-VN', {
                  style: 'currency',
                  currency: 'VND'
                }).format(product.original_price)}
              </span>
            )}
          </div>
          
          {product.stock_quantity > 0 && (
            <div className="text-right">
              <div className="text-sm text-gray-500">Còn lại</div>
              <div className="text-lg font-semibold text-green-600">
                {product.stock_quantity}
              </div>
            </div>
          )}
        </div>
        
        {/* Add to Cart Button - Fixed at bottom */}
        <div className="mt-auto">
          <button
            onClick={() => onAddToCart(product)}
            disabled={product.stock_quantity === 0 || isLoading}
            className={`w-full py-3 px-4 rounded-xl font-semibold transition-all duration-200 transform ${
              product.stock_quantity === 0 || isLoading
                ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
                : 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white hover:from-blue-700 hover:to-indigo-700 hover:shadow-lg active:scale-95 shadow-md'
            }`}
          >
            {isLoading ? (
              <div className="flex items-center justify-center">
                <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent mr-2"></div>
                Đang thêm...
              </div>
            ) : product.stock_quantity === 0 ? (
              <div className="flex items-center justify-center">
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
                Hết hàng
              </div>
            ) : (
              <div className="flex items-center justify-center">
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-2.5 5M7 13l2.5 5m0 0h8m-8 0a2 2 0 100 4 2 2 0 000-4zm8 0a2 2 0 100 4 2 2 0 000-4z" />
                </svg>
                Thêm vào giỏ
              </div>
            )}
          </button>
          
          {/* Product Features */}
          {product.features && product.features.length > 0 && (
            <div className="mt-4 pt-4 border-t border-gray-100">
              <div className="flex flex-wrap gap-1">
                {product.features.slice(0, 3).map((feature, index) => (
                  <span 
                    key={index}
                    className="inline-block bg-blue-50 text-blue-700 text-xs px-2 py-1 rounded-full"
                  >
                    {feature}
                  </span>
                ))}
                {product.features.length > 3 && (
                  <span className="inline-block bg-gray-100 text-gray-600 text-xs px-2 py-1 rounded-full">
                    +{product.features.length - 3} khác
                  </span>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductCard;