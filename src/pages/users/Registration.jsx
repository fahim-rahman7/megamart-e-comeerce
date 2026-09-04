import React, { useState } from "react";
import { Link, useNavigate } from "react-router";
import Input from "../../components/ui/Input";
import { IoMdEye, IoMdEyeOff } from "react-icons/io";
import { useSignUpMutation } from "../../service/api";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Registration = () => {
  const navigate = useNavigate();
  const [passToggle, setPassToggle] = useState(false);

  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
  });

  const [fieldErrors, setFieldErrors] = useState({});
  const [signUp, { isLoading }] = useSignUpMutation();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setFieldErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFieldErrors({});

    try {
      const response = await signUp(formData).unwrap();
      toast.success(response.message || "Registration successful, verify your email");

      setTimeout(() => {
        navigate("/verify-email", { state: { email: formData.email } });
      }, 2000);
    } catch (err) {
      const msg = err?.data?.message || "Something went wrong. Please try again.";
      const lowerMsg = msg.toLowerCase();

      // 1. "Email is not valid." -> Display via Toastify
      if (lowerMsg.includes("email is not valid") || lowerMsg.includes("email not valid")) {
        toast.error(msg);
      } else {
        // 2. Field errors (FullName is required, Email is required, This email already exist, Password is required) -> Inline
        const errors = {};

        if (lowerMsg.includes("fullname") || lowerMsg.includes("full name")) {
          errors.fullName = msg;
        } else if (lowerMsg.includes("email")) {
          errors.email = msg;
        } else if (lowerMsg.includes("password")) {
          errors.password = msg;
        } else {
          toast.error(msg);
        }

        setFieldErrors(errors);
      }
    }
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen dark">
      <ToastContainer position="top-right" autoClose={3000} />

      <div className="w-full max-w-md bg-theme rounded-xl shadow-xl p-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">Registration</h2>

        {/* noValidate attribute allows backend to run custom email validation */}
        <form className="flex flex-col" onSubmit={handleSubmit} noValidate>
          {/* Full Name Input */}
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

          {/* Email Input */}
          <div className="mb-3">
            <Input
              label="Email"
              placeholder="Enter your email"
              type="text"
              name="email"
              value={formData.email}
              onChange={handleChange}
            />
            {fieldErrors.email && (
              <p className="text-xs text-red-500 mt-1">{fieldErrors.email}</p>
            )}
          </div>

          {/* Password Input */}
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