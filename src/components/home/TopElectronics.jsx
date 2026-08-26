import React from "react";
import { Link } from "react-router";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import { FiArrowRight } from "react-icons/fi";

const TopElectronics = () => {
  const brandList = [
    { id: 1, img: "/Electronic-Brand.png", alt: "Electronic Brand 1" },
    { id: 2, img: "/Electronic-Brand-2.png", alt: "Electronic Brand 2" },
    { id: 3, img: "/Electronic-Brand-3.png", alt: "Electronic Brand 3" },
    { id: 4, img: "/Electronic-Brand-2.png", alt: "Electronic Brand 4" },
    { id: 5, img: "/Electronic-Brand-3.png", alt: "Electronic Brand 5" },
    { id: 6, img: "/Electronic-Brand.png", alt: "Electronic Brand 6" },
  ];

  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 3,
    slidesToScroll: 1,
    arrows: false,
    autoplay: true,
    autoplaySpeed: 2500,
    pauseOnHover: true,
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 3,
          slidesToScroll: 1,
        },
      },
      {
        breakpoint: 768,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 1,
        },
      },
      {
        breakpoint: 480,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
        },
      },
    ],
    appendDots: (dots) => (
      <div>
        <ul className="flex gap-2 justify-center mt-4 sm:mt-6"> {dots} </ul>
      </div>
    ),
    customPaging: () => (
      <div className="w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full bg-gray-300 transition-all duration-300 hover:bg-brand"></div>
    ),
  };

  return (
    <section className="py-6 sm:py-10 lg:py-14">
      <div className="container mx-auto px-3 sm:px-4">
        {/* Section Header */}
        <div className="flex items-center justify-between gap-2 pb-3 sm:pb-4 border-b border-gray-100 relative after:absolute after:w-20 sm:after:w-28 after:rounded-full after:bottom-0 after:left-0 after:h-1 after:bg-brand">
          <h2 className="text-base sm:text-2xl lg:text-3xl font-bold text-gray-900 leading-tight">
            Top <span className="text-brand">Electronics Brands</span>
          </h2>

          {/* View All Link */}
          <Link
            to="/shop?category=electronics"
            className="group flex items-center gap-1 sm:gap-1.5 text-xs sm:text-sm font-semibold text-brand bg-brand/10 hover:bg-brand hover:text-white px-3 py-1.5 sm:px-4 sm:py-2 rounded-full transition-all duration-200 shrink-0 shadow-xs"
          >
            {/* <span>View All</span> */}
            <FiArrowRight className="text-xs sm:text-sm transition-transform duration-200 group-hover:translate-x-1" />
          </Link>
        </div>

        {/* Responsive Slider */}
        <div className="mt-5 sm:mt-8 lg:mt-10">
          <Slider {...settings}>
            {brandList.map((brand) => (
              <div key={brand.id} className="px-1.5 sm:px-2.5 outline-none">
                <div className="bg-white border border-gray-100 rounded-2xl p-4 sm:p-6 shadow-xs hover:shadow-md transition-all duration-300 flex justify-center items-center h-28 sm:h-36 lg:h-44 group">
                  <img
                    className="max-h-full max-w-full object-contain transition-transform duration-300 transform group-hover:scale-105"
                    src={brand.img}
                    alt={brand.alt}
                  />
                </div>
              </div>
            ))}
          </Slider>
        </div>
      </div>
    </section>
  );
};

export default TopElectronics;