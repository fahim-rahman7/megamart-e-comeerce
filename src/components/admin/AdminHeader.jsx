import React from "react";
import { useGetProfileQuery } from "../../service/api";
import { FiBell, FiSearch, FiExternalLink, FiShield } from "react-icons/fi";
import { Link } from "react-router";

const AdminHeader = () => {
  const { data } = useGetProfileQuery();
  const user = data?.user || data?.data;

  return (
    <header className="h-16 bg-white border-b border-gray-200/80 px-6 flex items-center justify-between shrink-0 sticky top-0 z-10 shadow-xs">
      {/* Left Search Bar */}
      <div className="flex items-center gap-4 flex-1 max-w-md">
        <div className="relative w-full">
          <FiSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 text-base" />
          <input
            type="text"
            placeholder="Search products, orders, customers..."
            className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs font-medium text-gray-800 placeholder-gray-400 focus:outline-none focus:border-brand focus:bg-white transition-all"
          />
        </div>
      </div>

      {/* Right User & Actions */}
      <div className="flex items-center gap-4">
        {/* Quick Link to Store */}
        <Link
          to="/"
          target="_blank"
          className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-gray-600 hover:text-brand bg-gray-50 hover:bg-brand/10 border border-gray-200 hover:border-brand/30 transition-all"
        >
          <span>Live Store</span>
          <FiExternalLink className="text-xs" />
        </Link>

        {/* Notifications Icon */}
        <button className="relative p-2 text-gray-500 hover:text-brand hover:bg-gray-100 rounded-xl transition-all cursor-pointer">
          <FiBell className="text-lg" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-brand rounded-full ring-2 ring-white"></span>
        </button>

        <div className="h-8 w-[1px] bg-gray-200 mx-1"></div>

        {/* User Info */}
        <div className="flex items-center gap-3 pl-1">
          <div className="text-right hidden sm:block">
            <p className="text-xs font-bold text-gray-900 leading-tight">
              {user?.fullName || user?.name || "Admin User"}
            </p>
            <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-brand bg-brand/10 px-2 py-0.5 rounded-full capitalize mt-0.5">
              <FiShield className="text-[9px]" /> {user?.role || "Administrator"}
            </span>
          </div>

          {user?.avatar ? (
            <img
              src={user.avatar}
              alt="Avatar"
              className="w-9 h-9 rounded-xl object-cover border-2 border-brand/20 shadow-xs"
            />
          ) : (
            <div className="w-9 h-9 rounded-xl bg-brand/10 text-brand border border-brand/20 flex items-center justify-center font-bold text-sm shadow-xs">
              {(user?.fullName || user?.name || "A").charAt(0).toUpperCase()}
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default AdminHeader;