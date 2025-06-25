import { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { getAuth, onAuthStateChanged, signOut } from "firebase/auth";
import { FiShoppingCart, FiUser } from "react-icons/fi";
import SearchBar from "./SearchBar/SearchBar";
import { useCart } from "../../contexts/useCart";

const Navbar = () => {
  const [user, setUser] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const auth = getAuth();
  const { cartCount } = useCart();
  const dropdownRef = useRef(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });
    return () => unsubscribe();
  }, [auth]);

  const handleSearchInputChange = (value) => {
    setSearchTerm(value);
  };

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
    <>
      <nav className="sticky top-0 z-50 flex items-center justify-between px-8 py-2 bg-gray-800">
        {/* Logo */}
        <Link
          to="/dashboard"
          className="text-2xl font-normal text-white hover:text-gray-200 transition duration-300"
        >
          ShopEase
        </Link>

        {/* Search Bar - only show if user is logged in */}
        {user && (
          <SearchBar
            searchTerm={searchTerm}
            onSearch={handleSearchInputChange}
          />
        )}

        {/* Navigation Links / Auth Section */}
        {user ? (
          <div className="flex items-center space-x-6">
            <Link
              to="/featured"
              className="text-white font-semibold hover:text-green-500 transition duration-300"
            >
              Featured
            </Link>

            <Link
              to="/deals"
              className="text-white font-semibold hover:text-green-500 transition duration-300"
            >
              Deals
            </Link>

            <Link to="/sell">
              <button className="text-white hover:text-green-500 font-semibold transition duration-300 shadow-md cursor-pointer">
                Sell
              </button>
            </Link>

            <Link
              to="/cart"
              className="relative text-white hover:text-green-500 transition duration-300"
            >
              <FiShoppingCart size={24} />
              <span className="absolute -top-2 -right-2 bg-red-600 text-white text-xs px-1.5 py-0.5 rounded-full font-medium">
                {cartCount}
              </span>
            </Link>

            <div className="relative" ref={dropdownRef}>
              <button
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                className="flex items-center space-x-2 text-white hover:text-green-500 transition duration-300 cursor-pointer"
              >
                <FiUser size={24} />
              </button>
              {isDropdownOpen && (
                <div className="absolute right-[-9px] mt-3 z-50">
                  <div className="relative">
                    <div className="absolute top-[-6px] right-4 w-3 h-3 bg-white transform rotate-45" />
                    <div className="w-48 bg-white font-medium shadow-lg rounded-lg overflow-hidden">
                      <Link
                        to="/profile"
                        onClick={() => setIsDropdownOpen(false)}
                        className="block hover:text-blue-600 px-4 py-3 text-gray-700 hover:bg-gray-100 transition duration-300"
                      >
                        Profile
                      </Link>
                      <button
                        onClick={() => {
                          signOut(auth);
                          setIsDropdownOpen(false);
                        }}
                        className="w-full hover:text-blue-600 text-left px-4 py-3 text-gray-700 hover:bg-gray-100 transition duration-300 cursor-pointer"
                      >
                        Logout
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        ) : (
          // If not logged in, show only the Sign In button.
          <Link to="/login">
            <button className="bg-white font-semibold text-blue-600 px-6 py-2 rounded-full hover:bg-gray-100 transition duration-300 shadow-md cursor-pointer">
              Sign In
            </button>
          </Link>
        )}
      </nav>

      {/* Overlay for Dropdown */}
      {isDropdownOpen && (
        <div
          className="fixed inset-0 bg-black/50 transition-opacity duration-300 z-40"
          onClick={() => setIsDropdownOpen(false)}
        ></div>
      )}
    </>
  );
};

export default Navbar;
