import React from "react";
import { Link } from "react-router";
import { 
  useGetCartQuery, 
  useUpdateCartMutation, 
  useRemoveFromCartMutation 
} from "../service/api";
import { FiTrash2, FiMinus, FiPlus, FiShoppingBag } from "react-icons/fi";
import { toast } from "react-toastify"; // Optional: for visual feedback

const Cart = () => {
  const { data, isLoading } = useGetCartQuery();
  const [updateCart] = useUpdateCartMutation();
  const [removeFromCart] = useRemoveFromCartMutation();

  const cart = data?.cartData || data;
  const cartItems = cart?.items || [];

  const totalAmount = cartItems.reduce((sum, item) => sum + item.subtotal, 0);

  // Handle Quantity Increase / Decrease
  const handleUpdateQuantity = async (item, newQuantity) => {
    if (newQuantity < 1) return;
    try {
      await updateCart({
        productId: item.product?._id || item.product,
        itemId: item._id,
        quantity: newQuantity,
      }).unwrap();
    } catch (err) {
      console.error("Failed to update quantity:", err);
    }
  };

  // Handle Remove Item
  const handleRemoveItem = async (item) => {
    try {
      await removeFromCart({
        itemId: item._id,
        productId: item.product?._id || item.product,
        sku: item.sku,
      }).unwrap();
    } catch (err) {
      console.error("Failed to remove item:", err);
    }
  };

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
            {cartItems.map((item) => {
              const product = typeof item.product === 'object' ? item.product : {};
              const imageUrl = product.thumbnail || product.images?.[0] || "https://via.placeholder.com/150";
              const originalPrice = product.price || 0;

              return (
                <div
                  key={item._id}
                  className="bg-white flex flex-col sm:flex-row items-center gap-6 border border-gray-100 rounded-2xl p-5 shadow-sm hover:shadow-md transition-shadow"
                >
                  {/* IMAGE */}
                  <Link to={`/shop/${product._id || item.product}`} className="shrink-0">
                    <div className="w-24 h-24 bg-gray-50 border border-gray-100 rounded-xl p-2 flex items-center justify-center">
                      <img
                        src={imageUrl}
                        alt={product.title || "Product"}
                        className="max-w-full max-h-full object-contain mix-blend-multiply"
                      />
                    </div>
                  </Link>

                  {/* PRODUCT DETAILS */}
                  <div className="flex-grow text-center sm:text-left">
                    <Link to={`/shop/${product._id || item.product}`}>
                      <h2 className="text-lg font-semibold text-gray-900 hover:text-brand transition line-clamp-1">
                        {product.title || "Unknown Product"}
                      </h2>
                    </Link>
                    <p className="text-sm text-gray-500 mt-1">
                      SKU: <span className="font-medium">{item.sku}</span>
                    </p>
                    
                    <div className="flex items-center justify-center sm:justify-start gap-3 mt-2">
                      <span className="font-bold text-brand">৳ {item.subtotal / item.quantity}</span>
                      {product.discountPercentage > 0 && (
                        <span className="text-sm text-gray-400 line-through">৳ {originalPrice}</span>
                      )}
                    </div>
                  </div>

                  {/* QUANTITY CONTROLS */}
                  <div className="flex flex-col items-center gap-3">
                    <div className="flex items-center gap-3 bg-gray-50 border border-gray-200 rounded-full px-3 py-1">
                      <button 
                        onClick={() => handleUpdateQuantity(item, item.quantity - 1)}
                        className="w-8 h-8 flex items-center justify-center text-gray-600 hover:text-brand transition cursor-pointer"
                        disabled={item.quantity <= 1}
                      >
                        <FiMinus />
                      </button>
                      <span className="w-6 text-center font-semibold text-gray-900">
                        {item.quantity}
                      </span>
                      <button 
                        onClick={() => handleUpdateQuantity(item, item.quantity + 1)}
                        className="w-8 h-8 flex items-center justify-center text-gray-600 hover:text-brand transition cursor-pointer"
                      >
                        <FiPlus />
                      </button>
                    </div>
                  </div>

                  {/* SUBTOTAL & REMOVE */}
                  <div className="text-center sm:text-right min-w-[100px]">
                    <p className="text-sm text-gray-500 mb-1">Subtotal</p>
                    <p className="font-bold text-lg text-gray-900 mb-3">৳ {item.subtotal}</p>
                    <button 
                      onClick={() => handleRemoveItem(item)}
                      className="text-sm flex items-center justify-center sm:justify-end gap-1 text-red-500 hover:text-red-700 transition w-full cursor-pointer"
                    >
                      <FiTrash2 /> Remove
                    </button>
                  </div>
                </div>
              );
            })}
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

              <button className="w-full bg-brand text-white font-semibold py-4 rounded-xl hover:bg-brand/90 transition shadow-lg shadow-brand/20 flex items-center justify-center gap-2 cursor-pointer">
                Proceed to Checkout
              </button>
              
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