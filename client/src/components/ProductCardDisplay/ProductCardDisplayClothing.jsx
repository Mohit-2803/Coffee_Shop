/* eslint-disable react/prop-types */
import { useState } from "react";
import { Link } from "react-router-dom";
import { auth } from "../../config/firebaseConfig";
import { useCart } from "../../contexts/useCart";
import axios from "axios";
import toast, { Toaster } from "react-hot-toast";
import SuccessModal from "../../components/modals/SuccessModal";

const ProductCardDisplayClothing = ({ product }) => {
  const finalPrice = product.Price - product.Price * (product.Discount / 100);
  const { fetchCart } = useCart();
  const [selectedSize, setSelectedSize] = useState("");
  const [openSizeModal, setOpenSizeModal] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  // Derive available sizes from product.Size (if provided)
  const availableSizes = product.Size
    ? product.Size.split(",").map((s) => s.trim())
    : [];

  // Function to add product to cart after size selection
  const handleAddToCartConfirmed = async () => {
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
        size: selectedSize || null,
      });
      toast.success("Product added to cart!");
      fetchCart();
      setShowSuccessModal(true);
    } catch (error) {
      console.error("Error adding to cart:", error);
      toast.error("Failed to add product to cart. Please try again later.");
    }
  };

  // Main handleAddToCart that opens the modal if size is required
  const handleAddToCart = () => {
    const user = auth.currentUser;
    if (!user) {
      toast.error("You must be signed in to add products to your cart.");
      return;
    }
    // If available sizes exist and no size has been selected, open the modal
    if (availableSizes.length > 0 && !selectedSize) {
      setOpenSizeModal(true);
      return;
    }
    // Otherwise, proceed to add to cart directly
    handleAddToCartConfirmed();
  };

  return (
    <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200 flex flex-col">
      {/* Product Image */}
      <Link to={`/products/${product.ProductID}`} className="block mb-2">
        <div className="h-48 flex items-center justify-center">
          <img
            src={product.ImageURL}
            alt={product.Name}
            className="max-h-full object-contain"
          />
        </div>
      </Link>

      {/* Product Details */}
      <div className="flex flex-col flex-grow">
        <h1 className="font-medium text-lg">{product.Brand}</h1>
        <h3 className="text-md font-base text-gray-800 mb-1 line-clamp-2 hover:text-orange-700">
          <Link to={`/products/${product.ProductID}`}>{product.Name}</Link>
        </h3>

        {/* Rating */}
        <div className="flex items-center text-sm mb-1">
          <div className="flex items-center">
            {[1, 2, 3, 4, 5].map((star) => (
              <svg
                key={star}
                className={`h-4 w-4 ${
                  star <= product.Rating ? "text-orange-400" : "text-gray-300"
                }`}
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
            ))}
          </div>
          <span className="ml-1 text-gray-500 font-medium">
            ({product.TotalReviews} Reviews)
          </span>
        </div>

        {/* Price and Discount */}
        <div className="flex items-center gap-2 mb-1">
          {product.Discount && (
            <span className="text-lg text-green-600 font-medium">
              -{product.Discount}%
            </span>
          )}
          <span className="text-xl font-semibold text-gray-900">
            ₹{finalPrice.toFixed(2)}
          </span>
        </div>

        {/* Original Price */}
        {product.Price && (
          <div className="text-xs text-gray-500 font-medium mb-2">
            <span>MRP : </span>
            <span className="line-through">₹{product.Price}</span>
          </div>
        )}

        {/* Stock Status */}
        <div className="text-xs font-medium mb-2">
          {product.Stock === 0 ? (
            <span className="text-red-600">Out of stock</span>
          ) : (
            <span className="text-green-600">In stock</span>
          )}
        </div>

        {/* Add to Cart Button */}
        <button
          onClick={handleAddToCart}
          className="mt-auto w-full cursor-pointer font-medium bg-yellow-500 hover:bg-orange-600 text-black py-1 px-2 rounded text-sm"
        >
          Add to Cart
        </button>
      </div>

      {/* Size Selection Modal */}
      {openSizeModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60">
          <div className="bg-white p-6 rounded-md shadow-lg w-80">
            <h1 className="font-medium mb-4">{product.Name}</h1>
            <h2 className="text-xl font-semibold mb-4">Select Size</h2>
            <select
              value={selectedSize}
              onChange={(e) => setSelectedSize(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer"
            >
              <option value="">Select Size</option>
              {availableSizes.map((size, index) => (
                <option key={index} value={size}>
                  {size.toUpperCase()}
                </option>
              ))}
            </select>
            <div className="flex justify-end space-x-4">
              <button
                onClick={() => setOpenSizeModal(false)}
                className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400 cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  if (!selectedSize) {
                    toast.error("Please select a size.");
                  } else {
                    setOpenSizeModal(false);
                    handleAddToCartConfirmed();
                  }
                }}
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 cursor-pointer"
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}

      {showSuccessModal && (
        <SuccessModal onClose={() => setShowSuccessModal(false)} />
      )}

      <Toaster position="top center" />
    </div>
  );
};

export default ProductCardDisplayClothing;
