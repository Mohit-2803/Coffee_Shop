import { useState, useEffect } from "react";
import axios from "axios";
import { getAuth } from "firebase/auth";
import {
  MagnifyingGlassIcon,
  ChartBarIcon,
  TagIcon,
  CurrencyRupeeIcon,
} from "@heroicons/react/24/outline";
import Sidebar from "../Sidebar/Sidebar";
import ProductModal from "./SellerProductsModal/SellerProductModal";
import Loading from "../Loading/LoadingSpinner";
import EmptyState from "./SellerProductsModal/EmptyState";

const SellerProductsPage = () => {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeCategory, setActiveCategory] = useState("all");

  const auth = getAuth();
  const sellerEmail = auth.currentUser?.email;

  const categories = [
    { name: "all", label: "All Products", color: "bg-gray-300" },
    { name: "electronics", label: "Electronics", color: "bg-blue-200" },
    { name: "clothing", label: "Fashion", color: "bg-pink-200" },
    { name: "home", label: "Home", color: "bg-green-200" },
  ];

  useEffect(() => {
    if (!sellerEmail) {
      setError("Authentication required");
      setLoading(false);
      return;
    }

    const fetchProducts = async () => {
      try {
        const { data } = await axios.get(
          `${
            import.meta.env.VITE_FRONTEND_URL
          }/api/seller-central/getProducts/${sellerEmail}`
        );
        setProducts(data);
        setFilteredProducts(data);
      } catch (err) {
        setError("Failed to load products");
        console.error("Fetch error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [sellerEmail]);

  useEffect(() => {
    const results = products.filter((product) => {
      const matchesSearch = product.Name.toLowerCase().includes(
        searchTerm.toLowerCase()
      );
      const matchesCategory =
        activeCategory === "all" || product.Category === activeCategory;
      return matchesSearch && matchesCategory;
    });
    setFilteredProducts(results);
  }, [searchTerm, activeCategory, products]);

  const handleSearch = (e) => setSearchTerm(e.target.value);
  const handleCategoryFilter = (category) => setActiveCategory(category);

  if (loading) return <Loading />;

  if (error)
    return (
      <div className="flex">
        <Sidebar />
        <EmptyState
          title="No Products Found"
          description={"Kindly Add products"}
          icon={<ChartBarIcon className="w-16 h-16 text-red-500" />}
        />
      </div>
    );

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar />

      <main className="flex-1 p-8">
        <div className="max-w-7xl mx-auto">
          {/* Header Section */}
          <div className="mb-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <h1 className="text-3xl font-medium text-gray-800">
                Product Management
              </h1>
              <p className="text-gray-500 mt-2">
                {products.length} products • {filteredProducts.length} visible
              </p>
            </div>

            <div className="flex gap-4 w-full md:w-auto">
              <div className="relative flex-1">
                <input
                  type="text"
                  placeholder="Search products..."
                  className="w-full pl-10 pr-4 py-3 border border-gray-400 rounded-lg bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  value={searchTerm}
                  onChange={handleSearch}
                />
                <MagnifyingGlassIcon className="w-5 h-5 absolute left-3 top-3.5 text-gray-400" />
              </div>
            </div>
          </div>

          {/* Category Filters */}
          <div className="mb-8 flex flex-wrap gap-2">
            {categories.map((cat) => (
              <button
                key={cat.name}
                onClick={() => handleCategoryFilter(cat.name)}
                className={`px-4 py-2 rounded-full flex items-center cursor-pointer gap-2 transition-colors ${
                  activeCategory === cat.name
                    ? `${cat.color} text-gray-900 font-semibold`
                    : "bg-white text-gray-600 hover:bg-gray-300 font-medium"
                }`}
              >
                <TagIcon className="w-4 h-4" />
                {cat.label}
              </button>
            ))}
          </div>

          {/* Products Grid or Empty State */}
          {filteredProducts.length === 0 ? (
            <div className="flex justify-center items-center h-64">
              <EmptyState
                title="No products found"
                description="Try adjusting your search or filters"
                icon={<CurrencyRupeeIcon className="w-16 h-16 text-gray-400" />}
              />
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredProducts.map((product) => (
                <article
                  key={product.ProductID}
                  className="bg-white rounded-xl shadow-sm hover:shadow-lg transition-all duration-300 group cursor-pointer"
                  onClick={() => setSelectedProduct(product)}
                >
                  <div className="relative aspect-square">
                    <img
                      src={product.ImageURL}
                      alt={product.Name}
                      className="w-full h-full object-contain bg-gray-50 rounded-t-xl p-4"
                    />
                    <span
                      className={`absolute top-4 right-4 px-3 py-1 rounded-full text-sm font-medium ${
                        categories.find((c) => c.name === product.Category)
                          ?.color
                      }`}
                    >
                      {product.Category}
                    </span>
                  </div>

                  <div className="p-4 border-t border-gray-300">
                    <h3 className="font-semibold text-gray-900 truncate mb-2">
                      {product.Name}
                    </h3>

                    <div className="flex justify-between items-center">
                      <div className="flex items-center gap-1 text-blue-600">
                        <CurrencyRupeeIcon className="w-5 h-5" />
                        <span className="font-medium">{product.Price}</span>
                      </div>

                      <div
                        className={`px-2 py-1 rounded-full text-sm font-medium ${
                          product.Stock > 0
                            ? "bg-green-100 text-green-800"
                            : "bg-red-100 text-red-800"
                        }`}
                      >
                        {product.Stock > 0
                          ? `${product.Stock} in stock`
                          : "Out of stock"}
                      </div>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          )}
        </div>

        {/* Product Modal */}
        {selectedProduct && (
          <ProductModal
            product={selectedProduct}
            onClose={() => setSelectedProduct(null)}
            onUpdate={(updatedProduct) => {
              setProducts(
                products.map((p) =>
                  p.ProductID === updatedProduct.ProductID ? updatedProduct : p
                )
              );
            }}
          />
        )}
      </main>
    </div>
  );
};

export default SellerProductsPage;
