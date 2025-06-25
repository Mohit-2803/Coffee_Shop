import { useEffect, useState } from "react";
import { StarIcon } from "@heroicons/react/24/solid";
import axios from "axios";
import toast from "react-hot-toast";
import LoadingSpinner from "../Loading/LoadingSpinner";

const TopProducts = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTopProducts = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_FRONTEND_URL}/api/products/top-products`
        );
        // Assuming response.data is an array of product objects
        setProducts(response.data);
      } catch (error) {
        console.error("Error fetching top products:", error);
        toast.error("Error fetching top products");
      } finally {
        setLoading(false);
      }
    };

    fetchTopProducts();
  }, []);

  if (loading) {
    return (
      <div className="p-6 bg-white rounded-xl shadow-sm">
        <LoadingSpinner />
      </div>
    );
  }

  return (
    <div className="p-6 rounded-xl bg-white shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold">Top Selling Products</h3>
        <button className="text-sm font-bold cursor-pointer text-blue-600 hover:text-blue-900">
          View All
        </button>
      </div>
      {/* Set max-height to show about 5 products and enable vertical scrolling */}
      <div className="space-y-4 max-h-64 overflow-y-auto">
        {products.map((product, index) => (
          <div
            key={product.ProductID || index}
            className="flex items-center justify-between"
          >
            <div className="flex items-center space-x-4">
              <div className="w-10 h-10 rounded-full flex items-center justify-center bg-gray-100">
                <span className="text-sm font-medium">{index + 1}</span>
              </div>
              <div>
                <p className="text-sm font-medium w-[370px] truncate">
                  {product.Name}
                </p>
                <div className="flex items-center space-x-1">
                  <StarIcon className="w-4 h-4 text-yellow-400" />
                  <span className="text-xs text-gray-500 font-medium">
                    {product.Rating}
                  </span>
                </div>
              </div>
            </div>
            <div className="text-right mr-4">
              <p className="text-sm font-medium">₹{product.Revenue}</p>
              <p className="text-xs text-gray-500 font-medium">
                {product.TotalSales} sales
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TopProducts;
