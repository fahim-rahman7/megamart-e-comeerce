import React from "react";
import { Link } from "react-router";
import { useGetCartQuery } from "../service/api";
import { FiShoppingBag, FiArrowRight } from "react-icons/fi";
import CartItem from "../components/ui/CartItem";

const Cart = () => {
  const { data, isLoading } = useGetCartQuery();

  const cart = data?.cartData || data;
  const cartItems = cart?.items || [];

  const totalAmount = cartItems.reduce((sum, item) => sum + item.subtotal, 0);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[50vh] sm:min-h-[60vh]">
        <p className="text-base sm:text-xl text-gray-500 font-medium animate-pulse">
          Loading your cart...
        </p>
      </div>
    );
  }

  if (!cartItems.length) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[55vh] sm:min-h-[60vh] text-center px-4 py-8">
        <div className="w-16 h-16 sm:w-24 sm:h-24 bg-brand/10 rounded-full flex items-center justify-center mb-4 sm:mb-6">
          <FiShoppingBag className="text-brand text-2xl sm:text-4xl" />
        </div>
        <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2 sm:mb-3">
          Your cart is empty
        </h2>
        <p className="text-gray-500 text-xs sm:text-base mb-6 sm:mb-8 max-w-sm sm:max-w-md">
          Looks like you haven't added anything to your cart yet. Discover great products in our shop!
        </p>
        <Link
          to="/shop"
          className="px-6 py-2.5 sm:px-8 sm:py-3 bg-brand text-white text-sm sm:text-base font-semibold rounded-xl hover:bg-brand/90 transition shadow-md shadow-brand/20 active:scale-95"
        >
          Start Shopping
        </Link>
      </div>
    );
  }

  return (
    <section className="py-4 sm:py-8 lg:py-12 bg-gray-50 min-h-screen">
      <div className="container mx-auto px-3 sm:px-4">
        
        {/* Page Title & Items Counter */}
        <div className="flex items-center justify-between mb-4 sm:mb-8">
          <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900">
            Shopping Cart
          </h1>
          <span className="text-xs sm:text-sm text-gray-500 font-medium">
            {cart.totalItems || cartItems.length} {cartItems.length === 1 ? "Item" : "Items"}
          </span>
        </div>

        <div className="flex flex-col lg:flex-row gap-5 lg:gap-8 items-start">
          
          {/* CART ITEMS LIST */}
          <div className="w-full lg:w-2/3 space-y-3 sm:space-y-4">
            {cartItems.map((item) => (
              <CartItem key={item._id} item={item} />
            ))}
          </div>

          {/* CART SUMMARY */}
          <div className="w-full lg:w-1/3 mt-2 lg:mt-0">
            <div className="bg-white border border-gray-100 rounded-2xl p-4 sm:p-6 shadow-sm lg:sticky lg:top-8">
              <h3 className="text-base sm:text-xl font-bold text-gray-900 mb-4 sm:mb-6 border-b border-gray-100 pb-3 sm:pb-4">
                Order Summary
              </h3>

              <div className="space-y-2.5 sm:space-y-4 mb-4 sm:mb-6 text-xs sm:text-sm">
                <div className="flex justify-between text-gray-600">
                  <span>Total Items</span>
                  <span className="font-semibold text-gray-900">
                    {cart.totalItems || cartItems.length}
                  </span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Subtotal</span>
                  <span className="font-semibold text-gray-900">
                    ৳ {totalAmount.toFixed(2)}
                  </span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Shipping</span>
                  <span className="font-semibold text-green-600">
                    Calculated at checkout
                  </span>
                </div>
              </div>

              <div className="border-t border-gray-100 pt-3 sm:pt-4 mb-5 sm:mb-6">
                <div className="flex justify-between items-center">
                  <span className="text-base sm:text-lg font-bold text-gray-900">Total</span>
                  <span className="text-xl sm:text-2xl font-extrabold text-brand">
                    ৳ {totalAmount.toFixed(2)}
                  </span>
                </div>
              </div>

              {/* Checkout CTA */}
              <Link 
                to="/order" 
                className="w-full bg-brand text-white font-semibold py-3 sm:py-3.5 px-4 rounded-xl sm:rounded-2xl hover:bg-brand/90 transition shadow-md shadow-brand/20 flex items-center justify-center gap-2 text-sm sm:text-base active:scale-[0.99]"
              >
                <span>Proceed to Checkout</span>
                <FiArrowRight className="text-base sm:text-lg" />
              </Link>
              
              <Link 
                to="/shop" 
                className="block text-center text-brand font-medium text-xs sm:text-sm mt-3 sm:mt-4 hover:underline py-1"
              >
                Continue Shopping
              </Link>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};

export default Cart;