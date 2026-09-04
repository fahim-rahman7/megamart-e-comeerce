import React from "react";
import { useGetDashboardStatsQuery } from "../../service/api";
import Loading from "../../components/ui/Loading";

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

  // Status Badge Helper
  const getStatusBadge = (status) => {
    const styles = {
      pending: "bg-amber-50 text-amber-700 border-amber-200",
      confirmed: "bg-blue-50 text-blue-700 border-blue-200",
      shipped: "bg-indigo-50 text-indigo-700 border-indigo-200",
      delivered: "bg-emerald-50 text-emerald-700 border-emerald-200",
      cancelled: "bg-rose-50 text-rose-700 border-rose-200",
    };
    return (
      <span
        className={`px-2.5 py-1 text-xs rounded-full font-medium capitalize border ${
          styles[status] || "bg-gray-50 text-gray-700 border-gray-200"
        }`}
      >
        {status}
      </span>
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Overview Dashboard</h1>
          <p className="text-sm text-gray-500">Real-time business performance & operations metric overview.</p>
        </div>
      </div>

      {/* 1. Primary Revenue KPIs */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm">
          <p className="text-xs font-semibold uppercase text-gray-500 tracking-wider">Total Revenue</p>
          <h3 className="text-2xl font-black text-gray-900 mt-2">৳{revenue?.total?.toLocaleString() || 0}</h3>
          <p className="text-xs text-emerald-600 font-medium mt-1">All-time non-cancelled revenue</p>
        </div>

        <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm">
          <p className="text-xs font-semibold uppercase text-gray-500 tracking-wider">Today's Revenue</p>
          <h3 className="text-2xl font-black text-gray-900 mt-2">৳{revenue?.today?.toLocaleString() || 0}</h3>
          <p className="text-xs text-blue-600 font-medium mt-1">Earned since 12:00 AM</p>
        </div>

        <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm">
          <p className="text-xs font-semibold uppercase text-gray-500 tracking-wider">Monthly Revenue</p>
          <h3 className="text-2xl font-black text-gray-900 mt-2">৳{revenue?.monthly?.toLocaleString() || 0}</h3>
          <p className="text-xs text-indigo-600 font-medium mt-1">Current calendar month total</p>
        </div>

        <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm">
          <p className="text-xs font-semibold uppercase text-gray-500 tracking-wider">Avg Order Value (AOV)</p>
          <h3 className="text-2xl font-black text-gray-900 mt-2">৳{revenue?.averageOrderValue?.toLocaleString() || 0}</h3>
          <p className="text-xs text-violet-600 font-medium mt-1">Average spent per valid order</p>
        </div>
      </div>

      {/* 2. Secondary Inventory & Fulfillment Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs text-gray-500 font-medium">Action Required</p>
            <h4 className="text-xl font-bold text-amber-600">{orders?.pending || 0} Pending</h4>
          </div>
          <span className="w-10 h-10 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center font-bold">!</span>
        </div>

        <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs text-gray-500 font-medium">Stock Alerts</p>
            <h4 className="text-xl font-bold text-rose-600">{analytics?.lowStockVariants || 0} Low Stock</h4>
          </div>
          <span className="w-10 h-10 rounded-lg bg-rose-50 text-rose-600 flex items-center justify-center font-bold">⚠</span>
        </div>

        <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs text-gray-500 font-medium">Active Catalog</p>
            <h4 className="text-xl font-bold text-gray-800">{analytics?.totalActiveProducts || 0} Products</h4>
          </div>
          <span className="w-10 h-10 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center font-bold">📦</span>
        </div>

        <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs text-gray-500 font-medium">Customer Base</p>
            <h4 className="text-xl font-bold text-gray-800">{analytics?.totalUsers || 0} Registered</h4>
          </div>
          <span className="w-10 h-10 rounded-lg bg-violet-50 text-violet-600 flex items-center justify-center font-bold">👥</span>
        </div>
      </div>

      {/* 3. Middle Section: Pipeline & Regional Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Fulfillment Pipeline */}
        <div className="lg:col-span-2 bg-white rounded-xl border border-gray-200 shadow-sm p-5">
          <h2 className="text-base font-bold text-gray-900 mb-4">Fulfillment Pipeline Status</h2>
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 text-center">
            <div className="p-3 bg-amber-50/50 rounded-lg border border-amber-100">
              <span className="block text-lg font-bold text-amber-700">{orders?.pending || 0}</span>
              <span className="text-xs text-amber-800 font-medium">Pending</span>
            </div>
            <div className="p-3 bg-blue-50/50 rounded-lg border border-blue-100">
              <span className="block text-lg font-bold text-blue-700">{orders?.confirmed || 0}</span>
              <span className="text-xs text-blue-800 font-medium">Confirmed</span>
            </div>
            <div className="p-3 bg-indigo-50/50 rounded-lg border border-indigo-100">
              <span className="block text-lg font-bold text-indigo-700">{orders?.shipped || 0}</span>
              <span className="text-xs text-indigo-800 font-medium">Shipped</span>
            </div>
            <div className="p-3 bg-emerald-50/50 rounded-lg border border-emerald-100">
              <span className="block text-lg font-bold text-emerald-700">{orders?.delivered || 0}</span>
              <span className="text-xs text-emerald-800 font-medium">Delivered</span>
            </div>
            <div className="p-3 bg-rose-50/50 rounded-lg border border-rose-100">
              <span className="block text-lg font-bold text-rose-700">{orders?.cancelled || 0}</span>
              <span className="text-xs text-rose-800 font-medium">Cancelled</span>
            </div>
          </div>
        </div>

        {/* Regional Sales */}
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-5 flex flex-col justify-between">
          <h2 className="text-base font-bold text-gray-900 mb-3">Regional Sales Split</h2>
          <div className="space-y-4">
            <div>
              <div className="flex justify-between text-xs font-semibold text-gray-600 mb-1">
                <span>Inside Dhaka</span>
                <span>৳{regionalSales?.insideDhaka?.revenue?.toLocaleString() || 0} ({regionalSales?.insideDhaka?.orders || 0} orders)</span>
              </div>
              <div className="w-full bg-gray-100 rounded-full h-2">
                <div 
                  className="bg-emerald-500 h-2 rounded-full" 
                  style={{ 
                    width: `${revenue?.total ? Math.min(100, (regionalSales?.insideDhaka?.revenue / revenue.total) * 100) : 0}%` 
                  }}
                />
              </div>
            </div>

            <div>
              <div className="flex justify-between text-xs font-semibold text-gray-600 mb-1">
                <span>Outside Dhaka</span>
                <span>৳{regionalSales?.outsideDhaka?.revenue?.toLocaleString() || 0} ({regionalSales?.outsideDhaka?.orders || 0} orders)</span>
              </div>
              <div className="w-full bg-gray-100 rounded-full h-2">
                <div 
                  className="bg-blue-500 h-2 rounded-full" 
                  style={{ 
                    width: `${revenue?.total ? Math.min(100, (regionalSales?.outsideDhaka?.revenue / revenue.total) * 100) : 0}%` 
                  }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 4. Bottom Grid: Recent Orders & Top Selling Products */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Orders Table */}
        <div className="lg:col-span-2 bg-white rounded-xl border border-gray-200 shadow-sm p-5">
          <h2 className="text-base font-bold text-gray-900 mb-4">Recent Orders</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-gray-200 text-xs font-semibold text-gray-500 uppercase">
                  <th className="py-2.5 px-3">Customer</th>
                  <th className="py-2.5 px-3">Amount</th>
                  <th className="py-2.5 px-3">Status</th>
                  <th className="py-2.5 px-3">Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 text-sm">
                {recentOrders?.length > 0 ? (
                  recentOrders.map((order) => (
                    <tr key={order._id} className="hover:bg-gray-50/80">
                      <td className="py-3 px-3">
                        <p className="font-medium text-gray-900">{order.user?.fullName || "Guest Customer"}</p>
                        <p className="text-xs text-gray-500">{order.user?.email || "N/A"}</p>
                      </td>
                      <td className="py-3 px-3 font-semibold text-gray-900">
                        ৳{order.totalPrice?.toLocaleString()}
                      </td>
                      <td className="py-3 px-3">{getStatusBadge(order.status)}</td>
                      <td className="py-3 px-3 text-xs text-gray-500">
                        {new Date(order.createdAt).toLocaleDateString()}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="4" className="py-6 text-center text-gray-500 text-sm">
                      No orders found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Top Selling Products List */}
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-5">
          <h2 className="text-base font-bold text-gray-900 mb-4">Top Revenue Drivers</h2>
          <div className="space-y-4">
            {topSellingProducts?.length > 0 ? (
              topSellingProducts.map((prod) => (
                <div key={prod._id} className="flex items-center justify-between border-b border-gray-100 pb-3 last:border-0 last:pb-0">
                  <div className="flex items-center gap-3">
                    <img 
                      src={prod.thumbnail} 
                      alt={prod.title} 
                      className="w-10 h-10 rounded-lg object-cover border border-gray-200" 
                    />
                    <div>
                      <p className="text-xs font-semibold text-gray-900 line-clamp-1">{prod.title}</p>
                      <p className="text-xs text-gray-500">{prod.totalQuantitySold} units sold</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-xs font-bold text-emerald-600">৳{prod.totalRevenue?.toLocaleString()}</p>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-center text-xs text-gray-500 py-6">No sales data available yet.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;