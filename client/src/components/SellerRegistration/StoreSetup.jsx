/* eslint-disable react/prop-types */
import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import axios from "axios";
import toast, { Toaster } from "react-hot-toast";
import { getAuth } from "firebase/auth";

const StoreSetup = ({ onComplete }) => {
  const [storeName, setStoreName] = useState("");
  const [address, setAddress] = useState("");
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const auth = getAuth();

  // Check if store details already exist on mount
  useEffect(() => {
    const checkStoreDetails = async () => {
      const user = auth.currentUser;
      if (!user) return; // No user logged in
      const email = user.email;
      try {
        const response = await axios.post(
          `${import.meta.env.VITE_FRONTEND_URL}/api/sellers/checkStoreDetails`,
          { email }
        );
        if (response.data.storeDetailsAdded) {
          toast.success(
            "Store details already added. Redirecting to bank details."
          );
          // Optionally, set the fields if you want to show them
          setStoreName(response.data.details.storeName);
          setAddress(response.data.details.address);
          // Proceed to next step automatically
          onComplete({
            storeName: response.data.details.storeName,
            address: response.data.details.address,
          });
        }
      } catch (err) {
        console.error("Error checking store details:", err);
        // Optionally, toast an error message here if needed
      }
    };
    checkStoreDetails();
  }, [onComplete, auth]);

  const validate = () => {
    const newErrors = {};
    if (!storeName.trim()) newErrors.storeName = "Store name is required";
    if (!address.trim()) newErrors.address = "Address is required";
    setErrors(newErrors);
    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newErrors = validate();
    if (Object.keys(newErrors).length > 0) {
      Object.values(newErrors).forEach((errorMsg) => {
        toast.error(errorMsg);
      });
      return;
    }

    setLoading(true);
    try {
      const user = auth.currentUser;
      if (!user) {
        toast.error("User not logged in");
        return;
      }
      const email = user.email;
      const response = await axios.post(
        `${import.meta.env.VITE_FRONTEND_URL}/api/sellers/addStoreDetails`,
        { email, storeName, address }
      );

      if (response.status === 200 || response.status === 201) {
        toast.success(
          response.data.message || "Store details saved successfully!"
        );
        onComplete({ storeName, address });
      }
    } catch (error) {
      console.error("Error saving store details:", error);
      toast.error("Failed to save details. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="max-w-2xl mx-auto bg-white rounded-xl shadow-2xl p-8"
    >
      <h2 className="text-3xl font-bold mb-8 text-gray-900">Store Details</h2>
      <form onSubmit={handleSubmit} className="space-y-8">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Store Name
          </label>
          <input
            type="text"
            value={storeName}
            onChange={(e) => setStoreName(e.target.value)}
            className={`w-full px-4 py-3 rounded-lg border ${
              errors.storeName ? "border-red-500" : "border-gray-300"
            } focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors`}
            placeholder="Enter your store name"
            aria-invalid={!!errors.storeName}
            aria-describedby={errors.storeName ? "storeNameError" : undefined}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Pickup Address
          </label>
          <textarea
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            rows="4"
            className={`w-full px-4 py-3 rounded-lg border resize-none h-20 ${
              errors.address ? "border-red-500" : "border-gray-300"
            } focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors`}
            placeholder="Enter complete pickup address"
            aria-invalid={!!errors.address}
            aria-describedby={errors.address ? "addressError" : undefined}
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-gradient-to-r from-blue-600 to-blue-700 text-white py-3 px-4 rounded-lg hover:from-blue-700 hover:to-blue-800 transition-all disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
        >
          {loading ? <span>Submitting...</span> : "Continue"}
        </button>
      </form>
      <Toaster position="top-right" />
    </motion.div>
  );
};

export default StoreSetup;
