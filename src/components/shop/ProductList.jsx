import React, { useState } from "react"; 
import ProductCard from "../ui/ProductCard";
import { useGetProductsQuery } from "../../service/api";
import Loading from "../ui/Loading";
import { useSearchParams } from "react-router";
import ShopSidebar from "./ShopSidebar";

const ProductList = () => {
  const [searchParams] = useSearchParams();
  const category = searchParams.get("category");
  
  // 1. Extract the hasDiscount parameter from the URL
  const hasDiscountParam = searchParams.get("hasDiscount") === "true";

  const [limit, setLimit] = useState(10); 
  const [page, setPage] = useState(1);

  // 2. Pass hasDiscount into your query hook
  const { data, isLoading, isFetching } = useGetProductsQuery({ 
    limit, 
    page, 
    category,
    hasDiscount: hasDiscountParam ? true : undefined // If true, filter by discount
  });

  // Calculate items being displayed based on page and limit
  // Note: Depending on your backend, this might need to be data?.pagination?.totalProducts
  const totalProducts = data?.total || data?.pagination?.totalProducts || 0;
  const startItem = (page - 1) * limit + 1;
  const endItem = Math.min(page * limit, totalProducts);

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
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center font-semibold text-sm lg:text-xl text-primary gap-4 mb-6">
              <h4>
                {hasDiscountParam ? "Showing Best Deals " : "Showing "}
                <span className="font-bold">({limit} Items / Page)</span>
              </h4>

              <div className="flex gap-5 items-center">
                <p className="font-semibold text-sm text-gray-600">
                  {totalProducts > 0 
                    ? `Displaying ${startItem}-${endItem} of ${totalProducts} Products`
                    : "No products found"}
                </p>

                <select
                  value={limit}
                  onChange={(e) => {
                    setLimit(Number(e.target.value));
                    setPage(1); // Reset to first page when limit changes
                  }}
                  className="border rounded-2xl px-2 py-1 lg:px-4 lg:py-2 text-sm"
                >
                  {[10, 20, 30, 50].map((num) => (
                    <option key={num} value={num}>{num}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Products Grid */}
            {isLoading || isFetching ? (
              <Loading count={limit} className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-5"/>
            ) : (
              <>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-5">
                  {data?.products?.length > 0 ? (
                    data.products.map((item) => (
                      <ProductCard key={item._id || item.id} data={item} />
                    ))
                  ) : (
                    <p className="col-span-full text-center text-gray-500 py-10">
                      No products available matching your criteria.
                    </p>
                  )}
                </div>

                {/* Pagination Controls */}
                {totalProducts > limit && (
                  <div className="flex justify-center items-center gap-4 mt-10">
                    <button 
                      disabled={page === 1}
                      onClick={() => setPage(prev => Math.max(prev - 1, 1))}
                      className="px-4 py-2 bg-gray-200 rounded-md disabled:opacity-50 hover:bg-gray-300 transition"
                    >
                      Previous
                    </button>
                    <span className="font-medium text-gray-700">Page {page}</span>
                    <button 
                      disabled={endItem >= totalProducts}
                      onClick={() => setPage(prev => prev + 1)}
                      className="px-4 py-2 bg-gray-200 rounded-md disabled:opacity-50 hover:bg-gray-300 transition"
                    >
                      Next
                    </button>
                  </div>
                )}
              </>
            )}
            
          </div>
        </div>
      </div>
    </section>
  );
};

export default ProductList;