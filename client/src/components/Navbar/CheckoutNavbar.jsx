import { Link } from "react-router-dom";
import { FiLock } from "react-icons/fi";

const CheckoutNavbar = () => {
  return (
    <nav className="sticky top-0 z-50 flex items-center justify-between px-8 py-4 bg-gray-800">
      {/* Logo */}
      <Link
        to="/"
        className="text-2xl font-bold text-white hover:text-gray-200 transition duration-300"
      >
        ShopEase
      </Link>

      {/* Secure Checkout Info */}
      <div className="flex items-center space-x-2">
        <FiLock size={20} className="text-white" />
        <span className="text-white text-sm font-medium">Secure Checkout</span>
      </div>
    </nav>
  );
};

export default CheckoutNavbar;
