/* eslint-disable react/prop-types */
import { useState, useEffect } from "react";
import { FiSearch } from "react-icons/fi";
import axios from "axios"; // Import Axios
import { useNavigate } from "react-router-dom";

const SearchBar = ({ searchTerm, onSearch }) => {
  const [results, setResults] = useState([]);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const navigate = useNavigate();

  // Fetch results from the backend whenever the search term changes
  useEffect(() => {
    if (searchTerm.length > 0) {
      // Correct API URL
      axios
        .get(`${import.meta.env.VITE_FRONTEND_URL}/api/search-product/search`, {
          params: { search: searchTerm }, // Sending search term
        })
        .then((response) => {
          setResults(response.data.slice(0, 5)); // Limit to 5 results
          setIsDropdownOpen(true); // Open the dropdown if there are results
        })
        .catch((error) => {
          console.error("Error fetching search results:", error);
        });
    } else {
      setResults([]);
      setIsDropdownOpen(false); // Close dropdown if search term is empty
    }
  }, [searchTerm]);

  const handleResultClick = (productName) => {
    navigate(`/products?search=${encodeURIComponent(productName)}`);
    setIsDropdownOpen(false);
  };

  const handleSearchChange = (e) => {
    onSearch(e.target.value); // Update the search term in Navbar
  };

  const handleSearch = () => {
    if (onSearch) {
      onSearch(searchTerm); // Trigger search in Navbar on pressing enter or clicking icon
    }
    navigate(`/products?search=${encodeURIComponent(searchTerm)}`);
    setIsDropdownOpen(false); // Close the dropdown after search
  };

  return (
    <div className="flex-1 mx-8 max-w-xl relative">
      <input
        type="text"
        value={searchTerm}
        onChange={handleSearchChange}
        onKeyUp={(e) => e.key === "Enter" && handleSearch()} // Trigger search on Enter key press
        placeholder="Search products..."
        className="w-full font-medium p-3 pl-10 border-0 rounded-full bg-white bg-opacity-20 text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-700 focus:bg-opacity-30 transition duration-300"
      />
      <FiSearch
        className="absolute left-3 top-3.5 text-gray-700 cursor-pointer"
        size={20}
        onClick={handleSearch} // Trigger search on clicking the icon
      />
      {/* Search Button */}
      <button
        onClick={handleSearch}
        className="absolute cursor-pointer right-1 top-1 bg-gray-800 text-white px-4 py-2 rounded-full hover:bg-blue-600 transition duration-300"
      >
        Search
      </button>

      {/* Dropdown for search results */}
      {isDropdownOpen && results.length > 0 && (
        <div className="absolute left-0 right-0 mt-1 bg-white shadow-lg rounded-lg z-50 max-h-60 overflow-y-auto">
          {results.map((result, index) => (
            <div
              key={index}
              className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
              onClick={() => handleResultClick(result.Name)}
            >
              {result.Name}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default SearchBar;
