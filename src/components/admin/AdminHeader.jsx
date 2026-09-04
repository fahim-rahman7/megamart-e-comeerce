import React from "react";
import { useGetProfileQuery } from "../../service/api";

const AdminHeader = () => {
  const { data } = useGetProfileQuery();
  const user = data?.user || data?.data;

  return (
    <header className="h-16 bg-white border-b border-gray-200 px-6 flex items-center justify-between shrink-0">
      <span className="text-sm font-semibold text-gray-500 uppercase tracking-wider">
        Control Center
      </span>
      <div className="flex items-center gap-3">
        <div className="text-right">
          <p className="text-sm font-medium text-gray-900">{user?.name || "Admin"}</p>
          <p className="text-xs text-gray-500 capitalize">{user?.role || "Administrator"}</p>
        </div>
        {user?.avatar ? (
          <img
            src={user.avatar}
            alt="Avatar"
            className="w-9 h-9 rounded-full object-cover border border-gray-200"
          />
        ) : (
          <div className="w-9 h-9 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold text-sm">
            {user?.name?.charAt(0).toUpperCase() || "A"}
          </div>
        )}
      </div>
    </header>
  );
};

export default AdminHeader;