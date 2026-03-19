import React, { useEffect, useRef, useState } from "react";
import { BiChevronDown } from "react-icons/bi";
import { CiSearch, CiShoppingCart } from "react-icons/ci";
import {
  FaBars,
  FaChevronRight,
  FaRegUser,
  FaWindowClose,
} from "react-icons/fa";
import { Link, useNavigate } from "react-router";
import { useGetCategoryListQuery } from "../../service/api";
import { useGetProfileQuery } from "../../service/api";
import { getCookie } from "../utils/cookie";

const Navbar = () => {
  const [openDropDown, setOpenDropDown] = useState("");
  const [search, setSearch] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const { data } = useGetCategoryListQuery();
  // const navRef = useRef(null);

  const navigate = useNavigate();
  const token = getCookie();
  const { data: profile } = useGetProfileQuery(undefined, {
    skip: !token, // don't call API if user not logged in
  });

  const category = [
    {
      title: "Phone",
      href: "/",
      children: [
        {
          title: "Iphone",
          href: "/",
        },
        {
          title: "Samsung",
          href: "/",
        },
        {
          title: "Nokia",
          href: "/",
        },
      ],
    },
    {
      title: "Watch",
      href: "/",
      children: [
        {
          title: "Apple",
          href: "/",
        },
        {
          title: "Samsung",
          href: "/",
        },
        {
          title: "Nokia",
          href: "/",
        },
      ],
    },
    {
      title: "Tab",
      href: "/",
      children: [
        {
          title: "Ipad",
          href: "/",
        },
        {
          title: "Samsung",
          href: "/",
        },
        {
          title: "Nokia",
          href: "/",
        },
      ],
    },
    {
      title: "Laptop",
      href: "/",
      children: [
        {
          title: "Hp",
          href: "/",
        },
        {
          title: "Dell",
          href: "/",
        },
        {
          title: "Asus",
          href: "/",
        },
      ],
    },
  ];
  //  console.log(navRef);
  //   document.addEventListener("click", (e)=>{
  //     console.log(navRef.current.contains(e.target));
  //   });

  return (
    <header>
      <nav className="py-8">
        <div className="container">
          <div className=" flex justify-between items-center">
            <button className="md:hidden" onClick={() => setIsOpen(true)}>
              <FaBars className="text-xl text-primary" />
            </button>

            <div>
              <Link to="/" className="inline-block w-28 md:w-auto">
                <img src="/logo.png" alt="logo" className="w-full" />
              </Link>
            </div>
            <div className="hidden md:flex gap-2.5 items-center p-4 bg-[#F3F9FB] rounded-xl w-full  max-w-lg">
              <CiSearch className="text-brand text-2xl" />
              <input
                className="text-primary w-full text-base outline-0"
                type="text"
                placeholder="Search essentials, groceries and more..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    navigate(`/shop?category=${search}`);
                  }
                }}
              />
            </div>
            <div className="flex gap-10">
              <div className="text-base text-primary hidden md:flex whitespace-nowrap items-center gap-1.5 font-bold">
                {profile ? (
                  <Link to="/profile">
                    <img
                      src={profile.image}
                      alt="profile"
                      className="w-10 h-10 rounded-full object-cover"
                    />
                  </Link>
                ) : (
                  <>
                    <FaRegUser className="text-brand text-xl" />
                    <Link
                      className="relative after:absolute after:h-full after:w-0.5 after:bg-primary/40 after:top-0 after:-right-5"
                      to="/login"
                    >
                      Sign Up/Sign In
                    </Link>
                  </>
                )}
              </div>
              <div className="text-base text-primary font-bold">
                <Link to="/cart" className="flex items-center gap-1.5 ">
                  <CiShoppingCart className="text-brand text-xl" />
                  <span className="hidden md:block">Cart</span>
                </Link>
              </div>
            </div>
          </div>

          {/* Mobile SearchBar */}

          <div className="flex md:hidden gap-2.5 items-center mt-10 p-4 bg-[#F3F9FB] rounded-xl w-full  max-w-lg">
            <CiSearch className="text-brand text-2xl" />
            <input
              className="text-primary w-full text-base outline-0"
              type="text"
              placeholder="Search essentials, groceries and more..."
            />
          </div>
        </div>
      </nav>
      <div className="hidden md:block">
        <div className="container flex pb-2 border-b border-primary/20 mb-5">
          {data?.slice(0, 10).map((item) => (
            <div key={item} className="relative group">
              <Link
                to={`/shop?category=${item}`}
                className="bg-[#F3F9FB] inline-block rounded-2xl py-2 px-3.5 font-medium hover:bg-brand text-[#22222] hover:text-theme"
              >
                <div className="flex items-center gap-1 capitalize text-nowrap">
                  <p className="text-base ">{item}</p>
                  {/* <BiChevronDown className="text-2xl " /> */}
                </div>
              </Link>

              {/* <ul className="absolute top-full left-0 opacity-0 invisible group-hover:visible group-hover:opacity-100 bg-theme shadow w-40 rounded-2xl text-base font-medium text-[#22222] space-y-2">
                {item.children.map((child) => (
                  <li key={child.title}>
                    <Link
                      to={child.href}
                      key={child.title}
                      className="rounded-2xl px-3.5 py-1 block hover:bg-brand hover:text-theme"
                    >
                      {child.title}
                    </Link>
                  </li>
                ))}
              </ul> */}
            </div>
          ))}
        </div>
      </div>
      {/* Mobile SideBar */}
      <div
        className={`${
          isOpen ? "opacity-100 visible" : "opacity-0 invisible"
        } transition fixed top-0 left-0 z-[999] w-full h-screen bg-primary/40`}
      >
        <div
          className={`w-4/5 sm:3/5 bg-theme h-full overflow-y-auto ${
            isOpen ? "translate-x-0" : "-translate-x-full"
          } transition-all`}
        >
          <div className="flex justify-between items-center mb-5 bg-black p-2">
            <h3 className="font-semibold text-theme">Menu SideBar</h3>
            <button onClick={() => setIsOpen(false)}>
              <FaWindowClose className="text-theme" />
            </button>
          </div>
          <ul className="space-y-4 pb-5 border-b border-primary/50 px-5">
            {data?.slice(0, 30).map((item) => (
              <li key={item} className="text-sm font-bold text-primary">
                <div className="flex items-center justify-between ">
                  <Link
                    to={`/shop?category=${item}`}
                    onClick={() => setIsOpen(false)}
                    className="capitalize"
                  >
                    {item}
                  </Link>
                </div>
                <div
                  className={`${openDropDown === item ? "block" : "hidden"}`}
                >
                  {/* <ul>
                    {item.children.map((child) => (
                      <li
                        key={child.title}
                        className="text-xs font-medium mt-2 pl-2 text-primary"
                      >
                        <Link>{child.title}</Link>
                      </li>
                    ))}
                  </ul> */}
                </div>
              </li>
            ))}
          </ul>

          <div className="mt-5">
            {profile ? (
              <Link
                onClick={() => setIsOpen(false)}
                className="flex items-center gap-3 px-5 py-6"
                to="/profile"
              >
                <img
                  src={profile.image}
                  alt="profile"
                  className="w-10 h-10 rounded-full object-cover"
                />
                <span className="font-bold">{profile.firstName}</span>
              </Link>
            ) : (
              <Link
                onClick={() => setIsOpen(false)}
                className="text-lg font-bold px-5 py-6"
                to="/login"
              >
                Sign Up/Sign In
              </Link>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
