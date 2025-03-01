/* eslint-disable no-unused-vars */
import { useEffect, useState } from "react";
import { useCart } from "../contexts/useCart";
import toast from "react-hot-toast";
import { updateCartQuantity } from "../api/cart";
import { auth } from "../config/firebaseConfig";
import { FiShoppingCart } from "react-icons/fi";
import { FaReceipt } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";

const CartPage = () => {
  const { cartItems, removeFromCart, fetchCart } = useCart();
  const [selectedItems, setSelectedItems] = useState([]);
  const [giftItems, setGiftItems] = useState({});
  const navigate = useNavigate();

  useEffect(() => {
    fetchCart();
  }, [fetchCart]);

  // Handle checkout button click
  const handleCheckout = () => {
    if (selectedItems.length === 0) return;

    // Pass data to the Checkout Page
    navigate("/checkout", {
      state: {
        selectedItems,
        cartItems: cartItems.filter((item) =>
          selectedItems.includes(item.ProductID)
        ),
        subtotal,
      },
    });
  };

  const handleQuantityChange = async (productId, newQuantity) => {
    try {
      if (newQuantity < 1) return;
      const user = auth.currentUser;
      if (user) {
        await updateCartQuantity(user.email, productId, newQuantity);
        await fetchCart();
        toast.success("Quantity updated");
      }
    } catch (error) {
      toast.error("Failed to update quantity");
    }
  };

  const handleRemove = async (productId) => {
    try {
      await removeFromCart(productId);
      toast.success("Item removed from cart");
    } catch (error) {
      toast.error("Failed to remove item");
    }
  };

  const toggleSelection = (productId) => {
    setSelectedItems((prev) =>
      prev.includes(productId)
        ? prev.filter((id) => id !== productId)
        : [...prev, productId]
    );
  };

  const toggleGift = (productId) => {
    setGiftItems((prev) => ({
      ...prev,
      [productId]: !prev[productId],
    }));
  };

  // Calculate in-stock product IDs and selection status
  const inStockProductIds = cartItems
    .filter((item) => item.Stock > 0)
    .map((item) => item.ProductID);
  const allInStockSelected =
    inStockProductIds.length > 0 &&
    inStockProductIds.every((id) => selectedItems.includes(id));

  // Toggle select all in-stock items
  const toggleSelectAll = () => {
    if (allInStockSelected) {
      setSelectedItems([]);
    } else {
      setSelectedItems(inStockProductIds);
    }
  };

  const subtotal = cartItems
    .filter((item) => selectedItems.includes(item.ProductID))
    .reduce((sum, item) => sum + item.DiscountedPrice * item.Quantity, 0);

  // If cart is empty, show a message
  if (cartItems.length === 0) {
    return (
      <div className="container mx-auto px-4 py-8 pl-10 bg-gray-100 min-h-[80vh]">
        <h1 className="text-3xl font-semibold mb-8 flex items-center gap-3">
          <FiShoppingCart size={30} />
          Shopping Cart
        </h1>
        <div className="bg-white p-8 shadow-2xl rounded-lg text-center max-w-2xl mx-auto">
          <p className="text-xl font-bold mb-4">Your cart is empty!</p>
          <p className="text-gray-600 mb-6 font-medium">
            Looks like you haven&apos;t added any items to your cart yet.
          </p>
          <Link
            to="/dashboard"
            className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 transition-colors"
          >
            Continue Shopping
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 pl-10 bg-gray-100">
      <h1 className="text-3xl font-semibold mb-1 flex items-center gap-3 text-gray-700 ml-5">
        <FiShoppingCart size={30} />
        Shopping Cart
      </h1>

      {/* Select All row using clickable text */}
      <div className="bg-gray-100 max-w-[150px] p-4">
        {inStockProductIds.length === 0 ? (
          <span className="font-medium">No items available to select</span>
        ) : (
          <span
            onClick={toggleSelectAll}
            className="font-medium text-blue-600 cursor-pointer"
          >
            {allInStockSelected ? "Deselect All" : "Select All"}
          </span>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Cart Items */}
        <div className="lg:col-span-2">
          {cartItems.map((item) => (
            <div
              key={item.ProductID}
              className="bg-white p-6 shadow-xl mb-0 border-b border-t border-gray-300"
            >
              <div className="flex items-center gap-4 mb-4">
                <input
                  type="checkbox"
                  checked={selectedItems.includes(item.ProductID)}
                  onChange={() => toggleSelection(item.ProductID)}
                  className="h-5 w-5 text-blue-600 cursor-pointer"
                  disabled={item.Stock === 0}
                />
                <Link to={`/products/${item.ProductID}`} className="block">
                  <img
                    src={item.ImageURL}
                    alt={item.Name}
                    className="w-50 h-[200px] ml-5 object-contain"
                  />
                </Link>

                <div className="flex-1">
                  <Link to={`/products/${item.ProductID}`} className="block">
                    <h3 className="text-lg font-semibold hover:text-orange-700">
                      {item.Name}
                    </h3>
                  </Link>

                  {/* Stock Status */}
                  <p
                    className={`text-sm font-medium ${
                      item.Stock === 0 ? "text-red-600" : "text-green-600"
                    }`}
                  >
                    {item.Stock === 0 ? "Out of stock" : "In stock"}
                  </p>

                  {/* Is this a gift */}
                  <div className="flex items-center gap-2 mt-1 font-medium text-gray-600">
                    <input
                      type="checkbox"
                      checked={giftItems[item.ProductID] || false}
                      onChange={() => toggleGift(item.ProductID)}
                      className="h-4 w-4"
                    />
                    <span className="text-sm">This is a gift</span>
                  </div>

                  {/* ShopEase Badge */}
                  <div className="mt-2 inline-flex items-center p-1 bg-gradient-to-r from-purple-800 to-pink-600 border-2 rounded-lg text-white font-medium transform transition-transform duration-200 hover:scale-105 hover:shadow-lg">
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

                  {/* Display size if available */}
                  {item.Size && (
                    <p className="text-sm text-gray-700 font-medium mt-2">
                      Size: {item.Size.toUpperCase()}
                    </p>
                  )}

                  {/* Quantity buttons and Remove button */}
                  <div className="flex items-center gap-2 mt-8">
                    <div className="border-2 rounded-full px-1 border-orange-400">
                      <button
                        onClick={() =>
                          handleQuantityChange(
                            item.ProductID,
                            item.Quantity - 1
                          )
                        }
                        className="px-2 py-1 rounded-md cursor-pointer font-medium"
                        disabled={item.Stock === 0}
                      >
                        -
                      </button>
                      <span className="px-3 font-medium">{item.Quantity}</span>
                      <button
                        onClick={() =>
                          handleQuantityChange(
                            item.ProductID,
                            item.Quantity + 1
                          )
                        }
                        className="px-2 py-1 rounded-md cursor-pointer font-medium"
                        disabled={item.Stock === 0}
                      >
                        +
                      </button>
                    </div>
                    <button
                      onClick={() => handleRemove(item.ProductID)}
                      className="text-red-600 hover:text-red-800 font-medium cursor-pointer ml-4"
                    >
                      Remove
                    </button>
                  </div>
                </div>

                {/* Price aligned to the right */}
                <div className="text-right">
                  <p className="text-gray-700 font-bold text-lg">
                    ₹{item.DiscountedPrice.toFixed(2)}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Subtotal */}
        <div className="bg-white p-6 shadow-xl h-fit sticky top-20">
          <div className="flex items-center mb-5 gap-4 text-gray-700">
            <FaReceipt />
            <h2 className="text-xl font-bold text-gray-700">Order Summary</h2>
          </div>

          {/* Display selected items */}
          {selectedItems.length > 0 ? (
            <div className="mb-4">
              <h3 className="text-md font-semibold mb-2">Selected Items:</h3>
              <ul className="max-h-40 overflow-y-auto border rounded-md p-3 border-gray-300 bg-gray-50">
                {cartItems
                  .filter((item) => selectedItems.includes(item.ProductID))
                  .map((item) => (
                    <li
                      key={item.ProductID}
                      className="text-sm flex justify-between"
                    >
                      <span className="truncate font-base w-60 font-medium text-gray-600">
                        {item.Name}
                      </span>
                      <span className="font-medium text-gray-600">
                        x {item.Quantity}
                      </span>
                    </li>
                  ))}
              </ul>
            </div>
          ) : (
            <p className="text-gray-500 text-sm mb-4 font-medium">
              No items selected
            </p>
          )}

          {/* Subtotal */}
          <div className="flex justify-between mb-4">
            <span className="font-medium">
              Subtotal ({selectedItems.length} items):
            </span>
            <span className="font-bold text-green-700">
              ₹{subtotal.toFixed(2)}
            </span>
          </div>

          {/* Checkout Button */}
          <button
            disabled={selectedItems.length === 0}
            onClick={handleCheckout}
            className={`w-full py-3 rounded-md font-medium ${
              selectedItems.length === 0
                ? "bg-gray-300 cursor-not-allowed text-gray-600"
                : "bg-blue-600 hover:bg-blue-700 text-white cursor-pointer"
            }`}
          >
            Proceed to Checkout
          </button>
        </div>
      </div>
    </div>
  );
};

export default CartPage;
