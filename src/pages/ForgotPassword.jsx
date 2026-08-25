import React, { useState } from "react";
import { Link } from "react-router";
import Input from "../components/ui/Input";
import { useForgetPasswordMutation } from "../service/api";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const ForgotPassword = () => {
  const [forgetPassword, { isLoading }] = useForgetPasswordMutation();
  const [email, setEmail] = useState("");
  const [fieldError, setFieldError] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFieldError("");

    if (!email.trim()) {
      return setFieldError("Email is required.");
    }

    try {
      const res = await forgetPassword({ email }).unwrap();
      toast.success(res.message || "Reset link sent!");
      setIsSubmitted(true);
    } catch (err) {
      const errorMsg = err?.data?.message || "Something went wrong.";
      if (errorMsg.toLowerCase().includes("email")) {
        setFieldError(errorMsg);
      } else {
        toast.error(errorMsg);
      }
    }
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen dark">
      <ToastContainer position="top-right" autoClose={3000} />

      <div className="w-full max-w-md bg-theme rounded-xl shadow-xl p-6">
        <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-2">
          Forgot Password
        </h2>
        <p className="text-sm text-gray-500 mb-6">
          Enter your registered email address and we'll send you a password reset link.
        </p>

        {isSubmitted ? (
          <div className="text-center py-4">
            <p className="text-indigo-600 font-medium mb-4">
              A password reset link has been sent to <strong>{email}</strong>.
            </p>
            <p className="text-xs text-gray-400 mb-6">
              The link will expire in 2 minutes. Please check your inbox or spam folder.
            </p>
            <Link
              to="/login"
              className="inline-block bg-indigo-600 text-white font-semibold py-2 px-6 rounded-md hover:bg-indigo-700 transition duration-150"
            >
              Back to Login
            </Link>
          </div>
        ) : (
          <form className="flex flex-col" onSubmit={handleSubmit}>
            <div className="mb-4">
              <Input
                name="email"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  setFieldError("");
                }}
                label="Email Address"
                placeholder="Enter your email"
                type="text"
              />
              {fieldError && (
                <p className="text-xs text-red-500 mt-1">{fieldError}</p>
              )}
            </div>

            <button
              className="bg-gradient-to-r from-indigo-500 to-blue-500 text-white font-bold py-2 px-4 rounded-md mt-2 hover:from-indigo-600 hover:to-blue-600 transition ease-in-out duration-150 disabled:opacity-50"
              type="submit"
              disabled={isLoading}
            >
              {isLoading ? "Sending Link..." : "Send Reset Link"}
            </button>

            <div className="text-center mt-4">
              <Link
                to="/login"
                className="text-sm text-blue-500 hover:underline"
              >
                Remembered your password? Log in
              </Link>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default ForgotPassword;