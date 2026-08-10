import React, { useState } from "react";
import { Link } from "react-router";
import { useGetCategoryListQuery } from "../../service/api";
// 1. Import your new loading component (adjust the path if needed)
import CategoryLoading from "../ui/CategoryLoading"; 

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

  return (
    <section className="pb-32">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center pb-4 border-b border-primary/20 relative after:absolute after:w-100 after:rounded-full after:bottom-0 after:left-0 after:h-1 after:bg-brand">
          <h2 className="heading">
            Shop From <span> Top Categories</span>
          </h2>
          <button 
            onClick={() => setShowAll(!showAll)} 
            className="hover:text-brand font-medium transition cursor-pointer"
          >
            {showAll ? "Show Less" : "View All"}
          </button>
        </div>

        {isLoading ? (
          // 2. Use CategoryLoading with 8 items and the exact grid classes used below
          <CategoryLoading 
            count={8} 
            className="mt-15 grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-4" 
          />
        ) : (
          <div className="mt-15 grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-4">
            {displayedCategories.map((item) => {
              const id = item._id || item.id || item;
              const title = item.title || item.name || item;
              const slug = item.slug || (typeof item === 'string' ? item : title);
              const image = item.image || item.thumbnail || "/category-1.png";

              return (
                <Link
                  to={`/shop?category=${encodeURIComponent(slug)}`}
                  key={id}
                >
                  <div className="flex flex-col items-center gap-3 group">
                    <div className="w-32 h-32 bg-primary/10 rounded-full flex justify-center items-center border border-transparent group-hover:border-brand group-hover:shadow-2xl transition-all duration-300 overflow-hidden">
                      <img
                        src={image}
                        alt={title}
                        className="w-auto max-w-4/5 max-h-4/5 object-contain mix-blend-multiply"
                      />
                    </div>
                    <h3 className="text-base font-medium text-[#000000] capitalize group-hover:text-brand transition-colors">
                      {title}
                    </h3>
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
};

export default Categories;