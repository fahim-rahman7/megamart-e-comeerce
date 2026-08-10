import React from "react";

const ProductDetailsLoading = () => {
  return (
    <section className="py-12 bg-gray-50 min-h-screen">
      <div className="container mx-auto px-4">
        {/* Main Product Card Wrapper */}
        <div className="bg-white border border-gray-100 rounded-3xl p-6 lg:p-10 shadow-sm animate-pulse">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
            
            {/* ===== LEFT SIDE: Image Gallery Skeleton ===== */}
            <div className="space-y-4">
              {/* Main Large Image Box */}
              <div className="bg-gray-200 rounded-2xl border border-gray-100 h-[450px] w-full"></div>
              
              {/* Thumbnail Slider */}
              <div className="grid grid-cols-4 gap-3">
                {[1, 2, 3, 4].map((item) => (
                  <div 
                    key={item} 
                    className="border border-gray-100 bg-gray-200 rounded-xl h-[80px] w-full"
                  ></div>
                ))}
              </div>
            </div>

            {/* ===== RIGHT SIDE: Product Info Skeleton ===== */}
            <div className="flex flex-col h-full">
              
              {/* Category Breadcrumb */}
              <div className="h-6 w-24 bg-gray-200 rounded-full mb-3"></div>

              {/* Product Title */}
              <div className="h-9 w-full bg-gray-200 rounded-md mb-2"></div>
              <div className="h-9 w-2/3 bg-gray-200 rounded-md mb-4"></div>

              {/* Price Row */}
              <div className="mt-4 flex items-center gap-4">
                <div className="h-9 w-32 bg-gray-200 rounded-md"></div>
                <div className="h-6 w-20 bg-gray-200 rounded-md"></div>
                <div className="h-7 w-20 bg-gray-200 rounded-lg"></div>
              </div>

              {/* Stock and SKU Info */}
              <div className="mt-4 border-y border-gray-100 py-3 flex gap-4">
                <div className="h-5 w-40 bg-gray-200 rounded-md"></div>
                <div className="h-5 w-24 bg-gray-200 rounded-md"></div>
              </div>

              {/* Variants Selector */}
              <div className="mt-6 space-y-4">
                <div className="h-5 w-32 bg-gray-200 rounded-md mb-2"></div>
                <div className="flex flex-wrap gap-3">
                  <div className="h-10 w-28 bg-gray-200 rounded-xl"></div>
                  <div className="h-10 w-32 bg-gray-200 rounded-xl"></div>
                </div>
              </div>

              {/* Description */}
              <div className="mt-6">
                <div className="h-5 w-24 bg-gray-200 rounded-md mb-3"></div>
                <div className="h-4 w-full bg-gray-200 rounded-md mb-2"></div>
                <div className="h-4 w-5/6 bg-gray-200 rounded-md mb-2"></div>
                <div className="h-4 w-4/6 bg-gray-200 rounded-md"></div>
              </div>

              {/* Tags */}
              <div className="mt-4 flex gap-2">
                <div className="h-6 w-16 bg-gray-200 rounded-md"></div>
                <div className="h-6 w-20 bg-gray-200 rounded-md"></div>
              </div>

              {/* Quantity and CTA Buttons */}
              <div className="mt-8 pt-6 border-t border-gray-100 flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
                {/* Quantity Control */}
                <div className="h-[52px] w-[130px] bg-gray-200 rounded-2xl shrink-0"></div>
                {/* Add to Cart Button */}
                <div className="h-[52px] flex-1 bg-gray-200 rounded-2xl"></div>
              </div>

              {/* View Cart Quick Link */}
              <div className="mt-3">
                <div className="h-[52px] w-full bg-gray-200 rounded-2xl"></div>
              </div>

              {/* Extra Trust Badges */}
              <div className="grid grid-cols-3 gap-4 mt-8 pt-6 border-t border-gray-100 text-center">
                {[1, 2, 3].map((item) => (
                  <div key={item} className="flex flex-col items-center gap-2">
                    <div className="h-6 w-6 bg-gray-200 rounded-md"></div>
                    <div className="h-3 w-20 bg-gray-200 rounded-md"></div>
                  </div>
                ))}
              </div>

            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ProductDetailsLoading;