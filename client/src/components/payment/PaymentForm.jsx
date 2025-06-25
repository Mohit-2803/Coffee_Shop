/* eslint-disable react/prop-types */
import { useState } from "react";
import {
  useStripe,
  useElements,
  CardNumberElement,
  CardExpiryElement,
  CardCvcElement,
} from "@stripe/react-stripe-js";
import { FaLock, FaStripe } from "react-icons/fa";
import toast from "react-hot-toast";
import axios from "axios";
import { auth } from "../../config/firebaseConfig";
import { useCart } from "../../contexts/useCart";
import { DotLottieReact } from "@lottiefiles/dotlottie-react";
import { Link } from "react-router-dom";

const PaymentForm = ({ address, subtotal, selectedItems, cartItems }) => {
  const stripe = useStripe();
  const elements = useElements();
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState(null);
  const [paymentSuccess, setPaymentSuccess] = useState(false);
  const { clearSelectedItems } = useCart();

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!stripe || !elements) {
      toast.error("Payment system is not available. Try again later.");
      return;
    }

    // Validate address details
    if (
      !address?.fullName ||
      !address?.street ||
      !address?.city ||
      !address?.zipCode ||
      !address?.country
    ) {
      toast.error("Please fill in all required address details.");
      return;
    }

    if (!subtotal || subtotal <= 0) {
      toast.error("Invalid payment amount.");
      return;
    }

    if (!selectedItems || selectedItems.length === 0) {
      toast.error("No items selected for purchase.");
      return;
    }

    const cardElement = elements.getElement(CardNumberElement);
    if (!cardElement) {
      toast.error("Please enter valid card details.");
      return;
    }

    setProcessing(true);
    setError(null);

    try {
      // Compute the list of quantities corresponding to each selected item
      const selectedQuantities = cartItems
        .filter((item) => selectedItems.includes(item.ProductID))
        .map((item) => item.Quantity);

      const response = await axios.post(
        `${
          import.meta.env.VITE_FRONTEND_URL
        }/api/payment/create-payment-intent`,
        {
          amount: Math.round(subtotal * 100),
          currency: "inr",
          selectedItems,
          selectedQuantities, // New field: list of quantities for each item
        },
        {
          headers: {
            Authorization: `Bearer ${await auth.currentUser.getIdToken()}`,
          },
        }
      );

      const { clientSecret } = response.data;

      const { error: stripeError, paymentIntent } =
        await stripe.confirmCardPayment(clientSecret, {
          payment_method: {
            card: elements.getElement(CardNumberElement),
            billing_details: {
              email: auth.currentUser.email,
              phone: address.phone,
              address: {
                city: address.city,
                country: address.country,
                line1: address.street,
                postal_code: address.zipCode,
              },
              name: address.fullName,
            },
          },
        });

      if (stripeError) {
        setError(stripeError.message);
        toast.error(stripeError.message || "Payment failed. Try again.");
        throw stripeError;
      }

      if (paymentIntent.status === "succeeded") {
        await clearSelectedItems(selectedItems);
        setPaymentSuccess(true);
        toast.success("Payment successful! Your order has been placed.");
      }
    } catch (err) {
      setError(err.message);
      toast.error(err.response?.data?.message || "Payment failed.");
    } finally {
      setProcessing(false);
    }
  };

  const cardElementOptions = {
    style: {
      base: {
        fontSize: "16px",
        color: "#424770",
        "::placeholder": { color: "#aab7c4" },
      },
      invalid: { color: "#9e2146" },
    },
  };

  // If payment succeeded, show success animation & info.
  if (paymentSuccess) {
    return (
      <div className="flex flex-col items-center justify-center p-6">
        <DotLottieReact
          src="https://lottie.host/f75251f2-af9d-491c-b0dc-34fb296f5f40/NHBJMG0R1v.lottie"
          loop
          autoplay
          style={{ width: 250, height: 250 }}
        />
        <h2 className="mt-4 text-2xl font-bold text-sky-600">
          Payment Successful!
        </h2>
        <p className="text-gray-600 font-medium">
          Your order has been placed successfully.
        </p>
        <Link to={"/dashboard"}>
          <div className="bg-orange-400 mt-4 rounded-full px-4 hover:bg-amber-600 text-white font-medium p-2">
            Home
          </div>
        </Link>
      </div>
    );
  }

  // If there is an error, show failure animation & info with a retry option.
  if (error) {
    return (
      <div className="flex flex-col items-center justify-center p-6">
        <DotLottieReact
          src="https://lottie.host/dd52cd82-ada1-4179-9146-8768bf34ef79/R696Er0wAQ.lottie"
          loop
          autoplay
          style={{ width: 200, height: 200 }}
        />
        <h2 className="mt-4 text-xl font-bold text-red-600">Payment Failed</h2>
        <p>{error}</p>
        <button
          onClick={() => setError(null)}
          className="mt-4 px-4 py-2 bg-blue-600 text-white rounded cursor-pointer"
        >
          Try Again
        </button>
      </div>
    );
  }

  // Otherwise, render the payment form.
  return (
    <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg">
      <div className="mb-6">
        <h3 className="text-lg font-semibold mb-4">Card Information</h3>
        <div className="space-y-4">
          <div className="border border-gray-300 rounded-lg p-3">
            <label className="block text-sm font-medium mb-2">
              Card Number
            </label>
            <CardNumberElement
              options={cardElementOptions}
              className="w-full p-2"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="border border-gray-300 rounded-lg p-3">
              <label className="block text-sm font-medium mb-2">
                Expiration Date
              </label>
              <CardExpiryElement
                options={cardElementOptions}
                className="w-full p-2"
              />
            </div>

            <div className="border border-gray-300 rounded-lg p-3">
              <label className="block text-sm font-medium mb-2">CVC</label>
              <CardCvcElement
                options={cardElementOptions}
                className="w-full p-2"
              />
            </div>
          </div>
        </div>
        {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
      </div>

      <div className="text-gray-700 font-medium text-xs mb-2">
        <p className="flex items-center gap-2 justify-center">
          <span>Payments are secured by</span>{" "}
          <FaStripe size={30} className="mt-1" />
        </p>
      </div>

      <button
        type="submit"
        disabled={processing || !stripe}
        className={`w-full py-3 rounded-lg flex items-center justify-center gap-2 ${
          processing
            ? "bg-blue-400 cursor-not-allowed"
            : "bg-green-600 hover:bg-blue-700 cursor-pointer"
        } text-white font-semibold`}
      >
        {processing ? "Processing..." : "Pay Now"} <FaLock />
      </button>
    </form>
  );
};

export default PaymentForm;
