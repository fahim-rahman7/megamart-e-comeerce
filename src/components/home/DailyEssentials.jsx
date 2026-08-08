import React from "react";
import { Link } from "react-router"; // or "react-router-dom"
import { useGetProductsQuery } from "../../service/api";

const DailyEssentials = () => {
  // Changed category to target your new daily-essentials category
  const { data, isLoading } = useGetProductsQuery({
    limit: 8,
    page: 1,
    category: "daily-essentials", 
  });

  return (
    <section className="pb-32">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center pb-4 border-b border-primary/20 relative after:absolute after:w-100 after:rounded-full after:bottom-0 after:left-0 after:h-1 after:bg-brand">
          <h2 className="heading">
            Daily <span> Essentials</span>
          </h2>
          {/* Updated the View All link */}
          <Link to={`/shop?category=daily-essentials`} className="hover:text-brand font-medium transition">
            View All
          </Link>
        </div>

        {isLoading ? (
          <div className="flex justify-center py-10">
            <p className="text-gray-500 font-medium">Loading essentials...</p>
          </div>
        ) : (
          <div className="mt-15 grid grid-cols-2 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-8 gap-4">
            {data?.products?.length > 0 ? (
              data.products.map((item) => {
                const productUrl = `/shop/${item.slug || item._id}`;
                const image = item.thumbnail || item.images?.[0] || "/product-placeholder.png";

                return (
                  <Link
                    to={productUrl}
                    key={item._id || item.id}
                    className="flex flex-col items-center gap-2 group"
                  >
                    <div className="w-32 h-32 bg-primary/10 rounded-2xl flex justify-center items-center border border-transparent group-hover:border-brand group-hover:shadow-2xl transition-all duration-300 overflow-hidden p-2">
                      <img
                        src={image}
                        alt={item.title}
                        className="w-full h-full object-contain mix-blend-multiply transition-transform group-hover:scale-110"
                      />
                    </div>
                    <h3 className="text-base font-semibold text-primary text-center truncate w-full px-2 group-hover:text-brand transition-colors">
                      {item.title}
                    </h3>
                    
                    {item.discountPercentage > 0 ? (
                      <h4 className="text-sm font-bold text-[#222222]">
                        UP to {Math.round(item.discountPercentage)}% OFF
                      </h4>
                    ) : (
                      <h4 className="text-sm font-bold text-[#222222]">
                        ৳ {item.price}
                      </h4>
                    )}
                  </Link>
                );
              })
            ) : (
              <p className="col-span-full text-center text-gray-500 py-10">
                No daily essentials found.
              </p>
            )}
          </div>
        )}
      </div>
    </section>
  );
};

export default DailyEssentials;