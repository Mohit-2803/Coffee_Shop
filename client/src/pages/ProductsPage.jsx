// ProductsPage.jsx
import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import axios from "axios";
import ProductCardDisplayElectronics from "../components/ProductCardDisplay/ProductCardDisplayElectronics";
import ProductCardDisplayClothing from "../components/ProductCardDisplay/ProductCardDisplayClothing";
import ClothingFilter from "../components/Products/ClothingFilter";
import ElectronicsFilter from "../components/Products/ElectronicsFilter";

const ProductsPage = () => {
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const initialSearch = searchParams.get("search") || "";

  const [searchTerm, setSearchTerm] = useState(initialSearch);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  // Update searchTerm when URL changes
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const search = params.get("search") || "";
    setSearchTerm(search);
  }, [location.search]);

  // Fetch products based solely on search term (no filter params)
  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_FRONTEND_URL}/api/search-product/search`,
          {
            params: { search: searchTerm },
          }
        );
        setProducts(response.data);
      } catch (error) {
        console.error("Error fetching products:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [searchTerm]);

  // Determine the dominant category from fetched products
  const clothingProducts = products.filter(
    (p) => p.Category.toLowerCase() === "clothing"
  );
  const electronicsProducts = products.filter(
    (p) => p.Category.toLowerCase() === "electronics"
  );

  let dominantCategory = "electronics"; // default view
  let filteredProducts = [];

  if (clothingProducts.length > electronicsProducts.length) {
    dominantCategory = "clothing";
    filteredProducts = clothingProducts;
  } else {
    dominantCategory = "electronics";
    filteredProducts = electronicsProducts;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl px-2 sm:px-6 lg:px-4">
        <div className="pt-8 ml-5">
          <h1 className="text-lg font-semibold text-gray-800 mb-6">
            Showing results for &quot;{searchTerm}&quot; - {dominantCategory}{" "}
            view
          </h1>
        </div>
        <div className="flex gap-4 py-8 pt-0">
          {/* Filters Sidebar */}
          <div className="w-64 space-y-6">
            {dominantCategory === "clothing" ? (
              <ClothingFilter onFilteredResults={setProducts} />
            ) : dominantCategory === "electronics" ? (
              <ElectronicsFilter onFilteredResults={setProducts} />
            ) : (
              <div className="bg-white p-4 rounded-lg shadow-sm">
                <p>No filters available for this category.</p>
              </div>
            )}
          </div>

          {/* Product Display Section */}
          <div className="flex-1">
            {loading ? (
              <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
              </div>
            ) : filteredProducts.length === 0 ? (
              <div>No products found.</div>
            ) : dominantCategory === "clothing" ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
                {filteredProducts.map((product) => (
                  <ProductCardDisplayClothing
                    key={product.ProductID}
                    product={product}
                  />
                ))}
              </div>
            ) : (
              <div className="space-y-4">
                {filteredProducts.map((product) => (
                  <ProductCardDisplayElectronics
                    key={product.ProductID}
                    product={product}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductsPage;
