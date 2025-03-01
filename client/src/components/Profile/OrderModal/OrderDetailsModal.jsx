/* eslint-disable react/prop-types */
import { useState } from "react";
import { IoClose } from "react-icons/io5";

const OrderDetailsModal = ({ order, onClose, onCancelOrder }) => {
  const [confirming, setConfirming] = useState(false);
  // Parse the ItemQuantity string into an array
  const quantities = order.ItemQuantity ? JSON.parse(order.ItemQuantity) : [];

  const handleCancelClick = () => setConfirming(true);
  const handleConfirmCancel = () => onCancelOrder(order.OrderID);
  const handleCancelConfirmation = () => setConfirming(false);

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/70 z-50">
      <div className="bg-white p-8 rounded-lg max-w-2xl w-full relative shadow-lg mx-4">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-600 hover:text-gray-800 cursor-pointer"
        >
          <IoClose size={24} />
        </button>

        <h2 className="text-2xl font-bold mb-6 border-b border-gray-400 pb-3">
          Order Details
        </h2>

        {/* Order Summary Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
          <div className="space-y-2">
            <DetailItem label="Order ID" value={order.OrderID} />
            <DetailItem
              label="Placed on"
              value={new Date(order.CreatedAt).toLocaleDateString("en-IN", {
                weekday: "long",
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            />
            <StatusBadge
              status={order.DeliveryStatus}
              label="Delivery Status"
            />
          </div>

          <div className="space-y-2">
            <DetailItem
              label="Address"
              value={order.Address}
              className="break-words"
            />
            <DetailItem
              label="Amount Paid"
              value={`₹${order.Amount}`}
              valueClassName="text-green-700 font-semibold"
            />
            <StatusBadge
              status={order.OrderStatus}
              label="Seller Status"
              customStyles="bg-blue-100 text-blue-800"
            />
          </div>
        </div>

        {/* Purchased Items Section */}
        {order.ProductDetails?.length > 0 && (
          <div className="border-t border-gray-400 pt-6">
            <h3 className="text-xl font-semibold mb-4">
              Purchased Items ({order.ProductDetails.length})
            </h3>
            {/* Wrap in a scrollable container if more than 2 products */}
            <div
              className={
                order.ProductDetails.length > 2
                  ? "max-h-[200px] overflow-y-auto"
                  : ""
              }
            >
              <div className="grid gap-4 md:grid-cols-2">
                {order.ProductDetails.map((product, index) => (
                  <div
                    key={product.ProductID}
                    className="flex gap-4 p-3 border border-gray-300 rounded-lg hover:bg-gray-50"
                  >
                    <div className="flex-shrink-0 w-20 h-20 border border-gray-100 rounded-md overflow-hidden bg-white">
                      <img
                        src={product.ImageURL}
                        alt={product.Name}
                        className="w-full h-full object-contain p-1"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-medium truncate">{product.Name}</h4>
                      <div className="text-sm text-gray-600 mt-1">
                        <p>Quantity: {quantities[index] || 1}</p>
                        {product.Discount > 0 && (
                          <p className="text-green-600">
                            Saved ₹
                            {((product.Price * product.Discount) / 100).toFixed(
                              2
                            )}
                          </p>
                        )}
                      </div>
                      <div className="flex items-baseline gap-2 mt-1">
                        <span className="font-semibold">
                          ₹
                          {(
                            product.Price -
                            (product.Price * product.Discount) / 100
                          ).toFixed(2)}
                        </span>
                        {product.Discount > 0 && (
                          <span className="text-sm text-gray-500 line-through">
                            ₹{product.Price}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Order Cancellation Section */}
        {order.DeliveryStatus.toLowerCase() === "pending" && (
          <div className="mt-8 pt-6 border-t border-gray-400">
            {!confirming ? (
              <button
                onClick={handleCancelClick}
                className="w-full py-2.5 px-6 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition-colors font-medium cursor-pointer"
              >
                Request Order Cancellation
              </button>
            ) : (
              <div className="p-4 bg-red-50 rounded-lg border border-red-200">
                <p className="text-red-700 font-medium mb-4">
                  Confirm order cancellation? This action cannot be undone.
                </p>
                <div className="flex gap-3 justify-end">
                  <button
                    onClick={handleCancelConfirmation}
                    className="px-5 py-2 text-gray-700 cursor-pointer font-medium hover:bg-gray-100 rounded-md transition-colors"
                  >
                    Go Back
                  </button>
                  <button
                    onClick={handleConfirmCancel}
                    className="px-5 py-2 bg-red-600 cursor-pointer font-medium text-white hover:bg-red-700 rounded-md transition-colors"
                  >
                    Confirm Cancellation
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

const DetailItem = ({ label, value, className, valueClassName }) => (
  <div className={`flex gap-2 ${className}`}>
    <span className="font-medium text-gray-600">{label}:</span>
    <span className={`${valueClassName || "text-gray-800"}`}>{value}</span>
  </div>
);

const StatusBadge = ({ status, label, customStyles }) => (
  <div className="flex gap-2 items-center">
    <span className="font-medium text-gray-600">{label}:</span>
    <span
      className={`px-2.5 py-1 rounded-full text-sm font-medium ${
        customStyles ||
        (status.toLowerCase() === "pending"
          ? "bg-yellow-100 text-yellow-800"
          : status.toLowerCase() === "cancelled"
          ? "bg-red-100 text-red-800"
          : "bg-green-100 text-green-800")
      }`}
    >
      {status}
    </span>
  </div>
);

export default OrderDetailsModal;
