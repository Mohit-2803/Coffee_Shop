/* eslint-disable react/prop-types */
import { useEffect, useState } from "react";
import Sidebar from "../Sidebar/Sidebar";
import { getOrdersByEmail, updateOrderStatus } from "../../api/orderApi";
import { auth } from "../../config/firebaseConfig";
import {
  ArrowPathIcon,
  MagnifyingGlassIcon,
} from "@heroicons/react/24/outline";
import OrderModal from "./OrderModal/OrderModal";
import toast, { Toaster } from "react-hot-toast";

const SellerOrders = () => {
  const [orders, setOrders] = useState([]);
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const ordersPerPage = 20;

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const sellerEmail = auth.currentUser?.email;
        const response = await getOrdersByEmail(sellerEmail);
        setOrders(response.data);
        setFilteredOrders(response.data);
      } catch (error) {
        console.error("Error fetching orders:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  useEffect(() => {
    const result = orders.filter((order) => {
      const matchesSearch =
        order.OrderID.toString().includes(searchTerm) ||
        order.UserName.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesStatus =
        selectedStatus === "all" ||
        order.DeliveryStatus.toLowerCase() === selectedStatus.toLowerCase();

      return matchesSearch && matchesStatus;
    });
    setFilteredOrders(result);
    setCurrentPage(1); // reset to first page when filters change
  }, [searchTerm, selectedStatus, orders]);

  // Calculate current orders for pagination
  const indexOfLastOrder = currentPage * ordersPerPage;
  const indexOfFirstOrder = indexOfLastOrder - ordersPerPage;
  const currentOrders = filteredOrders.slice(
    indexOfFirstOrder,
    indexOfLastOrder
  );
  const totalPages = Math.ceil(filteredOrders.length / ordersPerPage);

  // When a user clicks an order row, open the modal
  const handleOrderClick = (order) => {
    setSelectedOrder(order);
  };

  const handleStatusUpdate = async (orderId, newStatus) => {
    try {
      await updateOrderStatus(orderId, newStatus);
      setOrders((prevOrders) =>
        prevOrders.map((order) =>
          order.OrderID === orderId
            ? { ...order, DeliveryStatus: newStatus }
            : order
        )
      );
      toast.success(`The order ${orderId} ${newStatus} successfuly`);
    } catch (error) {
      console.error("Error updating order status:", error);
    }
  };

  const StatusBadge = ({ status }) => {
    const statusColors = {
      pending: "bg-yellow-100 text-yellow-800",
      processing: "bg-blue-100 text-blue-800",
      shipped: "bg-indigo-100 text-indigo-800",
      delivered: "bg-green-100 text-green-800",
      cancelled: "bg-red-100 text-red-800",
    };

    return (
      <span
        className={`px-3 py-1 rounded-full text-sm ${
          statusColors[status.toLowerCase()] || "bg-gray-100"
        }`}
      >
        {status}
      </span>
    );
  };

  const OrderActions = ({ order }) => {
    const actions = {
      pending: [
        {
          label: "Accept",
          action: "processing",
          color: "bg-blue-600 hover:bg-blue-700",
        },
        {
          label: "Reject",
          action: "cancelled",
          color: "bg-red-600 hover:bg-red-700",
        },
      ],
      processing: [
        {
          label: "Mark as Shipped",
          action: "shipped",
          color: "bg-indigo-600 hover:bg-indigo-700",
        },
      ],
      shipped: [
        {
          label: "Mark as Delivered",
          action: "delivered",
          color: "bg-green-600 hover:bg-green-700",
        },
      ],
    };

    const currentActions = actions[order.DeliveryStatus.toLowerCase()] || [];

    return (
      <div className="flex gap-2">
        {currentActions.map((action, index) => (
          <button
            key={index}
            onClick={(e) => {
              // Prevent row onClick from firing when clicking on a button
              e.stopPropagation();
              handleStatusUpdate(order.OrderID, action.action);
            }}
            className={`${action.color} text-white px-3 py-1 rounded-md text-sm transition-colors cursor-pointer`}
          >
            {action.label}
          </button>
        ))}
      </div>
    );
  };

  if (loading) {
    return (
      <div className="flex min-h-screen bg-gray-50">
        <Sidebar />
        <div className="flex-1 p-8 flex items-center justify-center">
          <ArrowPathIcon className="w-12 h-12 text-blue-600 animate-spin" />
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-gray-100 text-gray-900">
      <Sidebar />
      <div className="flex-1 p-8">
        <div className="mb-6 flex flex-col md:flex-row gap-4 justify-between items-start md:items-center">
          <h1 className="text-2xl font-semibold text-gray-700">
            Order Management Portal
          </h1>
          <div className="w-full md:w-auto flex gap-4">
            <div className="relative flex-1">
              <input
                type="text"
                placeholder="Search by Order ID or Customer"
                className="pl-10 pr-4 py-2 border border-gray-300 outline-orange-700 rounded-lg w-full md:w-64 cursor-pointer"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <MagnifyingGlassIcon className="w-5 h-5 absolute left-3 top-3 text-gray-400" />
            </div>
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="px-4 py-2 border border-gray-300 cursor-pointer rounded-lg bg-white"
            >
              <option value="all">All Statuses</option>
              <option value="pending">Pending</option>
              <option value="processing">Processing</option>
              <option value="shipped">Shipped</option>
              <option value="delivered">Delivered</option>
              <option value="cancelled">Cancelled</option>
            </select>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-4 text-left text-md font-bold text-gray-800">
                  Order ID
                </th>
                <th className="px-6 py-4 text-left text-md font-bold text-gray-800">
                  Customer
                </th>
                <th className="px-6 py-4 text-left text-md font-bold text-gray-800">
                  Date
                </th>
                <th className="px-6 py-4 text-left text-md font-bold text-gray-800">
                  Status
                </th>
                <th className="px-6 py-4 text-left text-md font-bold text-gray-800">
                  Total
                </th>
                <th className="px-6 py-4 text-left text-md font-bold text-gray-800">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {currentOrders.map((order) => (
                <tr
                  key={order.OrderID}
                  onClick={() => handleOrderClick(order)}
                  className="hover:bg-gray-200 transition-colors cursor-pointer"
                >
                  <td className="px-6 py-4 text-sm font-medium">
                    #{order.OrderID}
                  </td>
                  <td className="px-6 py-4 text-sm font-medium">
                    {order.UserName}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500">
                    <span className="font-medium">
                      {new Date(order.CreatedAt).toLocaleDateString()}
                    </span>
                  </td>
                  <td className="px-6 py-4 font-medium">
                    <StatusBadge status={order.DeliveryStatus} />
                  </td>
                  <td className="px-6 py-4 text-md font-bold text-green-700">
                    ₹{order.Amount}
                  </td>
                  <td className="px-6 py-4 font-medium">
                    <OrderActions order={order} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {filteredOrders.length === 0 && (
            <div className="p-12 text-center text-gray-500 font-medium">
              No orders found matching your criteria
            </div>
          )}
        </div>

        {/* Pagination Controls */}
        {totalPages > 1 && (
          <div className="mt-4 flex justify-center items-center gap-2">
            <button
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className="px-3 py-1 border border-gray-400 rounded-md disabled:opacity-50 cursor-pointer"
            >
              Prev
            </button>
            {Array.from({ length: totalPages }, (_, index) => (
              <button
                key={index + 1}
                onClick={() => setCurrentPage(index + 1)}
                className={`px-3 py-1 border border-gray-400  rounded-md ${
                  currentPage === index + 1
                    ? "bg-blue-600 text-white cursor-pointer"
                    : "bg-white text-gray-700 cursor-pointer"
                }`}
              >
                {index + 1}
              </button>
            ))}
            <button
              onClick={() =>
                setCurrentPage((prev) => Math.min(prev + 1, totalPages))
              }
              disabled={currentPage === totalPages}
              className="px-3 py-1 border border-gray-400  rounded-md disabled:opacity-50 cursor-pointer"
            >
              Next
            </button>
          </div>
        )}
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

      <Toaster position="top-center" />
    </div>
  );
};

export default SellerOrders;
