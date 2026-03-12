import React from "react";
import { useGetCartQuery } from "../service/api";

const Cart = () => {
  const { data, isLoading } = useGetCartQuery();

  if (isLoading) {
    return (
      <div className="text-center py-20 text-lg font-medium">
        Loading Cart...
      </div>
    );
  }

  const cart = data?.carts?.[0]; // using first cart

  return (
    <section className="py-16">
      <div className="container">

        {/* PAGE TITLE */}
        <h1 className="text-3xl font-semibold mb-10">
          Shopping Cart
        </h1>

        {/* CART ITEMS */}
        <div className="grid gap-6">

          {cart?.products?.map((product) => (
            <div
              key={product.id}
              className="flex items-center justify-between border rounded-xl p-4 shadow-sm"
            >
              {/* PRODUCT INFO */}
              <div className="flex items-center gap-4">

                <img
                  src={product.thumbnail}
                  alt={product.title}
                  className="w-20 h-20 object-contain"
                />

                <div>
                  <h2 className="font-semibold text-lg">
                    {product.title}
                  </h2>

                  <p className="text-gray-500 text-sm">
                    Price: ${product.price}
                  </p>

                  <p className="text-gray-500 text-sm">
                    Discount: {product.discountPercentage}%
                  </p>
                </div>
              </div>

              {/* QUANTITY */}
              <div className="text-center">
                <p className="text-sm text-gray-500">Quantity</p>
                <p className="font-medium">{product.quantity}</p>
              </div>

              {/* TOTAL */}
              <div className="text-right">
                <p className="text-sm text-gray-500">
                  Total
                </p>

                <p className="font-semibold">
                  ${product.discountedTotal}
                </p>

                <p className="text-xs text-gray-400 line-through">
                  ${product.total}
                </p>
              </div>

              {/* REMOVE BUTTON */}
              <button className="text-red-500 font-medium hover:text-red-700">
                Remove
              </button>
            </div>
          ))}
        </div>

        {/* CART SUMMARY */}
        <div className="mt-12 border rounded-xl p-6 w-full md:w-[350px] ml-auto">

          <h3 className="text-xl font-semibold mb-4">
            Cart Summary
          </h3>

          <div className="flex justify-between mb-2">
            <span>Total Products</span>
            <span>{cart?.totalProducts}</span>
          </div>

          <div className="flex justify-between mb-2">
            <span>Total Quantity</span>
            <span>{cart?.totalQuantity}</span>
          </div>

          <div className="flex justify-between mb-2">
            <span>Total Price</span>
            <span>${cart?.total}</span>
          </div>

          <div className="flex justify-between text-lg font-semibold mt-4">
            <span>Discounted Total</span>
            <span>${cart?.discountedTotal}</span>
          </div>

          <button className="w-full mt-6 bg-orange-500 text-white py-3 rounded-lg hover:bg-orange-400 transition">
            Proceed to Checkout
          </button>

        </div>

      </div>
    </section>
  );
};

export default Cart;