import React, { useState, useRef } from "react";
import Slider from "react-slick";
import { useGetProductDetailsQuery } from "../service/api";
import { useParams } from "react-router";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const ProductDetails = () => {
  const sliderRef1 = useRef(null);
  const sliderRef2 = useRef(null);

  const { id } = useParams();
  const { data, isLoading } = useGetProductDetailsQuery({ id });

  const [quantity, setQuantity] = useState(1);
  const [zoomStyle, setZoomStyle] = useState({});

  const increaseQty = () => {
    if (quantity < data?.stock) {
      setQuantity((prev) => prev + 1);
    }
  };

  const decreaseQty = () => {
    if (quantity > 1) {
      setQuantity((prev) => prev - 1);
    }
  };

  const handleAddToCart = () => {
    toast.success(`${quantity} item added to cart`);
  };

  const handleMouseMove = (e) => {
    const { left, top, width, height } =
      e.currentTarget.getBoundingClientRect();

    const x = ((e.pageX - left) / width) * 100;
    const y = ((e.pageY - top) / height) * 100;

    setZoomStyle({
      transformOrigin: `${x}% ${y}%`,
      transform: "scale(2)",
    });
  };

  const handleMouseLeave = () => {
    setZoomStyle({
      transform: "scale(1)",
    });
  };

  const settings = {
    dots: false,
    arrows: false,
    accessibility: false,
  };

  return (
    <section>
      <div className="container">
        <ToastContainer/>
        {/* ===== TOP SECTION ===== */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* ===== IMAGE SECTION ===== */}
          <div>
            {/* MAIN IMAGE */}
            {data?.images?.length > 0 && (
              <div className="bg-primary/10 rounded-3xl border border-primary/20 mb-6 h-[420px] p-10 flex items-center justify-center overflow-hidden">
                <Slider
                  {...settings}
                  asNavFor={sliderRef2.current}
                  ref={sliderRef1}
                  className="w-full"
                >
                  {data.images.map((img) => (
                    <div key={img}>
                      <div
                        className="h-[360px] flex items-center justify-center cursor-zoom-in overflow-hidden"
                        onMouseMove={handleMouseMove}
                        onMouseLeave={handleMouseLeave}
                      >
                        <img
                          src={img}
                          alt={data.title}
                          style={zoomStyle}
                          className="max-h-full max-w-full object-contain transition-transform duration-200"
                        />
                      </div>
                    </div>
                  ))}
                </Slider>
              </div>
            )}

            {/* THUMBNAILS */}
            {data?.images?.length > 0 && (
              <Slider
                {...settings}
                asNavFor={sliderRef1.current}
                ref={sliderRef2}
                slidesToShow={4}
                swipeToSlide
                focusOnSelect
              >
                {data.images.map((img) => (
                  <div key={img} className="px-2">
                    <div className="border rounded-xl p-2 cursor-pointer h-[100px] flex items-center justify-center">
                      <img
                        src={img}
                        alt="thumb"
                        className="max-h-full max-w-full object-contain"
                      />
                    </div>
                  </div>
                ))}
              </Slider>
            )}
          </div>

          {/* ===== PRODUCT INFO ===== */}
          <div className="lg:col-span-2">
            <h1 className="text-3xl font-semibold">{data?.title}</h1>

            <p className="text-gray-500 mt-2">
              Brand:
              <span className="text-gray-900 font-medium ml-1">
                {data?.brand}
              </span>
            </p>

            <p className="mt-2">⭐ {data?.rating} / 5</p>

            {/* PRICE */}
            <div className="mt-4">
              <span className="text-3xl font-bold text-primary">
                ৳ {data?.price}
              </span>

              <span className="ml-3 text-sm text-green-600">
                {data?.discountPercentage}% OFF
              </span>
            </div>

            {/* AVAILABILITY */}
            <p className="mt-3">
              Availability:
              <span className="font-medium text-green-600 ml-1">
                {data?.availabilityStatus}
              </span>
            </p>

            <p className="mt-1 text-sm text-gray-500">
              Only {data?.stock} items left in stock
            </p>

            <p className="mt-1 text-sm">
              SKU:
              <span className="text-gray-600 ml-1">{data?.sku}</span>
            </p>

            {/* TAGS */}
            <div className="flex gap-2 mt-4 flex-wrap">
              {data?.tags?.map((tag) => (
                <span
                  key={tag}
                  className="px-3 py-1 text-sm bg-gray-100 rounded-full"
                >
                  #{tag}
                </span>
              ))}
            </div>

            {/* DESCRIPTION */}
            <p className="mt-6 text-gray-700 leading-relaxed">
              {data?.description}
            </p>

            {/* ===== QUANTITY SELECTOR ===== */}
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

                <span className="w-6 text-center font-medium">{quantity}</span>

                <button
                  onClick={increaseQty}
                  disabled={quantity >= data?.stock}
                  className="w-8 h-8 flex items-center justify-center rounded-full bg-white shadow disabled:opacity-40"
                >
                  +
                </button>
              </div>
            </div>

            {/* ADD TO CART */}
            <button
              onClick={handleAddToCart}
              className="mt-6 px-8 py-3 cursor-pointer bg-orange-500 text-white rounded-xl hover:bg-orange-400 transition"
            >
              Add to Cart
            </button>
          </div>
        </div>

        {/* ===== EXTRA INFORMATION ===== */}
        <div className="mt-16 grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="border rounded-2xl p-6">
            <h3 className="text-xl font-semibold mb-3">Shipping Information</h3>
            <p>{data?.shippingInformation}</p>
          </div>

          <div className="border rounded-2xl p-6">
            <h3 className="text-xl font-semibold mb-3">Warranty</h3>
            <p>{data?.warrantyInformation}</p>
          </div>

          <div className="border rounded-2xl p-6">
            <h3 className="text-xl font-semibold mb-3">Return Policy</h3>
            <p>{data?.returnPolicy}</p>
          </div>
        </div>

        {/* ===== REVIEWS ===== */}
        <div className="mt-16">
          <h2 className="text-2xl font-semibold mb-6">Customer Reviews</h2>

          <div className="space-y-4">
            {data?.reviews?.map((review, index) => (
              <div key={index} className="border rounded-xl p-4">
                <p className="font-medium">{review.reviewerName}</p>

                <p className="text-sm text-gray-500">⭐ {review.rating} / 5</p>

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