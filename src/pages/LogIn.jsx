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

  // Express backend expects `email` and `password`
  const [loginData, setLoginData] = useState({
    email: "",
    password: "",
  });

  // State for inline field errors
  const [fieldErrors, setFieldErrors] = useState({});

  const navigate = useNavigate();

  // Clear specific field errors when typing
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setLoginData((prev) => ({
      ...prev,
      [name]: value,
    }));
    setFieldErrors((prev) => ({ ...prev, [name]: "" }));
  };

  // Maps backend error messages to UI inputs
  const parseBackendError = (message) => {
    const lowerMsg = message.toLowerCase();
    const errors = {};

    if (lowerMsg.includes("email")) {
      errors.email = message;
    }
    if (lowerMsg.includes("password")) {
      errors.password = message;
    }
    if (lowerMsg.includes("crediential") || lowerMsg.includes("credential")) {
      errors.email = message;
      errors.password = message;
    }

    setFieldErrors(errors);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFieldErrors({});

    try {
      const res = await login(loginData).unwrap();

      toast.success(res.message || "Logged in successfully!");

      setTimeout(() => {
        navigate("/profile");
      }, 1000);
    } catch (err) {
      const errorMsg = err?.data?.message || "Login failed. Please try again.";

      // Show toast notification
      toast.error(errorMsg);

      // Parse error message for inline field display
      parseBackendError(errorMsg);

      // Auto-redirect to OTP verification if the email isn't verified yet
      if (errorMsg.toLowerCase().includes("not verified")) {
        setTimeout(() => {
          navigate("/verify-email", { state: { email: loginData.email } });
        }, 1500);
      }
    }
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen dark">
      <ToastContainer position="top-right" autoClose={3000} />

      <div className="w-full max-w-md bg-theme rounded-xl shadow-xl p-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">Log In</h2>

        <form className="flex flex-col" onSubmit={handleSubmit}>
          {/* Email Input */}
          <div className="mb-3">
            <Input
              name="email"
              value={loginData.email}
              onChange={handleInputChange}
              label="Email Address"
              placeholder="Enter your email"
              type="email"
            />
            {fieldErrors.email && (
              <p className="text-xs text-red-500 mt-1">{fieldErrors.email}</p>
            )}
          </div>

          {/* Password Input */}
          <div className="relative mb-3">
            <Input
              name="password"
              value={loginData.password}
              onChange={handleInputChange}
              label="Password"
              placeholder="Enter your password"
              type={passToggle ? "text" : "password"}
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
            {fieldErrors.password && (
              <p className="text-xs text-red-500 mt-1">{fieldErrors.password}</p>
            )}
          </div>

          <div className="flex items-center justify-between flex-wrap">
            <p className="text-primary mt-2">
              Don't have an account?{" "}
              <Link
                className="text-sm text-blue-500 hover:underline"
                to="/registration"
              >
                Sign up
              </Link>
            </p>
            <Link
              className="text-sm text-blue-500 hover:underline mt-2"
              to="/forget-password"
            >
              Forgot password?
            </Link>
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