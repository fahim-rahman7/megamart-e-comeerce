import React, { useState, useEffect } from "react";
import { Link, Navigate } from "react-router";
import {
  useGetProfileQuery,
  useUpdateProfileMutation,
  useGetCartQuery,
  useGetMyOrdersQuery,
} from "../service/api";
import Loader from "../components/ui/LoadAnime";
import {
  FiEdit3,
  FiSave,
  FiX,
  FiCamera,
  FiUser,
  FiMapPin,
  FiMail,
  FiShield,
  FiShoppingBag,
  FiPackage,
  FiTruck,
  FiCheckCircle,
  FiClock,
  FiPhone, // Added FiPhone icon
} from "react-icons/fi";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Profile = () => {
  // Fetching Data
  const {
    data: profileData,
    isLoading: isProfileLoading,
    error,
  } = useGetProfileQuery();
  const { data: cartRes } = useGetCartQuery();
  const { data: ordersRes, isLoading: isOrdersLoading } = useGetMyOrdersQuery();

  const [updateProfile, { isLoading: isUpdating }] = useUpdateProfileMutation();

  // Local States for Editing
  const [isEditing, setIsEditing] = useState(false);
  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState(""); // Added phone state
  const [address, setAddress] = useState("");
  const [avatarFile, setAvatarFile] = useState(null);
  const [avatarPreview, setAvatarPreview] = useState("");

  // Derived Data
  const cartItemsCount =
    cartRes?.cartData?.totalItems || cartRes?.cartData?.items?.length || 0;
  const orders = ordersRes?.data || ordersRes || [];

  const pendingOrders = orders.filter((o) => o.status === "pending").length;
  const activeOrders = orders.filter(
    (o) => o.status === "confirmed" || o.status === "shipped"
  ).length;
  const deliveredOrders = orders.filter((o) => o.status === "delivered").length;

  const recentOrders = orders.slice(0, 3);

  useEffect(() => {
    if (profileData) {
      setFullName(profileData.fullName || "");
      setPhone(profileData.phone || ""); // Populate phone state
      setAddress(
        typeof profileData.address === "string"
          ? profileData.address
          : profileData.address?.street || ""
      );
      setAvatarPreview(profileData.avatar || "");
    }
  }, [profileData]);

  if (isProfileLoading) return <Loader />;
  if (error || !profileData) return <Navigate to="/login" replace />;

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
    formData.append("phone", phone); // Append phone to form data
    formData.append("address", address);
    if (avatarFile) {
      formData.append("avatar", avatarFile);
    }

    try {
      await updateProfile(formData).unwrap();
      toast.success("Profile updated successfully!");
      setIsEditing(false);
    } catch (err) {
      toast.error(
        err?.data?.message || err?.message || "Failed to update profile"
      );
    }
  };

  const handleCancel = () => {
    setIsEditing(false);
    setFullName(profileData.fullName || "");
    setPhone(profileData.phone || ""); // Reset phone state on cancel
    setAddress(
      typeof profileData.address === "string"
        ? profileData.address
        : profileData.address?.street || ""
    );
    setAvatarPreview(profileData.avatar || "");
    setAvatarFile(null);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "pending":
        return "bg-yellow-100 text-yellow-700";
      case "confirmed":
        return "bg-blue-100 text-blue-700";
      case "shipped":
        return "bg-indigo-100 text-indigo-700";
      case "delivered":
        return "bg-green-100 text-green-700";
      case "cancelled":
        return "bg-red-100 text-red-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container max-w-6xl mx-auto px-4 space-y-6">
        <ToastContainer position="bottom-right" />

        {/* --- PROFILE HEADER CARD --- */}
        <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-8 flex flex-col md:flex-row items-center justify-between gap-6 relative">
          <div className="flex flex-col md:flex-row items-center gap-6 text-center md:text-left">
            <div className="relative group">
              <img
                src={avatarPreview || "https://placehold.co/150"}
                alt="profile avatar"
                className="w-32 h-32 rounded-full object-cover border-4 border-brand/20 shadow-md bg-white"
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
              <h1 className="text-2xl font-bold text-gray-900">
                {profileData.fullName}
              </h1>
              <p className="text-gray-500 text-sm mt-1 flex items-center justify-center md:justify-start gap-1">
                <FiMail className="text-gray-400" /> {profileData.email}
              </p>
              {profileData.phone && (
                <p className="text-gray-500 text-sm mt-1 flex items-center justify-center md:justify-start gap-1">
                  <FiPhone className="text-gray-400" /> {profileData.phone}
                </p>
              )}
              <span className="mt-3 inline-flex items-center gap-1 bg-brand/10 text-brand px-3 py-1 rounded-full text-xs font-semibold capitalize">
                <FiShield className="text-xs" /> {profileData.role || "User"}
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

        {/* --- QUICK STATS ROW --- */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Link
            to="/cart"
            className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 flex items-center gap-4 hover:border-brand transition group cursor-pointer"
          >
            <div className="w-12 h-12 rounded-full bg-orange-50 text-orange-500 flex items-center justify-center text-xl group-hover:scale-110 transition-transform">
              <FiShoppingBag />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Cart Items</p>
              <h3 className="text-xl font-bold text-gray-900">
                {cartItemsCount}
              </h3>
            </div>
          </Link>

          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-yellow-50 text-yellow-600 flex items-center justify-center text-xl">
              <FiClock />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Pending</p>
              <h3 className="text-xl font-bold text-gray-900">
                {pendingOrders}
              </h3>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-blue-50 text-blue-500 flex items-center justify-center text-xl">
              <FiTruck />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Shipped</p>
              <h3 className="text-xl font-bold text-gray-900">
                {activeOrders}
              </h3>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-green-50 text-green-500 flex items-center justify-center text-xl">
              <FiCheckCircle />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Delivered</p>
              <h3 className="text-xl font-bold text-gray-900">
                {deliveredOrders}
              </h3>
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-6 items-start">
          {/* --- ACCOUNT DETAILS FORM (Left 2 Columns) --- */}
          <div className="lg:col-span-2">
            <form
              onSubmit={handleUpdateProfile}
              className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 h-full"
            >
              <h2 className="text-lg font-bold text-gray-900 mb-6 pb-4 border-b border-gray-100 flex items-center gap-2">
                <FiUser className="text-brand" /> Personal Information
              </h2>

              <div className="grid md:grid-cols-2 gap-6 mb-6">
                <div>
                  <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
                    Full Name
                  </label>
                  {isEditing ? (
                    <input
                      type="text"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      required
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:border-brand transition"
                    />
                  ) : (
                    <p className="font-medium text-gray-800 bg-gray-50 px-4 py-3 rounded-xl border border-gray-100">
                      {profileData.fullName}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
                    Email Address
                  </label>
                  <div className="bg-gray-50 px-4 py-3 rounded-xl border border-gray-100 cursor-not-allowed flex justify-between items-center gap-3">
                    <span
                      className="font-medium text-gray-500 truncate"
                      title={profileData.email}
                    >
                      {profileData.email}
                    </span>
                    <span className="shrink-0 text-[10px] font-bold uppercase tracking-wider bg-gray-200/80 text-gray-500 px-3 py-1 rounded-full">
                      Read Only
                    </span>
                  </div>
                </div>
                
                {/* --- PHONE NUMBER INPUT BLOCK --- */}
                <div>
                  <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2 flex items-center gap-1">
                    <FiPhone /> Phone Number
                  </label>
                  {isEditing ? (
                    <input
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="Enter contact number..."
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:border-brand transition"
                    />
                  ) : (
                    <div className="bg-gray-50 px-4 py-3 rounded-xl border border-gray-100">
                      {profileData.phone ? (
                        <p className="font-medium text-gray-800">
                          {profileData.phone}
                        </p>
                      ) : (
                        <p className="italic text-gray-400">Not added</p>
                      )}
                    </div>
                  )}
                </div>
              </div>

              <div className="mb-6">
                <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2 flex items-center gap-1">
                  <FiMapPin /> Shipping Address
                </label>
                {isEditing ? (
                  <textarea
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    rows="4"
                    placeholder="Enter your detailed shipping address..."
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:border-brand transition resize-none"
                  />
                ) : (
                  <div className="bg-gray-50 px-4 py-3 rounded-xl border border-gray-100 min-h-[100px] flex items-center">
                    {profileData.address ? (
                      <p className="text-gray-800 leading-relaxed">
                        {typeof profileData.address === "string"
                          ? profileData.address
                          : `${
                              profileData.address.street ||
                              profileData.address.address
                            }, ${profileData.address.city}, ${
                              profileData.address.postalCode
                            }`}
                      </p>
                    ) : (
                      <p className="italic text-gray-400">
                        No address added yet. Click edit to add one.
                      </p>
                    )}
                  </div>
                )}
              </div>

              {isEditing && (
                <div className="pt-4 border-t border-gray-100 flex justify-end">
                  <button
                    type="submit"
                    disabled={isUpdating}
                    className="px-8 py-3 bg-brand text-white font-semibold rounded-xl hover:bg-brand/90 transition shadow-md shadow-brand/20 disabled:opacity-50 flex items-center gap-2 cursor-pointer"
                  >
                    <FiSave /> {isUpdating ? "Saving..." : "Save Changes"}
                  </button>
                </div>
              )}
            </form>
          </div>

          {/* --- RECENT ORDERS LIST (Right Column) --- */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 flex flex-col h-full">
            <h2 className="text-lg font-bold text-gray-900 mb-6 pb-4 border-b border-gray-100 flex items-center gap-2">
              <FiPackage className="text-brand" /> Recent Orders
            </h2>

            {isOrdersLoading ? (
              <p className="text-sm text-gray-500 animate-pulse text-center py-8">
                Loading orders...
              </p>
            ) : recentOrders.length === 0 ? (
              <div className="flex-grow flex flex-col items-center justify-center text-center py-8">
                <div className="w-16 h-16 bg-gray-50 text-gray-300 rounded-full flex items-center justify-center mx-auto mb-3 text-2xl">
                  <FiPackage />
                </div>
                <p className="text-sm text-gray-500 font-medium">
                  No orders placed yet.
                </p>
                <Link
                  to="/shop"
                  className="text-brand text-sm font-semibold hover:underline mt-2 inline-block"
                >
                  Explore Shop
                </Link>
              </div>
            ) : (
              <div className="flex-grow flex flex-col justify-between">
                <div className="space-y-4">
                  {recentOrders.map((order) => (
                    <div
                      key={order._id}
                      className="p-4 rounded-xl border border-gray-100 hover:border-brand/30 hover:bg-brand/5 transition"
                    >
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <p className="text-xs text-gray-500 font-medium">
                            Order #{order.orderNumber?.slice(-6) || "N/A"}
                          </p>
                          <p className="text-xs text-gray-400 mt-0.5">
                            {new Date(order.createdAt).toLocaleDateString()}
                          </p>
                        </div>
                        <span
                          className={`text-[10px] font-bold px-2 py-2 rounded-full uppercase tracking-wider ${getStatusColor(
                            order.status
                          )}`}
                        >
                          {order.status}
                        </span>
                      </div>

                      <div className="flex justify-between items-end mt-3 pt-3 border-t border-gray-50">
                        <div>
                          <p className="text-xs text-gray-500 capitalize">
                            {order.items?.length || 0} items •{" "}
                            {order.payment?.method || "N/A"}
                          </p>
                        </div>
                        <p className="text-sm font-bold text-gray-900">
                          ৳ {order.totalPrice?.toFixed(2)}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="pt-6 mt-4 border-t border-gray-100">
                  <Link
                    to="/orders"
                    className="block text-center text-sm font-semibold text-brand hover:text-brand/80 transition bg-brand/5 py-3 rounded-xl w-full"
                  >
                    View All Orders ({orders.length})
                  </Link>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;