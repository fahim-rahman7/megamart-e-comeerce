import React from "react";
import { Link } from "react-router";
import ProductCard from "../ui/ProductCard";
import { useGetProductsQuery } from "../../service/api";
import Loading from "../ui/Loading";

const BestDeal = () => {
  // Fetch 5 products that specifically have a discount > 0
  const { data, isLoading } = useGetProductsQuery({
    limit: 5,
    page: 1,
    hasDiscount: true, // Trigger the discount filter
  });

  return (
    <section className="py-120">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="flex justify-between items-center pb-4 border-b border-primary/20 relative after:absolute after:w-100 after:rounded-full after:bottom-0 after:left-0 after:h-1 after:bg-brand">
          <h2 className="heading">
            Grab the best deals <span>Today</span>
          </h2>
          <Link
            to={`/shop?hasDiscount=true`}
            className="hover:text-brand transition-colors font-medium"
          >
            View All
          </Link>
        </div>

        {/* Products Grid */}
        <div className="mt-10">
          {isLoading ? (
            <Loading count={5}/>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
              {data?.products?.length > 0 ? (
                data.products.map((item) => (
                  <ProductCard key={item._id || item.id} data={item} />
                ))
              ) : (
                <p className="col-span-full text-center text-gray-500 py-10">
                  No deals available at the moment.
                </p>
              )}
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default BestDeal;
