import { useEffect, useState } from "react";
import axios from "axios";
import { getAuth } from "firebase/auth";
import toast from "react-hot-toast";
import { useCart } from "../../contexts/useCart";
import { Link } from "react-router-dom";
import LoadingSpinner from "../Loading/LoadingSpinner";
import SuccessModal from "../../components/modals/SuccessModal";

const Wishlist = () => {
  const [wishlist, setWishlist] = useState([]);
  const [loading, setLoading] = useState(true);
  const auth = getAuth();
  const user = auth.currentUser;
  const { fetchCart } = useCart();

  // New state for modal handling
  const [wishlistModalItem, setWishlistModalItem] = useState(null);
  const [openWishlistSizeModal, setOpenWishlistSizeModal] = useState(false);
  const [selectedWishlistSize, setSelectedWishlistSize] = useState("");
  // New state for success modal
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  useEffect(() => {
    const fetchWishlist = async () => {
      if (user) {
        try {
          const response = await axios.get(
            `${import.meta.env.VITE_FRONTEND_URL}/api/products/get-wishlist/${
              user.email
            }`
          );
          setWishlist(response.data);
        } catch (error) {
          console.error("Error fetching wishlist:", error);
          toast.error("Failed to fetch wishlist.");
        } finally {
          setLoading(false);
        }
      } else {
        setLoading(false);
      }
    };

    fetchWishlist();
  }, [user]);

  // Function to add an item to cart (with optional size)
  const handleAddToCartForItem = async (item, size = null) => {
    if (!user) {
      toast.error("You must be signed in to add products to your cart.");
      return;
    }
    try {
      await axios.put(`${import.meta.env.VITE_FRONTEND_URL}/api/carts/add`, {
        email: user.email,
        productId: item.ProductID,
        quantity: 1,
        size: size || null,
      });
      toast.success("Product added to cart!");
      fetchCart();
      setShowSuccessModal(true);
      // Optionally, remove the product from wishlist after adding to cart.
    } catch (error) {
      console.error("Error adding product to cart:", error);
      toast.error("Failed to add product to cart.");
    }
  };

  // Handle "Add to Cart" button click for a wishlist item
  const handleAddToCartItem = (item) => {
    // Check if item is clothing and has size information.
    // We check for either item.size or item.Size.
    if (
      item.Category.toLowerCase() === "clothing" &&
      (item.size || item.Size) &&
      (item.size || item.Size).trim().length > 0
    ) {
      const sizes = (item.size || item.Size).split(",").map((s) => s.trim());
      if (sizes.length > 0) {
        setWishlistModalItem(item);
        setSelectedWishlistSize(""); // Reset selection
        setOpenWishlistSizeModal(true);
        return;
      }
    }
    // Otherwise, add directly with no size.
    handleAddToCartForItem(item, null);
  };

  // Confirm size selection from modal and add to cart.
  const handleConfirmSize = () => {
    if (!selectedWishlistSize) {
      toast.error("Please select a size.");
      return;
    }
    handleAddToCartForItem(wishlistModalItem, selectedWishlistSize);
    setOpenWishlistSizeModal(false);
  };

  if (loading) return <LoadingSpinner />;

  return (
    <div className="bg-white rounded-lg shadow-sm p-6 h-full">
      <h2 className="text-2xl font-semibold mb-6 text-gray-700">
        Your Wishlist
      </h2>
      {wishlist.length === 0 ? (
        <p className="font-medium text-center">Your wishlist is empty.</p>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {wishlist.map((item) => (
            <div
              key={item.ProductID}
              className="border border-gray-200 rounded-lg p-4"
            >
              <div
                className={`aspect-square rounded-lg mb-4 ${
                  item.Category.toLowerCase() === "clothing"
                    ? "bg-white"
                    : "bg-gray-100"
                }`}
              >
                {item.ImageURL && (
                  <Link to={`/products/${item.ProductID}`} className="block">
                    <img
                      src={item.ImageURL}
                      alt={item.Name}
                      className="w-full h-[200px] object-contain"
                    />
                  </Link>
                )}
              </div>
              <h3 className="font-medium truncate">{item.Name}</h3>
              <p className="text-green-700 ml-1 font-medium">
                ₹
                {(
                  item.Price -
                  (item.Price * (item.Discount || 0)) / 100
                ).toFixed(2)}
              </p>
              <button
                onClick={() => handleAddToCartItem(item)}
                className="mt-2 w-full py-2 bg-yellow-400 rounded-lg hover:bg-yellow-500 transition-colors cursor-pointer font-medium"
              >
                Add to Cart
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Wishlist Size Selection Modal */}
      {openWishlistSizeModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60">
          <div className="bg-white p-6 rounded-md shadow-lg w-80">
            <h2 className="text-xl font-semibold mb-4">
              Select Size for {wishlistModalItem?.Name}
            </h2>
            <select
              value={selectedWishlistSize}
              onChange={(e) => setSelectedWishlistSize(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Select Size</option>
              {wishlistModalItem &&
                (wishlistModalItem.size || wishlistModalItem.Size)
                  .split(",")
                  .map((s) => s.trim())
                  .map((size, index) => (
                    <option key={index} value={size}>
                      {size.toUpperCase()}
                    </option>
                  ))}
            </select>
            <div className="flex justify-end space-x-4">
              <button
                onClick={() => setOpenWishlistSizeModal(false)}
                className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400 cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmSize}
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 cursor-pointer"
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Success Modal */}
      {showSuccessModal && (
        <SuccessModal onClose={() => setShowSuccessModal(false)} />
      )}
    </div>
  );
};

export default Wishlist;
