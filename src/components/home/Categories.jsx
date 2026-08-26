import React, { useState } from "react";
import { Link } from "react-router";
import { useGetCategoryListQuery } from "../../service/api";
import CategoryLoading from "../ui/CategoryLoading"; 
import { FiChevronDown, FiChevronUp } from "react-icons/fi";

const Categories = () => {
  const { data, isLoading } = useGetCategoryListQuery();
  const [showAll, setShowAll] = useState(false);

  // Handle both array of objects (custom backend) or array of strings (fallback)
  const categories = Array.isArray(data) ? data : data?.categories || [];

  // FILTER OUT the daily-essentials category
  const filteredCategories = categories.filter((item) => {
    const slug = item.slug || (typeof item === 'string' ? item : item.title);
    return slug !== "daily-essentials"; 
  });

  // Determine which categories to display based on state
  const displayedCategories = showAll ? filteredCategories : filteredCategories.slice(0, 8);

  const gridClassNames = "grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-3 sm:gap-4 lg:gap-5";

  return (
    <section className="py-6 sm:py-10 lg:py-14">
      <div className="container mx-auto px-3 sm:px-4">
        {/* Section Header */}
        <div className="flex items-center justify-between gap-2 pb-3 sm:pb-4 border-b border-gray-100 relative after:absolute after:w-20 sm:after:w-28 after:rounded-full after:bottom-0 after:left-0 after:h-1 after:bg-brand">
          <h2 className="text-base sm:text-2xl lg:text-3xl font-bold text-gray-900 leading-tight">
            Shop From <span className="text-brand">Top Categories</span>
          </h2>

          {/* Redesigned Toggle Button */}
          <button 
            onClick={() => setShowAll(!showAll)} 
            className="group flex items-center gap-1 sm:gap-1.5 text-xs sm:text-sm font-semibold text-brand bg-brand/10 hover:bg-brand hover:text-white px-3 py-1.5 sm:px-4 sm:py-2 rounded-full transition-all duration-200 shrink-0 shadow-xs cursor-pointer"
          >
            <span>{showAll ? "Show Less" : "View All"}</span>
            {showAll ? (
              <FiChevronUp className="text-xs sm:text-sm transition-transform duration-200 group-hover:-translate-y-0.5" />
            ) : (
              <FiChevronDown className="text-xs sm:text-sm transition-transform duration-200 group-hover:translate-y-0.5" />
            )}
          </button>
        </div>

        {/* Categories Content */}
        <div className="mt-5 sm:mt-8 lg:mt-10">
          {isLoading ? (
            <CategoryLoading 
              count={8} 
              className={gridClassNames} 
            />
          ) : (
            <div className={gridClassNames}>
              {displayedCategories.map((item) => {
                const id = item._id || item.id || item;
                const title = item.title || item.name || item;
                const slug = item.slug || (typeof item === 'string' ? item : title);
                const image = item.image || item.thumbnail || "/category-1.png";

                return (
                  <Link
                    to={`/shop?category=${encodeURIComponent(slug)}`}
                    key={id}
                    className="group flex flex-col items-center gap-2 sm:gap-3"
                  >
                    <div className="w-20 h-20 sm:w-24 sm:h-24 md:w-28 md:h-28 lg:w-32 lg:h-32 bg-primary/10 rounded-full flex justify-center items-center border border-transparent group-hover:border-brand group-hover:shadow-xl transition-all duration-300 overflow-hidden shrink-0">
                      <img
                        src={image}
                        alt={title}
                        className="w-auto max-w-[75%] max-h-[75%] object-contain mix-blend-multiply group-hover:scale-105 transition-transform duration-300"
                      />
                    </div>
                    <h3 className="text-xs sm:text-sm lg:text-base font-semibold text-gray-900 capitalize group-hover:text-brand transition-colors text-center line-clamp-1">
                      {title}
                    </h3>
                  </Link>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default Categories;