/* eslint-disable react/prop-types */
import { useNavigate } from "react-router-dom";

const ProductCard = ({ product, className }) => {
  const navigate = useNavigate();

  const handleButtonClick = () => {
    navigate(`/products/${product.ProductID}`);
  };

  // Calculate discounted price if a discount exists, otherwise use the regular price.
  const discountedPrice =
    product.Discount > 0
      ? Math.round(product.Price - product.Price * (product.Discount / 100))
      : product.Price;

  return (
    <div className={`group bg-white shadow-md my-2 h-[450px] ${className}`}>
      <div className="overflow-hidden">
        <img
          src={product.ImageURL}
          alt={product.Name}
          className="w-full h-[250px] object-contain"
        />

        {/* Top Badges Container */}
        <div className="absolute top-2 mt-2 left-2 right-2 flex justify-between">
          {product.Discount > 0 && (
            <span className="bg-red-500 text-white px-2 py-1 h-full rounded-full text-xs font-medium">
              {product.Discount}% OFF
            </span>
          )}
        </div>
      </div>

      <div className="p-4 space-y-1">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold text-gray-700 uppercase">
            {product.Brand}
          </span>
          {product.Stock > 0 ? (
            <span className="text-xs text-green-600 font-medium">In Stock</span>
          ) : (
            <span className="text-xs text-red-600 font-medium">Pre-order</span>
          )}
        </div>

        <h4 className="font-medium text-md text-gray-900 line-clamp-2">
          {product.Name}
        </h4>

        <div className="flex items-center gap-2">
          <div className="flex items-center">
            {[...Array(5)].map((_, i) => (
              <svg
                key={i}
                className={`w-4 h-4 ${
                  i < product.Rating ? "text-orange-500" : "text-gray-300"
                }`}
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
            ))}
          </div>
          <span className="text-sm text-blue-600 font-medium">
            {product.TotalReviews} Reviews
          </span>
        </div>

        <div className="flex items-baseline justify-between gap-3">
          <div className="flex gap-2 items-center">
            {/* Display discounted price prominently */}
            <span className="text-xl font-semibold text-gray-900">
              ₹{discountedPrice.toLocaleString()}
            </span>
            {/* If discount exists, show the original price with a strikethrough */}
            {product.Discount > 0 && (
              <span className="text-md text-gray-600 line-through">
                ₹{product.Price.toLocaleString()}
              </span>
            )}
          </div>

          <button
            className="w-[120px] hover:text-blue-900 text-blue-700 py-1.5 rounded-lg font-bold transition-colors flex items-center text-sm mt-5 justify-center gap-2 cursor-pointer"
            onClick={handleButtonClick}
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
              />
            </svg>
            Shop Now
          </button>
        </div>

        {product.FreeDelivery && (
          <div className="text-sm text-green-600 font-medium">
            Free Delivery
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductCard;
