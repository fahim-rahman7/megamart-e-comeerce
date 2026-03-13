import React from "react";
import { Link } from "react-router";
import { useGetCategoryListQuery } from "../../service/api";

const ShopSidebar = () => {
  const { data, isLoading } = useGetCategoryListQuery();

  if (isLoading) return <p>Loading...</p>;

  return (
    <div className="bg-white p-4 lg:p-5 md:p-6 rounded-xl shadow w-full min-w-[180px]">
      <h3 className="text-lg lg:text-xl font-semibold mb-4">
        Categories
      </h3>

      <ul className="flex flex-col gap-2 lg:gap-3">
        {data?.map((item) => (
          <li key={item}>
            <Link
              to={`/shop?category=${item}`}
              className="block text-sm lg:text-base text-primary hover:text-brand font-medium transition"
            >
              {item}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ShopSidebar;