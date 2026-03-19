import React from "react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import { NextArrow, PrevArrow } from "../ui/SliderArrow";

const Banner = () => {
  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,        // ✅ enable auto slide
    autoplaySpeed: 2500,   // ⏱ 2 seconds
    pauseOnHover: true,    // 🛑 pause when hover
    nextArrow: <NextArrow />,
    prevArrow: <PrevArrow />,
    appendDots: (dots) => (
      <div>
        <ul className="flex gap-2  absolute left-10 bottom-5 md:left-24 md:bottom-10"> {dots} </ul>
      </div>
    ),
    customPaging: (i) => <div className=" bg-theme w-2 h-2 md:w-3 md:h-3 rounded-full"></div>,
  };
  return (
    <section>
      <div className="container">
        <div className="slider-container">
          <Slider {...settings}>
            <div>
              <img className="w-full" src="/banner-1.png" alt="banner-1" />
            </div>
            <div>
              <img className="w-full" src="/banner-2.png" alt="banner-2" />
            </div>
          </Slider>
        </div>
      </div>
    </section>
  );
};

export default Banner;
