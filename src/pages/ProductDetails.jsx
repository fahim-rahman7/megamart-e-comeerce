import React, { useState, useRef } from "react";
import Slider from "react-slick";
import { useGetProductDetailsQuery } from "../service/api";
import { useParams } from "react-router";

const ProductDetails = () => {
  const sliderRef1 = useRef(null);
  const sliderRef2 = useRef(null);

  const { id } = useParams();
  const { data, isLoading } = useGetProductDetailsQuery({ id });

  /* =========================
     QUANTITY STATE
  ========================= */
  const [quantity, setQuantity] = useState(1); // start from 1

  const increaseQty = () => {
    if (quantity < data.stock) {
      setQuantity((prev) => prev + 1);
    }
  };

  const decreaseQty = () => {
    if (quantity > 1) {
      setQuantity((prev) => prev - 1);
    }
  };

  if (isLoading) return <p className="text-center py-20">Loading...</p>;

  const settings = {
    dots: false,
    arrows: false,
    accessibility: false,
  };

  return (
    <section className="py-20">
      <div className="container">

        {/* ===== Top Section ===== */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">

          {/* ===== Image Section ===== */}
          <div>
            {data?.images?.length > 0 && (
              <div className="bg-primary/10 rounded-3xl border border-primary/20 mb-6 h-[420px]">
                <Slider
                  {...settings}
                  asNavFor={sliderRef2.current}
                  ref={sliderRef1}
                  className="h-full"
                >
                  {data.images.map((img) => (
                    <div
                      key={img}
                      className="h-[420px] flex items-center justify-center"
                    >
                      <img
                        src={img}
                        alt={data.title}
                        className="max-h-full max-w-full object-contain"
                      />
                    </div>
                  ))}
                </Slider>
              </div>
            )}

            {data?.images?.length > 0 && (
              <Slider
                {...settings}
                asNavFor={sliderRef1.current}
                ref={sliderRef2}
                slidesToShow={3}
                swipeToSlide
                focusOnSelect
              >
                {data.images.map((img) => (
                  <div key={img} className="px-2">
                    <div className="border rounded-xl p-2 cursor-pointer">
                      <img src={img} alt="thumb" />
                    </div>
                  </div>
                ))}
              </Slider>
            )}
          </div>

          {/* ===== Product Info ===== */}
          <div className="lg:col-span-2">
            <h1 className="text-3xl font-semibold">{data.title}</h1>

            <p className="text-gray-500 mt-2">
              Brand:{" "}
              <span className="text-gray-900 font-medium">{data.brand}</span>
            </p>

            <p className="mt-2">⭐ {data.rating} / 5</p>

            <div className="mt-4">
              <span className="text-3xl font-bold text-primary">
                ৳ {data.price}
              </span>
              <span className="ml-3 text-sm text-green-600">
                {data.discountPercentage}% OFF
              </span>
            </div>

            <p className="mt-3">
              Availability:{" "}
              <span className="font-medium text-green-600">
                {data.availabilityStatus}
              </span>
            </p>

            <p className="mt-1 text-sm text-gray-500">
              Only {data.stock} items left in stock
            </p>

            <p className="mt-1 text-sm">
              SKU: <span className="text-gray-600">{data.sku}</span>
            </p>

            <div className="flex gap-2 mt-4">
              {data.tags.map((tag) => (
                <span
                  key={tag}
                  className="px-3 py-1 text-sm bg-gray-100 rounded-full"
                >
                  #{tag}
                </span>
              ))}
            </div>

            <p className="mt-6 text-gray-700 leading-relaxed">
              {data.description}
            </p>

            {/* =========================
                QUANTITY SELECTOR
            ========================= */}
            <div className="mt-6">
              <p className="text-sm font-medium mb-2">Select Quantity:</p>

              <div className="inline-flex items-center gap-4 bg-gray-100 rounded-full px-4 py-2">
                <button
                  onClick={decreaseQty}
                  disabled={quantity <= 1}
                  className="w-8 h-8 flex items-center justify-center rounded-full bg-white shadow disabled:opacity-40"
                >
                  −
                </button>

                <span className="w-6 text-center font-medium">
                  {quantity}
                </span>

                <button
                  onClick={increaseQty}
                  disabled={quantity >= data.stock}
                  className="w-8 h-8 flex items-center justify-center rounded-full bg-white shadow disabled:opacity-40"
                >
                  +
                </button>
              </div>
            </div>

            {/* ===== Add to Cart ===== */}
            <button className="mt-6 px-8 py-3 bg-orange-500 text-white rounded-xl hover:bg-orange-400 transition">
              Add to Cart
            </button>
          </div>
        </div>

        {/* ===== Extra Information ===== */}
        <div className="mt-16 grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="border rounded-2xl p-6">
            <h3 className="text-xl font-semibold mb-3">
              Shipping Information
            </h3>
            <p>{data.shippingInformation}</p>
          </div>

          <div className="border rounded-2xl p-6">
            <h3 className="text-xl font-semibold mb-3">Warranty</h3>
            <p>{data.warrantyInformation}</p>
          </div>

          <div className="border rounded-2xl p-6">
            <h3 className="text-xl font-semibold mb-3">Return Policy</h3>
            <p>{data.returnPolicy}</p>
          </div>

          {/* <div className="border rounded-2xl p-6">
            <h3 className="text-xl font-semibold mb-3">
              Minimum Order
            </h3>
            <p>{data.minimumOrderQuantity} units</p>
          </div> */}
        </div>

        {/* ===== Reviews ===== */}
        <div className="mt-16">
          <h2 className="text-2xl font-semibold mb-6">
            Customer Reviews
          </h2>

          <div className="space-y-4">
            {data.reviews.map((review, index) => (
              <div key={index} className="border rounded-xl p-4">
                <p className="font-medium">{review.reviewerName}</p>
                <p className="text-sm text-gray-500">
                  ⭐ {review.rating} / 5
                </p>
                <p className="mt-2">{review.comment}</p>
              </div>
            ))}
          </div>
        </div>

      </div>
    </section>
  );
};

export default ProductDetails;