/* eslint-disable no-unused-vars */
import axios from "axios";

/**
 * Fetch order details from the backend by OrderID.
 *
 * @param {number} orderId - The ID of the order.
 * @returns {Promise<Object>} - A promise that resolves to the order details.
 * @throws {Error} - If there is an error fetching the order.
 */
export const fetchOrderById = async (orderId) => {
  try {
    const response = await axios.get(
      `${import.meta.env.VITE_FRONTEND_URL}/api/orders/getOrderById/${orderId}`
    );
    return response.data;
  } catch (error) {
    console.error("Error fetching order by ID:", error);
    throw error;
  }
};

/**
 * Processes an order-related request from the user input.
 *
 * @param {string} userInput - The input from the user.
 * @returns {Promise<string>} - A promise that resolves to a reply message.
 */
export const processOrderRequest = async (userInput) => {
  // Use a regex to extract the first occurrence of a number (order ID) from the input.
  const orderIdMatch = userInput.match(/\d+/);
  if (!orderIdMatch) {
    return "I see you are asking about orders.\nPlease enter your Order ID:";
  }

  const orderId = Number(orderIdMatch[0]);
  if (isNaN(orderId)) {
    return "Invalid order ID provided.";
  }

  try {
    const order = await fetchOrderById(orderId);
    if (order && order.CreatedAt && order.OrderID) {
      const orderDate = new Date(order.CreatedAt).toLocaleDateString();
      let reply =
        `Your order with order ID: ${order.OrderID} was placed on ${orderDate}.\n` +
        `The order Amount: Rs. ${order.Amount}\n` +
        `Address: ${order.Address}.\n`;

      // If delivery status is "Pending", ask if the user wants to cancel the order.
      if (
        order.DeliveryStatus &&
        order.DeliveryStatus.toLowerCase() === "pending"
      ) {
        reply +=
          "\n\nYour order is currently pending. Would you like to cancel your order?";
      }

      return reply;
    } else {
      return "No order found with that ID.";
    }
  } catch (error) {
    return "No order found with that ID.";
  }
};
