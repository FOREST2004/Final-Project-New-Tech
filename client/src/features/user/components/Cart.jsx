import { useState } from 'react';

const Cart = ({ cart, onUpdateQuantity, onRemoveItem, onClearCart, loading }) => {
  const formatPrice = (price) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(price);
  };

  const handleClearCart = () => {
    if (onClearCart && window.confirm('Bạn có chắc muốn xóa tất cả sản phẩm trong giỏ hàng?')) {
      onClearCart();
    }
  };

  return (
    <div className="w-full bg-white rounded-lg shadow-lg border border-gray-200">
      <div className="p-4">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-800">Giỏ hàng</h3>
          {cart.item_count > 0 && (
            <span className="bg-blue-600 text-white text-xs rounded-full h-6 w-6 flex items-center justify-center">
              {cart.item_count}
            </span>
          )}
        </div>

        {cart.items && cart.items.length > 0 ? (
          <>
            <div className="max-h-64 overflow-y-auto space-y-3">
              {cart.items.map(item => (
                <div key={item.cart_item_id} className="flex items-center space-x-3 p-2 border border-gray-100 rounded-lg">
                  <img
                    src={item.product?.image_url || '/placeholder-image.jpg'}
                    alt={item.product?.name || 'Product'}
                    className="w-12 h-12 object-cover rounded"
                  />
                  <div className="flex-1 min-w-0">
                    <h4 className="text-sm font-medium text-gray-800 truncate">
                      {item.product?.name || 'Unknown Product'}
                    </h4>
                    <p className="text-sm text-gray-600">
                      {formatPrice(item.product?.price || 0)}
                    </p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => onUpdateQuantity && onUpdateQuantity(item.cart_item_id, Math.max(1, item.quantity - 1))}
                      disabled={loading || item.quantity <= 1}
                      className="w-6 h-6 flex items-center justify-center bg-gray-100 text-gray-600 rounded hover:bg-gray-200 disabled:opacity-50"
                    >
                      -
                    </button>
                    <span className="text-sm font-medium w-8 text-center">
                      {item.quantity}
                    </span>
                    <button
                      onClick={() => onUpdateQuantity && onUpdateQuantity(item.cart_item_id, item.quantity + 1)}
                      disabled={loading}
                      className="w-6 h-6 flex items-center justify-center bg-gray-100 text-gray-600 rounded hover:bg-gray-200 disabled:opacity-50"
                    >
                      +
                    </button>
                    <button
                      onClick={() => onRemoveItem && onRemoveItem(item.cart_item_id)}
                      disabled={loading}
                      className="w-6 h-6 flex items-center justify-center text-red-500 hover:text-red-700 disabled:opacity-50"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-4 pt-4 border-t border-gray-200">
              <div className="flex justify-between items-center mb-3">
                <span className="text-sm font-medium text-gray-600">Tổng cộng:</span>
                <span className="text-lg font-bold text-gray-800">
                  {formatPrice(cart.total || 0)}
                </span>
              </div>
              <div className="space-y-2">
                <button
                  onClick={handleClearCart}
                  disabled={loading}
                  className="w-full py-2 px-4 bg-red-600 text-white text-sm font-medium rounded-lg hover:bg-red-700 disabled:opacity-50 transition-colors duration-200"
                >
                  Xóa tất cả
                </button>
                <button
                  disabled={loading}
                  className="w-full py-2 px-4 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors duration-200"
                >
                  Thanh toán
                </button>
              </div>
            </div>
          </>
        ) : (
          <div className="text-center py-8">
            <svg className="mx-auto h-12 w-12 text-gray-400 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-1.5 6M7 13l-1.5 6m0 0h9m-9 0h9" />
            </svg>
            <p className="text-gray-500 text-sm">Giỏ hàng trống</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Cart;