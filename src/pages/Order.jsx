import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router";
import {
  useGetCartQuery,
  useCheckoutMutation,
  useRemoveFromCartMutation,
  useGetProfileQuery,
} from "../service/api";
import { ToastContainer, toast } from "react-toastify";
import OrderSuccessModal from "../components/ui/OrderSuccessModal"; // 1. Import the popup modal

const Order = () => {
  const navigate = useNavigate();
  const { data, isLoading } = useGetCartQuery();
  const { data: profileData } = useGetProfileQuery();

  const [checkout, { isLoading: isCheckingOut }] = useCheckoutMutation();
  const [removeFromCart] = useRemoveFromCartMutation();

  // Form State
  const [shippingAddress, setShippingAddress] = useState("");
  const [insideDhaka, setInsideDhaka] = useState("true");
  const [paymentType, setPaymentType] = useState("card");

  // Modal Visibility State
  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);

  const cart = data?.cartData || data;
  const cartItems = cart?.items || [];

  // 3. Pre-fill the shipping address when profileData is loaded
  useEffect(() => {
    if (profileData?.address) {
      let formattedAddress = "";
      
      // Handle both string and object address formats (matching your Profile logic)
      if (typeof profileData.address === "string") {
        formattedAddress = profileData.address;
      } else {
        const { street, address, city, postalCode } = profileData.address;
        const streetPart = street || address || "";
        // Join the available parts with a comma
        formattedAddress = [streetPart, city, postalCode].filter(Boolean).join(", ");
      }

      // Only set it if the user hasn't already started typing something manually
      setShippingAddress((prev) => prev || formattedAddress);
    }
  }, [profileData]);

  // Calculations
  const subtotal = cartItems.reduce((sum, item) => sum + item.subtotal, 0);
  const deliveryCharge = insideDhaka === "true" ? 80 : 120;
  const totalAmount = subtotal + deliveryCharge;

  const handlePlaceOrder = async (e) => {
    e.preventDefault();

    if (!shippingAddress.trim()) {
      return toast.error("Please enter an address.");
    }

    try {
      const response = await checkout({
        cartId: cart._id,
        shippingAddress,
        insideDhaka,
        paymentType,
      }).unwrap();

      // If user chose card, redirect to Stripe session URL
      if (paymentType === "card" && response.url) {
        window.location.href = response.url;
      } else {
        // 2. Open the custom success modal popup instead of relying on quick toasts
        setIsSuccessModalOpen(true);

        // Clear the cart by removing all items sequentially in the background
        setTimeout(() => {
          try {
            Promise.all(
              cartItems.map((item) =>
                removeFromCart({
                  cartId: cart._id,
                  productId: item.product?._id,
                }).unwrap()
              )
            );
          } catch (removeErr) {
            console.error(
              "Non-fatal error: Failed to clear cart items",
              removeErr
            );
          }
        }, 4000);

        // 3. Give the user enough time to see the checkmark modal before redirecting
        setTimeout(() => {
          navigate("/shop");
        }, 7000);
      }
    } catch (err) {
      console.error("Checkout error:", err);
      toast.error(err?.data?.message || "Failed to place order.");
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <p className="text-xl text-gray-500 font-medium animate-pulse">
          Loading checkout...
        </p>
      </div>
    );
  }

  // If cart is empty, redirect back to cart
  if (!cartItems.length) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <h2 className="text-2xl font-bold mb-4">Your cart is empty</h2>
        <Link to="/cart" className="text-brand hover:underline">
          Go back to Cart
        </Link>
      </div>
    );
  }

  return (
    <section className="py-12 bg-gray-50 min-h-screen relative">
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
      />

      {/* Render the Success Modal Component */}
      <OrderSuccessModal
        isOpen={isSuccessModalOpen}
        onClose={() => setIsSuccessModalOpen(false)}
      />

      <div className="container mx-auto px-4">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Checkout</h1>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* CHECKOUT FORM */}
          <div className="lg:w-2/3">
            <div className="bg-white border border-gray-100 rounded-2xl p-8 shadow-sm">
              <h2 className="text-xl font-bold mb-6 border-b pb-4">
                Shipping Details
              </h2>

              <form onSubmit={handlePlaceOrder} className="space-y-6">
                <div>
                  <label className="block text-gray-700 font-medium mb-2">
                    Complete Shipping Address{" "}
                    <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    required
                    value={shippingAddress}
                    onChange={(e) => setShippingAddress(e.target.value)}
                    placeholder="House, Road, Block, Area, City..."
                    className="w-full border border-gray-300 rounded-xl p-3 focus:ring-2 focus:ring-brand focus:border-brand outline-none transition"
                    rows="3"
                  />
                </div>

                <div>
                  <label className="block text-gray-700 font-medium mb-2">
                    Delivery Area
                  </label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <label
                      className={`border rounded-xl p-4 cursor-pointer transition ${
                        insideDhaka === "true"
                          ? "border-brand bg-brand/5"
                          : "border-gray-200"
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <input
                          type="radio"
                          name="area"
                          value="true"
                          checked={insideDhaka === "true"}
                          onChange={(e) => setInsideDhaka(e.target.value)}
                          className="w-4 h-4 text-brand"
                        />
                        <div>
                          <p className="font-semibold text-gray-900">
                            Inside Dhaka
                          </p>
                          <p className="text-sm text-gray-500">
                            Delivery Charge: ৳ 80
                          </p>
                        </div>
                      </div>
                    </label>
                    <label
                      className={`border rounded-xl p-4 cursor-pointer transition ${
                        insideDhaka === "false"
                          ? "border-brand bg-brand/5"
                          : "border-gray-200"
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <input
                          type="radio"
                          name="area"
                          value="false"
                          checked={insideDhaka === "false"}
                          onChange={(e) => setInsideDhaka(e.target.value)}
                          className="w-4 h-4 text-brand"
                        />
                        <div>
                          <p className="font-semibold text-gray-900">
                            Outside Dhaka
                          </p>
                          <p className="text-sm text-gray-500">
                            Delivery Charge: ৳ 120
                          </p>
                        </div>
                      </div>
                    </label>
                  </div>
                </div>

                <div>
                  <label className="block text-gray-700 font-medium mb-2 mt-4">
                    Payment Method
                  </label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <label
                      className={`border rounded-xl p-4 cursor-pointer transition ${
                        paymentType === "card"
                          ? "border-brand bg-brand/5"
                          : "border-gray-200"
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <input
                          type="radio"
                          name="payment"
                          value="card"
                          checked={paymentType === "card"}
                          onChange={(e) => setPaymentType(e.target.value)}
                          className="w-4 h-4 text-brand"
                        />
                        <div>
                          <p className="font-semibold text-gray-900">
                            Online Payment
                          </p>
                          <p className="text-sm text-gray-500">
                            Pay securely via Stripe
                          </p>
                        </div>
                      </div>
                    </label>
                    <label
                      className={`border rounded-xl p-4 cursor-pointer transition ${
                        paymentType === "cash"
                          ? "border-brand bg-brand/5"
                          : "border-gray-200"
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <input
                          type="radio"
                          name="payment"
                          value="cash"
                          checked={paymentType === "cash"}
                          onChange={(e) => setPaymentType(e.target.value)}
                          className="w-4 h-4 text-brand"
                        />
                        <div>
                          <p className="font-semibold text-gray-900">
                            Cash on Delivery
                          </p>
                          <p className="text-sm text-gray-500">
                            Pay when you receive it
                          </p>
                        </div>
                      </div>
                    </label>
                  </div>
                </div>
              </form>
            </div>
          </div>

          {/* FINAL ORDER SUMMARY */}
          <div className="lg:w-1/3">
            <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm sticky top-8">
              <h3 className="text-xl font-bold text-gray-900 mb-6 border-b border-gray-100 pb-4">
                Your Order
              </h3>

              <div className="space-y-3 mb-6 max-h-[300px] overflow-y-auto pr-2">
                {cartItems.map((item) => (
                  <div
                    key={item._id}
                    className="flex justify-between items-center text-sm border-b border-gray-50 pb-2"
                  >
                    <div className="flex-1">
                      <p className="font-medium text-gray-800 line-clamp-1">
                        {item.product?.title || "Product"}
                      </p>
                      <p className="text-gray-500">Qty: {item.quantity}</p>
                    </div>
                    <span className="font-semibold text-gray-900">
                      ৳ {item.subtotal}
                    </span>
                  </div>
                ))}
              </div>

              <div className="space-y-4 mb-6 pt-2">
                <div className="flex justify-between text-gray-600">
                  <span>Subtotal</span>
                  <span className="font-medium text-gray-900">
                    ৳ {subtotal.toFixed(2)}
                  </span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Delivery Charge</span>
                  <span className="font-medium text-gray-900">
                    ৳ {deliveryCharge.toFixed(2)}
                  </span>
                </div>
              </div>

              <div className="border-t border-gray-100 pt-4 mb-6">
                <div className="flex justify-between items-center">
                  <span className="text-lg font-bold text-gray-900">Total</span>
                  <span className="text-2xl font-bold text-brand">
                    ৳ {totalAmount.toFixed(2)}
                  </span>
                </div>
              </div>

              <button
                onClick={handlePlaceOrder}
                disabled={isCheckingOut || isSuccessModalOpen}
                className="w-full bg-brand text-white font-semibold py-4 rounded-xl hover:bg-brand/90 transition shadow-lg shadow-brand/20 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
              >
                {isCheckingOut
                  ? "Processing..."
                  : `Place Order (৳ ${totalAmount.toFixed(2)})`}
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Order;
