import React, { useState } from "react"; 
import ProductCard from "../ui/ProductCard";
import { useGetProductsQuery } from "../../service/api";
import Loading from "../ui/Loading";
import { useSearchParams } from "react-router";
import ShopSidebar from "./ShopSidebar";

const ProductList = () => {
  const [searchParams] = useSearchParams();
  const category = searchParams.get("category");

  const [limit, setLimit] = useState(30);
  const [skip, setSkip] = useState(0);

  const { data, isLoading } = useGetProductsQuery({ limit, skip, category });

  return (
    <section className="py-20">
      <div className="container mx-auto px-4">

        {/* Grid: Sidebar visible on md and above */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">

          {/* Sidebar: hidden on sm, visible on md+ */}
          <div className="hidden md:block md:col-span-1">
            <ShopSidebar />
          </div>

          {/* Products: full width on sm, right of sidebar on md+ */}
          <div className="md:col-span-3">

            {/* Header */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center font-semibold text-sm lg:text-xl text-primary gap-4">
              <h4>
                Showing <span className="font-bold">({limit} Items)</span>
              </h4>

              <div className="flex gap-5 items-center">
                <p className="font-semibold">
                  Displaying {skip + 1}-{limit} of {data?.total || 0} Products
                </p>

                <select
                  onChange={(e) => setLimit(Number(e.target.value))}
                  className="border rounded-2xl px-2 py-1 lg:px-4 lg:py-2"
                >
                  {[30, 60, 90, 120, 150, 180, 210].map((num) => (
                    <option key={num} value={num}>{num}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Products Grid */}
            {isLoading ? (
              <Loading />
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-5 mt-6">
                {data?.products?.map((item) => (
                  <ProductCard key={item.id} data={item} />
                ))}
              </div>
            )}

          </div>
        </div>
      </div>
    </section>
  );
};

export default ProductList;