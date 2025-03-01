/* eslint-disable react/prop-types */
import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import axios from "axios";
import toast, { Toaster } from "react-hot-toast";
import { getAuth } from "firebase/auth";

const indianBanks = [
  "State Bank of India",
  "HDFC Bank",
  "ICICI Bank",
  "Axis Bank",
  "Punjab National Bank",
  "Bank of Baroda",
  "Kotak Mahindra Bank",
  "Yes Bank",
  "IDFC First Bank",
  "IndusInd Bank",
];

// Mapping bank names to the expected number of digits for the account number
const bankAccountDigits = {
  "State Bank of India": 11,
  "HDFC Bank": 14,
  "ICICI Bank": 12,
  "Axis Bank": 15,
  "Punjab National Bank": 16,
  "Bank of Baroda": 14,
  "Kotak Mahindra Bank": 14,
  "Yes Bank": 14,
  "IDFC First Bank": 14,
  "IndusInd Bank": 14,
};

const BankDetails = ({ onComplete }) => {
  const [bankName, setBankName] = useState("");
  const [accountNumber, setAccountNumber] = useState("");
  const [ifscCode, setIfscCode] = useState("");
  const [loading, setLoading] = useState(false);
  // Errors will be shown via toast
  const [errors, setErrors] = useState({});

  const auth = getAuth();

  // Check if bank details already exist on mount
  useEffect(() => {
    const checkBankDetails = async () => {
      const user = auth.currentUser;
      if (!user) return;
      const email = user.email;
      try {
        const response = await axios.post(
          `${import.meta.env.VITE_FRONTEND_URL}/api/sellers/checkBankDetails`,
          { email }
        );
        if (response.data.bankDetailsAdded) {
          toast.success("Bank details already added. Prefilling form.");
          setBankName(response.data.details.bankName);
          // Format the stored account number (assumed to be saved without spaces)
          const accNum = response.data.details.accountNumber;
          const formattedAcc = accNum.match(/.{1,4}/g)?.join(" ") || accNum;
          setAccountNumber(formattedAcc);
          setIfscCode(response.data.details.ifsc);
        }
      } catch (err) {
        console.error("Error checking bank details:", err);
      }
    };
    checkBankDetails();
  }, [onComplete, auth]);

  const validate = () => {
    const newErrors = {};

    // Validate bank name: Must be selected
    if (!bankName.trim()) newErrors.bankName = "Please select a bank";

    // Remove all spaces for validation
    const cleanedAccount = accountNumber.replace(/\s+/g, "");
    // If a bank is selected and has a defined digit count, enforce that exact length
    if (bankName && bankAccountDigits[bankName]) {
      const expectedDigits = bankAccountDigits[bankName];
      if (cleanedAccount.length !== expectedDigits) {
        newErrors.accountNumber = `Account number must be exactly ${expectedDigits} digits`;
      }
    } else {
      // Fallback: Ensure account number is between 9 and 18 digits
      if (!/^\d{9,18}$/.test(cleanedAccount)) {
        newErrors.accountNumber = "Account number must be 9 to 18 digits";
      }
    }

    // Validate IFSC code: Must be 11 characters with 4 letters, a '0', and 6 alphanumerics
    const trimmedIFSC = ifscCode.trim().toUpperCase();
    if (!/^[A-Z]{4}0[A-Z0-9]{6}$/.test(trimmedIFSC)) {
      newErrors.ifscCode = "Invalid IFSC code (e.g., SBIN0005943)";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Custom handler to format the account number and restrict its length
  const handleAccountNumberChange = (e) => {
    let value = e.target.value;
    // Allow only digits and spaces
    value = value.replace(/[^\d\s]/g, "");
    // Remove spaces to determine the raw number of digits
    let cleanedValue = value.replace(/\s+/g, "");
    // Determine max allowed digits based on the selected bank or default to 18
    const maxDigits =
      bankName && bankAccountDigits[bankName]
        ? bankAccountDigits[bankName]
        : 18;
    if (cleanedValue.length > maxDigits) {
      cleanedValue = cleanedValue.slice(0, maxDigits);
    }
    // Format: insert a space every 4 digits (you can adjust the grouping as needed)
    const formattedValue = cleanedValue.match(/.{1,4}/g)?.join(" ") || "";
    setAccountNumber(formattedValue);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) {
      // Show validation errors via toast
      Object.values(errors).forEach((errorMsg) => toast.error(errorMsg));
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
      // Remove spaces from the account number before sending
      const cleanedAccountNumber = accountNumber.replace(/\s+/g, "");
      const response = await axios.post(
        `${import.meta.env.VITE_FRONTEND_URL}/api/sellers/addBankDetails`,
        {
          email,
          bankName,
          accountNumber: cleanedAccountNumber,
          ifsc: ifscCode.trim().toUpperCase(),
        }
      );
      if (response.status === 200 || response.status === 201) {
        toast.success(
          response.data.message || "Bank details saved successfully!"
        );
        onComplete({
          bankName,
          accountNumber: cleanedAccountNumber,
          ifscCode: ifscCode.trim().toUpperCase(),
        });
      }
    } catch (error) {
      console.error("Error saving bank details:", error);
      toast.error("Failed to save details. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-2xl mx-auto bg-white rounded-xl shadow-lg p-8"
    >
      <h2 className="text-3xl font-bold text-gray-800 mb-6 text-center">
        Bank Information
      </h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Bank Name Dropdown */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Bank Name
          </label>
          <select
            value={bankName}
            onChange={(e) => setBankName(e.target.value)}
            className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
          >
            <option value="">Select your bank</option>
            {indianBanks.map((bank, index) => (
              <option key={index} value={bank}>
                {bank}
              </option>
            ))}
          </select>
        </div>

        {/* Account Number Input */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Account Number
          </label>
          <input
            type="text"
            value={accountNumber}
            onChange={handleAccountNumberChange}
            className={`w-full px-4 py-3 rounded-lg border ${
              errors.accountNumber ? "border-red-500" : "border-gray-300"
            } focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors`}
            placeholder="Enter account number"
          />
        </div>

        {/* IFSC Code Input */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            IFSC Code
          </label>
          <input
            type="text"
            value={ifscCode}
            onChange={(e) => setIfscCode(e.target.value)}
            className={`w-full px-4 py-3 rounded-lg border ${
              errors.ifscCode ? "border-red-500" : "border-gray-300"
            } focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors`}
            placeholder="Enter IFSC code (e.g., HDFC0001234)"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? "Saving..." : "Complete Registration"}
        </button>
      </form>
      <Toaster position="top-right" />
    </motion.div>
  );
};

export default BankDetails;
