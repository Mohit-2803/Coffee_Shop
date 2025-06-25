/* eslint-disable react/prop-types */
import { useState, useEffect } from "react";
import axios from "axios";

const ClothingFilter = ({ onFilteredResults }) => {
  const [selectedBrands, setSelectedBrands] = useState([]);
  const [selectedSleeveStyles, setSelectedSleeveStyles] = useState([]);
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [appliedPrice, setAppliedPrice] = useState({ min: "", max: "" });
  const [sortOrder, setSortOrder] = useState("");
  const [selectedMaterials, setSelectedMaterials] = useState([]);
  const [selectedDiscounts, setSelectedDiscounts] = useState([]);
  const [selectedRating, setSelectedRating] = useState("");
  const [includeOutOfStock, setIncludeOutOfStock] = useState(false);

  const brands = [
    "Nike",
    "Adidas",
    "Puma",
    "Reebok",
    "Under Armour",
    "Levi's",
    "H&M",
    "Zara",
    "Gucci",
    "Prada",
    "Dolce & Gabbana",
    "Versace",
    "Lacoste",
    "Burberry",
    "Calvin Klein",
    "Tommy Hilfiger",
    "Ralph Lauren",
    "Diesel",
    "Guess",
    "Forever 21",
    "Gap",
    "American Eagle",
    "Urban Outfitters",
    "Mango",
    "Bershka",
    "KETCH",
  ];

  const sleeveStyles = [
    "Short Sleeve",
    "Long Sleeve",
    "Sleeveless",
    "3/4 Sleeve",
    "Cap Sleeve",
  ];

  const materials = ["Cotton", "Polyester", "Wool", "Silk", "Linen"];

  const discounts = [
    { label: "10% Off or more", value: "10" },
    { label: "25% Off or more", value: "25" },
    { label: "35% Off or more", value: "35" },
    { label: "50% Off or more", value: "50" },
    { label: "60% Off or more", value: "60" },
  ];

  // Rating options for filtering
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

  // Fetch filters when any dependency changes (price is applied via button)
  useEffect(() => {
    const fetchFilteredClothing = async () => {
      try {
        const params = {
          brands: selectedBrands.join(","),
          sleeveStyles: selectedSleeveStyles.join(","),
          minPrice: appliedPrice.min,
          maxPrice: appliedPrice.max,
          sortOrder,
          materials: selectedMaterials.join(","),
          discounts: selectedDiscounts.join(","),
          rating: selectedRating,
          includeOutOfStock,
        };
        const response = await axios.get(
          `${
            import.meta.env.VITE_FRONTEND_URL
          }/api/search-product/filterClothingProducts`,
          { params }
        );
        onFilteredResults(response.data);
      } catch (error) {
        console.error("Error filtering clothing products:", error);
      }
    };

    fetchFilteredClothing();
  }, [
    selectedBrands,
    selectedSleeveStyles,
    appliedPrice,
    sortOrder,
    selectedMaterials,
    selectedDiscounts,
    selectedRating,
    includeOutOfStock,
    onFilteredResults,
  ]);

  const handleApplyPrice = () => {
    setAppliedPrice({ min: minPrice, max: maxPrice });
  };

  return (
    <div className="bg-white p-4 rounded-lg shadow-sm space-y-6">
      <h3 className="text-lg font-bold mb-4">Filters</h3>

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

      {/* Sleeve Style */}
      <div>
        <h4 className="font-medium">Sleeve Style</h4>
        <div className="flex flex-col mt-2">
          {sleeveStyles.map((style, index) => (
            <label key={index} className="flex items-center">
              <input
                type="checkbox"
                value={style}
                checked={selectedSleeveStyles.includes(style)}
                onChange={() =>
                  handleCheckboxToggle(
                    style,
                    selectedSleeveStyles,
                    setSelectedSleeveStyles
                  )
                }
                className="mr-2 cursor-pointer"
              />
              {style}
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

      {/* Sort By Price */}
      <div>
        <h4 className="font-medium">Sort By Price</h4>
        <select
          value={sortOrder}
          onChange={(e) => setSortOrder(e.target.value)}
          className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
        >
          <option value="">Select</option>
          <option value="asc">Low to High</option>
          <option value="desc">High to Low</option>
        </select>
      </div>

      {/* Material */}
      <div>
        <h4 className="font-medium">Material</h4>
        <div className="flex flex-col mt-2">
          {materials.map((material, index) => (
            <label key={index} className="flex items-center">
              <input
                type="checkbox"
                value={material}
                checked={selectedMaterials.includes(material)}
                onChange={() =>
                  handleCheckboxToggle(
                    material,
                    selectedMaterials,
                    setSelectedMaterials
                  )
                }
                className="mr-2 cursor-pointer"
              />
              {material}
            </label>
          ))}
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
          className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
        >
          {ratings.map((ratingOption, index) => (
            <option key={index} value={ratingOption.value}>
              {ratingOption.label}
            </option>
          ))}
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

export default ClothingFilter;
