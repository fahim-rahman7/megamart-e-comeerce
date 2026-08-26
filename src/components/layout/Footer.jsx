import React from "react";
import { BsWhatsapp } from "react-icons/bs";
import { PiPhone } from "react-icons/pi";
import { Link } from "react-router";
import { useGetCategoryListQuery } from "../../service/api";

const Footer = () => {
  const { data: categoriesData, isLoading } = useGetCategoryListQuery();

  // Handle array response safely regardless of backend structure
  const categories = Array.isArray(categoriesData)
    ? categoriesData
    : categoriesData?.categories || [];

  return (
    <footer className="bg-brand pt-10 pb-6 md:pt-20">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-10">
          
          {/* 1. Contact & Branding Section */}
          <div className="flex flex-col items-start">
            <Link to="/" className="inline-block">
              <img
                src="/Logo-theme.png"
                alt="Logo"
                className="h-9 w-auto md:h-11 object-contain"
              />
            </Link>

            <h2 className="text-theme font-bold text-lg md:text-xl mt-6 md:mt-8">
              Contact Us
            </h2>

            {/* WhatsApp Link */}
            <a
              href="https://wa.me/12029182132"
              target="_blank"
              rel="noopener noreferrer"
              className="text-theme mt-4 flex items-center gap-3 hover:opacity-80 transition-opacity py-1"
            >
              <BsWhatsapp className="text-xl flex-shrink-0" />
              <div className="text-sm md:text-base leading-tight">
                <p className="font-medium">WhatsApp</p>
                <p className="opacity-90">+1 202-918-2132</p>
              </div>
            </a>

            {/* Phone Call Link */}
            <a
              href="tel:+12029182132"
              className="text-theme mt-3 flex items-center gap-3 hover:opacity-80 transition-opacity py-1"
            >
              <PiPhone className="text-xl flex-shrink-0" />
              <div className="text-sm md:text-base leading-tight">
                <p className="font-medium">Call Us</p>
                <p className="opacity-90">+1 202-918-2132</p>
              </div>
            </a>

            <h3 className="text-theme mt-6 font-bold text-lg md:text-xl">
              Download App
            </h3>

            {/* App Store Links */}
            <div className="flex flex-wrap gap-3 mt-4">
              <a
                href="https://www.apple.com/app-store/"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:opacity-80 transition-all hover:-translate-y-0.5 active:translate-y-0"
              >
                <img
                  src="/Footer-1.png"
                  alt="App Store"
                  className="h-10 w-auto object-contain"
                />
              </a>

              <a
                href="https://play.google.com/store"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:opacity-80 transition-all hover:-translate-y-0.5 active:translate-y-0"
              >
                <img
                  src="/Footer-2.png"
                  alt="Google Play"
                  className="h-10 w-auto object-contain"
                />
              </a>
            </div>
          </div>

          {/* 2. Dynamic Categories Section */}
          <div className="text-theme mt-2 md:mt-0">
            <h3 className="font-semibold text-lg md:text-xl pb-2 md:pb-3 border-b-2 w-fit border-theme/30">
              Most Popular Categories
            </h3>

            {isLoading ? (
              <p className="mt-4 text-sm text-theme/70 animate-pulse">
                Loading categories...
              </p>
            ) : (
              <ul className="mt-4 space-y-2.5">
                {categories.slice(0, 8).map((cat) => (
                  <li key={cat._id || cat.id}>
                    <Link
                      to={`/shop?category=${cat.slug}`}
                      className="inline-block text-sm md:text-base hover:opacity-80 transition-opacity py-0.5"
                    >
                      {cat.title}
                    </Link>
                  </li>
                ))}
              </ul>
            )}
          </div>

          {/* 3. Customer Services Section */}
          <div className="text-theme mt-2 md:mt-0">
            <h3 className="font-semibold text-lg md:text-xl pb-2 md:pb-3 border-b-2 w-fit border-theme/30">
              Customer Services
            </h3>
            <ul className="mt-4 space-y-2.5">
              {[
                { label: "About Us", path: "/about" },
                { label: "Terms & Conditions", path: "/terms" },
                { label: "FAQ", path: "/faq" },
                { label: "Privacy Policy", path: "/privacy-policy" },
                { label: "My Account", path: "/profile" },
                { label: "My Cart", path: "/cart" },
              ].map((service) => (
                <li key={service.path}>
                  <Link
                    to={service.path}
                    className="inline-block text-sm md:text-base hover:opacity-80 transition-opacity py-0.5"
                  >
                    {service.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Copyright */}
        <div className="mt-10 md:mt-16 border-t border-theme/20 pt-6">
          <p className="text-theme text-center text-xs md:text-sm opacity-90">
            © {new Date().getFullYear()} All rights reserved. E-Commerce Inc.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;