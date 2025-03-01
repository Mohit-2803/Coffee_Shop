import { useState, useEffect, useRef } from "react";
import { getAuth, signOut } from "firebase/auth";
import { Link } from "react-router-dom";
import { FiSettings } from "react-icons/fi";

const SellNavbar = () => {
  const auth = getAuth();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Close the dropdown if clicked outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <nav className="sticky top-0 z-50 flex items-center justify-between px-8 py-4 bg-gray-800">
      {/* Logo */}
      <Link
        to="/dashboard"
        className="text-2xl font-normal text-white hover:text-gray-200 transition duration-300"
      >
        ShopEase{" "}
        <span className="text-base font-normal text-gray-300">
          Seller Central
        </span>
      </Link>

      {/* Settings Dropdown */}
      <div className="relative" ref={dropdownRef}>
        <button
          onClick={() => setIsDropdownOpen(!isDropdownOpen)}
          className="flex items-center space-x-2 text-white hover:text-green-600 font-medium transition duration-300 cursor-pointer"
        >
          <span>Settings</span>
          <FiSettings size={24} />
        </button>
        {isDropdownOpen && (
          <div className="absolute right-0 mt-2 w-40 bg-white shadow-lg rounded-md overflow-hidden z-50">
            <button
              onClick={() => signOut(auth)}
              className="w-full text-left px-4 py-2 text-gray-700 cursor-pointer hover:text-blue-700 font-medium  transition hover:bg-blue-300 duration-300"
            >
              Logout
            </button>
          </div>
        )}
      </div>
    </nav>
  );
};

export default SellNavbar;
