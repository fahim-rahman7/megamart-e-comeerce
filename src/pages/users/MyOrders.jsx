import React from "react";
import { Link } from "react-router"; // or "react-router-dom"
import { useGetMyOrdersQuery } from "../../service/api";
import Loader from "../../components/ui/LoadAnime";
import { 
  FiArrowLeft, FiPackage, FiMapPin, FiCreditCard, 
  FiCalendar, FiClock, FiCheckCircle, FiTruck, FiXCircle
} from "react-icons/fi";

const MyOrders = () => {
  const { data: ordersRes, isLoading, error } = useGetMyOrdersQuery();
  const orders = ordersRes?.data || ordersRes || [];

  if (isLoading) return <Loader />;

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4">
        <p className="text-red-500 font-semibold mb-4">Failed to load orders.</p>
        <Link to="/profile" className="text-brand hover:underline flex items-center gap-2">
          <FiArrowLeft /> Back to Profile
        </Link>
      </div>
    );
  }

  // Helpers for Status Styling
  const getOrderStatusUI = (status) => {
    switch (status) {
      case "pending": return { color: "bg-yellow-100 text-yellow-700", icon: <FiClock /> };
      case "confirmed": return { color: "bg-blue-100 text-blue-700", icon: <FiCheckCircle /> };
      case "shipped": return { color: "bg-indigo-100 text-indigo-700", icon: <FiTruck /> };
      case "delivered": return { color: "bg-green-100 text-green-700", icon: <FiPackage /> };
      case "cancelled": return { color: "bg-red-100 text-red-700", icon: <FiXCircle /> };
      default: return { color: "bg-gray-100 text-gray-700", icon: <FiPackage /> };
    }
  };

  const getPaymentStatusColor = (status) => {
    switch (status) {
      case "paid": return "text-green-600 bg-green-50";
      case "failed": return "text-red-600 bg-red-50";
      default: return "text-yellow-600 bg-yellow-50";
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-10">
      <div className="container max-w-4xl mx-auto px-4 space-y-6">
        
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <Link to="/profile" className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-brand transition mb-2 font-medium">
              <FiArrowLeft /> Back to Profile
            </Link>
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Order History</h1>
          </div>
          <div className="bg-white px-4 py-2 rounded-xl shadow-sm border border-gray-100">
            <span className="text-sm font-semibold text-gray-500">Total Orders:</span>
            <span className="ml-2 text-lg font-bold text-brand">{orders.length}</span>
          </div>
        </div>

        {/* Empty State */}
        {orders.length === 0 && (
          <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-12 text-center flex flex-col items-center">
            <div className="w-20 h-20 bg-gray-50 text-gray-300 rounded-full flex items-center justify-center text-4xl mb-4">
              <FiPackage />
            </div>
            <h2 className="text-xl font-bold text-gray-900 mb-2">No Orders Found</h2>
            <p className="text-gray-500 mb-6">Looks like you haven't placed any orders yet.</p>
            <Link to="/shop" className="px-6 py-3 bg-brand text-white font-semibold rounded-xl hover:bg-brand/90 transition shadow-md shadow-brand/20">
              Start Shopping
            </Link>
          </div>
        )}

        {/* Orders List */}
        <div className="space-y-6">
          {orders.map((order) => {
            const statusUI = getOrderStatusUI(order.status);
            
            return (
              <div key={order._id} className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                
                {/* --- Order Header --- */}
                <div className="bg-gray-50/50 border-b border-gray-100 p-4 sm:p-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                  <div>
                    <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">
                      Order Number
                    </p>
                    <p className="text-base font-bold text-gray-900">#{order.orderNumber || order._id.slice(-8)}</p>
                  </div>
                  
                  <div className="flex items-center gap-4 w-full sm:w-auto justify-between sm:justify-end">
                    <div className="text-left sm:text-right">
                      <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-1 flex items-center gap-1 sm:justify-end">
                        <FiCalendar /> Placed On
                      </p>
                      <p className="text-sm font-medium text-gray-900">
                        {new Date(order.createdAt).toLocaleDateString("en-US", {
                          year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute:'2-digit'
                        })}
                      </p>
                    </div>
                    
                    <div className={`px-3 py-1.5 rounded-full flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider ${statusUI.color}`}>
                      {statusUI.icon} {order.status}
                    </div>
                  </div>
                </div>

                <div className="p-4 sm:p-6 grid md:grid-cols-3 gap-6">
                  
                  {/* --- Items List (Left / Main Column) --- */}
                  <div className="md:col-span-2 space-y-4">
                    <h3 className="text-sm font-bold text-gray-900 border-b border-gray-100 pb-2">Items in this order</h3>
                    
                    <div className="space-y-3">
                      {order.items?.map((item) => (
                        <div key={item._id} className="flex gap-4 p-3 rounded-xl border border-gray-50 hover:bg-gray-50 transition">
                          {/* Fallback image if product population fails or thumbnail is missing */}
                          <div className="w-16 h-16 sm:w-20 sm:h-20 flex-shrink-0 bg-white rounded-lg border border-gray-100 overflow-hidden">
                            <img 
                              src={item.product?.thumbnail || "https://placehold.co/100x100?text=No+Image"} 
                              alt={item.product?.title || "Product"} 
                              className="w-full h-full object-cover"
                            />
                          </div>
                          
                          <div className="flex-grow flex flex-col justify-between">
                            <div>
                              <p className="text-sm sm:text-base font-semibold text-gray-900 line-clamp-2">
                                {item.product?.title || "Product Unavailable"}
                              </p>
                              <p className="text-xs text-gray-500 mt-1">SKU: {item.sku}</p>
                            </div>
                            <div className="flex justify-between items-center mt-2">
                              <p className="text-xs font-medium bg-gray-100 px-2 py-1 rounded text-gray-600">
                                Qty: {item.quantity}
                              </p>
                              <p className="text-sm font-bold text-gray-900">
                                ৳ {item.subtotal.toFixed(2)}
                              </p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* --- Order Details Sidebar (Right Column) --- */}
                  <div className="bg-gray-50/50 rounded-xl p-4 border border-gray-100 space-y-5">
                    
                    {/* Payment Info */}
                    <div>
                      <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                        <FiCreditCard /> Payment Details
                      </h3>
                      <p className="text-sm text-gray-900 font-medium capitalize mb-1">
                        Method: {order.payment?.method || 'N/A'}
                      </p>
                      <span className={`inline-flex px-2 py-0.5 rounded text-xs font-bold uppercase tracking-wider ${getPaymentStatusColor(order.payment?.status)}`}>
                        {order.payment?.status || 'Pending'}
                      </span>
                    </div>

                    {/* Shipping Info */}
                    <div>
                      <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                        <FiMapPin /> Shipping Info
                      </h3>
                      <p className="text-sm text-gray-800 leading-relaxed bg-white p-2 rounded-lg border border-gray-100">
                        {order.shippingAddress}
                      </p>
                    </div>

                    {/* Cost Summary */}
                    <div className="pt-3 border-t border-gray-200">
                      <div className="flex justify-between text-sm mb-2 text-gray-500">
                        <span>Subtotal</span>
                        <span>৳ {(order.totalPrice - order.deliveryCharge).toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between text-sm mb-3 text-gray-500">
                        <span>Delivery Fee {order.insideDhaka ? "(Inside Dhaka)" : "(Outside Dhaka)"}</span>
                        <span>৳ {order.deliveryCharge.toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between text-base font-bold text-gray-900 pt-3 border-t border-gray-200">
                        <span>Total</span>
                        <span className="text-brand">৳ {order.totalPrice.toFixed(2)}</span>
                      </div>
                    </div>

                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default MyOrders;