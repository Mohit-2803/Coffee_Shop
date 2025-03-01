/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import { useState, useEffect } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import {
  XMarkIcon,
  TruckIcon,
  CheckBadgeIcon,
  ClockIcon,
  BanknotesIcon,
} from "@heroicons/react/24/outline";
import { Spinner } from "@material-tailwind/react";

const OrderModal = ({ order, onClose, onStatusChange }) => {
  const [loading, setLoading] = useState(false);
  const [productDetails, setProductDetails] = useState([]);
  const [detailsLoading, setDetailsLoading] = useState(false);

  const statusConfig = {
    pending: { color: "bg-amber-100 text-amber-800", icon: ClockIcon },
    processing: { color: "bg-blue-100 text-blue-800", icon: TruckIcon },
    shipped: { color: "bg-indigo-100 text-indigo-800", icon: TruckIcon },
    delivered: { color: "bg-green-100 text-green-800", icon: CheckBadgeIcon },
    cancelled: { color: "bg-red-100 text-red-800", icon: XMarkIcon },
  };

  useEffect(() => {
    const fetchProductDetails = async () => {
      try {
        const productIds = JSON.parse(order.OrderItems) || [];
        const quantities = JSON.parse(order.ItemQuantity) || [];

        if (productIds.length > 0) {
          setDetailsLoading(true);
          const responses = await Promise.all(
            productIds.map((id) =>
              axios.get(
                `${
                  import.meta.env.VITE_FRONTEND_URL
                }/api/products/get-product/${id}`
              )
            )
          );

          setProductDetails(
            responses.map((res, index) => ({
              ...res.data,
              quantity: quantities[index] || 1,
            }))
          );
        }
      } catch (error) {
        toast.error("Error loading product details");
      } finally {
        setDetailsLoading(false);
      }
    };

    fetchProductDetails();
  }, [order]);

  const handleStatusUpdate = async (newStatus) => {
    try {
      setLoading(true);
      await axios.post("/api/orders/update-status", {
        orderId: order.OrderID,
        newStatus,
      });
      onStatusChange(order.OrderID, newStatus);
      toast.success(`Order marked as ${newStatus}`);
      onClose();
    } catch (error) {
      toast.error("Status update failed");
    } finally {
      setLoading(false);
    }
  };

  const StatusPill = ({ status }) => {
    const { color, icon: Icon } = statusConfig[status] || {};
    return (
      <div
        className={`${color} px-3 py-1 rounded-full text-sm flex items-center gap-2 w-fit`}
      >
        <Icon className="w-4 h-4" />
        <span className="capitalize">{status}</span>
      </div>
    );
  };

  return (
    <div className="fixed inset-0 bg-black/30 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="p-6 border-b border-gray-300 flex justify-between items-start">
          <div>
            <h2 className="text-2xl font-bold flex items-center gap-3">
              Order # {order.OrderID}
              <StatusPill status={order.DeliveryStatus.toLowerCase()} />
            </h2>
            <p className="text-gray-500 mt-1 font-medium">
              {new Date(order.CreatedAt).toLocaleDateString("en-US", {
                weekday: "long",
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors cursor-pointer"
          >
            <XMarkIcon className="w-8 h-8" />
          </button>
        </div>

        {/* Main Content */}
        <div className="grid md:grid-cols-2 gap-8 p-6">
          {/* Order Metadata */}
          <div className="space-y-6">
            <Section title="Customer Information">
              <InfoRow label="Name" value={order.UserName} />
              <InfoRow label="Email" value={order.UserEmail} />
              <InfoRow label="Phone" value={order.Phone} />
              <InfoRow label="Address" value={order.Address} />
            </Section>

            <Section title="Payment Details">
              <InfoRow label="Amount" value={`₹${order.Amount}`} />
              <InfoRow label="Currency" value={order.Currency.toUpperCase()} />
              <InfoRow label="Payment Status" value={order.PaymentStatus} />
              <div className="flex items-center gap-2 mt-3">
                <BanknotesIcon className="w-5 h-5 text-green-600" />
                <span className="font-medium">Payment Method:</span>
                <span className="text-gray-600 font-medium">Online Card</span>
              </div>
            </Section>
          </div>

          {/* Products */}
          <Section title="Order Items">
            {detailsLoading ? (
              <div className="space-y-4">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="animate-pulse flex gap-4">
                    <div className="w-20 h-20 bg-gray-200 rounded-lg" />
                    <div className="flex-1 space-y-2">
                      <div className="h-4 bg-gray-200 rounded w-3/4" />
                      <div className="h-4 bg-gray-200 rounded w-1/2" />
                    </div>
                  </div>
                ))}
              </div>
            ) : productDetails.length > 0 ? (
              <div className="space-y-4">
                {productDetails.map((product) => (
                  <div key={product.ProductID} className="flex gap-4">
                    <img
                      src={product.ImageURL}
                      alt={product.Name}
                      className="min-w-20 h-20 object-contain rounded-lg border border-gray-300"
                    />
                    <div>
                      <h4 className="font-medium truncate w-[250px]">
                        {product.Name}
                      </h4>
                      <p className="text-gray-600 font-medium text-sm">
                        {product.Brand} • {product.Category}
                      </p>
                      <div className="flex gap-4 mt-2 font-medium text-sm">
                        <div>
                          <span className="text-gray-500">Qty:</span>{" "}
                          {product.quantity}
                        </div>
                        <div>
                          <span className="text-gray-500">Price:</span> ₹
                          {product.Price}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500">No products found</p>
            )}
          </Section>
        </div>

        {/* Actions */}
        <div className="p-6 border-t border-gray-400 bg-gray-50 rounded-b-xl">
          <div className="flex flex-wrap gap-4 justify-end">
            {order.DeliveryStatus.toLowerCase() === "pending" && (
              <>
                <ActionButton
                  label="Accept Order"
                  onClick={() => handleStatusUpdate("processing")}
                  color="bg-green-600 hover:bg-green-700 cursor-pointer"
                  loading={loading}
                />
                <ActionButton
                  label="Reject Order"
                  onClick={() => handleStatusUpdate("cancelled")}
                  color="bg-red-600 hover:bg-red-700 cursor-pointer"
                  loading={loading}
                />
              </>
            )}

            {order.DeliveryStatus.toLowerCase() === "processing" && (
              <ActionButton
                label="Mark as Shipped"
                onClick={() => handleStatusUpdate("shipped")}
                color="bg-indigo-600 hover:bg-indigo-700 cursor-pointer"
                loading={loading}
              />
            )}

            {order.DeliveryStatus.toLowerCase() === "shipped" && (
              <ActionButton
                label="Confirm Delivery"
                onClick={() => handleStatusUpdate("delivered")}
                color="bg-green-600 hover:bg-green-700 cursor-pointer"
                loading={loading}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

// Reusable Components
const Section = ({ title, children }) => (
  <div>
    <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
      {title}
    </h3>
    <div className="space-y-4">{children}</div>
  </div>
);

const InfoRow = ({ label, value }) => (
  <div className="flex justify-between items-center py-2 border-b border-gray-300">
    <span className="text-gray-500 font-medium">{label}:</span>
    <span className="font-medium">{value}</span>
  </div>
);

const ActionButton = ({ label, onClick, color, loading }) => (
  <button
    onClick={onClick}
    disabled={loading}
    className={`${color} text-white px-6 py-2 rounded-lg font-medium transition-all flex items-center gap-2`}
  >
    {loading ? <Spinner className="w-4 h-4" /> : label}
  </button>
);

export default OrderModal;
