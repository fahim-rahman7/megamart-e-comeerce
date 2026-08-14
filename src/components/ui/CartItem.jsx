import React, { useState, useEffect } from "react";
import { Link } from "react-router"; // or "react-router-dom"
import { FiMinus, FiPlus, FiTrash2 } from "react-icons/fi";
import { useUpdateCartMutation, useRemoveFromCartMutation } from "../../service/api";

const CartItem = ({ item }) => {
  const [updateCart] = useUpdateCartMutation();
  const [removeFromCart] = useRemoveFromCartMutation();

  const product = typeof item.product === "object" ? item.product : {};
  const imageUrl = product.thumbnail || product.images?.[0] || "https://via.placeholder.com/150";
  const originalPrice = product.price || 0;
  
  // Calculate unit price so we can update the subtotal visually instantly
  const unitPrice = item.subtotal / item.quantity;

  // 1. LOCAL STATE: This ensures the UI updates instantly with zero lag.
  const [localQuantity, setLocalQuantity] = useState(item.quantity);

  // Sync local state if the global server state changes (e.g., initial load)
  useEffect(() => {
    setLocalQuantity(item.quantity);
  }, [item.quantity]);

  // 2. THE DEBOUNCE LOGIC
  useEffect(() => {
    // Prevent firing an API call on the initial render or if the quantity hasn't changed
    if (localQuantity === item.quantity) return;

    // Set a timer to fire the API call after 500ms of inactivity
    const debounceTimer = setTimeout(() => {
      updateCart({
        productId: product._id || item.product,
        itemId: item._id,
        quantity: localQuantity,
      }).catch((err) => console.error("Failed to update cart:", err));
    }, 500); // 500ms delay

    // Cleanup: If the user clicks again before 500ms, this clears the old timer
    return () => clearTimeout(debounceTimer);
  }, [localQuantity, item.quantity, item._id, product._id, updateCart]);

  // Instant local click handlers
  const handleIncrease = () => setLocalQuantity((prev) => prev + 1);
  const handleDecrease = () => setLocalQuantity((prev) => (prev > 1 ? prev - 1 : 1));

  const handleRemoveItem = async () => {
    try {
      await removeFromCart({
        itemId: item._id,
        productId: product._id || item.product,
        sku: item.sku,
      }).unwrap();
    } catch (err) {
      console.error("Failed to remove item:", err);
    }
  };

  // Calculate optimistic subtotal for the UI
  const optimisticSubtotal = localQuantity * unitPrice;

  return (
    <div className="bg-white flex flex-col sm:flex-row items-center gap-6 border border-gray-100 rounded-2xl p-5 shadow-sm hover:shadow-md transition-shadow">
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
          <span className="font-bold text-brand">৳ {unitPrice}</span>
          {product.discountPercentage > 0 && (
            <span className="text-sm text-gray-400 line-through">৳ {originalPrice}</span>
          )}
        </div>
      </div>

      {/* QUANTITY CONTROLS */}
      <div className="flex flex-col items-center gap-3">
        <div className="flex items-center gap-3 bg-gray-50 border border-gray-200 rounded-full px-3 py-1">
          <button
            onClick={handleDecrease}
            className="w-8 h-8 flex items-center justify-center text-gray-600 hover:text-brand transition cursor-pointer disabled:opacity-50"
            disabled={localQuantity <= 1}
          >
            <FiMinus />
          </button>
          <span className="w-6 text-center font-semibold text-gray-900">
            {localQuantity}
          </span>
          <button
            onClick={handleIncrease}
            className="w-8 h-8 flex items-center justify-center text-gray-600 hover:text-brand transition cursor-pointer"
          >
            <FiPlus />
          </button>
        </div>
      </div>

      {/* SUBTOTAL & REMOVE */}
      <div className="text-center sm:text-right min-w-[100px]">
        <p className="text-sm text-gray-500 mb-1">Subtotal</p>
        <p className="font-bold text-lg text-gray-900 mb-3">
          ৳ {optimisticSubtotal.toFixed(2)}
        </p>
        <button
          onClick={handleRemoveItem}
          className="text-sm flex items-center justify-center sm:justify-end gap-1 text-red-500 hover:text-red-700 transition w-full cursor-pointer"
        >
          <FiTrash2 /> Remove
        </button>
      </div>
    </div>
  );
};

export default CartItem;