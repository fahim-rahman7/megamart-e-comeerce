import React from "react";
import { Link } from "react-router";
import ProductCard from "../ui/ProductCard";
import { useGetProductsQuery } from "../../service/api";
import Loading from "../ui/Loading";
import { FiArrowRight } from "react-icons/fi";

const BestDeal = () => {
  // Fetch 5 products that specifically have a discount > 0
  const { data, isLoading } = useGetProductsQuery({
    limit: 5,
    page: 1,
    hasDiscount: true, // Trigger the discount filter
  });

  return (
    <section className="py-6 sm:py-10 lg:py-14">
      <div className="container mx-auto px-3 sm:px-4">
        {/* Section Header */}
        <div className="flex items-center justify-between gap-2 pb-3 sm:pb-4 border-b border-gray-100 relative after:absolute after:w-20 sm:after:w-28 after:rounded-full after:bottom-0 after:left-0 after:h-1 after:bg-brand">
          <h2 className="text-base sm:text-2xl lg:text-3xl font-bold text-gray-900 leading-tight">
            Grab the best deals <span className="text-brand">Today</span>
          </h2>

          {/* Redesigned View All Link */}
          <Link
            to="/shop?hasDiscount=true"
            className="group flex items-center gap-1 sm:gap-1.5 text-xs sm:text-sm font-semibold text-brand bg-brand/10 hover:bg-brand hover:text-white px-3 py-1.5 sm:px-4 sm:py-2 rounded-full transition-all duration-200 shrink-0 shadow-xs"
          >
            <span>View All</span>
            <FiArrowRight className="text-xs sm:text-sm transition-transform duration-200 group-hover:translate-x-1" />
          </Link>
        </div>

        {/* Products Grid */}
        <div className="mt-5 sm:mt-8">
          {isLoading ? (
            <Loading count={5} />
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-2.5 sm:gap-4 lg:gap-5">
              {data?.products?.length > 0 ? (
                data.products.map((item) => (
                  <ProductCard key={item._id || item.id} data={item} />
                ))
              ) : (
                <p className="col-span-full text-center text-xs sm:text-sm text-gray-500 py-8 sm:py-12">
                  No deals available at the moment.
                </p>
              )}
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default BestDeal;