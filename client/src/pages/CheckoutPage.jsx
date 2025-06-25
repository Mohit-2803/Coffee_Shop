/* eslint-disable no-unused-vars */
import { useEffect, useState } from "react";
import { useCart } from "../contexts/useCart";
import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import toast from "react-hot-toast";
import { FiMapPin } from "react-icons/fi";
import { FaReceipt, FaStripe } from "react-icons/fa";
import { useLocation } from "react-router-dom";
import { auth } from "../config/firebaseConfig";
import axios from "axios";
import PaymentForm from "../components/payment/PaymentForm";
import AddressForm from "../components/payment/AddressForm"; // Import the AddressForm

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLIC_KEY);

const CheckoutPage = () => {
  // step 1: Address, step 2: Payment
  const [step, setStep] = useState(1);
  const [address, setAddress] = useState(null);
  const [editingAddress, setEditingAddress] = useState(false);
  const location = useLocation();
  const { selectedItems, cartItems, subtotal } = location.state || {};

  useEffect(() => {
    if (!selectedItems || !cartItems || !subtotal) {
      return (
        <div className="container mx-auto px-4 py-8">
          <p className="text-red-600 font-semibold">
            No items selected for checkout. Redirecting to cart...
          </p>
        </div>
      );
    }
    // Fetch user's saved address
    const fetchAddress = async () => {
      try {
        const user = auth.currentUser;
        const response = await fetch(
          `${import.meta.env.VITE_FRONTEND_URL}/api/address/users/${
            user.email
          }/address`
        );
        const data = await response.json();
        if (data) {
          setAddress(data);
          setEditingAddress(false);
        }
      } catch (error) {
        toast.error("Failed to load address");
      }
    };
    fetchAddress();
  }, [cartItems, selectedItems, subtotal]);

  const saveAddress = async (newAddress) => {
    try {
      const user = auth.currentUser;
      await axios.put(
        `${import.meta.env.VITE_FRONTEND_URL}/api/address/users/${
          user.email
        }/address`,
        newAddress
      );
      setAddress(newAddress);
      setEditingAddress(false);
      toast.success("Address saved");
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to save address");
    }
  };

  // When no address exists, show the AddressForm along with extra payment info.
  if (!address) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-3xl mx-auto bg-white p-8 rounded-lg shadow-2xl">
          <h2 className="text-2xl font-semibold mb-6 flex items-center gap-2">
            <FiMapPin /> Add Delivery Address
          </h2>
          <AddressForm onSubmit={saveAddress} />
          {/* Extra information box */}
          <div className="mt-6 p-4 bg-blue-100 border border-blue-300 rounded">
            <p className="text-sm text-blue-800">
              For secure payment processing and to ensure timely delivery,
              please provide a valid delivery address. Note that we only accept
              online payments. Cash on Delivery (COD) is not available due to
              increased fraud risks and the need for contactless transactions.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-20 py-8 bg-gray-100 min-h-full">
      <h1 className="text-3xl font-semibold mb-8 flex items-center gap-3 text-gray-700">
        Secure Checkout
        <span className="text-indigo-600">
          <FaStripe />
        </span>
      </h1>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column */}
        <div className="lg:col-span-2 space-y-6">
          {step === 1 && (
            <div className="bg-white p-6 rounded-lg shadow-2xl">
              <h3 className="text-lg font-bold flex items-center gap-2 mb-4">
                <FiMapPin /> Delivery Address
              </h3>

              {/* If editing, show the AddressForm */}
              {editingAddress ? (
                <AddressForm initialValues={address} onSubmit={saveAddress} />
              ) : (
                <div className="space-y-2 pl-7">
                  <p className="font-medium text-blue-600">
                    {address.fullName}
                  </p>
                  <p>
                    <span className="font-medium">Street : </span>
                    <span className="font-medium text-gray-600">
                      {address.street}
                    </span>
                  </p>
                  <p>
                    <span className="font-medium">City : </span>
                    <span className="font-medium text-gray-600">
                      {address.city}
                    </span>
                  </p>
                  <p>
                    <span className="font-medium">State : </span>
                    <span className="font-medium text-gray-600">
                      {address.state} - {address.zipCode}
                    </span>
                  </p>
                  <p>
                    <span className="font-medium">Country : </span>
                    <span className="font-medium text-gray-600">
                      {address.country}
                    </span>
                  </p>
                  <p>
                    <span className="font-medium">Phone : </span>
                    <span className="font-medium text-gray-600">
                      {address.phone}
                    </span>
                  </p>
                </div>
              )}

              {/* Extra information box */}
              <div className="mt-6 p-4 bg-blue-100 border border-blue-300 rounded">
                <p className="text-sm text-blue-800">
                  Please note: A valid delivery address is required for secure
                  payment processing. We only accept online payments—Cash on
                  Delivery (COD) is not offered due to heightened security
                  measures and our commitment to contactless transactions.
                </p>
              </div>

              <div className="mt-4 flex justify-end gap-4">
                {!editingAddress && (
                  <button
                    onClick={() => setEditingAddress(true)}
                    className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300 cursor-pointer font-medium"
                  >
                    Edit
                  </button>
                )}
                {/* Show continue button only when not editing */}
                {!editingAddress && (
                  <button
                    onClick={() => setStep(2)}
                    className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 cursor-pointer font-medium"
                  >
                    Continue to Payment
                  </button>
                )}
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="bg-white p-6 rounded-lg shadow-2xl">
              <h3 className="text-lg font-bold mb-4 text-gray-700">
                Payment Details
              </h3>
              <Elements stripe={stripePromise}>
                <PaymentForm
                  address={address}
                  subtotal={subtotal}
                  selectedItems={selectedItems}
                  cartItems={cartItems} // Pass cartItems here
                />
              </Elements>
            </div>
          )}
        </div>

        {/* Order Summary */}
        <div className="bg-white p-6 rounded-lg shadow-2xl h-fit sticky top-20">
          <div className="flex items-center mb-5 gap-4 text-gray-700">
            <FaReceipt />
            <h2 className="text-xl font-bold">Order Summary</h2>
          </div>
          <div className="space-y-4">
            {cartItems
              .filter((item) => selectedItems.includes(item.ProductID))
              .map((item) => (
                <div key={item.ProductID} className="flex justify-between">
                  <div className="flex-1">
                    <p className="font-normal truncate w-[300px]">
                      {item.Name}
                    </p>
                    <p className="text-sm text-gray-500 font-medium">
                      Quantity : {item.Quantity}
                    </p>
                  </div>
                  <p className="font-medium text-gray-700">
                    ₹{item.DiscountedPrice * item.Quantity}
                  </p>
                </div>
              ))}
          </div>
          <hr className="my-4" />
          <div className="flex justify-between font-semibold text-lg text-gray-700">
            <span>Total Amount :</span>
            <span className="text-green-700 font-bold">
              ₹{subtotal.toFixed(2)}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;
