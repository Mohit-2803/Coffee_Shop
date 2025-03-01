import { useEffect, useState } from "react";
import { getAuth } from "firebase/auth";
import axios from "axios";
import toast from "react-hot-toast";
import LoadingSpinner from "../Loading/LoadingSpinner";

const Addresses = () => {
  const [addresses, setAddresses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingAddress, setEditingAddress] = useState(null);
  const auth = getAuth();
  const user = auth.currentUser;

  // Fetch the address from the backend
  useEffect(() => {
    const fetchAddresses = async () => {
      if (!user) return;
      try {
        const response = await axios.get(
          `${
            import.meta.env.VITE_FRONTEND_URL
          }/api/address/users/${encodeURIComponent(user.email)}/address`
        );
        // If the backend returns an object (or null), wrap it in an array.
        if (response.data) {
          setAddresses([response.data]);
        } else {
          setAddresses([]);
        }
      } catch (error) {
        console.error("Error fetching address:", error);
        toast.error("Failed to fetch address.");
      } finally {
        setLoading(false);
      }
    };

    fetchAddresses();
  }, [user]);

  // Handle editing: set the selected address as the one to edit
  const handleEdit = (address) => {
    setEditingAddress(address);
  };

  // Handle canceling edit
  const handleCancelEdit = () => {
    setEditingAddress(null);
  };

  // Handle saving updated address to backend
  const handleSaveEdit = async () => {
    // Validate required fields
    if (
      !editingAddress.fullName ||
      !editingAddress.street ||
      !editingAddress.city ||
      !editingAddress.state ||
      !editingAddress.zipCode ||
      !editingAddress.country ||
      !editingAddress.phone
    ) {
      toast.error("All address fields are required.");
      return;
    }
    try {
      const response = await axios.put(
        `${
          import.meta.env.VITE_FRONTEND_URL
        }/api/address/users/${encodeURIComponent(user.email)}/address`,
        editingAddress
      );
      toast.success(response.data.message || "Address updated successfully.");
      // Update addresses state with the new address
      setAddresses([editingAddress]);
      setEditingAddress(null);
    } catch (error) {
      console.error("Error updating address:", error);
      toast.error("Failed to update address.");
    }
  };

  if (loading) return <LoadingSpinner />;

  return (
    <div className="bg-white rounded-lg shadow-sm p-6 h-full">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-semibold text-gray-700">Your Addresses</h2>
      </div>
      {addresses.length === 0 ? (
        <p className="font-medium text-center">No address found.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {addresses.map((address, index) => (
            <div
              key={address.id || index}
              className="bg-blue-50 rounded-lg p-4"
            >
              {editingAddress && editingAddress.id === address.id ? (
                <>
                  <input
                    type="text"
                    value={editingAddress.fullName}
                    onChange={(e) =>
                      setEditingAddress({
                        ...editingAddress,
                        fullName: e.target.value,
                      })
                    }
                    placeholder="Full Name"
                    className="w-full p-2 border border-gray-300 rounded mb-2"
                  />
                  <input
                    type="text"
                    value={editingAddress.street}
                    onChange={(e) =>
                      setEditingAddress({
                        ...editingAddress,
                        street: e.target.value,
                      })
                    }
                    placeholder="Street"
                    className="w-full p-2 border border-gray-300 rounded mb-2"
                  />
                  <input
                    type="text"
                    value={editingAddress.city}
                    onChange={(e) =>
                      setEditingAddress({
                        ...editingAddress,
                        city: e.target.value,
                      })
                    }
                    placeholder="City"
                    className="w-full p-2 border border-gray-300 rounded mb-2"
                  />
                  <input
                    type="text"
                    value={editingAddress.state}
                    onChange={(e) =>
                      setEditingAddress({
                        ...editingAddress,
                        state: e.target.value,
                      })
                    }
                    placeholder="State"
                    className="w-full p-2 border border-gray-300 rounded mb-2"
                  />
                  <input
                    type="text"
                    value={editingAddress.zipCode}
                    onChange={(e) =>
                      setEditingAddress({
                        ...editingAddress,
                        zipCode: e.target.value,
                      })
                    }
                    placeholder="Zip Code"
                    maxLength="6"
                    pattern="\d{1,6}"
                    className="w-full p-2 border border-gray-300 rounded mb-2"
                  />

                  <input
                    type="text"
                    value={editingAddress.country}
                    onChange={(e) =>
                      setEditingAddress({
                        ...editingAddress,
                        country: e.target.value,
                      })
                    }
                    placeholder="Country (TWO CHARACTERS eg: US)"
                    className="w-full p-2 border border-gray-300 rounded mb-2"
                  />
                  <input
                    type="tel"
                    value={editingAddress.phone}
                    onChange={(e) =>
                      setEditingAddress({
                        ...editingAddress,
                        phone: e.target.value,
                      })
                    }
                    placeholder="Phone"
                    maxLength="10"
                    minLength="10"
                    pattern="\d{1,10}"
                    className="w-full p-2 border border-gray-300 rounded mb-2"
                  />

                  <div className="flex gap-4 mt-2">
                    <button
                      onClick={handleSaveEdit}
                      className="px-4 py-2 bg-green-600 cursor-pointer font-medium text-white rounded hover:bg-green-700 transition"
                    >
                      Save
                    </button>
                    <button
                      onClick={handleCancelEdit}
                      className="px-4 py-2 bg-gray-300 cursor-pointer font-medium text-gray-800 rounded hover:bg-gray-400 transition"
                    >
                      Cancel
                    </button>
                  </div>
                </>
              ) : (
                <>
                  <h3 className="font-medium mb-2">{address.fullName}</h3>
                  <p className="text-gray-600 font-medium">
                    {address.street}, {address.city}
                    <br />
                    {address.state} - {address.zipCode}
                    <br />
                    Phone: {address.phone}
                  </p>
                  <div className="mt-4 flex gap-2">
                    <button
                      onClick={() => handleEdit(address)}
                      className="text-gray-700 bg-amber-500 px-6 rounded-full font-medium cursor-pointer py-1 hover:bg-amber-600"
                    >
                      Edit
                    </button>
                  </div>
                </>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Addresses;
