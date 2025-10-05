import { useState, useEffect, useContext, useMemo, useCallback } from "react";
import ProductCard from "../components/ProductCard";
import Cart from "../components/Cart";
import CategoryFilter from "../components/CategoryFilter";
import SearchBar from "../components/SearchBar";
import { AuthContext } from "../../../shared/context/AuthContext";
import {
  productService,
  categoryService,
  cartService,
} from "../../../shared/services";

const User = () => {
  const { user } = useContext(AuthContext);
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [cartLoading, setCartLoading] = useState(false);
  const [error, setError] = useState(null);

  // Function to fetch products with optional category filter
  const fetchProducts = useCallback(
    async (categoryId = null, search = null) => {
      try {
        const productsData = await productService.getProducts(
          categoryId,
          search
        );
        setProducts(productsData);
        return productsData;
      } catch (error) {
        console.error("Lỗi khi tải sản phẩm:", error);
        throw error;
      }
    },
    []
  );

  const fetchCart = useCallback(async () => {
    try {
      const cartData = await cartService.getCart();
      setCartItems(cartData);
    } catch (error) {
      console.error("Lỗi khi tải giỏ hàng:", error);
    }
  }, []);

  // 1. Load categories một lần khi component mount
  useEffect(() => {
    const loadCategories = async () => {
      try {
        const categoriesData = await categoryService.getCategories();
        setCategories(categoriesData);
      } catch (error) {
        console.error("Lỗi khi tải danh mục:", error);
      }
    };

    loadCategories();
  }, []); // Chỉ chạy một lần khi component mount

  // 2. Load products một lần khi component mount
  useEffect(() => {
    const loadProducts = async () => {
      setLoading(true);
      try {
        const productsData = await productService.getProducts();
        setProducts(productsData);
      } catch (error) {
        console.error("Lỗi khi tải sản phẩm:", error);
        setError("Không thể tải sản phẩm. Vui lòng thử lại sau.");
      } finally {
        setLoading(false);
      }
    };

    loadProducts();
  }, []); // Chỉ chạy một lần khi component mount

  // 3. Load cart khi user thay đổi
  useEffect(() => {
    const loadCart = async () => {
      if (user) {
        try {
          const cartData = await cartService.getCart();
          setCartItems(cartData);
        } catch (error) {
          console.error("Lỗi khi tải giỏ hàng:", error);
        }
      } else {
        setCartItems([]); // Clear cart khi user logout
      }
    };

    loadCart();
  }, [user?.id]); // Chỉ chạy khi user?.id thay đổi

  const addToCart = async (product) => {
    if (!user) {
      alert("Vui lòng đăng nhập để thêm sản phẩm vào giỏ hàng");
      return;
    }

    setCartLoading(true);
    try {
      await cartService.addToCart(product.product_id, 1);
      alert("Đã thêm sản phẩm vào giỏ hàng!");
      await fetchCart();
    } catch (error) {
      console.error("Lỗi khi thêm sản phẩm vào giỏ hàng:", error);
      alert(error.message || "Có lỗi xảy ra khi thêm sản phẩm vào giỏ hàng");
    } finally {
      setCartLoading(false);
    }
  };

  const updateCartQuantity = async (cartItemId, newQuantity) => {
    setCartLoading(true);
    try {
      await cartService.updateCartQuantity(cartItemId, newQuantity);
      await fetchCart();
    } catch (error) {
      console.error("Lỗi khi cập nhật số lượng:", error);
      alert(error.message || "Có lỗi xảy ra khi cập nhật số lượng");
    } finally {
      setCartLoading(false);
    }
  };

  const removeCartItem = async (cartItemId) => {
    setCartLoading(true);
    try {
      await cartService.removeCartItem(cartItemId);
      await fetchCart();
      alert("Đã xóa sản phẩm khỏi giỏ hàng");
    } catch (error) {
      console.error("Lỗi khi xóa sản phẩm:", error);
      alert(error.message || "Có lỗi xảy ra khi xóa sản phẩm");
    } finally {
      setCartLoading(false);
    }
  };

  const clearCart = async () => {
    setCartLoading(true);
    try {
      await cartService.clearCart();
      await fetchCart();
      alert("Đã xóa tất cả sản phẩm trong giỏ hàng");
    } catch (error) {
      console.error("Lỗi khi xóa giỏ hàng:", error);
      alert(error.message || "Có lỗi xảy ra khi xóa giỏ hàng");
    } finally {
      setCartLoading(false);
    }
  };

  const handleCategoryChange = async (categoryId) => {
    setSelectedCategory(categoryId);
    setLoading(true);
    setError(null);

    try {
      // Fetch products for the selected category
      await fetchProducts(categoryId, searchTerm);
    } catch (error) {
      console.error("Lỗi khi tải sản phẩm theo danh mục:", error);
      setError("Không thể tải sản phẩm. Vui lòng thử lại sau.");
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = useCallback(async (term) => {
    setSearchTerm(term);
    setLoading(true);
    setError(null);

    try {
      // Fetch products with search term and current category
      await fetchProducts(selectedCategory, term);
    } catch (error) {
      console.error("Lỗi khi tìm kiếm sản phẩm:", error);
      setError("Không thể tìm kiếm sản phẩm. Vui lòng thử lại sau.");
    } finally {
      setLoading(false);
    }
  }, [selectedCategory, fetchProducts]); // Thêm dependencies cần thiết

  const handleClearFilters = async () => {
    setSearchTerm("");
    setSelectedCategory("");
    setLoading(true);
    setError(null);

    try {
      // Fetch all products (no filters)
      await fetchProducts();
    } catch (error) {
      console.error("Lỗi khi xóa bộ lọc:", error);
      setError("Không thể tải sản phẩm. Vui lòng thử lại sau.");
    } finally {
      setLoading(false);
    }
  };

  // Get selected category name for display
  const selectedCategoryName = useMemo(() => {
    return categories.find((c) => c.category_id === parseInt(selectedCategory))
      ?.name;
  }, [categories, selectedCategory]);

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="bg-white rounded-xl shadow-lg p-8 max-w-md mx-4">
          <div className="text-center">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg
                className="w-8 h-8 text-red-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Có lỗi xảy ra
            </h3>
            <p className="text-gray-600 mb-4">{error}</p>
            <button
              onClick={() => window.location.reload()}
              className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
            >
              Thử lại
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
      <div className="container mx-auto px-4 py-6 sm:py-8">
        {/* Header Section */}
        <div className="text-center mb-8 sm:mb-12">
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent mb-4">
            🐠 Cửa Hàng Thủy Sinh
          </h1>
          <p className="text-gray-600 text-lg sm:text-xl max-w-2xl mx-auto">
            Khám phá bộ sưu tập sản phẩm thủy sinh chất lượng cao cho bể cá của
            bạn
          </p>
          <div className="mt-6 flex justify-center">
            <div className="bg-white rounded-full px-6 py-2 shadow-md">
              <span className="text-sm text-gray-600">
                {products.length} sản phẩm • {categories.length} danh mục
              </span>
            </div>
          </div>
        </div>

        {/* Search and Filter Section */}
        <div className="mb-8 sm:mb-12">
          <div className="bg-white rounded-2xl shadow-lg p-6 sm:p-8">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Search Bar */}
              <div className="lg:col-span-1">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Tìm kiếm sản phẩm
                </label>
                <SearchBar
                  onSearch={handleSearch}
                  placeholder="Nhập tên sản phẩm..."
                />
              </div>

              {/* Category Filter */}
              <div className="lg:col-span-1">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Danh mục
                </label>
                <CategoryFilter
                  categories={categories}
                  selectedCategory={selectedCategory}
                  onCategoryChange={handleCategoryChange}
                  loading={loading}
                />
              </div>

              {/* Cart */}
              <div className="lg:col-span-1">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Giỏ hàng
                </label>
                <Cart
                  cart={cartItems}
                  onUpdateQuantity={updateCartQuantity}
                  onRemoveItem={removeCartItem}
                  onClearCart={clearCart}
                  loading={cartLoading}
                />
              </div>
            </div>

            {/* Active Filters */}
            {(searchTerm || selectedCategory) && (
              <div className="mt-6 pt-6 border-t border-gray-200">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-sm text-gray-600">
                    Bộ lọc đang áp dụng:
                  </span>
                  {searchTerm && (
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                      Tìm kiếm: "{searchTerm}"
                      <button
                        onClick={() => handleSearch("")}
                        className="ml-2 text-blue-600 hover:text-blue-800"
                      >
                        ×
                      </button>
                    </span>
                  )}
                  {selectedCategory && (
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                      Danh mục: {selectedCategoryName}
                      <button
                        onClick={() => handleCategoryChange("")}
                        className="ml-2 text-green-600 hover:text-green-800"
                      >
                        ×
                      </button>
                    </span>
                  )}
                  <button
                    onClick={handleClearFilters}
                    className="text-xs text-gray-500 hover:text-gray-700 underline"
                  >
                    Xóa tất cả
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Products Grid */}
        {loading ? (
          <div className="flex justify-center items-center py-16 sm:py-24">
            <div className="text-center">
              <div className="relative">
                <div className="animate-spin rounded-full h-16 w-16 sm:h-20 sm:w-20 border-4 border-blue-200 mx-auto mb-6"></div>
                <div className="animate-spin rounded-full h-16 w-16 sm:h-20 sm:w-20 border-t-4 border-blue-600 absolute top-0 left-1/2 transform -translate-x-1/2"></div>
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                Đang tải sản phẩm...
              </h3>
              <p className="text-gray-600">Vui lòng chờ trong giây lát</p>
            </div>
          </div>
        ) : products.length > 0 ? (
          <div>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-gray-900">
                {searchTerm || selectedCategory
                  ? "Kết quả tìm kiếm"
                  : "Tất cả sản phẩm"}
                <span className="ml-2 text-sm font-normal text-gray-500">
                  ({products.length} sản phẩm)
                </span>
              </h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 sm:gap-8">
              {products.map((product) => (
                <ProductCard
                  key={product.product_id}
                  product={product}
                  onAddToCart={addToCart}
                  isLoading={cartLoading}
                />
              ))}
            </div>
          </div>
        ) : (
          <div className="text-center py-16 sm:py-24">
            <div className="max-w-md mx-auto">
              <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <svg
                  className="w-12 h-12 text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2M4 13h2m13-8l-4 4m0 0l-4-4m4 4V3"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">
                Không tìm thấy sản phẩm
              </h3>
              <p className="text-gray-500 mb-8">
                {searchTerm ? (
                  <>
                    Không có sản phẩm nào phù hợp với từ khóa "
                    <strong>{searchTerm}</strong>"
                  </>
                ) : selectedCategory ? (
                  <>
                    Không có sản phẩm nào trong danh mục "
                    <strong>{selectedCategoryName}</strong>"
                  </>
                ) : (
                  "Hiện tại chưa có sản phẩm nào trong cửa hàng."
                )}
              </p>
              {(searchTerm || selectedCategory) && (
                <button
                  onClick={handleClearFilters}
                  className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-lg text-white bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 transition duration-200 shadow-lg hover:shadow-xl"
                >
                  <svg
                    className="mr-2 h-5 w-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                    />
                  </svg>
                  Xóa bộ lọc
                </button>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default User;
