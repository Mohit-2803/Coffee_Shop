import { useState, useEffect } from "react";
import axios from "axios";
import ProgressStepper from "../components/SellerRegistration/ProgressStepper";
import StoreSetup from "../components/SellerRegistration/StoreSetup";
import BankDetails from "../components/SellerRegistration/BankDetails";
import { motion } from "framer-motion";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

const SellerRegisterPage = () => {
  // We start with step 2 (store details) since account creation is already done.
  const [currentStep, setCurrentStep] = useState(2);
  const [completedSteps, setCompletedSteps] = useState(1);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  const auth = getAuth();
  const navigate = useNavigate();

  // Listen for auth state changes
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (currentUser) {
        setUser(currentUser);
      } else {
        toast.error("User not authenticated");
        navigate("/login");
      }
    });
    return () => unsubscribe();
  }, [auth, navigate]);

  // Fetch registration progress once the user is loaded
  useEffect(() => {
    if (!user) return; // Wait for user to be available

    const fetchProgress = async () => {
      try {
        const email = user.email;
        const response = await axios.post(
          `${import.meta.env.VITE_FRONTEND_URL}/api/sellers/progress`,
          { email }
        );

        // The backend returns { currentStep, completedSteps }
        let { currentStep: step } = response.data;
        // If no progress exists or it still indicates account creation (step 1),
        // default to step 2 (store details).
        if (!step || step === 1) {
          step = 2;
          await axios.post(
            `${import.meta.env.VITE_FRONTEND_URL}/api/sellers/update-progress`,
            {
              email,
              currentStep: step,
              completedSteps: step - 1,
            }
          );
        }

        // Update local state
        setCurrentStep(step);
        setCompletedSteps(step - 1);

        // If registration is complete (step 4 means completedSteps === 3), redirect immediately
        if (step === 4) {
          navigate("/sell/dashboard");
          return;
        }
      } catch (error) {
        console.error("❌ Error fetching registration progress:", error);
        toast.error("Failed to load registration progress");
      } finally {
        setLoading(false);
      }
    };

    fetchProgress();
  }, [user, navigate]);

  const handleStepComplete = async () => {
    try {
      const nextStep = currentStep + 1;
      setCompletedSteps((prev) => prev + 1);
      setCurrentStep(nextStep);
      const email = user.email;
      await axios.post(
        `${import.meta.env.VITE_FRONTEND_URL}/api/sellers/update-progress`,
        {
          email,
          currentStep: nextStep,
          completedSteps: nextStep - 1,
        }
      );
    } catch (error) {
      console.error("❌ Error updating progress:", error);
      toast.error("Failed to update registration progress");
    }
  };

  const handleRegistrationComplete = async () => {
    try {
      toast.loading("Finalizing registration...");
      await axios.post(
        `${import.meta.env.VITE_FRONTEND_URL}/api/sellers/update-progress`,
        {
          email: user.email,
          currentStep: 4,
          completedSteps: 3,
        }
      );
      toast.dismiss();
      toast.success("Registration completed successfully!");
      navigate("/sell/dashboard");
    } catch (error) {
      toast.dismiss();
      console.error("❌ Error completing registration:", error);
      toast.error("Failed to complete registration");
    }
  };

  if (loading) {
    return <p className="text-center mt-10 text-gray-500">Loading...</p>;
  }

  return (
    <div className="min-h-[75vh] bg-gray-50 py-8">
      <div className="w-full flex justify-center">
        <ProgressStepper
          currentStep={currentStep}
          completedSteps={completedSteps}
        />
      </div>

      <div className="mt-8">
        {currentStep === 2 && <StoreSetup onComplete={handleStepComplete} />}
        {currentStep === 3 && (
          <BankDetails onComplete={handleRegistrationComplete} />
        )}
        {currentStep > 3 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-2xl mx-auto bg-white rounded-xl shadow-lg p-8 text-center"
          >
            <svg
              className="mx-auto h-16 w-16 text-green-500"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5 13l4 4L19 7"
              />
            </svg>
            <h2 className="text-2xl font-bold mt-4 mb-2">
              Registration Complete!
            </h2>
            <p className="text-gray-600 mb-6">
              Your seller account is ready to use.
            </p>
            <button
              onClick={() => navigate("/sell/dashboard")}
              className="bg-blue-600 text-white py-2 px-6 rounded-lg hover:bg-blue-700 transition-colors"
            >
              Go to Dashboard
            </button>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default SellerRegisterPage;
