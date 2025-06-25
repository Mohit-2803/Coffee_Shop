/* eslint-disable react/prop-types */
import { useState } from "react";
import { FaComments, FaEnvelope, FaPhoneAlt, FaClock } from "react-icons/fa";
import ContactChatBot from "./ContactChatBot/ContactChatbot";

const Contact = ({ user }) => {
  const [chatStarted, setChatStarted] = useState(false);

  const startChat = () => {
    setChatStarted(true);
  };

  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <h2 className="text-2xl font-semibold text-gray-700 mb-6">Contact Us</h2>

      {!chatStarted ? (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-blue-100 p-6 rounded-lg">
              <div className="flex items-center gap-4 mb-4">
                <FaComments className="text-3xl text-blue-600" />
                <h3 className="text-xl font-semibold text-gray-800">
                  Chat Bot
                </h3>
              </div>
              <p className="text-gray-600 mb-4 font-medium">
                Our virtual assistant is available 24/7 to help with your
                questions. Start a chat for immediate assistance with orders,
                products, or account issues.
              </p>
              <button
                onClick={startChat}
                className="bg-blue-600 text-white cursor-pointer font-medium px-6 py-2 rounded-lg hover:bg-blue-900 transition-colors"
              >
                Start Chat
              </button>
            </div>

            <div className="space-y-6">
              <div className="flex items-start gap-4">
                <FaEnvelope className="text-2xl text-gray-600 mt-1" />
                <div>
                  <h3 className="text-lg font-semibold mb-2 text-gray-800">
                    Email Support
                  </h3>
                  <p className="text-gray-600 font-medium">
                    support@shopease.com
                  </p>
                  <p className="text-xs text-gray-500 font-medium">
                    Typical response time: 1-2 hours
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <FaPhoneAlt className="text-2xl text-gray-600 mt-1" />
                <div>
                  <h3 className="text-lg font-semibold mb-2 text-gray-800">
                    Phone Support
                  </h3>
                  <p className="text-gray-600 font-medium">
                    1-800-SHOPEASE (1-800-746-7327)
                  </p>
                  <p className="text-xs text-gray-500 font-medium">
                    Mon-Fri: 8 AM - 8 PM EST
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-gray-100 p-6 rounded-lg flex items-center gap-4">
            <FaClock className="text-2xl text-gray-600" />
            <div>
              <h3 className="font-semibold mb-1 text-gray-800">
                Current Wait Times
              </h3>
              <p className="text-gray-600 text-sm font-medium">
                Chat: Immediate • Email: 1-2 hours • Phone: Less than 5 minutes
              </p>
            </div>
          </div>
        </div>
      ) : (
        <>
          <ContactChatBot user={user} />
        </>
      )}
    </div>
  );
};

export default Contact;
