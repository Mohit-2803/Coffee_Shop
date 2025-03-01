import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import { Link } from "react-router-dom";
import SignupForm from "../components/Auth/SignupForm";
import ecommerceImage from "../assets/image.jpg";

const SignupPage = () => {
  const [emailSent, setEmailSent] = useState(false);
  const [userEmail, setUserEmail] = useState("");
  const navigate = useNavigate();

  // Redirect to login after 5 seconds if email is sent
  useEffect(() => {
    if (emailSent) {
      setTimeout(() => {
        navigate("/login");
      }, 15000);
    }
  }, [emailSent, navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center px-4 bg-gray-100">
      {/* Signup Container */}
      <div className="flex w-full max-w-4xl bg-white rounded-lg shadow-2xl h-[600px]">
        {/* Left Section - Image */}
        <div className="w-1/2 hidden md:block">
          <img
            src={ecommerceImage}
            alt="Ecommerce"
            className="w-full h-full object-cover"
          />
        </div>

        {/* Right Section - Signup Form or Success Message */}
        <div className="w-full md:w-1/2 flex flex-col items-center justify-center p-8">
          <div className="w-full max-w-md">
            <div className="text-center">
              {emailSent ? (
                <>
                  <h2 className="text-3xl font-bold text-gray-900">
                    Check Your Email
                  </h2>
                  <p className="mt-2 text-gray-600">
                    A verification link has been sent to{" "}
                    <strong>{userEmail}</strong>. Please check your inbox and
                    verify your email before logging in.
                  </p>
                  <p className="mt-4 text-gray-500 text-sm">
                    Redirecting to login page in a few seconds...
                  </p>
                </>
              ) : (
                <>
                  <h2 className="text-3xl font-bold text-gray-900">
                    Create Account
                  </h2>
                  <p className="mt-2 text-gray-600">
                    Join our community of happy shoppers
                  </p>
                  <SignupForm
                    onSuccess={(email) => {
                      setUserEmail(email);
                      setEmailSent(true);
                    }}
                  />
                  {/* Login Link */}
                  <p className="mt-4 text-center text-gray-600">
                    Already have an account?{" "}
                    <Link
                      to="/login"
                      className="text-blue-600 font-medium hover:underline"
                    >
                      Log In
                    </Link>
                  </p>
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      <Toaster position="top-center" />
    </div>
  );
};

export default SignupPage;
