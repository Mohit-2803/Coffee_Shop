/* eslint-disable react/prop-types */
import { useState } from "react";
import toast, { Toaster } from "react-hot-toast";

const AddressForm = ({ initialValues, onSubmit }) => {
  const [formData, setFormData] = useState(
    initialValues || {
      fullName: "",
      street: "",
      city: "",
      state: "",
      zipCode: "",
      country: "IN", // Using ISO code for India
      phone: "",
    }
  );

  const handleSubmit = (e) => {
    e.preventDefault();

    // Validate ZIP Code: no more than 6 digits
    if (formData.zipCode.length > 6) {
      toast.error("ZIP Code cannot exceed 6 digits.");
      return;
    }

    // Validate Phone Number: no more than 10 digits
    if (formData.phone.length > 10) {
      toast.error("Phone number cannot exceed 10 digits.");
      return;
    }

    // All validations passed, submit the form
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium mb-1">Full Name</label>
        <input
          type="text"
          value={formData.fullName}
          onChange={(e) =>
            setFormData({ ...formData, fullName: e.target.value })
          }
          className="w-full p-2 border border-gray-300 rounded-md"
        />
      </div>
      <div>
        <label className="block text-sm font-medium mb-1">Street Address</label>
        <input
          type="text"
          value={formData.street}
          onChange={(e) => setFormData({ ...formData, street: e.target.value })}
          className="w-full p-2 border border-gray-300 rounded-md"
        />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label className="block text-sm font-medium mb-1">City</label>
          <input
            type="text"
            value={formData.city}
            onChange={(e) => setFormData({ ...formData, city: e.target.value })}
            className="w-full p-2 border border-gray-300 rounded-md"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">State</label>
          <input
            type="text"
            value={formData.state}
            onChange={(e) =>
              setFormData({ ...formData, state: e.target.value })
            }
            className="w-full p-2 border border-gray-300 rounded-md"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">ZIP Code</label>
          <input
            type="text"
            value={formData.zipCode}
            onChange={(e) =>
              setFormData({ ...formData, zipCode: e.target.value })
            }
            maxLength="6"
            className="w-full p-2 border border-gray-300 rounded-md"
          />
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium mb-1">Country</label>
          <select
            value={formData.country}
            onChange={(e) =>
              setFormData({ ...formData, country: e.target.value })
            }
            className="w-full p-2 border border-gray-300 rounded-md"
          >
            <option value="IN">India</option>
            <option value="US">United States</option>
            {/* Add more countries as needed */}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Phone Number</label>
          <input
            type="tel"
            value={formData.phone}
            onChange={(e) =>
              setFormData({ ...formData, phone: e.target.value })
            }
            maxLength="10"
            className="w-full p-2 border border-gray-300 rounded-md"
          />
        </div>
      </div>
      <button
        type="submit"
        className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 cursor-pointer"
      >
        Save Address
      </button>
      <Toaster position="top-center" />
    </form>
  );
};

export default AddressForm;
