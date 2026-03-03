import React from "react";
import { Link } from "react-router";

const ProductCard = ({data}) => {
  return (
    <div className="relative rounded-2xl overflow-hidden border border-primary/20">
      <Link to={`/shop/${data?.id}`} className="flex justify-center bg-primary/10 py-4 px-16">
        <img className="w-auto max-w-full" src={data?.thumbnail} alt="product" />
      </Link>
      <div className="p-3">
        <h3>{data?.title}</h3>
        <div className="flex gap-2 pb-2.5 border-b border-primary/20">
          <p className="font-bold">{data?.price}</p>
          <p className="line-through">₹{data?.price + 50}</p>
        </div>
        <p className="text-green-600 mt-2.5">Save - ₹32999</p>
      </div>
      <div className="bg-brand w-10 md:w-14 absolute right-0 top-0 p-2.5 rounded-bl-2xl">
        <p className="text-theme text-xs font-semibold">{data?.discountPercentage}% OFF</p>
      </div>
    </div>
  );
};

export default ProductCard;
