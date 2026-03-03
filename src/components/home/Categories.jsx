import React from "react";
import { Link } from "react-router";
import { useGetCategoryListQuery } from "../../service/api";

const Categories = () => {
  const {data} = useGetCategoryListQuery()
  console.log(data);

  const category = [
    {
      title: "Mobile",
      src: "/product",
    },
    {
      title: "Cosmetics",
      src: "/product",
    },
    {
      title: "Electronics",
      src: "/product",
    },
    {
      title: "Furniture",
      src: "/product",
    },
    {
      title: "Watches",
      src: "/product",
    },
    {
      title: "Decor",
      src: "/product",
    },
    {
      title: "Accessories",
      src: "/product",
    },
    {
      title: "Mobile",
      src: "/product",
    },
  ];
  return (
    <section className=" pb-32">
      <div className="container">
        <div className=" flex justify-between pb-4 border-b border-primary/20 relative after:absolute after:w-100 after:rounded-full after:bottom-0 after:left-0 after:h-1 after:bg-brand">
          <h2 className="heading">
            Shop From <span> Top Categories</span>
          </h2>
          <Link to={"/shop"}>View All</Link>
        </div>   
      <div className="mt-15 grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-4">
      {data?.slice(0,8).map((item) => (
        <Link to={`/shop?category=${item}`} key={item}>
       
            <div className="flex flex-col items-center gap-3">
              <div className="w-32 h-32 bg-primary/10 rounded-full flex justify-center items-center border border-transparent hover:border-brand hover:shadow-2xl">
                <img
                  src="/category-1.png"
                  alt="category-1"
                  className="w-auto max-w-4/5"
                />
              </div>
              <h3 className="text-base font-medium text-[#000000]">{item}</h3>
            </div>
         
        </Link> 
      ))}
      </div>
      </div>
    </section>
  );
};

export default Categories;
