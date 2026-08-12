import React, { useState } from "react";
import { Link, useNavigate } from "react-router";
import Input from "../components/ui/Input";
import { IoMdEye, IoMdEyeOff } from "react-icons/io";
import { useSignUpMutation } from "../service/api";

const Registration = () => {
  const navigate = useNavigate();
  const [passToggle, setPassToggle] = useState(false);

  // Form State
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
  });

  // Global & Field-Specific Error States
  const [errorMessage, setErrorMessage] = useState("");
  const [fieldErrors, setFieldErrors] = useState({});
  const [successMessage, setSuccessMessage] = useState("");

  const [signUp, { isLoading }] = useSignUpMutation();

  // Clear specific field errors when user types
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setErrorMessage("");
    setFieldErrors((prev) => ({ ...prev, [name]: "" }));
  };

  // Maps backend validation messages to specific inputs
  const parseBackendError = (message) => {
    const lowerMsg = message.toLowerCase();
    const errors = {};

    if (lowerMsg.includes("fullname")) {
      errors.fullName = message;
    } else if (lowerMsg.includes("email")) {
      errors.email = message;
    } else if (lowerMsg.includes("password")) {
      errors.password = message;
    }

    setFieldErrors(errors);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage("");
    setFieldErrors({});
    setSuccessMessage("");

    try {
      const response = await signUp(formData).unwrap();
      setSuccessMessage(response.message || "Registration successful! Please verify your email.");

      setTimeout(() => {
        navigate("/verify-email", { state: { email: formData.email } });
      }, 2000);
    } catch (err) {
      const msg = err?.data?.message || "Something went wrong. Please try again.";
      setErrorMessage(msg);
      parseBackendError(msg);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen dark">
      <div className="w-full max-w-md bg-theme rounded-xl shadow-xl p-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">Registration</h2>

        {/* Top Error Alert */}
        {errorMessage && (
          <div className="mb-4 p-2 text-sm text-red-700 bg-red-100 rounded-md">
            {errorMessage}
          </div>
        )}

        {/* Top Success Alert */}
        {successMessage && (
          <div className="mb-4 p-2 text-sm text-green-700 bg-green-100 rounded-md">
            {successMessage}
          </div>
        )}

        <form className="flex flex-col" onSubmit={handleSubmit}>
          {/* Full Name */}
          <div className="mb-3">
            <Input
              label="Full Name"
              placeholder="Enter your full name"
              type="text"
              name="fullName"
              value={formData.fullName}
              onChange={handleChange}
            />
            {fieldErrors.fullName && (
              <p className="text-xs text-red-500 mt-1">{fieldErrors.fullName}</p>
            )}
          </div>

          {/* Email */}
          <div className="mb-3">
            <Input
              label="Email"
              placeholder="Enter your email"
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
            />
            {fieldErrors.email && (
              <p className="text-xs text-red-500 mt-1">{fieldErrors.email}</p>
            )}
          </div>

          {/* Password */}
          <div className="relative mb-3">
            <Input
              label="Password"
              placeholder="Enter your password"
              type={passToggle ? "text" : "password"}
              name="password"
              value={formData.password}
              onChange={handleChange}
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
              Already have an account?{" "}
              <Link className="text-sm text-blue-500 hover:underline" to="/login">
                Login
              </Link>
            </p>
          </div>

          {/* Submit Button */}
          <button
            className="bg-gradient-to-r from-indigo-500 to-blue-500 text-white font-bold py-2 px-4 rounded-md mt-4 hover:bg-indigo-600 hover:to-blue-600 transition ease-in-out duration-150 disabled:opacity-50"
            type="submit"
            disabled={isLoading}
          >
            {isLoading ? "Signing Up..." : "Sign Up"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Registration;