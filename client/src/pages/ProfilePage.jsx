import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import {
  FaUser,
  FaHeart,
  FaBox,
  FaMapMarkerAlt,
  FaHeadset,
  FaLock,
} from "react-icons/fa";
import axios from "axios";
import LoadingSpinner from "../components/Loading/LoadingSpinner";
import UserProfile from "../components/Profile/UserProfile";
import Wishlist from "../components/Profile/Wishlist";
import Orders from "../components/Profile/Orders";
import Addresses from "../components/Profile/Addresses";
import Contact from "../components/Profile/Contact"; // Import Contact component

const ProfilePage = () => {
  const [activeSection, setActiveSection] = useState("profile");
  const [user, setUser] = useState(null);

  // Function to fetch full user details from the backend using the email as a query parameter
  const fetchUserDetails = async (email) => {
    try {
      const response = await axios.get(
        `${
          import.meta.env.VITE_FRONTEND_URL
        }/api/user/details?email=${encodeURIComponent(email)}`
      );
      setUser(response.data);
    } catch (error) {
      console.error("Error fetching user details:", error);
      const currentUser = getAuth().currentUser;
      if (currentUser) {
        setUser({
          name: currentUser.displayName || "Guest",
          email: currentUser.email,
          joined: new Date(
            currentUser.metadata.creationTime
          ).toLocaleDateString(),
        });
      }
    }
  };

  useEffect(() => {
    const auth = getAuth();
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (currentUser) {
        const basicUser = {
          name: currentUser.displayName || "Guest",
          email: currentUser.email,
          joined: new Date(
            currentUser.metadata.creationTime
          ).toLocaleDateString(),
        };
        setUser(basicUser);
        fetchUserDetails(currentUser.email);
      }
    });
    return () => unsubscribe();
  }, []);

  const sections = [
    { id: "profile", icon: <FaUser />, title: "Profile" },
    { id: "wishlist", icon: <FaHeart />, title: "Wishlist" },
    { id: "orders", icon: <FaBox />, title: "Your Orders" },
    { id: "addresses", icon: <FaMapMarkerAlt />, title: "Your Addresses" },
    { id: "contact", icon: <FaHeadset />, title: "Contact Us" },
  ];

  if (!user) return <LoadingSpinner />;

  return (
    <div className="bg-gray-100 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col md:flex-row gap-8">
          {/* Left Navigation */}
          <div className="w-full md:w-64">
            <div className="bg-white rounded-lg shadow-sm p-4 sticky top-20">
              <h2 className="text-xl font-semibold text-gray-700 mb-4">
                Your Account
              </h2>
              <nav className="space-y-2">
                {sections.map((section) => (
                  <button
                    key={section.id}
                    onClick={() => setActiveSection(section.id)}
                    className={`w-full text-left flex items-center gap-3 p-3 rounded-lg cursor-pointer font-medium ${
                      activeSection === section.id
                        ? "bg-blue-50 text-blue-600"
                        : "hover:bg-gray-100 text-gray-800"
                    }`}
                  >
                    {section.icon}
                    {section.title}
                  </button>
                ))}
              </nav>
            </div>
          </div>

          {/* Main Content */}
          <div className="flex-1">
            {activeSection === "profile" && (
              <UserProfile
                user={user}
                refreshUser={() => fetchUserDetails(user.email)}
              />
            )}

            {activeSection === "wishlist" && <Wishlist />}

            {activeSection === "orders" && <Orders />}

            {activeSection === "addresses" && <Addresses />}

            {activeSection === "contact" && <Contact user={user} />}
          </div>
        </div>

        {/* Additional Info */}
        <div className="mt-8 p-6 bg-white rounded-lg shadow-sm">
          <div className="flex items-center gap-4 mb-4">
            <FaLock className="text-2xl text-gray-600" />
            <h3 className="text-lg font-bold text-gray-800">
              Account Security
            </h3>
          </div>
          <p className="text-gray-600 font-normal">
            Your privacy and security are important to us. We never share your
            personal details with third parties without your consent.
          </p>
          <p className="text-gray-600 font-normal">
            We employ state-of-the-art encryption and security measures to
            protect your data, ensuring that your transactions and personal
            information remain secure at all times.
          </p>
          <p className="text-gray-600 font-normal">
            Access to your information is strictly controlled and monitored, and
            our dedicated security team is always on standby to protect your
            account.
          </p>
          <p className="text-gray-600 font-normal">
            If you have any questions or concerns regarding our security
            practices, please do not hesitate to contact our support team.
          </p>
          <div className="mt-4 flex gap-4">
            <Link
              to="/terms"
              className="text-blue-600 font-bold hover:text-blue-800"
            >
              Terms of Service
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
