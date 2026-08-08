import React, { useState } from "react";
import { Link, useNavigate } from "react-router";
import Input from "../components/ui/Input";
import { IoMdEye, IoMdEyeOff } from "react-icons/io";
import { useLoginMutation } from "../service/api";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const LogIn = () => {
  const [login, { isLoading }] = useLoginMutation();
  const [passToggle, setPassToggle] = useState(false);
  
  // Express backend expects `email`, not `username`
  const [loginData, setLoginData] = useState({
    email: "",
    password: "",
  });

  const navigate = useNavigate();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setLoginData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await login(loginData).unwrap();

      // Show success toast message returned by controller ("Login Successfully")
      toast.success(res.message || "Logged in successfully!");

      // Navigate to profile page after login
      setTimeout(() => {
        navigate("/profile");
      }, 1000);

    } catch (err) {
      // Catch controller errors (e.g. "Invalid crediential" or "Email is not verified")
      toast.error(err?.data?.message || "Login failed. Please try again.");
    }
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen dark">
      <ToastContainer position="top-right" autoClose={3000} />
      
      <div className="w-full max-w-md bg-theme rounded-xl shadow-xl p-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">Log In</h2>
        
        <form className="flex flex-col" onSubmit={handleSubmit}>
          {/* Email Input */}
          <Input
            name="email"
            value={loginData.email}
            onChange={handleInputChange}
            label="Email Address"
            placeholder="Enter your email"
            type="email"
            required
          />

          {/* Password Input */}
          <div className="relative">
            <Input
              name="password"
              value={loginData.password}
              onChange={handleInputChange}
              label="Password"
              placeholder="Enter your password"
              type={passToggle ? "text" : "password"}
              required
            />
            {passToggle ? (
              <IoMdEye
                onClick={() => setPassToggle(!passToggle)}
                className="absolute right-2 top-10 cursor-pointer text-gray-500"
              />
            ) : (
              <IoMdEyeOff
                onClick={() => setPassToggle(!passToggle)}
                className="absolute right-2 top-10 cursor-pointer text-gray-500"
              />
            )}
          </div>

          <div className="flex items-center justify-between flex-wrap">
            <p className="text-primary mt-4">
              Don't have an account?{" "}
              <Link
                className="text-sm text-blue-500 hover:underline mt-4"
                to="/registration"
              >
                Sign up
              </Link>
            </p>
          </div>

          {/* Submit Button */}
          <button
            className="bg-gradient-to-r from-indigo-500 to-blue-500 text-white font-bold py-2 px-4 rounded-md mt-4 hover:bg-indigo-600 hover:to-blue-600 transition ease-in-out duration-150 disabled:opacity-50"
            type="submit"
            disabled={isLoading}
          >
            {isLoading ? "Logging in..." : "Log in"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default LogIn;