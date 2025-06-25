import {
  FaFacebook,
  FaTwitter,
  FaInstagram,
  FaCcVisa,
  FaCcMastercard,
  FaCcAmex,
} from "react-icons/fa";

const CheckoutFooter = () => {
  return (
    <footer className="bg-gray-900 text-white py-8">
      <div className="container mx-auto px-4">
        {/* Top Section: Logo and Social Links */}
        <div className="flex flex-col md:flex-row justify-between items-center border-b border-gray-700 pb-4 mb-4">
          <div className="text-center md:text-left mb-4 md:mb-0">
            <h2 className="text-2xl font-bold">ShopEase</h2>
            <p className="text-sm text-gray-400">
              Your Secure Checkout Experience
            </p>
          </div>
          <div className="flex space-x-4">
            <a
              href="https://facebook.com"
              target="_blank"
              rel="noopener noreferrer"
            >
              <FaFacebook className="w-6 h-6 hover:text-blue-500" />
            </a>
            <a
              href="https://twitter.com"
              target="_blank"
              rel="noopener noreferrer"
            >
              <FaTwitter className="w-6 h-6 hover:text-blue-400" />
            </a>
            <a
              href="https://instagram.com"
              target="_blank"
              rel="noopener noreferrer"
            >
              <FaInstagram className="w-6 h-6 hover:text-pink-500" />
            </a>
          </div>
        </div>

        {/* Middle Section: Payment Methods and Security Info */}
        <div className="flex flex-col md:flex-row justify-between items-center mb-4">
          <div className="flex items-center space-x-2">
            <span className="text-sm text-gray-400">We Accept:</span>
            <FaCcVisa className="w-8 h-8" />
            <FaCcMastercard className="w-8 h-8" />
            <FaCcAmex className="w-8 h-8" />
          </div>
          <div>
            <p className="text-sm text-gray-400">
              Secure Checkout powered by Stripe
            </p>
          </div>
        </div>

        {/* Bottom Section: Copyright and Contact */}
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="text-sm">
            <p>© 2025 ShopEase. All rights reserved.</p>
          </div>
          <div className="mt-4 md:mt-0">
            <p className="text-sm">
              Customer Support:{" "}
              <a
                href="mailto:support@shopease.com"
                className="text-blue-400 hover:underline"
              >
                support@shopease.com
              </a>
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default CheckoutFooter;
