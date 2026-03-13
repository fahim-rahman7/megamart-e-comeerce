import React from "react";
import { BsWhatsapp } from "react-icons/bs";
import { PiPhone } from "react-icons/pi";
import { Link } from "react-router";

const Footer = () => {
  return (
    <footer className="bg-brand pt-20">
      <div className="container">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
          <div>
            <img src="/Logo-theme.png" alt="Logo-theme" />
            <h2 className="text-theme font-bold text-xl mt-9">Contact Us</h2>
            <div className="text-theme mt-5 flex gap-3">
              <BsWhatsapp />
              <div className="text-base">
                <p>Whats App</p>
                <p>+1 202-918-2132</p>
              </div>
            </div>
            <div className="text-theme mt-5 flex gap-3 ">
              <PiPhone />
              <div className="text-base">
                <p>Whats App</p>
                <p>+1 202-918-2132</p>
              </div>
            </div>
            <h3 className="text-theme mt-5 font-bold text-xl">Download App</h3>
            <div className="flex gap-5 mt-5">
              <img src="/Footer-1.png" alt="Footer-1" />
              <img src="/Footer-2.png" alt="Footer-2" />
            </div>
          </div>
          <div className="text-theme">
            <h3 className="font-semibold text-xl pb-4 border-b-2 w-fit">
              Most Popular Categories
            </h3>
            <ul className="mt-5 list-disc pl-6 space-y-4">
              <li>
                <Link>Staples</Link>
              </li>
              <li>
                <Link>Beverages</Link>
              </li>
              <li>
                <Link>Personal Care</Link>
              </li>
              <li>
                <Link>Snacks & Foods</Link>
              </li>
              <li>
                <Link>Dairy & Bakery</Link>
              </li>
              <li>
                <Link>Home Care</Link>
              </li>
              <li>
                <Link>Vegetables & Fruits</Link>
              </li>
              <li>
                <Link>Baby Care</Link>
              </li>
            </ul>
          </div>
          <div className="text-theme">
            <h3 className="font-semibold text-xl pb-4 border-b-2 w-fit">
              Customer Services
            </h3>
            <ul className="mt-5 list-disc pl-6 space-y-4">
              <li>
                <Link>About Us</Link>
              </li>
              <li>
                <Link>Terms & Conditions</Link>
              </li>
              <li>
                <Link>FAQ</Link>
              </li>
              <li>
                <Link>Privacy Policy</Link>
              </li>
              <li>
                <Link>E-waste Policy</Link>
              </li>
              <li>
                <Link>Cancellation & Return Policy</Link>
              </li>
            </ul>
          </div>
        </div>
        <div>
          <h4 className="text-theme text-center py-7.5 border-t-2 mt-20 border-theme/50">
            © 2022 All rights reserved. Reliance Retail Ltd.
          </h4>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
