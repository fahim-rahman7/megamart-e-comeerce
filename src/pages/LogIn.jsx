import React, { useState } from "react";
import { Link, Navigate, useNavigate } from "react-router";
import Input from "../components/ui/Input";
import { IoMdEye, IoMdEyeOff } from "react-icons/io";
import { useLoginMutation } from "../service/api";
import { ToastContainer, toast } from "react-toastify";

const LogIn = () => {
  const [login] = useLoginMutation();
  const [passToggle, setPassToggle] = useState(false);
  const [loginData,setLoginData] = useState({
    username: "",
    password: ""
  })
  const navigate = useNavigate();
  const HandleSubmit = async(e) => {
    e.preventDefault();
    try {
    const  res = await login(loginData)
      if(res.error){
        return toast.error(res.error.data.message)
      }
       document.cookie = `accessToken=${res.data.accessToken}`
       navigate("/profile")
      console.log(res);
    } catch (error) {
      
    }
    console.log(loginData);
  };
  return (
    <div className="flex flex-col items-center justify-center h-screen dark">
      <ToastContainer/>
      <div className="w-full max-w-md bg-theme rounded-xl shadow-xl p-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">Log In</h2>
        <form className="flex flex-col" onSubmit={HandleSubmit}>
          <Input
          onChange={(e)=>setLoginData((prev)=>({...prev, username: e.target.value}))}
            label="User Name"
            placeholder="Enter your user name"
            type="text"
          />
          <div className="relative">
            <Input
             onChange={(e)=>setLoginData((prev)=>({...prev, password: e.target.value}))}
              label="Password"
              placeholder="Enter your  password"
              type={passToggle ? "text" : "password"}
            />
            {passToggle ? (
              <IoMdEye
                onClick={() => setPassToggle(!passToggle)}
                className="absolute right-2 top-10"
              />
            ) : (
              <IoMdEyeOff
                onClick={() => setPassToggle(!passToggle)}
                className="absolute right-2 top-10"
              />
            )}
          </div>

          <div className="flex items-center justify-between flex-wrap">
            <p className="text-primary mt-4">
              {" "}
              Don't have an account?{" "}
              <Link
                className="text-sm text-blue-500 -200 hover:underline mt-4"
                to="/registration"
              >
                Sign up
              </Link>
            </p>
          </div>
          <button
            className="bg-gradient-to-r from-indigo-500 to-blue-500 text-white font-bold py-2 px-4 rounded-md mt-4 hover:bg-indigo-600 hover:to-blue-600 transition ease-in-out duration-150"
            type="submit"
          >
            Log in
          </button>
        </form>
      </div>
    </div>
  );
};

export default LogIn;
