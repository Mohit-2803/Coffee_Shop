/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
import { useState } from "react";
import toast from "react-hot-toast";

const OTPVerification = ({ phone, onVerificationComplete }) => {
  const [otp, setOtp] = useState("");
  const [isVerifying, setIsVerifying] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!/^\d{6}$/.test(otp)) {
      toast.error("Please enter a valid 6-digit OTP");
      return;
    }

    setIsVerifying(true);
    try {
      // Simulate verification API call
      await new Promise((resolve) => setTimeout(resolve, 1000));
      onVerificationComplete();
      toast.success("Phone verified successfully!");
    } catch (err) {
      toast.error("Verification failed. Please try again.");
    } finally {
      setIsVerifying(false);
    }
  };

  return (
    <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
      <div>
        <label
          htmlFor="otp"
          className="block text-sm font-medium text-gray-700"
        >
          Verification Code
        </label>
        <input
          id="otp"
          name="otp"
          type="tel"
          value={otp}
          onChange={(e) => setOtp(e.target.value.replace(/\D/g, ""))}
          className="mt-1 block w-full rounded-md border border-gray-300 shadow-sm px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
          placeholder="Enter 6-digit code"
          maxLength={6}
        />
      </div>

      <button
        type="submit"
        disabled={isVerifying}
        className={`w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white ${
          isVerifying ? "bg-blue-400" : "bg-blue-600 hover:bg-blue-700"
        } focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors`}
      >
        {isVerifying ? "Verifying..." : "Verify Phone"}
      </button>
    </form>
  );
};

export default OTPVerification;
