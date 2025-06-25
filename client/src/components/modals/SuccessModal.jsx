/* eslint-disable react/prop-types */
// components/SuccessModal.jsx
import { DotLottieReact } from "@lottiefiles/dotlottie-react";

const SuccessModal = ({ onClose }) => {
  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
      <div className="bg-white p-8 rounded-lg shadow-lg max-w-md w-full">
        <div className="flex justify-center">
          <DotLottieReact
            src="https://lottie.host/cc613b98-f63c-492e-9dac-0b295dac2cbb/HbS9AHcxTC.lottie"
            loop
            autoplay
            style={{ width: "150px", height: "150px" }}
          />
        </div>
        <h2 className="text-2xl font-semibold text-center mt-4">
          Product Added to Cart!
        </h2>
        <p className="text-gray-600 text-center mt-2">
          Your item has been successfully added to your shopping cart.
        </p>
        <button
          onClick={onClose}
          className="mt-6 w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition-colors cursor-pointer"
        >
          Continue Shopping
        </button>
      </div>
    </div>
  );
};

export default SuccessModal;
