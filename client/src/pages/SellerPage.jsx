/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
import { useState, useEffect } from "react";
import { getAuth } from "firebase/auth";
import toast from "react-hot-toast";
import axios from "axios";
import {
  ChartBarIcon,
  CogIcon,
  CurrencyRupeeIcon,
  GlobeAltIcon,
  ShieldCheckIcon,
  UserGroupIcon,
  SparklesIcon,
  BuildingStorefrontIcon,
} from "@heroicons/react/24/outline";

const SellerPage = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [agreeTerms, setAgreeTerms] = useState(false);
  const [userEmail, setUserEmail] = useState("");
  const [userName, setUserName] = useState("");
  const auth = getAuth();

  useEffect(() => {
    const checkIfSeller = async () => {
      const user = auth.currentUser;
      if (user) {
        setUserEmail(user.email);
        setUserName(user.displayName);
        try {
          const response = await axios.post(
            `${import.meta.env.VITE_FRONTEND_URL}/api/sellers/isSeller`,
            { email: user.email }
          );
          if (response.data.isSeller) {
            window.location.href = "/sell/register";
          }
        } catch (error) {
          console.error("Error checking seller status:", error);
          toast.error("Error verifying seller status");
        }
      }
    };
    checkIfSeller();
  }, [auth]);

  const handleBecomeSeller = async () => {
    try {
      toast.loading("Processing...");
      const token = await auth.currentUser.getIdToken();
      const { data } = await axios.post(
        `${import.meta.env.VITE_FRONTEND_URL}/api/sellers/becomeSeller`,
        { email: userEmail, name: userName },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      toast.dismiss();
      toast.success("Seller account created successfully!");
      window.location.href = "/sell/register";
    } catch (error) {
      toast.dismiss();
      toast.error(error.response?.data?.message || "Registration failed");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-blue-600 to-indigo-700 text-white py-24 px-4">
        <div className="max-w-7xl mx-auto text-center">
          <div className="mb-8 flex justify-center">
            <BuildingStorefrontIcon className="w-16 h-16 text-white/90" />
          </div>
          <h1 className="text-5xl font-bold mb-6 leading-tight">
            Transform Your Business with
            <br />
            Our Seller Platform
          </h1>
          <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
            Join our marketplace of variety of sellers and access
            enterprise-grade tools to scale your business globally.
          </p>
          <button
            onClick={() => auth.currentUser && setIsModalOpen(true)}
            className="bg-white text-blue-600 px-8 py-4 rounded-xl text-lg font-semibold hover:bg-opacity-95 transition-all shadow-2xl hover:bg-green-600 hover:text-white cursor-pointer"
          >
            Launch Your Store Now
          </button>
        </div>
      </section>

      {/* Value Propositions */}
      <section className="py-20 px-4 bg-gray-200">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
          <ValueCard
            icon={GlobeAltIcon}
            title="Global Reach"
            description="Access millions of buyers across 150+ countries with our international logistics network"
          />
          <ValueCard
            icon={CurrencyRupeeIcon}
            title="Competitive Fees"
            description="Low 5% transaction fee with no hidden costs - keep more of your earnings"
          />
          <ValueCard
            icon={ShieldCheckIcon}
            title="Seller Protection"
            description="Full fraud protection and secure payment processing guaranteed"
          />
        </div>
      </section>

      {/* Platform Features */}
      <section className="py-20 px-4 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <SectionHeader
            title="Enterprise-Level Selling Tools"
            subtitle="Everything you need to manage and grow your business"
          />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <FeatureCard
              icon={ChartBarIcon}
              title="Advanced Analytics"
              description="Real-time sales tracking and customer insights with AI-powered recommendations"
            />
            <FeatureCard
              icon={CogIcon}
              title="Smart Automation"
              description="Automated inventory management and order fulfillment systems"
            />
            <FeatureCard
              icon={SparklesIcon}
              title="Marketing Suite"
              description="Built-in SEO tools and social media integration for maximum visibility"
            />
            <FeatureCard
              icon={UserGroupIcon}
              title="Dedicated Support"
              description="24/7 priority support with dedicated account manager"
            />
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 px-4 bg-gray-200">
        <div className="max-w-7xl mx-auto">
          <SectionHeader
            title="Trusted by Leading Sellers"
            subtitle="Hear from our successful partners"
          />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <TestimonialCard
              name="Sarah Johnson"
              role="CEO, Fashion Collective"
              text="Our sales grew 300% in the first year using this platform. The analytics tools are unmatched."
            />
            <TestimonialCard
              name="Michael Chen"
              role="Founder, TechGadgets"
              text="The international shipping solutions helped us expand to 15 new markets effortlessly."
            />
            <TestimonialCard
              name="Emma Wilson"
              role="Owner, HomeDecor Plus"
              text="The seller support team has been instrumental in scaling our operations globally."
            />
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white py-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <div className="mb-8 flex justify-center">
            <SparklesIcon className="w-16 h-16 text-amber-300" />
          </div>
          <h2 className="text-4xl font-bold mb-6">
            Ready for Exponential Growth?
          </h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto">
            Join our elite network of sellers and get first access to new
            features, beta programs, and global expansion opportunities.
          </p>
          <button
            onClick={() => auth.currentUser && setIsModalOpen(true)}
            className="bg-white text-blue-600 px-8 py-4 rounded-xl text-lg font-semibold hover:bg-opacity-95 transition-all shadow-2xl hover:bg-green-600 hover:text-white cursor-pointer"
          >
            Start Selling Today
          </button>
        </div>
      </section>

      {/* Registration Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-lg">
          <div className="bg-white rounded-2xl shadow-3xl p-8 max-w-xl w-full border border-gray-100">
            <div className="mb-6">
              <h3 className="text-3xl font-bold text-gray-900 mb-2">
                Create Seller Account
              </h3>
              <p className="text-gray-600 font-medium">
                Registering as <span className="font-bold">{userName}</span> (
                {userEmail})
              </p>
            </div>

            <div className="mb-6 space-y-4">
              <div className="p-4 bg-blue-50 rounded-lg">
                <h4 className="font-semibold text-blue-800 mb-2">
                  Premium Benefits:
                </h4>
                <ul className="list-disc list-inside space-y-2 text-blue-700">
                  <li>Advanced business analytics dashboard</li>
                  <li>Priority customer support</li>
                  <li>Customizable storefront options</li>
                  <li>Exclusive seller promotions</li>
                </ul>
              </div>

              <div className="flex items-start space-x-3">
                <input
                  type="checkbox"
                  checked={agreeTerms}
                  onChange={(e) => setAgreeTerms(e.target.checked)}
                  className="mt-1 h-5 w-5 text-blue-600 rounded-lg"
                />
                <p className="text-sm text-gray-600 font-medium">
                  I agree to the{" "}
                  <a
                    href="/terms"
                    className="text-blue-600 hover:underline font-medium"
                  >
                    Seller Terms & Conditions
                  </a>{" "}
                  and acknowledge the{" "}
                  <a
                    href="/privacy"
                    className="text-blue-600 hover:underline font-medium"
                  >
                    Privacy Policy
                  </a>
                </p>
              </div>
            </div>

            <div className="flex justify-end gap-4">
              <button
                onClick={() => setIsModalOpen(false)}
                className="px-6 py-3 text-white bg-red-500 font-medium hover:bg-red-900 rounded-lg transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={handleBecomeSeller}
                disabled={!agreeTerms}
                className={`px-6 py-3 rounded-lg transition-colors ${
                  agreeTerms
                    ? "bg-blue-600 text-white hover:bg-blue-700 cursor-pointer"
                    : "bg-gray-200 text-gray-400 cursor-not-allowed"
                }`}
              >
                Confirm Registration
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// Reusable Components
const SectionHeader = ({ title, subtitle }) => (
  <div className="text-center mb-12">
    <h2 className="text-3xl font-bold text-gray-900 mb-4">{title}</h2>
    <p className="text-gray-600 text-lg max-w-2xl mx-auto">{subtitle}</p>
  </div>
);

const ValueCard = ({ icon: Icon, title, description }) => (
  <div className="p-8 bg-white rounded-xl shadow-xl hover:shadow-xl transition-shadow">
    <div className="mb-4 text-blue-600">
      <Icon className="w-12 h-12" />
    </div>
    <h3 className="text-xl font-bold text-gray-900 mb-3">{title}</h3>
    <p className="text-gray-600 leading-relaxed font-medium">{description}</p>
  </div>
);

const FeatureCard = ({ icon: Icon, title, description }) => (
  <div className="p-6 bg-white rounded-xl shadow-xl hover:shadow-2xl transition-shadow">
    <div className="mb-4 text-blue-600">
      <Icon className="w-8 h-8" />
    </div>
    <h3 className="text-lg font-bold text-gray-900 mb-2">{title}</h3>
    <p className="text-gray-600 text-sm font-medium">{description}</p>
  </div>
);

const TestimonialCard = ({ name, role, text }) => (
  <div className="p-6 bg-white rounded-xl shadow-xl hover:shadow-2xl transition-shadow">
    <p className="text-blue-500 mb-4 italic font-medium">&quot;{text}&quot;</p>
    <div className="border-t pt-4">
      <h4 className="font-semibold text-gray-900">{name}</h4>
      <p className="text-sm text-gray-500 font-medium">{role}</p>
    </div>
  </div>
);

export default SellerPage;
