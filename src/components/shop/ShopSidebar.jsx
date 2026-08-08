import React from "react";
import { Link, useSearchParams } from "react-router";
import { useGetCategoryListQuery } from "../../service/api";

const ShopSidebar = () => {
  const { data, isLoading } = useGetCategoryListQuery();
  const [searchParams] = useSearchParams();
  const activeCategory = searchParams.get("category");

  if (isLoading) return <p className="text-gray-500">Loading categories...</p>;

  // Depending on how your controller sends the list, it might be in `data` or `data.categories`
  const categories = Array.isArray(data) ? data : data?.categories || [];

  return (
    <div className="bg-white p-4 lg:p-5 md:p-6 rounded-xl shadow w-full min-w-[180px]">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg lg:text-xl font-semibold">Categories</h3>
        
        {/* Option to clear category filter */}
        {activeCategory && (
          <Link to="/shop" className="text-xs text-red-500 hover:underline">
            Clear
          </Link>
        )}
      </div>

      <ul className="flex flex-col gap-2 lg:gap-3">
        {categories.length > 0 ? (
          categories.map((item) => {
            // Check for Mongoose _id or fallback to standard id/name
            const id = item._id || item.id;
            const title = item.title || item.name;
            const slug = item.slug || title; // Use slug for URL if available

            const isActive = activeCategory === slug;

            return (
              <li key={id}>
                <Link
                  to={`/shop?category=${encodeURIComponent(slug)}`}
                  className={`block text-sm lg:text-base font-medium transition ${
                    isActive 
                      ? "text-blue-600 font-bold" 
                      : "text-primary hover:text-blue-500"
                  }`}
                >
                  {title}
                </Link>
              </li>
            );
          })
        ) : (
          <li className="text-sm text-gray-400">No categories found</li>
        )}
      </ul>
    </div>
  );
};

export default ShopSidebar;