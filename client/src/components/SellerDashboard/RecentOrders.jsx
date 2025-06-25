import { useEffect, useState } from "react";
import { getOrdersByEmail } from "../../api/orderApi";
import { auth } from "../../config/firebaseConfig";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import OrderModal from "./OrderModal/OrderModal";

const RecentOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const navigate = useNavigate();

  // Helper function to return Tailwind classes based on order status
  const getStatusColor = (status) => {
    switch (status.toLowerCase()) {
      case "delivered":
        return "bg-green-100 text-green-700";
      case "shipped":
        return "bg-blue-100 text-blue-700";
      case "pending":
        return "bg-yellow-100 text-yellow-700";
      case "cancelled":
        return "bg-red-100 text-red-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const email = auth.currentUser?.email;
        if (!email) {
          toast.error("User not logged in");
          setLoading(false);
          return;
        }
        // Call your API using the provided function
        const response = await getOrdersByEmail(email);
        // Sort orders by CreatedAt (most recent first)
        const sortedOrders = response.data.sort(
          (a, b) => new Date(b.CreatedAt) - new Date(a.CreatedAt)
        );
        // Get only the latest 5 orders
        setOrders(sortedOrders.slice(0, 5));
      } catch (error) {
        console.error("Error fetching recent orders:", error);
        toast.error("Error fetching recent orders");
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  // When a user clicks an order row, open the modal
  const handleOrderClick = (order) => {
    setSelectedOrder(order);
  };

  const handleViewAll = () => {
    navigate("/sell/dashboard/orders");
  };

  if (loading) {
    return (
      <div className="p-6 bg-white rounded-xl shadow-sm">
        <p>Loading recent orders...</p>
      </div>
    );
  }

  return (
    <div className="p-6 bg-white rounded-xl shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold">Recent Orders</h3>
        <button
          className="text-sm text-blue-600 hover:text-blue-900 font-bold cursor-pointer"
          onClick={handleViewAll}
        >
          View All
        </button>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full min-w-[500px] font-medium">
          <thead>
            <tr className="border-b border-gray-200">
              <th className="py-2 text-left text-sm font-medium">Order ID</th>
              <th className="py-2 text-left text-sm font-medium">Customer</th>
              <th className="py-2 text-left text-sm font-medium">Date</th>
              <th className="py-2 text-left text-sm font-medium">Status</th>
              <th className="py-2 text-left text-sm font-medium">Total</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => (
              <tr
                key={order.OrderID}
                onClick={() => handleOrderClick(order)}
                className="border-b border-gray-200 cursor-pointer hover:bg-gray-200"
              >
                <td className="py-3 text-sm">#{order.OrderID}</td>
                <td className="py-3 text-sm">{order.UserName}</td>
                <td className="py-3 text-sm">
                  {new Date(order.CreatedAt).toLocaleDateString()}
                </td>
                <td className="py-3 text-sm">
                  <span
                    className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(
                      order.DeliveryStatus
                    )}`}
                  >
                    {order.DeliveryStatus}
                  </span>
                </td>
                <td className="py-3 text-sm text-green-800 font-bold">
                  ₹{order.Amount}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {selectedOrder && (
        <OrderModal
          order={selectedOrder}
          onClose={() => setSelectedOrder(null)}
          onStatusChange={(orderId, newStatus) => {
            setOrders((prevOrders) =>
              prevOrders.map((order) =>
                order.OrderID === orderId
                  ? { ...order, DeliveryStatus: newStatus }
                  : order
              )
            );
          }}
        />
      )}
    </div>
  );
};

export default RecentOrders;
