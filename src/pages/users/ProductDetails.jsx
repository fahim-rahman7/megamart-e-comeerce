import React, { useState, useRef, useEffect } from "react";
import Slider from "react-slick";
import { useGetProductDetailsQuery, useAddToCartMutation } from "../../service/api";
import { useParams, useNavigate } from "react-router";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { FiShoppingBag, FiCheck, FiShield, FiTruck, FiRefreshCw, FiZap } from "react-icons/fi";
import ProductDetailsLoading from "../../components/ui/ProductDetailsLoading";

const ProductDetails = () => {
  const sliderRef1 = useRef(null);
  const sliderRef2 = useRef(null);
  const navigate = useNavigate();

  const { id } = useParams();
  const { data, isLoading } = useGetProductDetailsQuery(id);
  const [addToCart, { isLoading: isAddingToCart }] = useAddToCartMutation();

  const [quantity, setQuantity] = useState(1);
  const [zoomStyle, setZoomStyle] = useState({});
  const [selectedVariant, setSelectedVariant] = useState(null);

  // Safely extract product object matching backend response structure
  const product = data?.productDetails || data?.product || data?.data || data;

  // Variants management
  const variants = product?.variants || [];

  // Set default variant when product data loads
  useEffect(() => {
    if (variants.length > 0 && !selectedVariant) {
      setSelectedVariant(variants[0]);
    }
  }, [product, variants]);

  // Dynamic values depending on variant or product fallbacks
  const currentPrice = product?.price || 0;
  const discountPercent = product?.discountPercentage || 0;
  const originalPrice = discountPercent > 0 ? Math.round(currentPrice / (1 - discountPercent / 100)) : currentPrice;

  const currentSku = selectedVariant?.sku || product?.sku || "DEFAULT-SKU";
  
  // Stock check
  const stockLimit = selectedVariant !== null && selectedVariant?.stock !== undefined 
    ? selectedVariant.stock 
    : (product?.stock ?? product?.countInStock ?? 0);

  // Robust image extraction handling arrays and objects
  const rawImages = product?.images || product?.thumbnail;
  let productImages = ["https://via.placeholder.com/600"];

  if (Array.isArray(rawImages) && rawImages.length > 0) {
    productImages = rawImages.map(img => (typeof img === 'string' ? img : img?.url || img?.secure_url));
  } else if (typeof rawImages === 'string') {
    productImages = [rawImages];
  }

  const increaseQty = () => {
    if (quantity < stockLimit) {
      setQuantity((prev) => prev + 1);
    } else {
      toast.info(`Only ${stockLimit} items available in stock`);
    }
  };

  const decreaseQty = () => {
    if (quantity > 1) {
      setQuantity((prev) => prev - 1);
    }
  };

  const handleAddToCart = async () => {
    if (stockLimit < 1) {
      toast.error("This item is out of stock");
      return;
    }

    try {
      const response = await addToCart({
        productId: product?._id || id,
        sku: currentSku,
        quantity,
      }).unwrap();

      toast.success(response?.message || `${quantity} item(s) added to cart!`);
    } catch (err) {
      toast.error(err?.data?.message || "Failed to add product to cart");
    }
  };

  const handleOrderNow = () => {
    if (stockLimit < 1) {
      toast.error("This item is out of stock");
      return;
    }

    const directOrderItem = {
      _id: `direct-${Date.now()}`,
      product: {
        _id: product?._id || id,
        title: product?.title,
        price: currentPrice,
        images: productImages,
      },
      quantity,
      subtotal: currentPrice * quantity,
      sku: currentSku,
      selectedVariant,
    };

    sessionStorage.setItem("directOrderItem", JSON.stringify(directOrderItem));
    navigate("/order", { state: { directOrderItem } });
  };

  const handleMouseMove = (e) => {
    // Enable hover zoom on non-touch devices
    if (window.innerWidth < 768) return;
    const { left, top, width, height } = e.currentTarget.getBoundingClientRect();
    const x = ((e.pageX - left) / width) * 100;
    const y = ((e.pageY - top) / height) * 100;

    setZoomStyle({
      transformOrigin: `${x}% ${y}%`,
      transform: "scale(2)",
    });
  };

  const handleMouseLeave = () => {
    setZoomStyle({
      transform: "scale(1)",
    });
  };

  const mainSettings = {
    dots: false,
    arrows: false,
    infinite: false,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
  };

  const thumbSettings = {
    dots: false,
    arrows: false,
    infinite: false,
    speed: 500,
    slidesToShow: Math.min(productImages.length, 4),
    slidesToScroll: 1,
    swipeToSlide: true,
    focusOnSelect: true,
  };

  if (isLoading) {
    return <ProductDetailsLoading />;
  }

  if (!product) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-4">
        <p className="text-xl text-red-500 font-medium mb-4">Product not found.</p>
        <button onClick={() => navigate("/shop")} className="px-6 py-2 bg-brand text-white rounded-xl">
          Back to Shop
        </button>
      </div>
    );
  }

  return (
    <section className="py-4 sm:py-8 lg:py-12 bg-gray-50 min-h-screen">
      <div className="container mx-auto px-3 sm:px-4">
        <ToastContainer position="bottom-right" />
        
        <div className="bg-white border border-gray-100 rounded-2xl sm:rounded-3xl p-4 sm:p-6 lg:p-10 shadow-sm">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-12 items-start">
            
            {/* ===== IMAGE & SLIDER SECTION ===== */}
            <div className="space-y-3 sm:space-y-4">
              <div className="bg-gray-50 rounded-2xl border border-gray-100 h-[300px] sm:h-[400px] lg:h-[480px] p-2 sm:p-4 flex items-center justify-center overflow-hidden relative">
                <div className="w-full h-full">
                  <Slider
                    {...mainSettings}
                    asNavFor={sliderRef2.current}
                    ref={sliderRef1}
                    className="h-full"
                  >
                    {productImages.map((img, idx) => (
                      <div key={idx} className="outline-none h-[280px] sm:h-[360px] lg:h-[440px] flex items-center justify-center">
                        <div
                          className="w-full h-full flex items-center justify-center cursor-zoom-in overflow-hidden"
                          onMouseMove={handleMouseMove}
                          onMouseLeave={handleMouseLeave}
                        >
                          <img
                            src={img}
                            alt={`${product?.title || 'Product'} ${idx}`}
                            style={zoomStyle}
                            className="max-h-full max-w-full object-contain transition-transform duration-200"
                          />
                        </div>
                      </div>
                    ))}
                  </Slider>
                </div>
              </div>

              {/* Thumbnail Slider */}
              {productImages.length > 1 && (
                <div className="slider-thumbnails">
                  <Slider
                    {...thumbSettings}
                    asNavFor={sliderRef1.current}
                    ref={sliderRef2}
                  >
                    {productImages.map((img, idx) => (
                      <div key={idx} className="px-1 cursor-pointer">
                        <div className="border border-gray-200 bg-gray-50 rounded-xl p-1.5 sm:p-2 h-[60px] sm:h-[80px] flex items-center justify-center hover:border-brand transition-colors">
                          <img
                            src={img}
                            alt={`thumb-${idx}`}
                            className="max-h-full max-w-full object-contain"
                          />
                        </div>
                      </div>
                    ))}
                  </Slider>
                </div>
              )}
            </div>

            {/* ===== PRODUCT INFO SECTION ===== */}
            <div className="flex flex-col h-full mt-2 lg:mt-0">
              
              {/* Category Breadcrumb */}
              {product?.category?.title && (
                <span className="text-[11px] sm:text-xs uppercase tracking-wider font-semibold text-brand bg-brand/10 w-max px-2.5 py-1 rounded-full mb-2 sm:mb-3">
                  {product.category.title}
                </span>
              )}

              <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 capitalize leading-snug">
                {product?.title}
              </h1>

              {/* Price Row */}
              <div className="mt-3 sm:mt-4 flex flex-wrap items-center gap-2.5 sm:gap-4">
                <span className="text-2xl sm:text-3xl font-extrabold text-brand">
                  ৳ {currentPrice.toLocaleString()}
                </span>
                
                {discountPercent > 0 && (
                  <div className="flex items-center gap-2">
                    <span className="text-base sm:text-lg line-through text-gray-400">
                      ৳ {originalPrice.toLocaleString()}
                    </span>
                    <span className="text-xs font-semibold text-green-600 bg-green-50 border border-green-200 px-2 py-0.5 rounded-md">
                      {discountPercent}% OFF
                    </span>
                  </div>
                )}
              </div>

              {/* Stock and SKU Info */}
              <div className="mt-3 sm:mt-4 flex flex-wrap items-center gap-2 sm:gap-4 text-xs sm:text-sm text-gray-600 border-y border-gray-100 py-3">
                <p>
                  Status: 
                  <span className={`font-semibold ml-1.5 ${stockLimit > 0 ? 'text-green-600' : 'text-red-500'}`}>
                    {stockLimit > 0 ? `In Stock (${stockLimit} left)` : "Out of Stock"}
                  </span>
                </p>
                <span className="hidden sm:inline">•</span>
                <p>
                  SKU: <span className="font-semibold text-gray-900">{currentSku}</span>
                </p>
              </div>

              {/* Variants Selector */}
              {variants.length > 0 && (
                <div className="mt-4 sm:mt-6 space-y-2.5">
                  <p className="text-xs sm:text-sm font-semibold text-gray-900">
                    Variant Options:
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {variants.map((v) => {
                      const isSelected = selectedVariant?._id === v._id;
                      return (
                        <button
                          key={v._id}
                          onClick={() => {
                            setSelectedVariant(v);
                            setQuantity(1);
                          }}
                          className={`px-3 py-1.5 sm:px-4 sm:py-2 rounded-xl border text-xs sm:text-sm font-medium transition cursor-pointer flex items-center gap-1.5 ${
                            isSelected 
                              ? 'border-brand bg-brand/5 text-brand shadow-sm font-semibold' 
                              : 'border-gray-200 bg-white text-gray-700 hover:border-gray-300'
                          }`}
                        >
                          {v.size && <span>{v.size}</span>}
                          {v.color && <span className="capitalize">• {v.color}</span>}
                          <span className="text-[10px] sm:text-xs text-gray-400">({v.stock})</span>
                          {isSelected && <FiCheck className="text-brand text-xs sm:text-sm" />}
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Description */}
              <div className="mt-4 sm:mt-6">
                <h3 className="text-xs sm:text-sm font-semibold text-gray-900 mb-1">Description</h3>
                <p className="text-gray-600 text-xs sm:text-sm leading-relaxed">
                  {product?.description || "No description available for this item."}
                </p>
              </div>

              {/* Tags */}
              {product?.tags?.length > 0 && (
                <div className="mt-3 flex flex-wrap gap-1.5">
                  {product.tags.map((tag, idx) => (
                    <span key={idx} className="text-[11px] sm:text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded-md">
                      #{tag}
                    </span>
                  ))}
                </div>
              )}

              {/* Quantity and CTA Buttons */}
              <div className="mt-6 sm:mt-8 pt-5 border-t border-gray-100 flex flex-col gap-3">
                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                  
                  {/* Quantity Control */}
                  <div className="flex items-center justify-between bg-gray-50 border border-gray-200 rounded-xl sm:rounded-2xl px-3 py-1.5 w-full sm:w-auto">
                    <button
                      onClick={decreaseQty}
                      disabled={quantity <= 1 || stockLimit < 1}
                      className="w-8 h-8 flex items-center justify-center rounded-lg bg-white shadow-sm border border-gray-200 disabled:opacity-40 hover:bg-gray-100 transition cursor-pointer font-bold text-sm"
                    >
                      −
                    </button>
                    <span className="w-12 text-center font-bold text-gray-900 text-sm">{quantity}</span>
                    <button
                      onClick={increaseQty}
                      disabled={quantity >= stockLimit || stockLimit < 1}
                      className="w-8 h-8 flex items-center justify-center rounded-lg bg-white shadow-sm border border-gray-200 disabled:opacity-40 hover:bg-gray-100 transition cursor-pointer font-bold text-sm"
                    >
                      +
                    </button>
                  </div>

                  {/* CTA Action Buttons Grid */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 flex-1 w-full">
                    <button
                      onClick={handleAddToCart}
                      disabled={stockLimit < 1 || isAddingToCart}
                      className="py-3 px-4 cursor-pointer bg-brand text-white text-sm font-semibold rounded-xl sm:rounded-2xl hover:bg-brand/90 transition shadow-md shadow-brand/10 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 active:scale-[0.99]"
                    >
                      <FiShoppingBag className="text-base" />
                      {isAddingToCart ? "Adding..." : "Add to Cart"}
                    </button>

                    <button
                      onClick={handleOrderNow}
                      disabled={stockLimit < 1 || isAddingToCart}
                      className="py-3 px-4 cursor-pointer bg-emerald-600 text-white text-sm font-semibold rounded-xl sm:rounded-2xl hover:bg-emerald-700 transition shadow-md shadow-emerald-600/10 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 active:scale-[0.99]"
                    >
                      <FiZap className="text-base" />
                      Order Now
                    </button>
                  </div>
                </div>

                {/* View Cart Quick Link */}
                <button
                  onClick={() => navigate("/cart")}
                  className="w-full py-2.5 sm:py-3 border border-brand/20 bg-brand/5 text-brand text-xs sm:text-sm font-semibold rounded-xl sm:rounded-2xl hover:bg-brand/10 transition text-center cursor-pointer"
                >
                  View Shopping Cart
                </button>
              </div>

              {/* Trust Badges */}
              <div className="grid grid-cols-3 gap-2 sm:gap-4 mt-6 pt-5 border-t border-gray-100 text-center">
                <div className="flex flex-col items-center text-gray-500 text-[11px] sm:text-xs gap-1">
                  <FiTruck className="text-brand text-base sm:text-lg" />
                  <span>Fast Delivery</span>
                </div>
                <div className="flex flex-col items-center text-gray-500 text-[11px] sm:text-xs gap-1">
                  <FiShield className="text-brand text-base sm:text-lg" />
                  <span>Secure Warranty</span>
                </div>
                <div className="flex flex-col items-center text-gray-500 text-[11px] sm:text-xs gap-1">
                  <FiRefreshCw className="text-brand text-base sm:text-lg" />
                  <span>Easy Returns</span>
                </div>
              </div>

            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ProductDetails;