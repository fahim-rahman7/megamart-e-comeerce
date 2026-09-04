import React, { useEffect, useState } from "react";
import { Link, useNavigate, useLocation } from "react-router";
import {
  useGetCartQuery,
  useCartCheckoutMutation,
  useDirectCheckoutMutation,
  useRemoveFromCartMutation,
  useGetProfileQuery,
} from "../../service/api";
import { ToastContainer, toast } from "react-toastify";
import OrderSuccessModal from "../../components/ui/OrderSuccessModal";

const Order = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const { data, isLoading } = useGetCartQuery();
  const { data: profileData } = useGetProfileQuery();

  // Hook initializations
  const [cartCheckout, { isLoading: isCartCheckingOut }] = useCartCheckoutMutation();
  const [directCheckout, { isLoading: isDirectCheckingOut }] = useDirectCheckoutMutation();
  const [removeFromCart] = useRemoveFromCartMutation();

  const isCheckingOut = isCartCheckingOut || isDirectCheckingOut;

  // Read Direct Order item from router state or sessionStorage fallback
  const [directOrderItem] = useState(() => {
    return (
      location.state?.directOrderItem ||
      JSON.parse(sessionStorage.getItem("directOrderItem") || "null")
    );
  });

  const isDirectOrder = Boolean(directOrderItem);

  // Form State
  const [phone, setPhone] = useState("");
  const [shippingAddress, setShippingAddress] = useState("");
  const [insideDhaka, setInsideDhaka] = useState("true");
  const [paymentType, setPaymentType] = useState("card");
  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);

  const cart = data?.cartData || data;
  const cartItems = cart?.items || [];

  // Determine checkout items source (Direct Order vs Cart)
  const checkoutItems = isDirectOrder ? [directOrderItem] : cartItems;

  // Pre-fill phone and shipping address when profileData loads
  useEffect(() => {
    if (profileData) {
      if (profileData.phone) {
        setPhone((prev) => prev || profileData.phone);
      }
      if (profileData.address) {
        let formattedAddress = "";
        if (typeof profileData.address === "string") {
          formattedAddress = profileData.address;
        } else {
          const { street, address, city, postalCode } = profileData.address;
          const streetPart = street || address || "";
          formattedAddress = [streetPart, city, postalCode].filter(Boolean).join(", ");
        }
        setShippingAddress((prev) => prev || formattedAddress);
      }
    }
  }, [profileData]);

  // Handle closing modal and immediate navigation
  const handleModalClose = () => {
    if (isDirectOrder) {
      sessionStorage.removeItem("directOrderItem");
    }
    setIsSuccessModalOpen(false);
    navigate("/shop");
  };

  // Optional 5-second auto-redirect if modal isn't manually closed
  useEffect(() => {
    let timer;
    if (isSuccessModalOpen) {
      timer = setTimeout(() => {
        handleModalClose();
      }, 5000);
    }
    return () => clearTimeout(timer);
  }, [isSuccessModalOpen]);

  // Calculations derived from checkoutItems
  const subtotal = checkoutItems.reduce((sum, item) => sum + (item.subtotal || 0), 0);
  const deliveryCharge = insideDhaka === "true" ? 80 : 120;
  const totalAmount = subtotal + deliveryCharge;

  // Order Submission Handler
  const handlePlaceOrder = async (e) => {
    e.preventDefault();

    const formattedPhone = String(phone || "").trim();

    if (!formattedPhone) {
      return toast.error("Please enter a valid contact number.");
    }

    if (!shippingAddress.trim()) {
      return toast.error("Please enter an address.");
    }

    try {
      let response;

      if (isDirectOrder) {
        response = await directCheckout({
          productId: directOrderItem.product?._id || directOrderItem.productId,
          quantity: directOrderItem.quantity,
          sku: directOrderItem.sku || `SKU-${directOrderItem.product?._id}`,
          phone,
          shippingAddress,
          insideDhaka,
          paymentType,
        }).unwrap();
      } else {
        response = await cartCheckout({
          cartId: cart?._id,
          phone,
          shippingAddress,
          insideDhaka,
          paymentType,
        }).unwrap();
      }

      if (paymentType === "card" && response?.url) {
        if (isDirectOrder) sessionStorage.removeItem("directOrderItem");
        window.location.href = response.url;
      } else {
        setIsSuccessModalOpen(true);
      }
    } catch (err) {
      console.error("Checkout error:", err);
      toast.error(err?.data?.message || "Failed to place order.");
    }
  };

  // Skip cart loading state if processing direct order
  if (isLoading && !isDirectOrder) {
    return (
      <div className="flex justify-center items-center min-h-[55vh] sm:min-h-[60vh]">
        <p className="text-base sm:text-xl text-gray-500 font-medium animate-pulse">
          Loading checkout...
        </p>
      </div>
    );
  }

  // Prevent displaying empty cart layout when success modal is open
  if (!checkoutItems.length && !isSuccessModalOpen) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[55vh] sm:min-h-[60vh] px-4 text-center">
        <h2 className="text-xl sm:text-2xl font-bold mb-3 text-gray-900">Your cart is empty</h2>
        <Link to="/cart" className="text-brand font-medium text-sm sm:text-base hover:underline">
          Go back to Cart
        </Link>
      </div>
    );
  }

  return (
    <section className="py-4 sm:py-8 lg:py-12 bg-gray-50 min-h-screen relative">
      <ToastContainer position="top-right" autoClose={3000} hideProgressBar={false} />

      <OrderSuccessModal
        isOpen={isSuccessModalOpen}
        onClose={handleModalClose}
      />

      <div className="container mx-auto px-3 sm:px-4">
        <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 mb-4 sm:mb-8">
          {isDirectOrder ? "Direct Checkout" : "Checkout"}
        </h1>

        <div className="flex flex-col lg:flex-row gap-5 lg:gap-8 items-start">
          
          {/* CHECKOUT FORM */}
          <div className="w-full lg:w-2/3">
            <div className="bg-white border border-gray-100 rounded-2xl p-4 sm:p-6 lg:p-8 shadow-sm">
              <h2 className="text-base sm:text-xl font-bold text-gray-900 mb-4 sm:mb-6 border-b pb-3 sm:pb-4">
                Shipping & Contact Details
              </h2>

              <form onSubmit={handlePlaceOrder} className="space-y-4 sm:space-y-6">
                
                {/* Phone Field */}
                <div>
                  <label className="block text-xs sm:text-sm font-semibold text-gray-700 mb-1.5">
                    Phone / Contact Number <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="tel"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="e.g. 01700000000"
                    className="w-full border border-gray-300 rounded-xl p-2.5 sm:p-3 text-xs sm:text-sm focus:ring-2 focus:ring-brand focus:border-brand outline-none transition"
                  />
                </div>

                {/* Address Field */}
                <div>
                  <label className="block text-xs sm:text-sm font-semibold text-gray-700 mb-1.5">
                    Complete Shipping Address <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    required
                    value={shippingAddress}
                    onChange={(e) => setShippingAddress(e.target.value)}
                    placeholder="House, Road, Block, Area, City..."
                    className="w-full border border-gray-300 rounded-xl p-2.5 sm:p-3 text-xs sm:text-sm focus:ring-2 focus:ring-brand focus:border-brand outline-none transition"
                    rows="3"
                  />
                </div>

                {/* Delivery Area Selection */}
                <div>
                  <label className="block text-xs sm:text-sm font-semibold text-gray-700 mb-1.5">
                    Delivery Area
                  </label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 sm:gap-4">
                    <label
                      className={`border rounded-xl p-3 sm:p-4 cursor-pointer transition ${
                        insideDhaka === "true" ? "border-brand bg-brand/5" : "border-gray-200"
                      }`}
                    >
                      <div className="flex items-center gap-2.5 sm:gap-3">
                        <input
                          type="radio"
                          name="area"
                          value="true"
                          checked={insideDhaka === "true"}
                          onChange={(e) => setInsideDhaka(e.target.value)}
                          className="w-4 h-4 text-brand accent-brand"
                        />
                        <div>
                          <p className="font-semibold text-gray-900 text-xs sm:text-sm">Inside Dhaka</p>
                          <p className="text-[11px] sm:text-xs text-gray-500">Delivery Charge: ৳ 80</p>
                        </div>
                      </div>
                    </label>

                    <label
                      className={`border rounded-xl p-3 sm:p-4 cursor-pointer transition ${
                        insideDhaka === "false" ? "border-brand bg-brand/5" : "border-gray-200"
                      }`}
                    >
                      <div className="flex items-center gap-2.5 sm:gap-3">
                        <input
                          type="radio"
                          name="area"
                          value="false"
                          checked={insideDhaka === "false"}
                          onChange={(e) => setInsideDhaka(e.target.value)}
                          className="w-4 h-4 text-brand accent-brand"
                        />
                        <div>
                          <p className="font-semibold text-gray-900 text-xs sm:text-sm">Outside Dhaka</p>
                          <p className="text-[11px] sm:text-xs text-gray-500">Delivery Charge: ৳ 120</p>
                        </div>
                      </div>
                    </label>
                  </div>
                </div>

                {/* Payment Method Selection */}
                <div>
                  <label className="block text-xs sm:text-sm font-semibold text-gray-700 mb-1.5 pt-1">
                    Payment Method
                  </label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 sm:gap-4">
                    <label
                      className={`border rounded-xl p-3 sm:p-4 cursor-pointer transition ${
                        paymentType === "card" ? "border-brand bg-brand/5" : "border-gray-200"
                      }`}
                    >
                      <div className="flex items-center gap-2.5 sm:gap-3">
                        <input
                          type="radio"
                          name="payment"
                          value="card"
                          checked={paymentType === "card"}
                          onChange={(e) => setPaymentType(e.target.value)}
                          className="w-4 h-4 text-brand accent-brand"
                        />
                        <div>
                          <p className="font-semibold text-gray-900 text-xs sm:text-sm">Online Payment</p>
                          <p className="text-[11px] sm:text-xs text-gray-500">Pay securely via Stripe</p>
                        </div>
                      </div>
                    </label>

                    <label
                      className={`border rounded-xl p-3 sm:p-4 cursor-pointer transition ${
                        paymentType === "cash" ? "border-brand bg-brand/5" : "border-gray-200"
                      }`}
                    >
                      <div className="flex items-center gap-2.5 sm:gap-3">
                        <input
                          type="radio"
                          name="payment"
                          value="cash"
                          checked={paymentType === "cash"}
                          onChange={(e) => setPaymentType(e.target.value)}
                          className="w-4 h-4 text-brand accent-brand"
                        />
                        <div>
                          <p className="font-semibold text-gray-900 text-xs sm:text-sm">Cash on Delivery</p>
                          <p className="text-[11px] sm:text-xs text-gray-500">Pay when you receive it</p>
                        </div>
                      </div>
                    </label>
                  </div>
                </div>

              </form>
            </div>
          </div>

          {/* FINAL ORDER SUMMARY */}
          <div className="w-full lg:w-1/3">
            <div className="bg-white border border-gray-100 rounded-2xl p-4 sm:p-6 shadow-sm lg:sticky lg:top-8">
              <h3 className="text-base sm:text-xl font-bold text-gray-900 mb-4 sm:mb-6 border-b border-gray-100 pb-3 sm:pb-4">
                Your Order
              </h3>

              {/* Items List */}
              <div className="space-y-2.5 mb-4 sm:mb-6 max-h-[220px] sm:max-h-[300px] overflow-y-auto pr-1 sm:pr-2">
                {checkoutItems.map((item, idx) => (
                  <div
                    key={item._id || idx}
                    className="flex justify-between items-center text-xs sm:text-sm border-b border-gray-50 pb-2"
                  >
                    <div className="flex-1 pr-2">
                      <p className="font-semibold text-gray-800 line-clamp-1">
                        {item.product?.title || item.title || "Product"}
                      </p>
                      <p className="text-gray-500 text-[11px] sm:text-xs">Qty: {item.quantity}</p>
                    </div>
                    <span className="font-semibold text-gray-900">
                      ৳ {item.subtotal}
                    </span>
                  </div>
                ))}
              </div>

              {/* Price Calculations */}
              <div className="space-y-2.5 sm:space-y-4 mb-4 sm:mb-6 text-xs sm:text-sm pt-1">
                <div className="flex justify-between text-gray-600">
                  <span>Subtotal</span>
                  <span className="font-semibold text-gray-900">
                    ৳ {subtotal.toFixed(2)}
                  </span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Delivery Charge</span>
                  <span className="font-semibold text-gray-900">
                    ৳ {deliveryCharge.toFixed(2)}
                  </span>
                </div>
              </div>

              <div className="border-t border-gray-100 pt-3 sm:pt-4 mb-4 sm:mb-6">
                <div className="flex justify-between items-center">
                  <span className="text-base sm:text-lg font-bold text-gray-900">Total</span>
                  <span className="text-xl sm:text-2xl font-extrabold text-brand">
                    ৳ {totalAmount.toFixed(2)}
                  </span>
                </div>
              </div>

              {/* Submit CTA */}
              <button
                onClick={handlePlaceOrder}
                disabled={isCheckingOut || isSuccessModalOpen}
                className="w-full bg-brand text-white font-semibold py-3 sm:py-3.5 rounded-xl sm:rounded-2xl text-sm sm:text-base hover:bg-brand/90 transition shadow-md shadow-brand/20 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 active:scale-[0.99]"
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