import axios from "axios";

// Get orders by seller email
export const getOrdersByEmail = async (email) => {
  const response = await axios.post(
    `${import.meta.env.VITE_FRONTEND_URL}/api/orders/seller`,
    {
      email,
    }
  );
  return response;
};

// Update order status
export const updateOrderStatus = async (orderId, newStatus) => {
  const response = await axios.put(
    `${import.meta.env.VITE_FRONTEND_URL}/api/orders/update-status`,
    {
      orderId,
      newStatus,
    }
  );
  return response;
};
