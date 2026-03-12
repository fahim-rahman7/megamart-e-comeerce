import React from "react";
import { Link } from "react-router";
import { useGetCategoryListQuery } from "../../service/api";

const ShopSidebar = () => {
  const { data, isLoading } = useGetCategoryListQuery();

  if (isLoading) return <p>Loading...</p>;

  return (
    <div className="bg-white p-5 rounded-xl shadow">
      <h3 className="text-xl font-semibold mb-4">Categories</h3>

      <ul className="flex flex-col gap-3">
        {data?.map((item) => (
          <li key={item}>
            <Link
              to={`/shop?category=${item}`}
              className="text-primary hover:text-brand font-medium"
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