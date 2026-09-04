import React, { useState } from "react";
import { Link, useNavigate } from "react-router";
import { useDispatch } from "react-redux";
import Input from "../../components/ui/Input";
import { IoMdEye, IoMdEyeOff } from "react-icons/io";
import { useLoginMutation, API } from "../../service/api";
import { toast } from "react-toastify";

const LogIn = () => {
  const [login, { isLoading }] = useLoginMutation();
  const [passToggle, setPassToggle] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [loginData, setLoginData] = useState({
    email: "",
    password: "",
  });

  const [fieldErrors, setFieldErrors] = useState({});

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setLoginData((prev) => ({
      ...prev,
      [name]: value,
    }));
    setFieldErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFieldErrors({});
  
    try {
      const res = await login(loginData).unwrap();
      
      // 1. Extract token safely
      const token = res?.accToken || res?.token;
  
      if (token) {
        localStorage.setItem("acc_tkn", token);
      } else {
        console.error("No token received from backend:", res);
        return;
      }
  
      // 2. Refresh RTK Query profile state with the new token
      dispatch(API.util.invalidateTags(["Profile", "Cart"]));
  
      toast.success(res.message || "Logged in successfully!");
  
      // 3. Route check using backend response role
      const userRole = (res?.user?.role || "").toLowerCase();
      if (userRole === "admin" || userRole === "moderator") {
        navigate("/admin/dashboard");
      } else {
        navigate("/profile");
      }
    } catch (err) {
      toast.error(err?.data?.message || "Login failed");
    }
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen dark">
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
              type="text"
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
              <p className="text-xs text-red-500 mt-1">
                {fieldErrors.password}
              </p>
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