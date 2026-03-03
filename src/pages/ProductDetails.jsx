import React, { useState, useEffect, useRef } from "react";
import Slider from "react-slick";
import { useGetProductDetailsQuery } from "../service/api";
import { useParams } from "react-router";

const ProductDetails = () => {
  const [nav1, setNav1] = useState(null);
  const [nav2, setNav2] = useState(null);
  let sliderRef1 = useRef(null);
  let sliderRef2 = useRef(null);
  const { id } = useParams();
  const { data, isLoading } = useGetProductDetailsQuery({ id });
  console.log(data);
  useEffect(() => {
    setNav1(sliderRef1);
    setNav2(sliderRef2);
  }, []);
  const settings = {
    dots: false,
    arrows: false,
  };
  return (
    <section className="py-120">
      <div className="container">
        <div className="grid  grid-cols-3 gap-12">
          <div>
            {" "}
            <div className="bg-primary/10 flex items-center justify-center rounded-4xl border border-primary/20 mb-5">
              <Slider
                {...settings}
                asNavFor={nav2}
                ref={(slider) => (sliderRef1 = slider)}
                className="w-full h-full max-w-4/6"
              >
                {data?.images.map((img) => (
                  <div className="" key={img}>
                    <img src={img} alt="product-1" className="w-full h-full" />
                  </div>
                ))}
              </Slider>
            </div>
            <Slider
              {...settings}
              asNavFor={nav1}
              ref={(slider) => (sliderRef2 = slider)}
              slidesToShow={3}
              swipeToSlide={true}
              focusOnSelect={true}
            >
              {data?.images.map((img) => (
                <div key={img}>
                  <div className="w-fit flex justify-center items-center border border-primary/20 rounded-2xl mx-2">
                    <img
                      src={img}
                      alt="product-1"
                      className="w-4/5"
                    />
                  </div>
                </div>
              ))}

            </Slider>
          </div>
          <div className="mt-15">
            <h2 className="text-xl md:text-2xl lg:text-3xl font-semibold text-gray-900">
             {data?.title}
            </h2>
            <p className="text-lg md:text-xl lg:text-2xl font-semibold text-gray-900 mt-5">
              ৳{data?.price}{" "}
              <span className="text-sm md:text-lg lg:text-xl text-slate-400 font-light">
                (Cash Price)
              </span>
            </p>
            <div className="mt-5 flex items-center justify-between">
              <p className="font-semibold text-gray-900 pr-22  xl:border-r-2 border-primary/20">
                Availability: <span className="font-normal">In Stock</span>
              </p>
              <p className="font-semibold text-gray-900">
              Brand: <span className="font-light">{data?.brand}</span>
              </p>
            </div>
          </div>
        </div>
        <div></div>
      </div>
    </section>
  );
};

export default ProductDetails;
