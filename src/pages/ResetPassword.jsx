import React, { useState } from "react";
import { useParams, useNavigate, Link } from "react-router";
import Input from "../components/ui/Input";
import { IoMdEye, IoMdEyeOff } from "react-icons/io";
import { useResetPasswordMutation } from "../service/api";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const ResetPassword = () => {
  const { token } = useParams();
  const navigate = useNavigate();
  const [resetPassword, { isLoading }] = useResetPasswordMutation();

  const [formData, setFormData] = useState({
    newPass: "",
    confirmPass: "",
  });

  const [passToggle, setPassToggle] = useState(false);
  const [confirmToggle, setConfirmToggle] = useState(false);
  const [fieldErrors, setFieldErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setFieldErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFieldErrors({});

    const errors = {};
    if (!formData.newPass) errors.newPass = "New password is required.";
    if (!formData.confirmPass) {
      errors.confirmPass = "Please confirm your password.";
    } else if (formData.newPass !== formData.confirmPass) {
      errors.confirmPass = "Passwords do not match.";
    }

    if (Object.keys(errors).length > 0) {
      return setFieldErrors(errors);
    }

    try {
      const res = await resetPassword({
        token,
        newPass: formData.newPass,
      }).unwrap();

      toast.success(res.message || "Password changed successfully!");

      setTimeout(() => {
        navigate("/login");
      }, 2000);
    } catch (err) {
      const errorMsg = err?.data?.message || "Reset link expired or invalid.";
      toast.error(errorMsg);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen dark">
      <ToastContainer position="top-right" autoClose={3000} />

      <div className="w-full max-w-md bg-theme rounded-xl shadow-xl p-6">
        <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-2">
          Reset Password
        </h2>
        <p className="text-sm text-gray-500 mb-6">
          Enter your new password below.
        </p>

        <form className="flex flex-col" onSubmit={handleSubmit}>
          {/* New Password */}
          <div className="relative mb-3">
            <Input
              name="newPass"
              value={formData.newPass}
              onChange={handleChange}
              label="New Password"
              placeholder="Enter new password"
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
            {fieldErrors.newPass && (
              <p className="text-xs text-red-500 mt-1">{fieldErrors.newPass}</p>
            )}
          </div>

          {/* Confirm Password */}
          <div className="relative mb-3">
            <Input
              name="confirmPass"
              value={formData.confirmPass}
              onChange={handleChange}
              label="Confirm New Password"
              placeholder="Confirm new password"
              type={confirmToggle ? "text" : "password"}
            />
            {confirmToggle ? (
              <IoMdEye
                onClick={() => setConfirmToggle(!confirmToggle)}
                className="absolute right-2 top-10 cursor-pointer text-gray-500"
              />
            ) : (
              <IoMdEyeOff
                onClick={() => setConfirmToggle(!confirmToggle)}
                className="absolute right-2 top-10 cursor-pointer text-gray-500"
              />
            )}
            {fieldErrors.confirmPass && (
              <p className="text-xs text-red-500 mt-1">
                {fieldErrors.confirmPass}
              </p>
            )}
          </div>

          <button
            className="bg-gradient-to-r from-indigo-500 to-blue-500 text-white font-bold py-2 px-4 rounded-md mt-4 hover:from-indigo-600 hover:to-blue-600 transition ease-in-out duration-150 disabled:opacity-50"
            type="submit"
            disabled={isLoading}
          >
            {isLoading ? "Updating..." : "Reset Password"}
          </button>

          <div className="text-center mt-4">
            <Link to="/login" className="text-sm text-blue-500 hover:underline">
              Back to Login
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ResetPassword;