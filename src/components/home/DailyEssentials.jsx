import React from "react";
import { Link } from "react-router";
import { useGetProductsQuery } from "../../service/api";

const DailyEssentials = () => {
  const { data, isLoading } = useGetProductsQuery({limit: 8 , skip : 0, category: "kitchen-accessories"});
  
  console.log(data);
    const essentials = [
        {
          title: "Daily Essentials",
          src: "/product",
        },
        {
          title: "Vegitables",
          src: "/product",
        },
        {
          title: "Fruits",
          src: "/product",
        },
        {
          title: "Strowberry",
          src: "/product",
        },
        {
          title: "Mango",
          src: "/product",
        },
        {
          title: "Cherry",
          src: "/product",
        },
        {
          title: "Daily Essentials",
          src: "/product",
        },
        {
          title: "Daily Essentials",
          src: "/product",
        },
      ];
  return (
    <section className=" pb-32">
      <div className="container">
        <div className=" flex justify-between pb-4 border-b border-primary/20 relative after:absolute after:w-100 after:rounded-full after:bottom-0 after:left-0 after:h-1 after:bg-brand">
          <h2 className="heading">
          Daily  <span> Essentials</span>
          </h2>
          <Link to={`/shop?category=kitchen-accessories`}>View All</Link>
        </div>
        <div className="mt-15 grid grid-cols-2 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-8 gap-4">
          {data?.products.map((item) => (
            <Link to={`/shop/${item.id}`} key={item.id} className="flex flex-col items-center gap-2">
              <div className="w-32 h-32 bg-primary/10 rounded-2xl flex justify-center items-center border border-transparent hover:border-brand hover:shadow-2xl">
                <img
                  src={item?.thumbnail}
                  alt="category-1"
                  className="w-auto max-w-4/5"
                />
              </div>
              <h3 className="text-base font-semibold text-primary">{item.title}</h3>
              <h4 className="text-xl font-bold text-[#222222]">UP to 50% OFF</h4>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};

export default DailyEssentials;
