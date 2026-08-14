import React from "react";
import { Link } from "react-router"; // or "react-router-dom"
import { useGetCartQuery } from "../service/api";
import { FiShoppingBag } from "react-icons/fi";
import CartItem from "../components/ui/CartItem"; // Import the new component

const Cart = () => {
  const { data, isLoading } = useGetCartQuery();

  const cart = data?.cartData || data;
  const cartItems = cart?.items || [];

  const totalAmount = cartItems.reduce((sum, item) => sum + item.subtotal, 0);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <p className="text-xl text-gray-500 font-medium animate-pulse">
          Loading your cart...
        </p>
      </div>
    );
  }

  if (!cartItems.length) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-4">
        <div className="w-24 h-24 bg-brand/10 rounded-full flex items-center justify-center mb-6">
          <FiShoppingBag className="text-brand text-4xl" />
        </div>
        <h2 className="text-2xl font-bold text-gray-900 mb-3">Your cart is empty</h2>
        <p className="text-gray-500 mb-8 max-w-md">
          Looks like you haven't added anything to your cart yet. Discover great products in our shop!
        </p>
        <Link
          to="/shop"
          className="px-8 py-3 bg-brand text-white font-semibold rounded-xl hover:bg-brand/90 transition shadow-lg"
        >
          Start Shopping
        </Link>
      </div>
    );
  }

  return (
    <section className="py-12 bg-gray-50 min-h-screen">
      <div className="container mx-auto px-4">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Shopping Cart</h1>

        <div className="flex flex-col lg:flex-row gap-8">
          
          {/* CART ITEMS LIST */}
          <div className="lg:w-2/3 space-y-4">
            {cartItems.map((item) => (
              <CartItem key={item._id} item={item} />
            ))}
          </div>

          {/* CART SUMMARY */}
          <div className="lg:w-1/3">
            <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm sticky top-8">
              <h3 className="text-xl font-bold text-gray-900 mb-6 border-b border-gray-100 pb-4">
                Order Summary
              </h3>

              <div className="space-y-4 mb-6">
                <div className="flex justify-between text-gray-600">
                  <span>Total Items</span>
                  <span className="font-medium text-gray-900">{cart.totalItems || cartItems.length}</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Subtotal</span>
                  <span className="font-medium text-gray-900">৳ {totalAmount.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Shipping</span>
                  <span className="font-medium text-green-600">Calculated at checkout</span>
                </div>
              </div>

              <div className="border-t border-gray-100 pt-4 mb-6">
                <div className="flex justify-between items-center">
                  <span className="text-lg font-bold text-gray-900">Total</span>
                  <span className="text-2xl font-bold text-brand">৳ {totalAmount.toFixed(2)}</span>
                </div>
              </div>

              <Link 
                to="/order" 
                className="w-full bg-brand text-white font-semibold py-4 rounded-xl hover:bg-brand/90 transition shadow-lg shadow-brand/20 flex items-center justify-center gap-2"
              >
                Proceed to Checkout
              </Link>
              
              <Link to="/shop" className="block text-center text-brand font-medium mt-4 hover:underline">
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