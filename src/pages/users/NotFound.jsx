import React from "react";
import { Link, useNavigate } from "react-router"; // Use "react-router-dom" if that's what your app uses
import { HiOutlineArrowLeft } from "react-icons/hi2";

const NotFound = () => {
  const navigate = useNavigate();

  return (
    <section className="min-h-[85vh] flex items-center justify-center bg-gray-50 px-4 py-16">
      <div className="max-w-md w-full text-center">
        {/* Decorative 404 Header */}
        <div className="relative mb-6">
          <h1 className="text-9xl font-black text-brand/10 tracking-widest select-none">
            404
          </h1>
          <p className="absolute inset-0 flex items-center justify-center text-2xl font-bold text-gray-800">
            Page Not Found
          </p>
        </div>

        <p className="text-gray-600 mb-8 leading-relaxed">
          Oops! The page you are looking for doesn't exist, has been removed, or is temporarily unavailable.
        </p>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <button
            onClick={() => navigate(-1)}
            className="w-full sm:w-auto px-6 py-3 border border-gray-300 rounded-xl font-medium text-gray-700 bg-white hover:bg-gray-100 transition flex items-center justify-center gap-2 cursor-pointer shadow-sm"
          >
            <HiOutlineArrowLeft className="text-lg" />
            Go Back
          </button>

          <Link
            to="/"
            className="w-full sm:w-auto px-6 py-3 bg-brand text-white rounded-xl font-medium hover:bg-brand/90 transition shadow-lg shadow-brand/20 cursor-pointer text-center"
          >
            Back to Home
          </Link>
        </div>
      </div>
    </section>
  );
};

export default NotFound;