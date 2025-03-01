/* eslint-disable react/prop-types */
import { motion } from "framer-motion";

const steps = [
  { title: "Account Creation" },
  { title: "Store Details" },
  { title: "Bank Information" },
];

const ProgressStepper = ({ currentStep, completedSteps }) => {
  return (
    <div className="max-w-6xl mx-auto px-4 py-8 flex justify-center items-center">
      <div className="flex items-center">
        {steps.map((step, index) => {
          const isCompleted = index < completedSteps;
          const isCurrent = index === currentStep - 1;
          return (
            <div key={step.title} className="flex items-center">
              <div className="flex flex-col items-center">
                <motion.div
                  initial={{ scale: 0.8 }}
                  animate={{ scale: 1 }}
                  className={`w-8 h-8 rounded-full flex items-center justify-center ${
                    isCompleted
                      ? "bg-green-600 text-white"
                      : isCurrent
                      ? "bg-blue-600 text-white"
                      : "bg-gray-200 text-gray-500"
                  }`}
                >
                  {isCompleted ? (
                    <svg
                      className="w-5 h-5"
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
                  ) : (
                    index + 1
                  )}
                </motion.div>
                <span
                  className={`mt-2 text-sm ${
                    isCompleted || isCurrent
                      ? "text-gray-900 font-medium"
                      : "text-gray-500"
                  }`}
                >
                  {step.title}
                </span>
              </div>
              {index !== steps.length - 1 && (
                <div className="w-24 h-1 mx-2">
                  <div
                    className={`w-full h-full ${
                      index < completedSteps ? "bg-green-600" : "bg-gray-200"
                    }`}
                  />
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ProgressStepper;
