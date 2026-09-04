import React from "react";
import { useGetDashboardStatsQuery } from "../../service/api";
import Loading from "../../components/ui/Loading";
import {
  FiDollarSign,
  FiShoppingBag,
  FiTrendingUp,
  FiActivity,
  FiAlertTriangle,
  FiBox,
  FiUsers,
  FiClock,
  FiMapPin,
  FiChevronRight,
} from "react-icons/fi";
import { Link } from "react-router";

const Dashboard = () => {
  const { data, isLoading } = useGetDashboardStatsQuery();

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loading />
      </div>
    );
  }

  const { analytics, topSellingProducts, recentOrders } = data || {};
  const { revenue, orders, regionalSales } = analytics || {};

  const getStatusBadge = (status) => {
    const styles = {
      pending: "bg-amber-50 text-amber-700 border-amber-200/60",
      confirmed: "bg-blue-50 text-blue-700 border-blue-200/60",
      shipped: "bg-indigo-50 text-indigo-700 border-indigo-200/60",
      delivered: "bg-emerald-50 text-emerald-700 border-emerald-200/60",
      cancelled: "bg-rose-50 text-rose-700 border-rose-200/60",
    };
    return (
      <span
        className={`px-2.5 py-0.5 text-[11px] rounded-full font-bold uppercase tracking-wider border ${
          styles[status] || "bg-gray-50 text-gray-700 border-gray-200"
        }`}
      >
        {status}
      </span>
    );
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2">
        <div>
          <h1 className="text-xl font-bold text-gray-900 tracking-tight">
            Dashboard Overview
          </h1>
          <p className="text-xs text-primary mt-0.5">
            Monitor real-time revenue performance and operations metric.
          </p>
        </div>
      </div>

      {/* 1. Primary Financial KPIs */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-gray-200/80 shadow-xs hover:border-brand/40 transition-all">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase text-primary tracking-wider">
              Total Revenue
            </span>
            <div className="w-9 h-9 rounded-xl bg-brand/10 text-brand flex items-center justify-center text-lg font-bold">
              <FiDollarSign />
            </div>
          </div>
          <h3 className="text-2xl font-black text-gray-900 mt-3">
            ৳{revenue?.total?.toLocaleString() || 0}
          </h3>
          <p className="text-[11px] text-emerald-600 font-medium mt-1 flex items-center gap-1">
            <FiTrendingUp /> All-time valid earnings
          </p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-gray-200/80 shadow-xs hover:border-brand/40 transition-all">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase text-primary tracking-wider">
              Today's Revenue
            </span>
            <div className="w-9 h-9 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center text-lg font-bold">
              <FiClock />
            </div>
          </div>
          <h3 className="text-2xl font-black text-gray-900 mt-3">
            ৳{revenue?.today?.toLocaleString() || 0}
          </h3>
          <p className="text-[11px] text-blue-600 font-medium mt-1">
            Earned since 12:00 AM
          </p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-gray-200/80 shadow-xs hover:border-brand/40 transition-all">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase text-primary tracking-wider">
              Monthly Revenue
            </span>
            <div className="w-9 h-9 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center text-lg font-bold">
              <FiActivity />
            </div>
          </div>
          <h3 className="text-2xl font-black text-gray-900 mt-3">
            ৳{revenue?.monthly?.toLocaleString() || 0}
          </h3>
          <p className="text-[11px] text-indigo-600 font-medium mt-1">
            Current calendar month
          </p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-gray-200/80 shadow-xs hover:border-brand/40 transition-all">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase text-primary tracking-wider">
              Avg Order Value
            </span>
            <div className="w-9 h-9 rounded-xl bg-violet-50 text-violet-600 flex items-center justify-center text-lg font-bold">
              <FiShoppingBag />
            </div>
          </div>
          <h3 className="text-2xl font-black text-gray-900 mt-3">
            ৳{revenue?.averageOrderValue?.toLocaleString() || 0}
          </h3>
          <p className="text-[11px] text-violet-600 font-medium mt-1">
            Average per fulfilled order
          </p>
        </div>
      </div>

      {/* 2. Operations & Inventory Status */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-xl border border-gray-200/80 shadow-xs flex items-center justify-between">
          <div>
            <p className="text-xs text-primary font-medium">Action Required</p>
            <h4 className="text-lg font-bold text-amber-600 mt-0.5">
              {orders?.pending || 0} Orders
            </h4>
          </div>
          <div className="w-9 h-9 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center text-base font-bold">
            <FiClock />
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-gray-200/80 shadow-xs flex items-center justify-between">
          <div>
            <p className="text-xs text-primary font-medium">Stock Alerts</p>
            <h4 className="text-lg font-bold text-rose-600 mt-0.5">
              {analytics?.lowStockVariants || 0} Low Items
            </h4>
          </div>
          <div className="w-9 h-9 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center text-base font-bold">
            <FiAlertTriangle />
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-gray-200/80 shadow-xs flex items-center justify-between">
          <div>
            <p className="text-xs text-primary font-medium">Active Catalog</p>
            <h4 className="text-lg font-bold text-gray-900 mt-0.5">
              {analytics?.totalActiveProducts || 0} Products
            </h4>
          </div>
          <div className="w-9 h-9 rounded-xl bg-brand/10 text-brand flex items-center justify-center text-base font-bold">
            <FiBox />
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-gray-200/80 shadow-xs flex items-center justify-between">
          <div>
            <p className="text-xs text-primary font-medium">Customer Base</p>
            <h4 className="text-lg font-bold text-gray-900 mt-0.5">
              {analytics?.totalUsers || 0} Registered
            </h4>
          </div>
          <div className="w-9 h-9 rounded-xl bg-violet-50 text-violet-600 flex items-center justify-center text-base font-bold">
            <FiUsers />
          </div>
        </div>
      </div>

      {/* 3. Pipeline & Regional Sales */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Pipeline Status */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-gray-200/80 shadow-xs p-5">
          <h2 className="text-sm font-bold text-gray-900 mb-4 uppercase tracking-wider text-xs text-primary">
            Order Fulfillment Breakdown
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 text-center">
            <div className="p-3 bg-amber-50/60 rounded-xl border border-amber-100">
              <span className="block text-xl font-black text-amber-700">
                {orders?.pending || 0}
              </span>
              <span className="text-xs text-amber-800 font-semibold">Pending</span>
            </div>
            <div className="p-3 bg-blue-50/60 rounded-xl border border-blue-100">
              <span className="block text-xl font-black text-blue-700">
                {orders?.confirmed || 0}
              </span>
              <span className="text-xs text-blue-800 font-semibold">Confirmed</span>
            </div>
            <div className="p-3 bg-indigo-50/60 rounded-xl border border-indigo-100">
              <span className="block text-xl font-black text-indigo-700">
                {orders?.shipped || 0}
              </span>
              <span className="text-xs text-indigo-800 font-semibold">Shipped</span>
            </div>
            <div className="p-3 bg-emerald-50/60 rounded-xl border border-emerald-100">
              <span className="block text-xl font-black text-emerald-700">
                {orders?.delivered || 0}
              </span>
              <span className="text-xs text-emerald-800 font-semibold">Delivered</span>
            </div>
            <div className="p-3 bg-rose-50/60 rounded-xl border border-rose-100">
              <span className="block text-xl font-black text-rose-700">
                {orders?.cancelled || 0}
              </span>
              <span className="text-xs text-rose-800 font-semibold">Cancelled</span>
            </div>
          </div>
        </div>

        {/* Regional Sales Breakdown */}
        <div className="bg-white rounded-2xl border border-gray-200/80 shadow-xs p-5 flex flex-col justify-between">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xs font-bold uppercase tracking-wider text-primary">
              Regional Sales Split
            </h2>
            <FiMapPin className="text-brand text-base" />
          </div>
          <div className="space-y-4">
            <div>
              <div className="flex justify-between text-xs font-semibold text-gray-800 mb-1.5">
                <span>Inside Dhaka</span>
                <span>
                  ৳{regionalSales?.insideDhaka?.revenue?.toLocaleString() || 0} (
                  {regionalSales?.insideDhaka?.orders || 0})
                </span>
              </div>
              <div className="w-full bg-gray-100 rounded-full h-2 overflow-hidden">
                <div
                  className="bg-brand h-2 rounded-full transition-all duration-500"
                  style={{
                    width: `${
                      revenue?.total
                        ? Math.min(
                            100,
                            (regionalSales?.insideDhaka?.revenue / revenue.total) *
                              100
                          )
                        : 0
                    }%`,
                  }}
                />
              </div>
            </div>

            <div>
              <div className="flex justify-between text-xs font-semibold text-gray-800 mb-1.5">
                <span>Outside Dhaka</span>
                <span>
                  ৳{regionalSales?.outsideDhaka?.revenue?.toLocaleString() || 0} (
                  {regionalSales?.outsideDhaka?.orders || 0})
                </span>
              </div>
              <div className="w-full bg-gray-100 rounded-full h-2 overflow-hidden">
                <div
                  className="bg-emerald-500 h-2 rounded-full transition-all duration-500"
                  style={{
                    width: `${
                      revenue?.total
                        ? Math.min(
                            100,
                            (regionalSales?.outsideDhaka?.revenue /
                              revenue.total) *
                              100
                          )
                        : 0
                    }%`,
                  }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 4. Bottom Section: Recent Orders & Top Selling Products */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Orders */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-gray-200/80 shadow-xs p-5">
          <div className="flex items-center justify-between mb-4 pb-2 border-b border-gray-100">
            <h2 className="text-sm font-bold text-gray-900">Recent Orders</h2>
            <Link
              to="/admin/orders"
              className="text-xs font-bold text-brand hover:underline flex items-center gap-0.5"
            >
              View All <FiChevronRight />
            </Link>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-gray-100 text-[11px] font-bold text-primary uppercase tracking-wider">
                  <th className="pb-3 px-2">Customer</th>
                  <th className="pb-3 px-2">Amount</th>
                  <th className="pb-3 px-2">Status</th>
                  <th className="pb-3 px-2">Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 text-xs">
                {recentOrders?.length > 0 ? (
                  recentOrders.map((order) => (
                    <tr key={order._id} className="hover:bg-gray-50/80 transition">
                      <td className="py-3 px-2">
                        <p className="font-semibold text-gray-900">
                          {order.user?.fullName || "Guest Customer"}
                        </p>
                        <p className="text-[11px] text-primary">
                          {order.user?.email || "N/A"}
                        </p>
                      </td>
                      <td className="py-3 px-2 font-bold text-gray-900">
                        ৳{order.totalPrice?.toLocaleString()}
                      </td>
                      <td className="py-3 px-2">
                        {getStatusBadge(order.status)}
                      </td>
                      <td className="py-3 px-2 text-primary font-medium">
                        {new Date(order.createdAt).toLocaleDateString()}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td
                      colSpan="4"
                      className="py-8 text-center text-primary text-xs"
                    >
                      No recent orders recorded.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Top Selling Products */}
        <div className="bg-white rounded-2xl border border-gray-200/80 shadow-xs p-5">
          <div className="flex items-center justify-between mb-4 pb-2 border-b border-gray-100">
            <h2 className="text-sm font-bold text-gray-900">Top Revenue Drivers</h2>
            <Link
              to="/admin/products"
              className="text-xs font-bold text-brand hover:underline flex items-center gap-0.5"
            >
              Catalog <FiChevronRight />
            </Link>
          </div>
          <div className="space-y-3.5">
            {topSellingProducts?.length > 0 ? (
              topSellingProducts.map((prod) => (
                <div
                  key={prod._id}
                  className="flex items-center justify-between border-b border-gray-100 pb-3 last:border-0 last:pb-0"
                >
                  <div className="flex items-center gap-3">
                    <img
                      src={prod.thumbnail}
                      alt={prod.title}
                      className="w-10 h-10 rounded-xl object-cover border border-gray-200 shrink-0"
                    />
                    <div>
                      <p className="text-xs font-bold text-gray-900 line-clamp-1">
                        {prod.title}
                      </p>
                      <p className="text-[11px] text-primary">
                        {prod.totalQuantitySold} units sold
                      </p>
                    </div>
                  </div>
                  <div className="text-right shrink-0">
                    <p className="text-xs font-black text-brand">
                      ৳{prod.totalRevenue?.toLocaleString()}
                    </p>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-center text-xs text-primary py-8">
                No top-selling products yet.
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;