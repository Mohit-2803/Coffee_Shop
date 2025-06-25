/* eslint-disable react/prop-types */
import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import LoadingSpinner from "../../Loading/LoadingSpinner";

const RecommendedProducts = ({ productId }) => {
  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const containerRef = useRef(null);

  useEffect(() => {
    const fetchRecommendations = async () => {
      try {
        // 1. Call the ML microservice to get recommended product IDs
        const mlResponse = await axios.get(
          `http://127.0.0.1:5001/api/recommendations/${productId}`
        );
        const recommendedIds = mlResponse.data.recommendedProducts;

        // 2. For each recommended ID, call the get-product endpoint
        const productRequests = recommendedIds.map((id) =>
          axios.get(
            `${
              import.meta.env.VITE_FRONTEND_URL
            }/api/products/get-product/${id}`
          )
        );
        // Wait for all product detail requests to complete
        const productResponses = await Promise.all(productRequests);
        // Extract the data from each response
        const products = productResponses.map((res) => res.data);
        setRecommendations(products);
      } catch (error) {
        console.error("Error fetching recommendations:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchRecommendations();
  }, [productId]);

  const scrollLeft = () => {
    if (containerRef.current) {
      containerRef.current.scrollBy({ left: -300, behavior: "smooth" });
    }
  };

  const scrollRight = () => {
    if (containerRef.current) {
      containerRef.current.scrollBy({ left: 300, behavior: "smooth" });
    }
  };

  if (loading) {
    return (
      <div className="mt-8">
        <LoadingSpinner />
      </div>
    );
  }

  if (!recommendations.length) return null;

  return (
    <section className="mt-12 border-t border-gray-300 pt-8 relative">
      <h2 className="text-2xl font-semibold text-gray-800 mb-6">
        Customers who viewed this item also viewed
      </h2>
      <div className="relative">
        {/* Left Arrow Button */}
        <button
          onClick={scrollLeft}
          className="absolute left-0 top-1/2 transform -translate-y-1/2 z-10 bg-gray-200 p-2 rounded-full hover:bg-gray-300 focus:outline-none"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6 text-gray-700"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 19l-7-7 7-7"
            />
          </svg>
        </button>

        {/* Recommended Products Container */}
        <div
          ref={containerRef}
          className="flex overflow-x-auto pb-4 scrollbar-hide scroll-smooth"
        >
          {recommendations.map((product) => (
            <div
              key={product.ProductID}
              className="flex-shrink-0 w-64 mr-4 cursor-pointer transform transition-transform duration-200 hover:scale-105"
              onClick={() => navigate(`/products/${product.ProductID}`)}
            >
              <div className="bg-white h-[400px] p-4 rounded-xl shadow-md hover:shadow-lg border border-gray-100">
                <img
                  src={product.ImageURL}
                  alt={product.Name}
                  className="w-full h-48 object-contain mb-4 rounded-lg"
                />
                <h3 className="text-sm font-medium text-gray-800 line-clamp-2 mb-2">
                  {product.Name}
                </h3>
                <div className="flex items-center mb-2">
                  <span className="text-orange-500 text-sm">
                    {product.Rating}.0
                  </span>
                  <div className="flex ml-1">
                    {[...Array(5)].map((_, i) => (
                      <svg
                        key={i}
                        className={`w-4 h-4 ${
                          i < product.Rating
                            ? "text-orange-400"
                            : "text-gray-300"
                        }`}
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                    ))}
                  </div>
                </div>
                <div className="flex flex-col gap-1.5">
                  <div className="flex flex-row gap-2">
                    <span className="text-green-700 font-medium text-lg">
                      -{product.Discount}%
                    </span>
                    <span className="text-lg font-semibold text-gray-800">
                      ₹
                      {(
                        product.Price -
                        product.Price * (product.Discount / 100)
                      ).toFixed(2)}
                    </span>
                  </div>
                  {product.Discount > 0 && (
                    <span className="ml-2 text-xs font-medium text-gray-500">
                      M.R.P ₹
                      <span className="line-through">{product.Price}</span>
                    </span>
                  )}

                  <div className="inline-flex items-center p-1 w-20 bg-gradient-to-r bg-purple-600 border-2 rounded-lg text-white font-medium transform transition-transform duration-200 hover:scale-105 hover:shadow-lg">
                    <svg
                      className="w-4 h-4 mr-1.5 fill-current"
                      viewBox="0 0 24 24"
                      aria-hidden="true"
                    >
                      <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z" />
                    </svg>
                    <div className="flex flex-col leading-tight">
                      <span className="text-xs font-semibold">ShopEase</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Right Arrow Button */}
        <button
          onClick={scrollRight}
          className="absolute right-0 top-1/2 transform -translate-y-1/2 z-10 bg-gray-200 p-2 rounded-full hover:bg-gray-300 focus:outline-none"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6 text-gray-700"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 5l7 7-7 7"
            />
          </svg>
        </button>
      </div>
    </section>
  );
};

export default RecommendedProducts;
