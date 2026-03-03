import React from "react";
import { Link } from "react-router";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";

const TopElectronics = () => {
  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 3,
    slidesToScroll: 3,
    arrows: false,
    appendDots: (dots) => (
      <div>
        <ul className="flex gap-2 justify-center mt-5"> {dots} </ul>
      </div>
    ),
    customPaging: (i) => <div className="bg-slate-400 w-2 h-2 md:w-3 md:h-3 rounded-full"></div>,
  };
  return (
    <section className=" pb-32">
      <div className="container">
        <div className=" flex justify-between pb-4 border-b border-primary/20 relative after:absolute after:w-100 after:rounded-full after:bottom-0 after:left-0 after:h-1 after:bg-brand">
          <h2 className="heading">
            Top<span> Electronics Brands </span>
          </h2>
          <Link>View All</Link>
        </div>
        <div className="slider-container mt-15">
          <Slider {...settings}>
            <div>
              <img
                className="w-11/12"
                src="/Electronic-Brand.png"
                alt="Electronic-Brand"
              />
            </div>
            <div>
              <img
                className="w-11/12"
                src="/Electronic-Brand.png"
                alt="Electronic-Brand"
              />
            </div>
            <div>
              <img
                className="w-11/12"
                src="/Electronic-Brand.png"
                alt="Electronic-Brand"
              />
            </div>
            <div>
              <img
                className="w-11/12"
                src="/Electronic-Brand-2.png"
                alt="Electronic-Brand-2"
              />
            </div>
            <div>
              <img
                className="w-11/12"
                src="/Electronic-Brand-3.png"
                alt="Electronic-Brand-3"
              />
            </div>
            <div>
              <img
                className="w-11/12"
                src="/Electronic-Brand.png"
                alt="Electronic-Brand"
              />
            </div>
          </Slider>
        </div>
      </div>
    </section>
  );
};

export default TopElectronics;
