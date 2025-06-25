/* eslint-disable react/prop-types */
import { useState, useEffect } from "react";
import axios from "axios";

const ElectronicsFilter = ({ onFilteredResults }) => {
  const [selectedBrands, setSelectedBrands] = useState([]);
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [appliedPrice, setAppliedPrice] = useState({ min: "", max: "" });
  const [sortOrder, setSortOrder] = useState("");
  const [selectedDiscounts, setSelectedDiscounts] = useState([]);
  const [selectedRating, setSelectedRating] = useState("");
  const [includeOutOfStock, setIncludeOutOfStock] = useState(false);

  const brands = ["Samsung", "Apple", "Sony", "LG", "Panasonic"];

  const discounts = [
    { label: "10% Off or more", value: "10" },
    { label: "20% Off or more", value: "20" },
    { label: "30% Off or more", value: "30" },
  ];

  // Rating options for electronics
  const ratings = [
    { label: "All Ratings", value: "" },
    { label: "4★ & above", value: "4" },
    { label: "3★ & above", value: "3" },
    { label: "2★ & above", value: "2" },
    { label: "1★ & above", value: "1" },
  ];

  const handleCheckboxToggle = (value, selectedArray, setSelectedArray) => {
    if (selectedArray.includes(value)) {
      setSelectedArray(selectedArray.filter((item) => item !== value));
    } else {
      setSelectedArray([...selectedArray, value]);
    }
  };

  useEffect(() => {
    const fetchFilteredElectronics = async () => {
      try {
        const params = {
          brands: selectedBrands.join(","),
          minPrice: appliedPrice.min,
          maxPrice: appliedPrice.max,
          discounts: selectedDiscounts.join(","),
          sortOrder,
          rating: selectedRating,
          includeOutOfStock,
        };
        const response = await axios.get(
          `${
            import.meta.env.VITE_FRONTEND_URL
          }/api/search-product/filterElectronicsProducts`,
          { params }
        );
        onFilteredResults(response.data);
      } catch (error) {
        console.error("Error filtering electronics products:", error);
      }
    };

    fetchFilteredElectronics();
  }, [
    selectedBrands,
    appliedPrice,
    selectedDiscounts,
    sortOrder,
    selectedRating,
    includeOutOfStock,
    onFilteredResults,
  ]);

  const handleApplyPrice = () => {
    setAppliedPrice({ min: minPrice, max: maxPrice });
  };

  return (
    <div className="bg-white p-4 rounded-lg shadow-sm space-y-6">
      <h3 className="text-lg font-semibold mb-4">Filters</h3>

      {/* Brands */}
      <div>
        <h4 className="font-medium">Brands</h4>
        <div className="flex flex-col mt-2">
          {brands.map((brand, index) => (
            <label key={index} className="flex items-center">
              <input
                type="checkbox"
                value={brand}
                checked={selectedBrands.includes(brand)}
                onChange={() =>
                  handleCheckboxToggle(brand, selectedBrands, setSelectedBrands)
                }
                className="mr-2 cursor-pointer"
              />
              {brand}
            </label>
          ))}
        </div>
      </div>

      {/* Price Range as Min/Max Inputs */}
      <div>
        <h4 className="font-medium">Price Range (INR)</h4>
        <div className="flex flex-col gap-2 mt-2">
          <input
            type="number"
            placeholder="Min Price (INR)"
            value={minPrice}
            onChange={(e) => setMinPrice(e.target.value)}
            className="p-1 border  border-gray-300 rounded-md"
          />
          <input
            type="number"
            placeholder="Max Price (INR)"
            value={maxPrice}
            onChange={(e) => setMaxPrice(e.target.value)}
            className="p-1 border border-gray-300 rounded-md"
          />
          <button
            onClick={handleApplyPrice}
            className="bg-orange-400 font-medium text-white p-1 w-[75px] rounded-md"
          >
            Apply
          </button>
        </div>
      </div>

      {/* Discount */}
      <div>
        <h4 className="font-medium">Discount</h4>
        <div className="flex flex-col mt-2">
          {discounts.map((discount, index) => (
            <label key={index} className="flex items-center">
              <input
                type="checkbox"
                value={discount.value}
                checked={selectedDiscounts.includes(discount.value)}
                onChange={() =>
                  handleCheckboxToggle(
                    discount.value,
                    selectedDiscounts,
                    setSelectedDiscounts
                  )
                }
                className="mr-2 cursor-pointer"
              />
              {discount.label}
            </label>
          ))}
        </div>
      </div>

      {/* Rating */}
      <div>
        <h4 className="font-medium">Rating</h4>
        <select
          value={selectedRating}
          onChange={(e) => setSelectedRating(e.target.value)}
          className="mt-1 block w-full p-2 border border-gray-300 cursor-pointer rounded-md"
        >
          {ratings.map((ratingOption, index) => (
            <option key={index} value={ratingOption.value}>
              {ratingOption.label}
            </option>
          ))}
        </select>
      </div>

      {/* Sort By Price */}
      <div>
        <h4 className="font-medium">Sort By Price</h4>
        <select
          value={sortOrder}
          onChange={(e) => setSortOrder(e.target.value)}
          className="mt-1 block w-full p-2 border cursor-pointer border-gray-300 rounded-md"
        >
          <option value="">Select</option>
          <option value="asc">Low to High</option>
          <option value="desc">High to Low</option>
        </select>
      </div>

      {/* Availability */}
      <div>
        <h4 className="font-medium">Availability</h4>
        <label className="flex items-center mt-2">
          <input
            type="checkbox"
            checked={includeOutOfStock}
            onChange={() => setIncludeOutOfStock(!includeOutOfStock)}
            className="mr-2 cursor-pointer"
          />
          Include Out of Stock
        </label>
      </div>
    </div>
  );
};

export default ElectronicsFilter;
