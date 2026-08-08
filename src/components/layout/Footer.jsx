import React from "react";
import { BsWhatsapp } from "react-icons/bs";
import { PiPhone } from "react-icons/pi";
import { Link } from "react-router"; // Ensure this is react-router or react-router-dom based on your setup
import { useGetCategoryListQuery } from "../../service/api"; // Adjust the path to your api slice

const Footer = () => {
  // Fetch categories from your API
  const { data: categories, isLoading } = useGetCategoryListQuery();

  return (
    <footer className="bg-brand pt-20">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
          
          {/* 1. Contact Section */}
          <div>
            <img src="/Logo-theme.png" alt="Logo-theme" />
            <h2 className="text-theme font-bold text-xl mt-9">Contact Us</h2>
            <div className="text-theme mt-5 flex gap-3">
              <BsWhatsapp className="text-xl" />
              <div className="text-base">
                <p>WhatsApp</p>
                <p>+1 202-918-2132</p>
              </div>
            </div>
            <div className="text-theme mt-5 flex gap-3 ">
              <PiPhone className="text-xl" />
              <div className="text-base">
                <p>Call Us</p>
                <p>+1 202-918-2132</p>
              </div>
            </div>
            <h3 className="text-theme mt-5 font-bold text-xl">Download App</h3>
            <div className="flex gap-5 mt-5">
              <img src="/Footer-1.png" alt="App Store" className="cursor-pointer" />
              <img src="/Footer-2.png" alt="Google Play" className="cursor-pointer" />
            </div>
          </div>

          {/* 2. Dynamic Categories Section */}
          <div className="text-theme">
            <h3 className="font-semibold text-xl pb-4 border-b-2 w-fit border-theme/30">
              Most Popular Categories
            </h3>
            
            {isLoading ? (
              <p className="mt-5 text-theme/70">Loading categories...</p>
            ) : (
              <ul className="mt-5 list-disc pl-6 space-y-4">
                {/* Slice to only show the first 8 categories so it doesn't break the layout */}
                {categories?.slice(0, 8).map((cat) => (
                  <li key={cat._id || cat.id}>
                    {/* Link directly to the shop page with the category filter applied */}
                    <Link 
                      to={`/shop?category=${cat.slug}`} 
                      className="hover:opacity-80 transition-opacity"
                    >
                      {cat.title}
                    </Link>
                  </li>
                ))}
              </ul>
            )}
          </div>

          {/* 3. Customer Services Section */}
          <div className="text-theme">
            <h3 className="font-semibold text-xl pb-4 border-b-2 w-fit border-theme/30">
              Customer Services
            </h3>
            <ul className="mt-5 list-disc pl-6 space-y-4">
              <li>
                <Link to="/about" className="hover:opacity-80 transition-opacity">About Us</Link>
              </li>
              <li>
                <Link to="/terms" className="hover:opacity-80 transition-opacity">Terms & Conditions</Link>
              </li>
              <li>
                <Link to="/faq" className="hover:opacity-80 transition-opacity">FAQ</Link>
              </li>
              <li>
                <Link to="/privacy-policy" className="hover:opacity-80 transition-opacity">Privacy Policy</Link>
              </li>
              {/* Added links that make sense for your specific API endpoints */}
              <li>
                <Link to="/profile" className="hover:opacity-80 transition-opacity">My Account</Link>
              </li>
              <li>
                <Link to="/cart" className="hover:opacity-80 transition-opacity">My Cart</Link>
              </li>
            </ul>
          </div>

        </div>
        
        {/* Copyright */}
        <div>
          <h4 className="text-theme text-center py-7 border-t-2 mt-20 border-theme/20 text-sm">
            © {new Date().getFullYear()} All rights reserved. E-Commerce Inc.
          </h4>
        </div>
      </div>
    </footer>
  );
};

export default Footer;