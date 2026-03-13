import React from "react";
import { useGetCartQuery } from "../service/api";

const Cart = () => {
  const { data, isLoading } = useGetCartQuery();
console.log(data);
  if (isLoading) {
    return (
      <div className="text-center py-20 text-lg font-medium">
        Loading Cart...
      </div>
    );
  }

  // combine all products from carts and limit to 20
  const products =
    data?.carts?.flatMap((cart) => cart.products).slice(0, 10);

  return (
    <section className="py-16">
      <div className="container mx-auto">

        {/* PAGE TITLE */}
        <h1 className="text-3xl font-semibold mb-10">
          Shopping Cart
        </h1>

        {/* PRODUCTS */}
        <div className="space-y-6">

          {products?.map((product) => (
            <div
              key={product.id}
              className="flex items-center justify-between border rounded-xl p-5 shadow-sm"
            >
              {/* LEFT SIDE */}
              <div className="flex items-center gap-4">

                <img
                  src={product.thumbnail}
                  alt={product.title}
                  className="w-20 h-20 object-contain"
                />

                <div>
                  <h2 className="text-lg font-semibold">
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
                <p className="text-gray-500 text-sm">
                  Quantity
                </p>

                <p className="font-medium text-lg">
                  {product.quantity}
                </p>
              </div>

              {/* TOTAL */}
              <div className="text-right">

                <p className="text-gray-500 text-sm">
                  Total
                </p>

                <p className="font-semibold text-lg">
                  ${product.discountedTotal}
                </p>

                <p className="text-gray-400 text-sm line-through">
                  ${product.total}
                </p>

              </div>



            </div>
          ))}

        </div>

        {/* CART SUMMARY */}
        <div className="mt-12 max-w-sm ml-auto border rounded-xl p-6">

          <h3 className="text-xl font-semibold mb-4">
            Cart Summary
          </h3>

          <div className="flex justify-between mb-2">
            <span>Total Products</span>
            <span>{products?.length}</span>
          </div>

          <div className="flex justify-between text-lg font-semibold mt-4">
            <span>Estimated Total</span>
            <span>
              $
              {products
                ?.reduce((sum, item) => sum + item.discountedTotal, 0)
                .toFixed(2)}
            </span>
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