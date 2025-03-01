/* eslint-disable react/prop-types */
import { useState } from "react";
import { Link } from "react-router-dom";
import { auth } from "../../config/firebaseConfig";
import { useCart } from "../../contexts/useCart";
import axios from "axios";
import toast from "react-hot-toast";
import SuccessModal from "../../components/modals/SuccessModal";

const ProductCardDisplayElectronics = ({ product }) => {
  const finalPrice = product.Price - product.Price * (product.Discount / 100);
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  const { fetchCart } = useCart();

  const handleAddToCart = async () => {
    const user = auth.currentUser;
    if (!user) {
      toast.error("You must be signed in to add products to your cart.");
      return;
    }
    try {
      await axios.put(`${import.meta.env.VITE_FRONTEND_URL}/api/carts/add`, {
        email: user.email,
        productId: product.ProductID,
        quantity: 1,
      });
      toast.success("Product added to cart!");
      fetchCart();
      setShowSuccessModal(true);
    } catch (error) {
      console.error("Error adding to cart:", error);
      toast.error("Failed to add product to cart. Please try again later.");
    }
  };

  return (
    <div className="bg-white p-4 rounded-lg duration-300 min-w-5xl border border-gray-200">
      <div className="flex gap-6">
        {/* Product Image */}
        <Link to={`/products/${product.ProductID}`} className="block">
          <div className="flex-shrink-0 bg-gray-100">
            <img
              src={product.ImageURL}
              alt={product.Name}
              className="w-[300px] max-w-full h-auto object-contain rounded-md"
            />
          </div>
        </Link>

        {/* Product Details */}
        <div className="w-2/3">
          <h3 className="text-xl font-semibold text-gray-700 mb-2 truncate hover:text-orange-700">
            <Link to={`/products/${product.ProductID}`}>{product.Name}</Link>
          </h3>

          {/* Rating */}
          <div className="flex items-center mb-2">
            <div className="flex items-center">
              {[1, 2, 3, 4, 5].map((star) => (
                <svg
                  key={star}
                  className={`h-5 w-5 ${
                    star <= product.Rating ? "text-orange-400" : "text-gray-300"
                  }`}
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
              ))}
            </div>
            <span className="text-sm text-gray-500 ml-2 font-medium">
              ({product.TotalReviews} reviews)
            </span>
          </div>

          {/* Price and Discount */}
          <div className="flex items-center gap-2 mb-1">
            {product.Discount && (
              <span className="text-2xl text-green-600 font-medium">
                -{product.Discount}%
              </span>
            )}
            <span className="text-2xl font-semibold text-gray-900">
              ₹{finalPrice.toFixed(2)}
            </span>
          </div>

          {/* Original Price */}
          {product.Price && (
            <div className="text-sm text-gray-500 mb-2">
              <span className="ml-2 font-medium">MRP : </span>
              <span className="line-through font-medium">₹{product.Price}</span>
            </div>
          )}

          {/* EMI Information */}
          {product.Category === "electronics" && (
            <div className="text-sm ml-2 text-gray-500 font-medium mb-4">
              No Cost EMI available on select cards.
            </div>
          )}

          {/* Stock Status */}
          <p
            className={`text-sm font-medium ml-2 ${
              product.Stock === 0 ? "text-red-600" : "text-green-600"
            }`}
          >
            {product.Stock === 0 ? "Out of stock" : "In stock"}
          </p>

          {/* Featured Badge */}
          {product.IsFeatured && (
            <div className="mt-2">
              <span className="bg-orange-100 text-orange-600 text-sm font-semibold px-2 py-1 rounded">
                Featured
              </span>
            </div>
          )}

          {/* Add to Cart Button */}
          <button
            onClick={handleAddToCart}
            className="mt-4 w-[120px] cursor-pointer bg-yellow-500 text-black py-1 px-1 rounded-full hover:bg-orange-600 transition-colors duration-200 font-medium text-sm"
          >
            Add to Cart
          </button>
        </div>
      </div>
      {showSuccessModal && (
        <SuccessModal onClose={() => setShowSuccessModal(false)} />
      )}
    </div>
  );
};

export default ProductCardDisplayElectronics;
