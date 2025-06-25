import { Link, useLocation } from "react-router-dom";
import {
  ArrowUpIcon,
  ShoppingBagIcon,
  ShoppingCartIcon,
  ChartBarIcon,
} from "@heroicons/react/24/outline";

const Sidebar = () => {
  const location = useLocation(); // Hook to get the current location (route)

  // Helper function to check if the current path matches the link's path
  const isActive = (path) => {
    return location.pathname === path
      ? "bg-blue-100 text-blue-700"
      : "hover:bg-gray-100 hover:text-gray-800";
  };

  return (
    <div className="w-64 min-h-auto p-4 bg-gray-800 text-white pb-0">
      <h2 className="text-xl font-semibold text-gray-400 mb-6">Navigations</h2>
      <nav className="flex flex-col space-y-5">
        {/* Dashboard Link */}
        <Link to="/sell/dashboard">
          <button
            className={`w-full flex items-center cursor-pointer p-2 rounded-lg ${isActive(
              "/sell/dashboard"
            )} font-medium`}
          >
            <ArrowUpIcon className="w-5 h-5 mr-2" />
            Dashboard
          </button>
        </Link>

        {/* Products Link */}
        <Link to="/sell/dashboard/products">
          <button
            className={`w-full flex items-center cursor-pointer p-2 rounded-lg ${isActive(
              "/sell/dashboard/products"
            )} font-medium`}
          >
            <ShoppingBagIcon className="w-5 h-5 mr-2" />
            Products
          </button>
        </Link>

        {/* Orders Link */}
        <Link to="/sell/dashboard/orders">
          <button
            className={`w-full flex items-center cursor-pointer p-2 rounded-lg ${isActive(
              "/sell/dashboard/orders"
            )} font-medium`}
          >
            <ShoppingCartIcon className="w-5 h-5 mr-2" />
            Orders
          </button>
        </Link>

        {/* Analytics Link */}
        <Link to="/sell/dashboard/analytics">
          <button
            className={`w-full flex items-center cursor-pointer p-2 rounded-lg ${isActive(
              "/sell/dashboard/analytics"
            )} font-medium`}
          >
            <ChartBarIcon className="w-5 h-5 mr-2" />
            Analytics
          </button>
        </Link>
      </nav>
    </div>
  );
};

export default Sidebar;
