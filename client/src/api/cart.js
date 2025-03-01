import axios from "axios";

// Get Cart Items for a specific user (by email)
export const getCartItems = async (email) => {
  const response = await axios.get(
    `${import.meta.env.VITE_FRONTEND_URL}/api/carts/get-cart/${email}`
  );
  return response.data;
};

// Add item to Cart (using email)
export const addToCart = async (email, productId, quantity) => {
  const response = await axios.put(
    `${import.meta.env.VITE_FRONTEND_URL}/api/carts/add`,
    {
      email,
      productId,
      quantity,
    }
  );
  return response.data;
};

// Remove item from Cart (using email)
export const removeFromCart = async (email, productId) => {
  const response = await axios.delete(
    `${import.meta.env.VITE_FRONTEND_URL}/api/carts/remove`,
    {
      data: { email, productId },
    }
  );
  return response.data;
};

// api/cart.js
export const updateCartQuantity = async (email, productId, quantity) => {
  const response = await axios.put(
    `${import.meta.env.VITE_FRONTEND_URL}/api/carts/update`,
    {
      email,
      productId,
      quantity,
    }
  );
  return response.data;
};
