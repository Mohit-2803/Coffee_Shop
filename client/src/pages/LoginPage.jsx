import { useNavigate } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import { Link } from "react-router-dom";
import LoginForm from "../components/Auth/LoginForm";
import ecommerceImage from "../assets/image.jpg";

const LoginPage = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex items-center justify-center px-4 bg-gray-100">
      {/* Login Container */}
      <div className="flex w-full max-w-4xl bg-white rounded-lg shadow-2xl h-[600px]">
        {/* Left Section - Image */}
        <div className="w-1/2 hidden md:block">
          <img
            src={ecommerceImage}
            alt="Ecommerce"
            className="w-full h-full object-cover"
          />
        </div>

        {/* Right Section - Login Form */}
        <div className="w-full md:w-1/2 flex flex-col items-center justify-center p-8">
          <div className="w-full max-w-md">
            <div className="text-center">
              <h2 className="text-3xl font-bold text-gray-900">Welcome Back</h2>
              <p className="mt-2 text-gray-600">
                Log in to your account to continue shopping
              </p>
            </div>

            {/* Login Form */}
            <LoginForm onSuccess={() => navigate("/dashboard")} />

            {/* Signup Link */}
            <p className="mt-4 text-center text-gray-600">
              Not having an account?{" "}
              <Link
                to="/signup"
                className="text-blue-600 font-medium hover:underline"
              >
                Create Account
              </Link>
            </p>
          </div>
        </div>
      </div>

      <Toaster position="top-center" />
    </div>
  );
};

export default LoginPage;
