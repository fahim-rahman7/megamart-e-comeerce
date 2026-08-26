import React from "react";
import { Link } from "react-router";

const ProductCard = ({ data }) => {
  // 1. Routing fallback
  const productUrl = `/shop/${data?.slug || data?._id}`;
  
  // 2. Safe image fallback 
  const imageUrl = data?.thumbnail || data?.images?.[0] || "https://via.placeholder.com/300";

  // 3. Dynamic Price Handling
  const currentPrice = data?.price || 0;
  const regularPrice = data?.regularPrice || data?.comparePrice || currentPrice;
  const savings = regularPrice - currentPrice;
  
  // Calculate discount percentage
  const discountPercent = data?.discountPercentage || 
    (regularPrice > currentPrice 
      ? Math.round(((regularPrice - currentPrice) / regularPrice) * 100) 
      : 0);

  return (
    <div className="group relative rounded-2xl overflow-hidden border border-gray-100 w-full bg-white hover:shadow-xl transition-all duration-300 flex flex-col justify-between h-full">
      
      {/* Image Section */}
      <Link
        to={productUrl}
        className="relative w-full aspect-square bg-primary/5 p-3 sm:p-4 flex justify-center items-center overflow-hidden shrink-0"
      >
        <img
          className="w-full h-full object-contain mix-blend-multiply group-hover:scale-105 transition-transform duration-300"
          src={imageUrl}
          alt={data?.title || "Product"}
        />

        {/* Discount Badge */}
        {discountPercent > 0 && (
          <div className="bg-brand text-white text-[10px] sm:text-xs font-bold px-2 py-1 rounded-bl-xl absolute right-0 top-0 shadow-xs leading-tight text-center min-w-[38px]">
            {discountPercent}% <br className="hidden sm:block" /> OFF
          </div>
        )}
      </Link>

      {/* Info Section */}
      <div className="p-3 sm:p-4 flex flex-col flex-grow justify-between">
        <div>
          <Link to={productUrl}>
            <h3 className="text-xs sm:text-sm font-semibold text-gray-800 group-hover:text-brand transition-colors line-clamp-2 leading-snug" title={data?.title}>
              {data?.title}
            </h3>
          </Link>
        </div>

        <div className="mt-2 pt-2 border-t border-gray-100">
          <div className="flex items-baseline gap-1.5 flex-wrap">
            <p className="font-bold text-sm sm:text-base text-gray-900">
              ₹{currentPrice}
            </p>
            
            {regularPrice > currentPrice && (
              <p className="line-through text-xs text-gray-400">
                ₹{regularPrice}
              </p>
            )}
          </div>

          {/* Savings */}
          {savings > 0 ? (
            <p className="text-emerald-600 text-[11px] sm:text-xs font-semibold mt-1">
              Save ₹{savings}
            </p>
          ) : (
            <p className="text-transparent text-[11px] sm:text-xs mt-1 select-none">
              No savings
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductCard;