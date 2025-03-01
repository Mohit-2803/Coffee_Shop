/* eslint-disable react/prop-types */
import { IoCheckmarkCircle, IoClose } from "react-icons/io5";

const OrderCancelledModal = ({ onClose, message }) => {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/70 z-50 backdrop-blur-sm">
      <div className="bg-white p-8 rounded-2xl max-w-md w-full relative shadow-2xl mx-4 border border-gray-100">
        <button
          onClick={onClose}
          className="absolute top-5 right-5 text-gray-500 hover:text-gray-700 transition-colors cursor-pointer"
        >
          <IoClose className="w-7 h-7" />
        </button>

        <div className="flex flex-col items-center text-center">
          {/* Animated checkmark with gradient */}
          <div className="mb-6 relative">
            <div className="absolute inset-0 bg-gradient-to-r from-red-500 to-orange-500 rounded-full blur-lg opacity-30 animate-pulse"></div>
            <IoCheckmarkCircle className="w-20 h-20 text-red-500 relative z-10" />
          </div>

          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Order Cancellation Complete
          </h2>

          <div className="space-y-4 text-gray-600 mb-6">
            <p className="leading-relaxed">
              {message ||
                "Your order cancellation has been successfully processed."}
            </p>

            <div className="bg-gray-50 p-4 rounded-xl text-left">
              <p className="text-sm font-medium mb-2">
                <span className="block text-gray-500 text-xs mb-1">
                  Refund Timeline:
                </span>
                <span className="text-green-600">5-7 business days</span>
              </p>
              <p className="text-sm">
                We&lsquo;ve sent confirmation to your registered email address.
              </p>
            </div>
          </div>

          <div className="w-full border-t border-gray-400 pt-6">
            <h3 className="text-sm font-semibold text-gray-500 uppercase mb-4">
              Need Help?
            </h3>
            <div className="flex flex-col space-y-2">
              <a
                href="mailto:support@shopease.com"
                className="flex items-center justify-center gap-2 text-blue-600 hover:text-blue-700 transition-colors"
              >
                <svg
                  className="w-5 h-5"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 14H4V8l8 5 8-5v10zm-8-7L4 6h16l-8 5z" />
                </svg>
                support@shopease.com
              </a>
              <a
                href="tel:18007766327"
                className="flex items-center justify-center gap-2 text-gray-600 hover:text-gray-800 transition-colors"
              >
                <svg
                  className="w-5 h-5"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M6.62 10.79c1.44 2.83 3.76 5.14 6.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2z" />
                </svg>
                1-800-SHOPEASE
              </a>
            </div>
          </div>

          <button
            onClick={onClose}
            className="mt-8 cursor-pointer w-full py-3 px-6 bg-gradient-to-r from-red-500 to-orange-500 text-white rounded-xl font-semibold hover:shadow-lg transition-all transform hover:scale-[1.02]"
          >
            Close Notification
          </button>
        </div>
      </div>
    </div>
  );
};

export default OrderCancelledModal;
