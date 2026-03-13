import React from "react";
import { Link } from "react-router";

const ProductCard = ({ data }) => {
  return (
    <div className="relative rounded-2xl overflow-hidden border border-primary/20 w-full">
      
      {/* Image Section */}
      <Link
        to={`/shop/${data?.id}`}
        className="flex justify-center items-center bg-primary/10 py-4 px-4 sm:px-8 md:px-16"
      >
        <img
          className="w-auto max-w-full h-40 sm:h-48 md:h-56 object-contain"
          src={data?.thumbnail}
          alt="product"
        />
      </Link>

      {/* Info Section */}
      <div className="p-3 sm:p-4">
        <h3 className="text-sm sm:text-base md:text-lg font-medium truncate">
          {data?.title}
        </h3>

        <div className="flex gap-2 pb-2 border-b border-primary/20 mt-1">
          <p className="font-bold text-sm sm:text-base md:text-lg">
            ₹{data?.price}
          </p>
          <p className="line-through text-xs sm:text-sm md:text-base text-gray-400">
            ₹{data?.price + 50}
          </p>
        </div>

        <p className="text-green-600 text-xs sm:text-sm md:text-base mt-2">
          Save - ₹{data?.price * 0.1} {/* You can adjust the calculation */}
        </p>
      </div>

      {/* Discount Badge */}
      <div className="bg-brand w-10 h-10 sm:w-12 sm:h-12 md:w-14 md:h-14 absolute right-0 top-0 p-1.5 sm:p-2 rounded-bl-2xl flex items-center justify-center">
        <p className="text-theme text-xs sm:text-sm md:text-base font-semibold text-center">
          {data?.discountPercentage}% OFF
        </p>
      </div>
    </div>
  );
};

export default ProductCard;