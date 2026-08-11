import React from "react";
import { useNavigate } from "react-router";
import { useDispatch } from "react-redux";
// 1. Correctly import 'API' (capitalized) to match your api.js file
import { API } from "../service/api";
import { toast } from "react-toastify";

const Logout = ({ className }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleLogout = async () => {
    try {
      // Replace VITE_API_BASE_URL to match your .env variable (or default to localhost)
      const backendUrl = import.meta.env.VITE_API_BASE_URL || "http://localhost:3001";

      // 2. Call the backend to clear the HTTP-only cookies
      const response = await fetch(`${backendUrl}/auth/logout`, {
        method: "POST",
        credentials: "include", // CRITICAL: Tells the browser to send cookies to clear them
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (response.ok) {
        // 3. Clear the RTK Query cache using 'API'
        dispatch(API.util.resetApiState());

        // 4. Show success toast and redirect
        toast.success("Logged out successfully");
        navigate("/login");
      } else {
        toast.error("Logout failed. Please try again.");
      }
    } catch (error) {
      console.error("Logout error:", error);
      toast.error("An error occurred during logout.");
    }
  };

  return (
    <button 
      onClick={handleLogout} 
      className={`text-left bg-transparent border-none ${className || ""}`}
    >
      Logout
    </button>
  );
};

export default Logout;