import React, { useState } from "react";
import { Link, useNavigate } from "react-router";
import Input from "../components/ui/Input";
import { IoMdEye, IoMdEyeOff } from "react-icons/io";
import { useSignUpMutation } from "../service/api";

const Registration = () => {
  const navigate = useNavigate();
  const [passToggle, setPassToggle] = useState(false);

  // Form state
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
  });

  // Local UI error/success messages
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  // RTK Query Sign Up Mutation Hook
  const [signUp, { isLoading }] = useSignUpMutation();

  // Handle Input Changes
  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  // Form Submit Handler
  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage("");
    setSuccessMessage("");

    try {
      // Execute the mutation with form values
      const response = await signUp(formData).unwrap();
      
      setSuccessMessage(response.message || "Registration successful! Please verify your email.");

      // Optional: Redirect to an OTP verification page after 2 seconds
      setTimeout(() => {
        navigate("/verify-email", { state: { email: formData.email } });
      }, 2000);

    } catch (err) {
      // Capture error response from backend controller (e.g. "This email already exist.")
      setErrorMessage(err?.data?.message || "Something went wrong. Please try again.");
    }
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen dark">
      <div className="w-full max-w-md bg-theme rounded-xl shadow-xl p-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">Registration</h2>

        {/* Display Error Message */}
        {errorMessage && (
          <div className="mb-4 p-2 text-sm text-red-700 bg-red-100 rounded-md">
            {errorMessage}
          </div>
        )}

        {/* Display Success Message */}
        {successMessage && (
          <div className="mb-4 p-2 text-sm text-green-700 bg-green-100 rounded-md">
            {successMessage}
          </div>
        )}

        <form className="flex flex-col" onSubmit={handleSubmit}>
          {/* Full Name */}
          <Input
            label="Full Name"
            placeholder="Enter your full name"
            type="text"
            name="fullName"
            value={formData.fullName}
            onChange={handleChange}
            required
          />

          {/* Email */}
          <Input
            label="Email"
            placeholder="Enter your email"
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
          />

          {/* Password */}
          <div className="relative">
            <Input
              label="Password"
              placeholder="Enter your password"
              type={passToggle ? "text" : "password"}
              name="password"
              value={formData.password}
              onChange={handleChange}
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
              Already have an account?{" "}
              <Link
                className="text-sm text-blue-500 hover:underline mt-4"
                to="/login"
              >
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