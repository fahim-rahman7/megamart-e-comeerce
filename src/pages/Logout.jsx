import React from "react";
import { useNavigate } from "react-router";
import { useDispatch } from "react-redux";
import { API } from "../service/api";
import { toast } from "react-toastify";

const Logout = ({ className }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleLogout = async () => {
    try {
      const backendUrl = import.meta.env.VITE_API_BASE_URL || "http://localhost:3001";
      const token = localStorage.getItem("acc_tkn");

      // 1. Send request with both cookies and Bearer header
      const response = await fetch(`${backendUrl}/auth/logout`, {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
          ...(token && { Authorization: `Bearer ${token}` }),
        },
      });

      // 2. Remove token from localStorage for mobile / iOS Safari
      localStorage.removeItem("acc_tkn");

      // 3. Reset RTK Query cache
      dispatch(API.util.resetApiState());

      if (response.ok) {
        toast.success("Logged out successfully");
      } else {
        toast.info("Logged out locally");
      }

      navigate("/login");
    } catch (error) {
      console.error("Logout error:", error);

      // Ensure local cleanup even if the backend request encounters a network error
      localStorage.removeItem("acc_tkn");
      dispatch(API.util.resetApiState());
      
      toast.error("An error occurred during logout");
      navigate("/login");
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