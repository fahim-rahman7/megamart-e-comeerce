import React, { useState, useEffect } from "react";
// 1. Import your mutation hook alongside the query hook
import { useGetProfileQuery, useUpdateProfileMutation } from "../service/api";
import { Navigate } from "react-router";
import Loader from "../components/ui/LoadAnime";
import { FiEdit3, FiSave, FiX, FiCamera, FiUser, FiMapPin, FiMail, FiShield } from "react-icons/fi";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Profile = () => {
  const { data, isLoading, error } = useGetProfileQuery();
  
  // 2. Initialize the RTK Query mutation hook
  const [updateProfile, { isLoading: isUpdating }] = useUpdateProfileMutation();

  const [isEditing, setIsEditing] = useState(false);
  const [fullName, setFullName] = useState("");
  const [address, setAddress] = useState("");
  const [avatarFile, setAvatarFile] = useState(null);
  const [avatarPreview, setAvatarPreview] = useState("");

  // Populate local states when data is fetched
  useEffect(() => {
    if (data) {
      setFullName(data.fullName || "");
      setAddress(typeof data.address === "string" ? data.address : data.address?.street || "");
      setAvatarPreview(data.avatar || "");
    }
  }, [data]);

  if (isLoading) return <Loader />;
  if (error || !data) return <Navigate to="/login" replace />;

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setAvatarFile(file);
      setAvatarPreview(URL.createObjectURL(file)); 
    }
  };

  const handleUpdateProfile = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("fullName", fullName);
    formData.append("address", address);
    if (avatarFile) {
      formData.append("avatar", avatarFile);
    }

    try {
      await updateProfile(formData).unwrap();

      toast.success("Profile updated successfully!");
      setIsEditing(false);
    } catch (err) {
      toast.error(err?.data?.message || err?.message || "Failed to update profile");
    }
  };

  const handleCancel = () => {
    setIsEditing(false);
    setFullName(data.fullName || "");
    setAddress(typeof data.address === "string" ? data.address : data.address?.street || "");
    setAvatarPreview(data.avatar || "");
    setAvatarFile(null);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container max-w-3xl mx-auto px-4">
        <ToastContainer position="bottom-right" />

        {/* Profile Card Header */}
        <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-8 flex flex-col md:flex-row items-center justify-between gap-6 relative">
          
          <div className="flex flex-col md:flex-row items-center gap-6 text-center md:text-left">
            <div className="relative group">
              <img
                src={avatarPreview || "https://placehold.co/150"}
                alt="profile avatar"
                className="w-32 h-32 rounded-full object-cover border-4 border-brand/20 shadow-md"
              />
              {isEditing && (
                <label className="absolute inset-0 bg-black/40 rounded-full flex flex-col items-center justify-center text-white cursor-pointer opacity-0 group-hover:opacity-100 transition-opacity">
                  <FiCamera className="text-2xl mb-1" />
                  <span className="text-xs font-medium">Change</span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="hidden"
                  />
                </label>
              )}
            </div>

            <div>
              <h1 className="text-2xl font-bold text-gray-900">{data.fullName}</h1>
              <p className="text-gray-500 text-sm mt-1 flex items-center justify-center md:justify-start gap-1">
                <FiMail className="text-gray-400" /> {data.email}
              </p>
              <span className="mt-3 inline-flex items-center gap-1 bg-brand/10 text-brand px-3 py-1 rounded-full text-xs font-semibold capitalize">
                <FiShield className="text-xs" /> {data.role || "User"}
              </span>
            </div>
          </div>

          <div>
            {!isEditing ? (
              <button
                onClick={() => setIsEditing(true)}
                className="flex items-center gap-2 px-5 py-2.5 bg-brand text-white rounded-xl font-semibold shadow-sm hover:bg-brand/90 transition cursor-pointer"
              >
                <FiEdit3 /> Edit Profile
              </button>
            ) : (
              <button
                onClick={handleCancel}
                className="flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-600 rounded-xl font-semibold hover:bg-gray-200 transition cursor-pointer"
              >
                <FiX /> Cancel
              </button>
            )}
          </div>
        </div>

        <form onSubmit={handleUpdateProfile} className="mt-6">
          <div className="grid md:grid-cols-2 gap-6">
            
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 flex flex-col justify-between">
              <div>
                <h2 className="text-base font-bold text-gray-900 mb-4 pb-2 border-b border-gray-100 flex items-center gap-2">
                  <FiUser className="text-brand" /> Account Overview
                </h2>

                <div className="space-y-4 text-sm">
                  <div>
                    <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">
                      Full Name
                    </label>
                    {isEditing ? (
                      <input
                        type="text"
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                        required
                        className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:border-brand transition"
                      />
                    ) : (
                      <p className="font-medium text-gray-800">{data.fullName}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">
                      Email Address
                    </label>
                    <p className="font-medium text-gray-800 bg-gray-50 px-3 py-2.5 rounded-xl border border-gray-100">
                      {data.email} <span className="text-xs text-gray-400 font-normal">(Cannot be changed)</span>
                    </p>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">
                      Account Type
                    </label>
                    <p className="font-medium text-gray-800 capitalize">{data.role}</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 flex flex-col justify-between">
              <div>
                <h2 className="text-base font-bold text-gray-900 mb-4 pb-2 border-b border-gray-100 flex items-center gap-2">
                  <FiMapPin className="text-brand" /> Shipping Address
                </h2>

                <div className="space-y-4 text-sm">
                  <div>
                    <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">
                      Street / Detailed Address
                    </label>
                    {isEditing ? (
                      <textarea
                        value={address}
                        onChange={(e) => setAddress(e.target.value)}
                        rows="3"
                        placeholder="Enter your address..."
                        className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:border-brand transition resize-none"
                      />
                    ) : (
                      <div>
                        {data.address ? (
                          typeof data.address === "string" ? (
                            <p className="text-gray-700 leading-relaxed">{data.address}</p>
                          ) : (
                            <div className="text-gray-700 space-y-0.5">
                              <p>{data.address.street || data.address.address}</p>
                              <p>{data.address.city} {data.address.state && `, ${data.address.state}`}</p>
                              <p>{data.address.postalCode}</p>
                            </div>
                          )
                        ) : (
                          <p className="italic text-gray-400">No address added yet.</p>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {isEditing && (
                <div className="mt-6 pt-4 border-t border-gray-100">
                  <button
                    type="submit"
                    disabled={isUpdating}
                    className="w-full flex items-center justify-center gap-2 py-3 bg-brand text-white font-semibold rounded-xl hover:bg-brand/90 transition shadow-md shadow-brand/20 disabled:opacity-50 cursor-pointer"
                  >
                    <FiSave /> {isUpdating ? "Saving Changes..." : "Save Changes"}
                  </button>
                </div>
              )}
            </div>

          </div>
        </form>

      </div>
    </div>
  );
};

export default Profile;