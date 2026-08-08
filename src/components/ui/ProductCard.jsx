import React from "react";
import { Link } from "react-router";

const ProductCard = ({ data }) => {
  // 1. Use slug for routing based on your backend api.js setup, fallback to _id
  const productUrl = `/shop/${data?.slug || data?._id}`;
  
  // 2. Safe image fallback 
  const imageUrl = data?.thumbnail || data?.images?.[0] || "https://via.placeholder.com/300";

  // 3. Dynamic Price Handling
  const currentPrice = data?.price || 0;
  // If backend sends a regular/old price, use it. Otherwise, default to currentPrice.
  const regularPrice = data?.regularPrice || data?.comparePrice || currentPrice;
  
  const savings = regularPrice - currentPrice;
  
  // Calculate discount percentage if backend doesn't provide it directly
  const discountPercent = data?.discountPercentage || 
    (regularPrice > currentPrice 
      ? Math.round(((regularPrice - currentPrice) / regularPrice) * 100) 
      : 0);

  return (
    <div className="relative rounded-2xl overflow-hidden border border-primary/20 w-full bg-white hover:shadow-lg transition-shadow duration-300">
      
      {/* Image Section */}
      <Link
        to={productUrl}
        className="flex justify-center items-center bg-primary/5 py-4 px-4 sm:px-8 md:px-16"
      >
        <img
          className="w-auto max-w-full h-40 sm:h-48 md:h-56 object-contain mix-blend-multiply"
          src={imageUrl}
          alt={data?.title || "Product"}
        />
      </Link>

      {/* Info Section */}
      <div className="p-4">
        <Link to={productUrl}>
          <h3 className="text-sm sm:text-base md:text-lg font-medium truncate text-gray-800 hover:text-blue-600 transition-colors">
            {data?.title}
          </h3>
        </Link>

        <div className="flex items-center gap-2 pb-3 border-b border-primary/20 mt-2">
          <p className="font-bold text-sm sm:text-base md:text-lg text-gray-900">
            ₹{currentPrice}
          </p>
          
          {/* Only show old price if it's strictly greater than the current price */}
          {regularPrice > currentPrice && (
            <p className="line-through text-xs sm:text-sm md:text-base text-gray-400">
              ₹{regularPrice}
            </p>
          )}
        </div>

        {/* Display Savings OR keep layout spacing consistent */}
        {savings > 0 ? (
          <p className="text-green-600 text-xs sm:text-sm md:text-base mt-2 font-medium">
            Save ₹{savings}
          </p>
        ) : (
          <p className="text-transparent text-xs sm:text-sm md:text-base mt-2 select-none">
            No savings
          </p>
        )}
      </div>

      {/* Discount Badge - Only render if there is an actual discount */}
      {discountPercent > 0 && (
        <div className="bg-brand w-12 h-12 sm:w-14 sm:h-14 absolute right-0 top-0 p-1.5 sm:p-2 rounded-bl-2xl flex items-center justify-center shadow-sm">
          <p className="text-theme text-xs sm:text-sm font-semibold text-center leading-tight">
            {discountPercent}% <br className="hidden sm:block" /> OFF
          </p>
        </div>
      )}
    </div>
  );
};

export default ProductCard;