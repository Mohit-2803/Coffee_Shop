/* eslint-disable react/prop-types */
// AddProduct.js
import { useEffect, useState } from "react";
import { auth } from "../../config/firebaseConfig";
import Sidebar from "../Sidebar/Sidebar";
import ElectronicsForm from "./AddProduct/ElectronicsForm";
import ClothingForm from "./AddProduct/ClothingForm";

const CategorySelection = ({ onSelectCategory }) => {
  return (
    <div className="flex flex-col items-center justify-center min-h-[70vh] bg-gray-50">
      <h1 className="text-4xl font-bold mb-8 text-gray-800">
        What category of product do you want to sell?
      </h1>
      <div className="flex gap-8">
        <button
          onClick={() => onSelectCategory("electronics")}
          className="px-8 py-4 bg-blue-600 text-white font-semibold rounded-lg shadow-lg hover:bg-blue-900 transition-all cursor-pointer"
        >
          Electronics
        </button>
        <button
          onClick={() => onSelectCategory("clothing")}
          className="px-8 py-4 bg-green-600 text-white font-semibold rounded-lg shadow-lg hover:bg-green-900 transition-all cursor-pointer"
        >
          Clothing
        </button>
      </div>
    </div>
  );
};

const AddProduct = () => {
  const [userEmail, setUserEmail] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState(null);

  useEffect(() => {
    const currentUser = auth.currentUser;
    if (currentUser) {
      setUserEmail(currentUser.email);
    }
  }, []);

  const handleCategorySelect = (category) => {
    setSelectedCategory(category);
  };

  return (
    <div className="flex min-h-screen bg-gray-50 text-gray-900">
      <Sidebar />
      <div className="flex-1 p-8">
        {selectedCategory === null ? (
          <CategorySelection onSelectCategory={handleCategorySelect} />
        ) : selectedCategory === "electronics" ? (
          <ElectronicsForm userEmail={userEmail} />
        ) : (
          <ClothingForm userEmail={userEmail} />
        )}
      </div>
    </div>
  );
};

export default AddProduct;
