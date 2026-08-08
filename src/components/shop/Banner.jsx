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
    nextArrow: <NextArrow />,
    prevArrow: <PrevArrow />,
    appendDots: (dots) => (
      <div>
        <ul className="flex gap-2 absolute left-10 bottom-5 md:left-24 md:bottom-10">
          {dots}
        </ul>
      </div>
    ),
    customPaging: () => (
      <div className="bg-theme w-2 h-2 md:w-3 md:h-3 rounded-full"></div>
    ),
  };

  return (
    <section>
      <div className="container mx-auto">
        <div className="slider-container relative">
          <Slider {...settings}>
            <div>
              <img className="w-full object-cover" src="/banner-1.png" alt="banner-1" />
            </div>
            <div>
              <img className="w-full object-cover" src="/banner-2.png" alt="banner-2" />
            </div>
          </Slider>
        </div>
      </div>
    </section>
  );
};

export default Banner;