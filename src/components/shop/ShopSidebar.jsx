import React from "react";
import { Link, useSearchParams } from "react-router";
import { useGetCategoryListQuery } from "../../service/api";
import { FiX } from "react-icons/fi";

const ShopSidebar = () => {
  const { data, isLoading } = useGetCategoryListQuery();
  const [searchParams] = useSearchParams();
  const activeCategory = searchParams.get("category");

  if (isLoading) {
    return (
      <div className="bg-white p-3 sm:p-4 md:p-5 rounded-2xl border border-gray-100 shadow-sm w-full animate-pulse">
        <div className="h-5 bg-gray-200 rounded-md w-24 mb-3 sm:mb-4"></div>
        <div className="flex md:flex-col gap-2 overflow-x-auto pb-2 md:pb-0">
          {[1, 2, 3, 4, 5].map((n) => (
            <div
              key={n}
              className="h-8 bg-gray-100 rounded-full md:rounded-lg w-20 md:w-full shrink-0"
            ></div>
          ))}
        </div>
      </div>
    );
  }

  const categories = Array.isArray(data) ? data : data?.categories || [];

  return (
    <div className="bg-white p-3 sm:p-4 md:p-5 rounded-2xl border border-gray-100 shadow-sm w-full">
      {/* Header & Clear Filter Link */}
      <div className="flex items-center justify-between mb-2.5 sm:mb-4">
        <h3 className="text-sm sm:text-base md:text-lg font-bold text-gray-900">
          Categories
        </h3>

        {activeCategory && (
          <Link
            to="/shop"
            className="inline-flex items-center gap-1 text-xs text-red-500 hover:text-red-600 font-medium transition"
          >
            <span>Clear Filter</span>
            <FiX className="text-xs" />
          </Link>
        )}
      </div>

      {/* Category List: Horizontal Scroll (Mobile) -> Vertical Stack (Desktop) */}
      <ul className="flex md:flex-col gap-2 overflow-x-auto pb-2 md:pb-0 scrollbar-none scroll-smooth">
        {/* Default 'All Products' Chip */}
        <li className="shrink-0 md:shrink">
          <Link
            to="/shop"
            className={`block px-3.5 py-1.5 md:px-3 md:py-2 rounded-full md:rounded-xl text-xs sm:text-sm font-medium transition whitespace-nowrap ${
              !activeCategory
                ? "bg-brand text-white font-semibold shadow-sm md:bg-brand/10 md:text-brand"
                : "bg-gray-100 text-gray-600 hover:bg-gray-200 md:bg-transparent md:hover:bg-gray-50 md:hover:text-brand"
            }`}
          >
            All Products
          </Link>
        </li>

        {categories.length > 0 ? (
          categories.map((item) => {
            const id = item._id || item.id;
            const title = item.title || item.name;
            const slug = item.slug || title;
            const isActive = activeCategory === slug;

            return (
              <li key={id} className="shrink-0 md:shrink">
                <Link
                  to={`/shop?category=${encodeURIComponent(slug)}`}
                  className={`block px-3.5 py-1.5 md:px-3 md:py-2 rounded-full md:rounded-xl text-xs sm:text-sm font-medium transition whitespace-nowrap ${
                    isActive
                      ? "bg-brand text-white font-semibold shadow-sm md:bg-brand/10 md:text-brand"
                      : "bg-gray-100 text-gray-600 hover:bg-gray-200 md:bg-transparent md:hover:bg-gray-50 md:hover:text-brand"
                  }`}
                >
                  {title}
                </Link>
              </li>
            );
          })
        ) : (
          <li className="text-xs text-gray-400 py-1">No categories found</li>
        )}
      </ul>
    </div>
  );
};

export default ShopSidebar;