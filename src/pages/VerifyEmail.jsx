import React, { useState } from "react";
import { useLocation, useNavigate, Link } from "react-router";
import Input from "../components/ui/Input";
import { useVerifyEmailMutation, useResendOtpMutation } from "../service/api";

const VerifyEmail = () => {
  const location = useLocation();
  const navigate = useNavigate();

  // Retrieve email from state passed during navigation, or default to empty string
  const [email, setEmail] = useState(location.state?.email || "");
  const [otp, setOtp] = useState("");

  // UI state messages
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  // RTK Query hooks
  const [verifyEmail, { isLoading: isVerifying }] = useVerifyEmailMutation();
  const [resendOtp, { isLoading: isResending }] = useResendOtpMutation();

  // Handle Submit Verification Code
  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage("");
    setSuccessMessage("");

    try {
      const response = await verifyEmail({ email, otp }).unwrap();
      setSuccessMessage(response?.message || "Email verified successfully! Redirecting to login...");

      // Redirect to login page after 2 seconds
      setTimeout(() => {
        navigate("/login");
      }, 2000);
    } catch (err) {
      setErrorMessage(err?.data?.message || "Invalid or expired OTP code. Please try again.");
    }
  };

  // Handle Resend OTP Request
  const handleResendOtp = async () => {
    setErrorMessage("");
    setSuccessMessage("");

    if (!email) {
      setErrorMessage("Please enter your email address to request a new code.");
      return;
    }

    try {
      const response = await resendOtp({ email }).unwrap();
      setSuccessMessage(response?.message || "A new verification code has been sent to your email.");
    } catch (err) {
      setErrorMessage(err?.data?.message || "Failed to resend code. Please try again.");
    }
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen dark">
      <div className="w-full max-w-md bg-theme rounded-xl shadow-xl p-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-2">Verify Email</h2>
        <p className="text-sm text-gray-500 mb-4">
          Enter the verification code sent to your email.
        </p>

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
          {/* Email (Readonly if passed from state, editable if user landed directly) */}
          <Input
            label="Email"
            placeholder="Enter your email"
            type="email"
            name="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          {/* OTP Code Input */}
          <Input
            label="Verification Code (OTP)"
            placeholder="Enter 6-digit code"
            type="text"
            name="otp"
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
            required
          />

          {/* Resend OTP button */}
          <div className="flex justify-end mt-1">
            <button
              type="button"
              onClick={handleResendOtp}
              disabled={isResending}
              className="text-sm text-blue-500 hover:underline cursor-pointer disabled:opacity-50"
            >
              {isResending ? "Resending..." : "Resend Code?"}
            </button>
          </div>

          {/* Verify Button */}
          <button
            className="bg-gradient-to-r from-indigo-500 to-blue-500 text-white font-bold py-2 px-4 rounded-md mt-4 hover:bg-indigo-600 hover:to-blue-600 transition ease-in-out duration-150 disabled:opacity-50 cursor-pointer"
            type="submit"
            disabled={isVerifying}
          >
            {isVerifying ? "Verifying..." : "Verify Email"}
          </button>
        </form>

        <div className="mt-4 text-center">
          <Link to="/login" className="text-sm text-gray-500 hover:underline">
            Back to Login
          </Link>
        </div>
      </div>
    </div>
  );
};

export default VerifyEmail;