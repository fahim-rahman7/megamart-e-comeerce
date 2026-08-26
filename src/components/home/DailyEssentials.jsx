import React from "react";
import { Link } from "react-router";
import { useGetProductsQuery } from "../../service/api";
import DailyEssentialsLoading from "../ui/DailyEssentialsLoading";
import { FiArrowRight } from "react-icons/fi";

const DailyEssentials = () => {
  // Fetch 8 products for the daily-essentials category
  const { data, isLoading } = useGetProductsQuery({
    limit: 8,
    page: 1,
    category: "daily-essentials", 
  });

  // Reusable responsive grid definition
  const gridClassNames = "grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-3 sm:gap-4";

  return (
    <section className="py-6 sm:py-10 lg:py-14">
      <div className="container mx-auto px-3 sm:px-4">
        {/* Section Header */}
        <div className="flex items-center justify-between gap-2 pb-3 sm:pb-4 border-b border-gray-100 relative after:absolute after:w-20 sm:after:w-28 after:rounded-full after:bottom-0 after:left-0 after:h-1 after:bg-brand">
          <h2 className="text-base sm:text-2xl lg:text-3xl font-bold text-gray-900 leading-tight">
            Daily <span className="text-brand">Essentials</span>
          </h2>

          {/* Redesigned Interactive View All Link */}
          <Link 
            to="/shop?category=daily-essentials" 
            className="group flex items-center gap-1 sm:gap-1.5 text-xs sm:text-sm font-semibold text-brand bg-brand/10 hover:bg-brand hover:text-white px-3 py-1.5 sm:px-4 sm:py-2 rounded-full transition-all duration-200 shrink-0 shadow-xs"
          >
            <span>View All</span>
            <FiArrowRight className="text-xs sm:text-sm transition-transform duration-200 group-hover:translate-x-1" />
          </Link>
        </div>

        {/* Products Grid */}
        <div className="mt-5 sm:mt-8 lg:mt-10">
          {isLoading ? (
            <DailyEssentialsLoading 
              count={8} 
              className={gridClassNames}
            />
          ) : (
            <div className={gridClassNames}>
              {data?.products?.length > 0 ? (
                data.products.map((item) => {
                  const productUrl = `/shop/${item.slug || item._id}`;
                  const image = item.thumbnail || item.images?.[0] || "/product-placeholder.png";

                  return (
                    <Link
                      to={productUrl}
                      key={item._id || item.id}
                      className="flex flex-col items-center gap-1.5 sm:gap-2 group text-center"
                    >
                      {/* Responsive Image Container */}
                      <div className="w-20 h-20 sm:w-24 sm:h-24 md:w-28 md:h-28 lg:w-32 lg:h-32 bg-primary/10 rounded-2xl flex justify-center items-center border border-transparent group-hover:border-brand group-hover:shadow-xl transition-all duration-300 overflow-hidden p-2 shrink-0">
                        <img
                          src={image}
                          alt={item.title}
                          className="w-full h-full object-contain mix-blend-multiply transition-transform duration-300 group-hover:scale-110"
                        />
                      </div>

                      {/* Product Title */}
                      <h3 className="text-xs sm:text-sm font-semibold text-gray-900 truncate w-full px-1 group-hover:text-brand transition-colors">
                        {item.title}
                      </h3>
                      
                      {/* Price / Offer Badge */}
                      {item.discountPercentage > 0 ? (
                        <span className="text-[10px] sm:text-xs font-bold text-brand bg-brand/10 px-2 py-0.5 rounded-full line-clamp-1">
                          Up to {Math.round(item.discountPercentage)}% OFF
                        </span>
                      ) : (
                        <span className="text-xs sm:text-sm font-bold text-gray-900">
                          ৳ {item.price}
                        </span>
                      )}
                    </Link>
                  );
                })
              ) : (
                <p className="col-span-full text-center text-xs sm:text-sm text-gray-500 py-8 sm:py-12">
                  No daily essentials found.
                </p>
              )}
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default DailyEssentials;