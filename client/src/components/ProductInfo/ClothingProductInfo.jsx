/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react/prop-types */
import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom"; // Import useNavigate
import { auth } from "../../config/firebaseConfig";
import toast, { Toaster } from "react-hot-toast";
import { useCart } from "../../contexts/useCart";
import SuccessModal from "../../components/modals/SuccessModal";
import { AiOutlineHeart, AiFillHeart } from "react-icons/ai";
import axios from "axios";
import RatingComponent from "../Rating/RatingComponent";
import RecommendedProducts from "./RecommendedProducts/RecommendedProducts";

const ClothingProductInfo = ({ product }) => {
  const [quantity, setQuantity] = useState(1);
  const [selectedSize, setSelectedSize] = useState("");
  const [isInWishlist, setIsInWishlist] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const { fetchCart } = useCart();
  const navigate = useNavigate(); // Initialize useNavigate

  // Derive available sizes from the product.Size field
  const availableSizes = product.Size.split(",").map((size) => size.trim());

  // Use a ref to persist the logged product ID across re-renders
  const loggedProductId = useRef(null);

  // Log product view when component mounts or product changes
  useEffect(() => {
    const logProductView = async () => {
      try {
        const user = auth.currentUser;
        await axios.post(
          `${import.meta.env.VITE_FRONTEND_URL}/api/productViews/view`,
          {
            productId: product.ProductID,
            userId: user ? user.uid : null,
            userName: user ? user.displayName : null,
            category: product.Category, // Send the product category as well
          }
        );
      } catch (error) {
        console.error("Error logging product view:", error);
      }
    };

    // Only log if we haven't logged this product yet
    if (
      product &&
      product.ProductID &&
      loggedProductId.current !== product.ProductID
    ) {
      loggedProductId.current = product.ProductID;
      logProductView();
    }
  }, [product.ProductID]);

  // Fetch wishlist status on mount
  useEffect(() => {
    const fetchWishlistStatus = async () => {
      const user = auth.currentUser;
      if (user) {
        try {
          const response = await axios.get(
            `${import.meta.env.VITE_FRONTEND_URL}/api/products/get-wishlist/${
              user.email
            }`
          );
          if (
            response.data.some((item) => item.ProductID === product.ProductID)
          ) {
            setIsInWishlist(true);
          } else {
            setIsInWishlist(false);
          }
        } catch (error) {
          console.error("Error fetching wishlist status:", error);
        }
      }
    };

    fetchWishlistStatus();
  }, [product.ProductID]);

  const handleSaveToList = async () => {
    try {
      const user = auth.currentUser;
      if (!user) {
        toast.error("You must be signed in to save products to your wishlist.");
        return;
      }
      const response = await axios.post(
        `${import.meta.env.VITE_FRONTEND_URL}/api/products/wishlist/toggle`,
        {
          email: user.email,
          productId: product.ProductID,
        }
      );
      if (response.data.message.includes("added")) {
        setIsInWishlist(true);
        toast.success("Product added to wishlist!");
      } else {
        setIsInWishlist(false);
        toast.success("Product removed from wishlist!");
      }
    } catch (error) {
      console.error("Error toggling wishlist:", error);
      toast.error("Failed to update wishlist. Please try again later.");
    }
  };

  const handleAddToCart = async () => {
    try {
      const user = auth.currentUser;
      if (!user) {
        toast.error("You must be signed in to add products to your cart.");
        return;
      }
      if (!selectedSize) {
        toast.error("Please select a size.");
        return;
      }
      await axios.put(`${import.meta.env.VITE_FRONTEND_URL}/api/carts/add`, {
        email: user.email,
        productId: product.ProductID,
        quantity: quantity,
        size: selectedSize, // Pass the selected size to backend
      });
      fetchCart();
      setShowSuccessModal(true);
      toast.success("Product added to cart!");
    } catch (error) {
      console.error("Error adding to cart:", error);
      toast.error("Failed to add product to cart. Please try again later.");
    }
  };

  // Calculate final price after discount
  const finalPrice = product.Price - product.Price * (product.Discount / 100);

  // New "Buy Now" handler for Clothing products
  const handleBuyNow = () => {
    if (!selectedSize) {
      toast.error("Please select a size.");
      return;
    }
    // Build a cart item object similar to your cart structure
    const cartItem = {
      ...product,
      Quantity: quantity,
      DiscountedPrice: finalPrice,
      size: selectedSize,
    };
    // Navigate to checkout with state containing product info
    navigate("/checkout", {
      state: {
        selectedItems: [product.ProductID],
        cartItems: [cartItem],
        subtotal: finalPrice * quantity,
      },
    });
  };

  return (
    <div className="bg-gray-50 min-h-screen p-8">
      <div className="max-w-7xl mx-auto bg-white p-6 rounded-lg shadow-xl">
        {/* Breadcrumbs */}
        <div className="text-sm font-medium text-gray-500 mb-4">
          <span>Home</span> / <span>{product.Category}</span>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left Column - Image */}
          <div className="relative">
            <div className="rounded-lg p-4 relative">
              <img
                src={product.ImageURL}
                alt={product.Name}
                className="w-full h-[800px] object-contain"
              />
              <div
                className="absolute top-2 right-2 cursor-pointer"
                onClick={handleSaveToList}
                title="Save to List"
              >
                {isInWishlist ? (
                  <AiFillHeart size={24} className="text-red-600" />
                ) : (
                  <AiOutlineHeart
                    size={24}
                    className="text-red-500 hover:text-red-600"
                  />
                )}
              </div>
            </div>
          </div>
          {/* Right Column - Product Info */}
          <div className="space-y-6">
            <h1 className="text-2xl font-medium text-gray-800">
              {product.Name}
            </h1>
            <div className="flex items-center space-x-4">
              <span className="text-gray-700">{product.Rating}.0</span>
              <div className="flex items-center">
                {[1, 2, 3, 4, 5].map((star) => (
                  <svg
                    key={star}
                    className={`h-5 w-5 ${
                      star <= product.Rating
                        ? "text-yellow-400"
                        : "text-gray-300"
                    }`}
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ))}
              </div>
              <span className="text-sm text-blue-600 font-medium">
                {product.TotalReviews} customer ratings
              </span>
            </div>
            <p
              className={`text-sm font-medium ${
                product.Stock === 0 ? "text-red-600" : "text-green-600"
              }`}
            >
              {product.Stock === 0 ? "Out of stock" : "In stock"}
            </p>
            <hr className="border-t border-gray-400 my-4" />
            <div className="space-y-2">
              <div className="text-red-700 font-medium">Limited time deal</div>
              <div className="flex items-center gap-2 mb-1">
                {product.Discount && (
                  <span className="text-lg text-white font-medium bg-red-700 px-2 py-1 rounded-lg">
                    -{product.Discount}%
                  </span>
                )}
                <span className="text-2xl font-semibold text-gray-900">
                  ₹{finalPrice.toFixed(2)}
                </span>
              </div>
              {product.Price && (
                <div className="text-sm text-gray-500 mb-2">
                  <span className="font-medium">MRP : </span>
                  <span className="line-through font-medium">
                    ₹{product.Price}
                  </span>
                </div>
              )}
              <div className="inline-flex items-center p-1 bg-gradient-to-r bg-purple-800 border-2 rounded-lg text-white font-medium transform transition-transform duration-200 hover:scale-105 hover:shadow-lg">
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
            <div className="border-t border-gray-400 pt-4">
              <h3 className="text-lg font-bold mb-2">Product Highlights</h3>
              <ul className="list-disc pl-6 space-y-2 text-gray-600">
                {product.Description.split(". ").map(
                  (point, index) => point && <li key={index}>{point}</li>
                )}
              </ul>
            </div>
            <div className="border-t border-gray-400 pt-4">
              <div className="flex flex-col space-y-4 mb-4">
                <div className="flex items-center space-x-4">
                  <span className="font-medium">Quantity:</span>
                  <select
                    value={quantity}
                    onChange={(e) => setQuantity(parseInt(e.target.value))}
                    className="border border-gray-400 rounded-md px-3 py-1 cursor-pointer"
                  >
                    {[...Array(Math.min(product.Stock, 5)).keys()].map(
                      (num) => (
                        <option key={num + 1} value={num + 1}>
                          {num + 1}
                        </option>
                      )
                    )}
                  </select>
                  <span className="text-sm text-gray-500 font-medium">
                    {product.Stock} left in stock
                  </span>
                </div>
                <div className="flex items-center space-x-4">
                  <span className="font-medium">Size:</span>
                  <select
                    value={selectedSize}
                    onChange={(e) => setSelectedSize(e.target.value)}
                    className="border border-gray-400 rounded-md px-3 py-1 cursor-pointer"
                  >
                    <option value="">Select Size</option>
                    {availableSizes.map((size, index) => (
                      <option key={index} value={size}>
                        {size.toUpperCase()}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              <div className="flex gap-4">
                <button
                  onClick={handleAddToCart}
                  className="bg-yellow-400 hover:bg-yellow-500 px-6 py-2 rounded-full font-medium transition-colors cursor-pointer"
                >
                  Add to Cart
                </button>
                {/* Updated Buy Now button with onClick handler */}
                <button
                  onClick={handleBuyNow}
                  className="bg-orange-500 hover:bg-orange-600 px-6 py-2 rounded-full font-medium text-white transition-colors cursor-pointer"
                >
                  Buy Now
                </button>
              </div>
            </div>
            <div className="border-t border-gray-400 pt-4">
              <h3 className="text-lg font-bold mb-2">Specifications</h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <p>
                    <span className="font-medium">Brand:</span> {product.Brand}
                  </p>
                  <p>
                    <span className="font-medium">Category:</span>{" "}
                    {product.Category}
                  </p>
                  <p>
                    <span className="font-medium">Size:</span> {product.Size}
                  </p>
                </div>
                <div className="space-y-2">
                  <p>
                    <span className="font-medium">Weight:</span>{" "}
                    {product.Weight} kg
                  </p>
                  {product.SetupService && (
                    <p>
                      <span className="font-medium">Setup Service:</span>{" "}
                      Included
                    </p>
                  )}
                  <p>
                    <span className="font-medium">Material:</span>{" "}
                    {product.Material}
                  </p>
                  <p>
                    <span className="font-medium">Sleeve Style:</span>{" "}
                    {product.SleeveStyle}
                  </p>
                </div>
              </div>
              <div className="mt-4 flex items-center space-x-2">
                <span className="font-medium">Color:</span>
                {/* Color Sphere */}
                <div
                  className="w-6 h-6 rounded-full border"
                  style={{ backgroundColor: product.Color }}
                ></div>
                <span>{product.Color}</span>
              </div>
            </div>
          </div>
        </div>
        <RecommendedProducts productId={product.ProductID} />
        <RatingComponent productId={product.ProductID} />
      </div>
      <Toaster position="top-center" />
      {showSuccessModal && (
        <SuccessModal onClose={() => setShowSuccessModal(false)} />
      )}
    </div>
  );
};

export default ClothingProductInfo;
