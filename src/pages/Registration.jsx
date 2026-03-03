import React, { useState } from "react";
import { Link } from "react-router";
import Input from "../components/ui/Input";
import { IoMdEye, IoMdEyeOff } from "react-icons/io";

const Registration = () => {
    const [passToggle, setPassToggle] = useState(false);
  return (
    <div className="flex flex-col items-center justify-center h-screen dark">
      <div className="w-full max-w-md bg-theme rounded-xl shadow-xl p-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">Registration</h2>
        <form className="flex flex-col">
            <Input label="Full Name" placeholder="Enter your full name" type="text"/>
            <Input label="Email" placeholder="Enter your email" type="email"/>
            <div className="relative">
           <Input            
              label="Password"
              placeholder="Enter your  password"
              type={passToggle? "text" : "password"}
            />
            {
                passToggle
                ?
                <IoMdEye onClick={()=>setPassToggle(!passToggle)} className="absolute right-2 top-10"/>
                :
                <IoMdEyeOff onClick={()=>setPassToggle(!passToggle)} className="absolute right-2 top-10"/>
            }

        

          </div>
         
          <div className="flex items-center justify-between flex-wrap">
            <p className="text-primary mt-4">
              {" "}
              Already have an account?{" "}
              <Link
                className="text-sm text-blue-500 -200 hover:underline mt-4"
                to="/login"
              >
                Login
              </Link>
            </p>
          </div>
          <button
            className="bg-gradient-to-r from-indigo-500 to-blue-500 text-white font-bold py-2 px-4 rounded-md mt-4 hover:bg-indigo-600 hover:to-blue-600 transition ease-in-out duration-150"
            type="submit"
          >
            Sign Up
          </button>
        </form>
      </div>
    </div>
  );
};

export default Registration;
