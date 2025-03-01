/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import { useState } from "react";
import toast from "react-hot-toast";
import { auth, googleProvider } from "../../config/firebaseConfig";
import {
  signInWithEmailAndPassword,
  signInWithPopup,
  signOut,
} from "firebase/auth";
import axios from "axios"; // Import Axios

const validateLoginForm = (formData) => {
  const errors = {};
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email))
    errors.email = "Invalid email address";
  if (!formData.password.trim()) errors.password = "Password is required";
  return errors;
};

const LoginForm = ({ onSuccess }) => {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // 🔹 Verify user with backend
  const verifyUser = async (email) => {
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_FRONTEND_URL}/api/auth/verifyUser`,
        { email }
      );
      toast.success(response.data.message); // Show success message
    } catch (err) {
      toast.error("Verification failed");
    }
  };

  // 🔹 Handle Email Login
  const handleEmailLogin = async (e) => {
    e.preventDefault();
    const validationErrors = validateLoginForm(formData);

    if (Object.keys(validationErrors).length > 0) {
      Object.values(validationErrors).forEach((error) => toast.error(error));
      setErrors(validationErrors);
      return;
    }

    setIsSubmitting(true);
    try {
      const userCredential = await signInWithEmailAndPassword(
        auth,
        formData.email,
        formData.password
      );
      const user = userCredential.user;

      if (!user.emailVerified) {
        await signOut(auth); // Log out unverified users
        toast.error("Please verify your email before proceeding");

        setTimeout(() => {
          toast.error("Check your email for verification link"); // Another error after 4 secs
        }, 5000);

        return;
      }

      await verifyUser(user.email); // Call backend to verify user

      toast.success("Logged in successfully!");
      onSuccess();
    } catch (err) {
      toast.error("Invalid email or password");
    } finally {
      setIsSubmitting(false);
    }
  };

  // 🔹 Handle Google Login
  const handleGoogleLogin = async () => {
    try {
      const userCredential = await signInWithPopup(auth, googleProvider);
      const user = userCredential.user;

      if (!user.emailVerified) {
        await signOut(auth);
        toast.error("Please verify your email before logging in.");
        return;
      }

      await verifyUser(user.email); // Call backend to verify user

      toast.success("Logged in successfully with Google!");
      onSuccess();
    } catch (err) {
      toast.error("Google sign-in failed");
    }
  };

  return (
    <form className="mt-8 space-y-6" onSubmit={handleEmailLogin}>
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Email Address
          </label>
          <input
            type="email"
            value={formData.email}
            onChange={(e) =>
              setFormData({ ...formData, email: e.target.value })
            }
            className={`mt-1 block w-full rounded-md border outline-green-700 ${
              errors.email ? "border-red-500" : "border-gray-300"
            } shadow-sm px-4 py-2`}
            placeholder="you@example.com"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Password
          </label>
          <input
            type="password"
            value={formData.password}
            onChange={(e) =>
              setFormData({ ...formData, password: e.target.value })
            }
            className={`mt-1 block w-full rounded-md border outline-green-700 ${
              errors.password ? "border-red-500" : "border-gray-300"
            } shadow-sm px-4 py-2`}
            placeholder="Enter your password"
          />
        </div>
      </div>

      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full flex justify-center py-2 px-4 bg-blue-600 text-white font-medium rounded-md shadow-md cursor-pointer"
      >
        {isSubmitting ? "Logging in..." : "Log In"}
      </button>

      <button
        type="button"
        onClick={handleGoogleLogin}
        className="w-full flex justify-center items-center py-2 px-4 font-semibold cursor-pointer text-gray-700 bg-gray-100 rounded-md shadow-md mt-2"
      >
        {/* Google Logo SVG */}
        <svg
          className="w-6 h-6 mr-2"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 48 48"
        >
          <path
            fill="#FFC107"
            d="M43.611 20.083H42V20H24v8h11.303c-1.649 4.657-6.08 8-11.303 8-6.627 0-12-5.373-12-12s5.373-12 12-12c3.059 0 5.842 1.154 7.961 3.039l5.657-5.657C34.046 6.053 29.268 4 24 4 12.955 4 4 12.955 4 24s8.955 20 20 20 20-8.955 20-20c0-1.341-.138-2.65-.389-3.917z"
          />
          <path
            fill="#FF3D00"
            d="M6.306 14.691l6.571 4.819C14.655 15.108 18.961 12 24 12c3.059 0 5.842 1.154 7.961 3.039l5.657-5.657C34.046 6.053 29.268 4 24 4 16.318 4 9.656 8.337 6.306 14.691z"
          />
          <path
            fill="#4CAF50"
            d="M24 44c5.166 0 9.86-1.977 13.409-5.192l-6.19-5.238A11.91 11.91 0 0124 36c-5.202 0-9.619-3.317-11.283-7.946l-6.522 5.025C9.505 39.556 16.227 44 24 44z"
          />
          <path
            fill="#1976D2"
            d="M43.611 20.083H42V20H24v8h11.303a12.04 12.04 0 01-4.087 5.571l.003-.002 6.19 5.238C36.971 39.205 44 34 44 24c0-1.341-.138-2.65-.389-3.917z"
          />
        </svg>
        Continue with Google
      </button>
    </form>
  );
};

export default LoginForm;
