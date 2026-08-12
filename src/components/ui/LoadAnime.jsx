import React from 'react';

const Loader = ({ message = "Loading your profile..." }) => {
  return (
    <div className="min-h-[60vh] w-full flex flex-col items-center justify-center p-4">
      {/* Spinner Container */}
      <div className="relative flex items-center justify-center">
        {/* Soft background glow effect */}
        <div className="w-16 h-16 rounded-full absolute bg-blue-500/20 animate-ping" />

        {/* Outer subtle track ring */}
        <div className="w-16 h-16 rounded-full border-4 border-indigo-100 dark:border-gray-700" />

        {/* Active spinning ring */}
        <div className="w-16 h-16 rounded-full border-4 border-transparent border-t-indigo-600 border-r-blue-500 animate-spin absolute top-0 left-0" />

        {/* Center glowing core dot */}
        <div className="w-3 h-3 bg-indigo-600 rounded-full animate-pulse shadow-md shadow-indigo-500/50" />
      </div>

      {/* Dynamic Status Message */}
      {message && (
        <p className="mt-4 text-sm font-medium text-gray-500 dark:text-gray-400 tracking-wide animate-pulse">
          {message}
        </p>
      )}
    </div>
  );
};

export default Loader;