import { useEffect, useState } from "react";
import { getAuth } from "firebase/auth";
import axios from "axios";
import toast from "react-hot-toast";
import LoadingSpinner from "../Loading/LoadingSpinner";
import OrderDetailsModal from "./OrderModal/OrderDetailsModal";
import OrderCancelledModal from "./OrderModal/OrderCancelledModal";
import { Link } from "react-router-dom";

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [showCancelledModal, setShowCancelledModal] = useState(false);
  const auth = getAuth();
  const user = auth.currentUser;

  useEffect(() => {
    const fetchOrders = async () => {
      if (!user) return;
      try {
        const response = await axios.post(
          `${import.meta.env.VITE_FRONTEND_URL}/api/orders/get-orders`,
          { email: user.email }
        );
        console.log("orders", response);
        setOrders(response.data);
      } catch (error) {
        console.error("Error fetching orders:", error);
        toast.error("Failed to fetch orders.");
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [user]);

  const handleViewDetails = (order) => {
    setSelectedOrder(order);
  };

  const handleCloseModal = () => {
    setSelectedOrder(null);
  };

  const handleCancelOrder = async (orderId) => {
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_FRONTEND_URL}/api/orders/cancel-order`,
        { orderId, email: user.email }
      );
      toast.success(response.data.message || "Order cancelled successfully");
      // Refresh orders list after cancellation
      const refreshedOrders = await axios.post(
        `${import.meta.env.VITE_FRONTEND_URL}/api/orders/get-orders`,
        { email: user.email }
      );
      setOrders(refreshedOrders.data);
      setSelectedOrder(null);
      // Show cancellation confirmation modal
      setShowCancelledModal(true);
    } catch (error) {
      console.error("Error cancelling order:", error);
      toast.error("Failed to cancel order.");
    }
  };

  const handleCloseCancelledModal = () => {
    setShowCancelledModal(false);
  };

  if (loading) return <LoadingSpinner />;

  return (
    <div className="bg-white rounded-lg shadow-sm p-6 h-full">
      <h2 className="text-2xl font-semibold text-gray-700 mb-6">Your Orders</h2>
      {orders.length === 0 ? (
        <p className="font-medium text-center">No orders found.</p>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => {
            // Parse the ItemQuantity string into an array
            const quantities = order.ItemQuantity
              ? JSON.parse(order.ItemQuantity)
              : [];

            return (
              <div
                key={order.OrderID}
                className="border border-gray-300 rounded-lg p-4"
              >
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <p className="font-medium">Order ID #{order.OrderID}</p>
                    <p className="text-sm text-gray-500 font-medium">
                      Placed on {new Date(order.CreatedAt).toLocaleDateString()}
                    </p>
                  </div>
                  <span
                    className={`px-3 py-1 rounded-full text-sm font-medium ${
                      order.DeliveryStatus.toLowerCase() === "pending"
                        ? "bg-yellow-100 text-yellow-800"
                        : order.DeliveryStatus.toLowerCase() === "cancelled"
                        ? "bg-red-100 text-red-800"
                        : "bg-green-100 text-green-800"
                    }`}
                  >
                    {order.DeliveryStatus}
                  </span>
                </div>
                <div className="flex gap-4">
                  {order.ProductDetails && order.ProductDetails.length > 0 ? (
                    order.ProductDetails.map((product, index) => (
                      <div
                        key={index}
                        className="w-20 aspect-square bg-gray-100 rounded-lg overflow-hidden"
                      >
                        <Link
                          to={`/products/${product.ProductID}`}
                          className="block"
                        >
                          <img
                            src={product.ImageURL}
                            alt={product.Name}
                            className="w-full h-full object-cover"
                          />
                        </Link>
                      </div>
                    ))
                  ) : (
                    <div className="w-20 aspect-square bg-gray-200 rounded-lg" />
                  )}
                  <div>
                    {order.ProductDetails &&
                      order.ProductDetails.length > 0 && (
                        <>
                          <h3 className="font-medium">
                            <Link
                              to={`/products/${order.ProductDetails[0].ProductID}`}
                              className="block hover:text-orange-700"
                            >
                              {order.ProductDetails.length === 1
                                ? order.ProductDetails[0].Name
                                : order.ProductDetails[0].Name + " and more"}
                            </Link>
                          </h3>
                          {order.ProductDetails.length === 1 && (
                            <p className="text-gray-600">
                              Quantity: {quantities[0] || 1}
                            </p>
                          )}
                          <button
                            onClick={() => handleViewDetails(order)}
                            className="mt-2 text-blue-600 hover:text-blue-800 font-medium cursor-pointer"
                          >
                            Order Details
                          </button>
                        </>
                      )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
      {selectedOrder && (
        <OrderDetailsModal
          order={selectedOrder}
          onClose={handleCloseModal}
          onCancelOrder={handleCancelOrder}
        />
      )}
      {showCancelledModal && (
        <OrderCancelledModal
          onClose={handleCloseCancelledModal}
          message="Your order has been cancelled. Your refund (if applicable) will be processed within 5-7 business days."
        />
      )}
    </div>
  );
};

export default Orders;
