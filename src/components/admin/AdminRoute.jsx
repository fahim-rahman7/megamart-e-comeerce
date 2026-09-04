import React from "react";
import { Navigate, Outlet } from "react-router";
import { useGetProfileQuery } from "../../service/api";
import Loading from "../ui/Loading";

const AdminRoute = () => {
  const { data, isLoading, isError, error } = useGetProfileQuery();

  // 🔍 Debug log: Check your DevTools Console (F12)
  console.log("AdminRoute Check:", { data, isError, error });

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center bg-gray-50">
        <Loading />
      </div>
    );
  }

  // Safely extract user object across common response shapes
  const user = data?.user || data?.data || data;

  // Case-insensitive role check
  const isAdmin = user?.role?.toLowerCase() === "admin";

  if (isError || !user || !isAdmin) {
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
};

export default AdminRoute;