/* eslint-disable react/prop-types */
import { useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { auth, googleProvider } from "../../config/firebaseConfig";
import {
  createUserWithEmailAndPassword,
  sendEmailVerification,
  signInWithPopup,
} from "firebase/auth";
import { useNavigate } from "react-router-dom";

const validateSignupForm = (formData) => {
  const errors = {};
  if (!formData.name.trim()) errors.name = "Name is required";
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email))
    errors.email = "Invalid email address";
  if (formData.password.length < 8)
    errors.password = "Password must be at least 8 characters";
  if (!formData.termsAccepted)
    errors.termsAccepted = "You must accept the Terms and Conditions";
  return errors;
};

const SignupForm = ({ onSuccess }) => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    termsAccepted: false,
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

  // 🔹 Handle Email Signup
  const handleEmailSignup = async (e) => {
    e.preventDefault();
    const validationErrors = validateSignupForm(formData);

    if (Object.keys(validationErrors).length > 0) {
      Object.values(validationErrors).forEach((error) => toast.error(error));
      setErrors(validationErrors);
      return;
    }

    setIsSubmitting(true);
    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        formData.email,
        formData.password
      );
      await sendEmailVerification(userCredential.user);

      // Send user data to backend
      await axios.post(`${import.meta.env.VITE_FRONTEND_URL}/api/auth/signup`, {
        name: formData.name,
        email: formData.email,
        password: formData.password, // Password should be hashed in the backend
      });

      onSuccess(formData.email);
      toast.success("Account created! Please verify your email.");
    } catch (err) {
      console.error(err.message);
      toast.error(
        "Password must contain a lowercase, uppercase & numeric characters"
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  // 🔹 Handle Google Signup
  const handleGoogleSignup = async () => {
    try {
      const userCredential = await signInWithPopup(auth, googleProvider);
      const user = userCredential.user;

      // Send user data to backend
      await axios.post(`${import.meta.env.VITE_FRONTEND_URL}/api/auth/signup`, {
        name: user.displayName,
        email: user.email,
        password: "GoogleOAuth", // Indicate it's a Google login
      });

      toast.success("Signed up successfully with Google!");
      navigate("/dashboard");
    } catch (err) {
      toast.error(err.message);
    }
  };

  return (
    <form className="mt-8 space-y-6 text-start" onSubmit={handleEmailSignup}>
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Full Name
          </label>
          <input
            type="text"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            className={`mt-1 block w-full rounded-md border outline-green-700 ${
              errors.name ? "border-red-500" : "border-gray-300"
            } shadow-sm px-4 py-2`}
            placeholder="John Doe"
          />
        </div>

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

      <div className="flex items-center">
        <input
          type="checkbox"
          checked={formData.termsAccepted}
          onChange={(e) =>
            setFormData({ ...formData, termsAccepted: e.target.checked })
          }
          className="h-4 w-4 text-blue-600 border-gray-300 rounded cursor-pointer ml-1"
        />
        <label className="ml-2 text-sm text-gray-700 font-medium">
          I accept the{" "}
          <a href="/terms" className="text-blue-600">
            Terms and Conditions
          </a>
        </label>
      </div>

      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full flex justify-center py-2 px-4 bg-blue-600 text-white font-medium rounded-md shadow-md cursor-pointer"
      >
        {isSubmitting ? "Creating Account..." : "Sign Up"}
      </button>

      <button
        type="button"
        onClick={handleGoogleSignup}
        className="w-full flex justify-center items-center py-2 px-4 bg-gray-100 text-gray-700 font-semibold cursor-pointer rounded-md shadow-md mt-2"
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

export default SignupForm;
