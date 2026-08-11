import React, { useState } from "react";
import { CiSearch, CiShoppingCart } from "react-icons/ci";
import { FaBars, FaRegUser, FaWindowClose } from "react-icons/fa";
import { Link, useNavigate } from "react-router";
import { useGetCategoryListQuery, useGetProfileQuery } from "../../service/api";
import Logout from "../../pages/Logout";

const Navbar = () => {
  const [openDropDown, setOpenDropDown] = useState("");
  const [search, setSearch] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();

  // Fetch Categories
  const { data: categoryData } = useGetCategoryListQuery();
  const categories = Array.isArray(categoryData) ? categoryData : categoryData?.categories || [];

  // Check if user has an auth cookie before making the request
  // const hasAuthToken = document.cookie.includes("acc_tkn=");

  // Skip request if no token exists to avoid 401 console error
  const { data: profile } = useGetProfileQuery();

  // Search Handler
  const handleSearch = (e) => {
    if (e.key === "Enter" && search.trim()) {
      navigate(`/shop?search=${encodeURIComponent(search.trim())}`);
      setIsOpen(false);
    }
  };

  return (
    <header>
      <nav className="py-8">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center">
            
            {/* Mobile Menu Toggle */}
            <button className="md:hidden" onClick={() => setIsOpen(true)}>
              <FaBars className="text-xl text-primary" />
            </button>

            {/* Logo */}
            <div>
              <Link to="/" className="inline-block w-28 md:w-auto">
                <img src="/logo.png" alt="logo" className="w-full" />
              </Link>
            </div>

            {/* Desktop SearchBar */}
            <div className="hidden md:flex gap-2.5 items-center p-4 bg-[#F3F9FB] rounded-xl w-full max-w-lg">
              <CiSearch className="text-brand text-2xl" />
              <input
                className="text-primary w-full text-base outline-0 bg-transparent"
                type="text"
                placeholder="Search products..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                onKeyDown={handleSearch}
              />
            </div>

            {/* Icons / Profile Section */}
            <div className="flex items-center gap-5 font-bold text-base text-primary">
              {profile ? (
                <div className="hidden md:flex items-center gap-3">
                  <Link to="/profile" className="flex items-center">
                    <img
                      src={profile.avatar || "https://placehold.co/40"}
                      alt="profile"
                      className="w-9 h-9 rounded-full object-cover border border-primary/20"
                    />
                  </Link>
                  <Logout className="hover:text-brand transition-colors cursor-pointer leading-none" />
                </div>
              ) : (
                <div className="hidden md:flex items-center gap-2">
                  <FaRegUser className="text-brand text-xl" />
                  <Link
                    className="hover:text-brand transition-colors"
                    to="/login"
                  >
                    Sign Up/Sign In
                  </Link>
                </div>
              )}

              {/* Vertical Separator */}
              <span className="hidden md:block h-5 w-[1px] bg-primary/30"></span>

              {/* Cart Link */}
              <Link to="/cart" className="flex items-center gap-1.5 hover:text-brand transition-colors">
                <CiShoppingCart className="text-brand text-2xl" />
                <span className="hidden md:block leading-none">Cart</span>
              </Link>
            </div>

          </div>

          {/* Mobile SearchBar */}
          <div className="flex md:hidden gap-2.5 items-center mt-6 p-4 bg-[#F3F9FB] rounded-xl w-full">
            <CiSearch className="text-brand text-2xl" />
            <input
              className="text-primary w-full text-base outline-0 bg-transparent"
              type="text"
              placeholder="Search products..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              onKeyDown={handleSearch}
            />
          </div>
        </div>
      </nav>

      {/* Desktop Category Bar */}
      <div className="hidden md:block">
        <div className="container mx-auto px-4 flex gap-3 pb-2 border-b border-primary/20 mb-5 overflow-x-auto hide-scrollbar">
          {categories.slice(0, 10).map((item) => {
            const id = item._id || item.id || item;
            const title = item.title || item.name || item;
            const slug = item.slug || (typeof item === "string" ? item : title);

            return (
              <div key={id} className="relative group flex-shrink-0">
                <Link
                  to={`/shop?category=${encodeURIComponent(slug)}`}
                  className="bg-[#F3F9FB] inline-block rounded-2xl py-2 px-3.5 font-medium hover:bg-brand text-[#222222] hover:text-white transition-colors"
                >
                  <div className="flex items-center gap-1 capitalize text-nowrap">
                    <p className="text-sm">{title}</p>
                  </div>
                </Link>
              </div>
            );
          })}
        </div>
      </div>

      {/* Mobile SideBar */}
      <div
        className={`${
          isOpen ? "opacity-100 visible" : "opacity-0 invisible"
        } transition-all fixed top-0 left-0 z-[999] w-full h-screen bg-primary/40`}
      >
        <div
          className={`w-4/5 sm:w-3/5 max-w-sm bg-white h-full overflow-y-auto flex flex-col ${
            isOpen ? "translate-x-0" : "-translate-x-full"
          } transition-transform duration-300`}
        >
          <div className="flex justify-between items-center bg-black p-4">
            <h3 className="font-semibold text-white">Menu</h3>
            <button onClick={() => setIsOpen(false)}>
              <FaWindowClose className="text-white text-xl" />
            </button>
          </div>

          <ul className="space-y-4 py-5 border-b border-primary/20 px-5 flex-grow">
            {categories.slice(0, 30).map((item) => {
              const id = item._id || item.id || item;
              const title = item.title || item.name || item;
              const slug = item.slug || (typeof item === "string" ? item : title);

              return (
                <li key={id} className="text-sm font-bold text-primary">
                  <div className="flex items-center justify-between">
                    <Link
                      to={`/shop?category=${encodeURIComponent(slug)}`}
                      onClick={() => setIsOpen(false)}
                      className="capitalize w-full block py-1"
                    >
                      {title}
                    </Link>
                  </div>
                </li>
              );
            })}
          </ul>

          <div className="mt-auto border-t border-gray-100">
            {profile ? (
              <div className="bg-gray-50 pb-4">
                <Link
                  onClick={() => setIsOpen(false)}
                  className="flex items-center gap-3 px-5 py-5 border-b border-gray-200 hover:bg-gray-100 transition-colors"
                  to="/profile"
                >
                  <img
                    src={profile.avatar || "https://placehold.co/40"}
                    alt="profile"
                    className="w-10 h-10 rounded-full object-cover border border-gray-300"
                  />
                  <span className="font-bold text-primary truncate max-w-[150px]">
                    {profile.fullName || "My Profile"}
                  </span>
                </Link>
                <Logout className="w-full text-left px-5 py-4 font-bold text-primary hover:text-brand hover:bg-gray-100 transition-colors cursor-pointer" />
              </div>
            ) : (
              <Link
                onClick={() => setIsOpen(false)}
                className="block text-lg font-bold px-5 py-6 text-brand hover:underline"
                to="/login"
              >
                Sign Up / Sign In
              </Link>
            )}
          </div>
        </div>
        
        {/* Click outside to close */}
        <div 
          className="absolute top-0 right-0 w-1/5 sm:w-2/5 h-full cursor-pointer" 
          onClick={() => setIsOpen(false)}
        />
      </div>
    </header>
  );
};

export default Navbar;