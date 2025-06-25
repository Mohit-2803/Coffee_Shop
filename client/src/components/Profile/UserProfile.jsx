/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import { useState } from "react";
import { FaUser } from "react-icons/fa";
import axios from "axios";
import toast from "react-hot-toast";

const UserProfile = ({ user, refreshUser }) => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [isUploading, setIsUploading] = useState(false);

  // Function to upload image to Cloudinary
  const uploadImage = async (file) => {
    const formData = new FormData();
    formData.append("file", file);
    formData.append(
      "upload_preset",
      import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET
    );
    formData.append("cloud_name", import.meta.env.VITE_CLOUDINARY_CLOUD_NAME);

    try {
      const response = await axios.post(
        `https://api.cloudinary.com/v1_1/${
          import.meta.env.VITE_CLOUDINARY_CLOUD_NAME
        }/image/upload`,
        formData
      );
      return response.data.secure_url;
    } catch (error) {
      toast.error("Failed to upload image");
      throw error;
    }
  };

  // Handle file selection
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file);
    }
  };

  // Function to handle image upload and update the user profile
  const handleUpload = async () => {
    if (!selectedFile) {
      toast.error("No file selected");
      return;
    }
    setIsUploading(true);
    try {
      // Upload image to Cloudinary
      const imageUrl = await uploadImage(selectedFile);

      // API call to update the user's profile image (using email as key)
      const payload = {
        email: user.email,
        profileImage: imageUrl,
      };

      const response = await axios.put(
        `${import.meta.env.VITE_FRONTEND_URL}/api/user/update-profile-image`,
        payload
      );

      if (response.status === 200) {
        toast.success("Profile image updated!");
        // Refresh the user details so the new image URL is reflected
        refreshUser && refreshUser();
      }
    } catch (error) {
      toast.error("An error occurred while updating profile image");
    } finally {
      setIsUploading(false);
      setSelectedFile(null);
    }
  };

  return (
    <div className="bg-white shadow-lg p-6 h-full rounded-xl">
      <h1 className="text-2xl font-semibold mb-6 text-gray-700">
        Hello, <span className="text-orange-600">{user.name}</span>
      </h1>
      <div className="space-y-4">
        <div className="flex items-center gap-4 mt-10">
          <div className="relative">
            {user.profileImage ? (
              <img
                src={user.profileImage}
                alt="Profile"
                className="w-20 h-20 rounded-full object-cover"
              />
            ) : (
              <div className="w-20 h-20 rounded-full bg-gray-200 flex items-center justify-center">
                <FaUser className="text-3xl text-gray-500" />
              </div>
            )}
            {/* File Input Overlay */}
            <input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="absolute inset-0 opacity-0 cursor-pointer"
            />
          </div>
          <div>
            <h3 className="text-xl font-medium">{user.name}</h3>
            <p className="text-gray-600 font-medium">{user.email}</p>
            {selectedFile && (
              <button
                onClick={handleUpload}
                disabled={isUploading}
                className={`mt-2 px-3 py-1 text-white rounded transition ${
                  isUploading
                    ? "cursor-not-allowed bg-blue-300 "
                    : "cursor-pointer bg-blue-600 hover:bg-blue-700"
                }`}
              >
                {isUploading ? "Uploading..." : "Upload New Image"}
              </button>
            )}
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4 mt-10">
          <div className="p-4 bg-gray-100 rounded-lg">
            <p className="text-sm text-gray-500 font-medium">Account created</p>
            <p className="font-medium">
              {new Date(user.created_at).toLocaleDateString("en-US", {
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </p>
          </div>
          <div className="p-4 bg-gray-100 rounded-lg">
            <p className="text-sm text-gray-500 font-medium">Security</p>
            <p className="font-medium">••••••••</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserProfile;
