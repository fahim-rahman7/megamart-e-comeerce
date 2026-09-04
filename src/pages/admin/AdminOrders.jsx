import React, { useState } from "react";
import {
  useGetAllOrdersAdminQuery,
  useUpdateOrderStatusMutation,
} from "../../service/api";
import Loading from "../../components/ui/Loading";
import { toast } from "react-toastify";

// --- Inline SVGs for clean UI ---
const SearchIcon = () => (
  <svg className="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
  </svg>
);

const EditIcon = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
  </svg>
);

const XIcon = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
  </svg>
);

const ChevronLeftIcon = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
  </svg>
);

const ChevronRightIcon = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
  </svg>
);

const OrderBagIcon = () => (
  <svg className="w-5 h-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
  </svg>
);

const ALLOWED_STATUSES = [
  "pending",
  "confirmed",
  "shipped",
  "delivered",
  "cancelled",
];

const AdminOrders = () => {
  const [page, setPage] = useState(1);
  const [statusFilter, setStatusFilter] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [newStatus, setNewStatus] = useState("");

  // RTK Query Hooks
  const { data, isLoading, isFetching } = useGetAllOrdersAdminQuery({
    page,
    limit: 10,
    status: statusFilter || undefined,
  });

  const [updateOrderStatus, { isLoading: isUpdating }] =
    useUpdateOrderStatusMutation();

  const ordersList = data?.orders || [];
  const pagination = data?.pagination;

  // Filter local search for immediate UI responsiveness
  const filteredOrders = ordersList.filter((order) => {
    const search = searchTerm.toLowerCase();
    const orderId = order._id?.toLowerCase() || "";
    const customerName = order.user?.fullName?.toLowerCase() || "";
    const customerEmail = order.user?.email?.toLowerCase() || "";
    return orderId.includes(search) || customerName.includes(search) || customerEmail.includes(search);
  });

  // Status Badge Helper with explicit color rings & status dots
  const getStatusBadge = (status = "") => {
    switch (status.toLowerCase()) {
      case "delivered":
        return {
          bg: "bg-emerald-50 text-emerald-700 ring-emerald-600/20",
          dot: "bg-emerald-500",
        };
      case "shipped":
        return {
          bg: "bg-purple-50 text-purple-700 ring-purple-600/20",
          dot: "bg-purple-500",
        };
      case "confirmed":
        return {
          bg: "bg-blue-50 text-blue-700 ring-blue-600/20",
          dot: "bg-blue-500",
        };
      case "pending":
        return {
          bg: "bg-amber-50 text-amber-700 ring-amber-600/20",
          dot: "bg-amber-500",
        };
      case "cancelled":
        return {
          bg: "bg-rose-50 text-rose-700 ring-rose-600/20",
          dot: "bg-rose-500",
        };
      default:
        return {
          bg: "bg-slate-100 text-slate-600 ring-slate-400/20",
          dot: "bg-slate-400",
        };
    }
  };

  // Helper for generating avatar initials
  const getInitials = (name = "G") => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .slice(0, 2)
      .toUpperCase();
  };

  // Modal Handlers
  const handleOpenStatusModal = (order) => {
    setSelectedOrder(order);
    setNewStatus(order.orderStatus || order.status || "pending");
  };

  const handleStatusSubmit = async (e) => {
    e.preventDefault();
    if (!selectedOrder) return;

    try {
      const res = await updateOrderStatus({
        id: selectedOrder._id,
        status: newStatus.toLowerCase(),
      }).unwrap();

      toast.success(res?.message || "Order status updated successfully!");
      setSelectedOrder(null);
    } catch (err) {
      toast.error(err?.data?.message || "Failed to update order status.");
    }
  };

  return (
    <div className="max-w-7xl mx-auto space-y-6 p-4 sm:p-6 lg:p-8 font-sans text-slate-800">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-2">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">Order Management</h1>
          <p className="text-sm text-slate-500 mt-1">
            Track, fulfill, and update fulfillment lifecycle across all transactions.
          </p>
        </div>
      </div>

      {/* Filter Tabs for Quick Status Navigation */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none border-b border-slate-200/80">
        <button
          onClick={() => {
            setStatusFilter("");
            setPage(1);
          }}
          className={`px-3.5 py-2 text-xs font-semibold rounded-xl transition-all whitespace-nowrap ${
            statusFilter === ""
              ? "bg-indigo-600 text-white shadow-sm shadow-indigo-200"
              : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
          }`}
        >
          All Orders
        </button>
        {ALLOWED_STATUSES.map((st) => (
          <button
            key={st}
            onClick={() => {
              setStatusFilter(st);
              setPage(1);
            }}
            className={`px-3.5 py-2 text-xs font-semibold rounded-xl capitalize transition-all whitespace-nowrap ${
              statusFilter === st
                ? "bg-indigo-600 text-white shadow-sm shadow-indigo-200"
                : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
            }`}
          >
            {st}
          </button>
        ))}
      </div>

      {/* Orders Table Container */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden">
        {/* Search & Filter Controls */}
        <div className="p-4 border-b border-slate-100 bg-slate-50/50 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="relative flex-1 max-w-xs">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <SearchIcon />
            </div>
            <input
              type="text"
              placeholder="Search reference or customer..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-3 py-2 text-sm bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all placeholder:text-slate-400"
            />
          </div>

          <div className="flex items-center gap-3 text-xs text-slate-500">
            <span>Filter Status:</span>
            <select
              value={statusFilter}
              onChange={(e) => {
                setStatusFilter(e.target.value);
                setPage(1);
              }}
              className="border border-slate-200 rounded-xl px-3 py-1.5 text-xs font-medium bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 capitalize transition-all"
            >
              <option value="">All Statuses</option>
              {ALLOWED_STATUSES.map((st) => (
                <option key={st} value={st}>
                  {st.charAt(0).toUpperCase() + st.slice(1)}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Table Body */}
        {isLoading || isFetching ? (
          <div className="p-12 flex justify-center items-center">
            <Loading />
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-100 bg-slate-50/70 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                  <th className="py-3.5 px-5">Order Reference</th>
                  <th className="py-3.5 px-5">Customer Details</th>
                  <th className="py-3.5 px-5">Phone</th>
                  <th className="py-3.5 px-5">Date</th>
                  <th className="py-3.5 px-5">Total</th>
                  <th className="py-3.5 px-5">Fulfillment</th>
                  <th className="py-3.5 px-5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-sm">
                {filteredOrders.length === 0 ? (
                  <tr>
                    <td colSpan="7" className="text-center py-12 text-slate-400">
                      <div className="flex flex-col items-center justify-center gap-2">
                        <OrderBagIcon />
                        <p className="text-sm font-medium">No matching orders found.</p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  filteredOrders.map((order) => {
                    const currentStatus = order.orderStatus || order.status || "pending";
                    const badge = getStatusBadge(currentStatus);
                    const userPhone =
                      order.user?.phone ||
                      order.shippingAddress?.phone ||
                      order.phone ||
                      "—";
                    const customerName = order.user?.fullName || "Guest Customer";

                    return (
                      <tr key={order._id} className="hover:bg-slate-50/80 transition-colors group">
                        {/* Reference Badge */}
                        <td className="py-3.5 px-5">
                          <span className="font-mono text-xs font-semibold px-2.5 py-1 rounded-md bg-slate-100 text-slate-700 border border-slate-200/60">
                            #{order._id.slice(-8).toUpperCase()}
                          </span>
                        </td>

                        {/* Customer Avatar & Name */}
                        <td className="py-3.5 px-5">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full bg-indigo-50 text-indigo-700 border border-indigo-100 flex items-center justify-center font-bold text-xs flex-shrink-0">
                              {getInitials(customerName)}
                            </div>
                            <div>
                              <p className="font-semibold text-slate-900 leading-none">
                                {customerName}
                              </p>
                              <p className="text-xs text-slate-400 mt-1">
                                {order.user?.email || "No email on record"}
                              </p>
                            </div>
                          </div>
                        </td>

                        {/* Phone */}
                        <td className="py-3.5 px-5 text-slate-600 font-mono text-xs">
                          {userPhone}
                        </td>

                        {/* Date */}
                        <td className="py-3.5 px-5 text-slate-500 text-xs">
                          {order.createdAt
                            ? new Date(order.createdAt).toLocaleDateString("en-US", {
                                year: "numeric",
                                month: "short",
                                day: "numeric",
                              })
                            : "—"}
                        </td>

                        {/* Price */}
                        <td className="py-3.5 px-5 font-bold text-slate-900">
                          ৳{order.totalPrice?.toFixed(2) || "0.00"}
                        </td>

                        {/* Status Badge */}
                        <td className="py-3.5 px-5">
                          <span
                            className={`inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-semibold rounded-full ring-1 capitalize ${badge.bg}`}
                          >
                            <span className={`w-1.5 h-1.5 rounded-full ${badge.dot}`} />
                            {currentStatus}
                          </span>
                        </td>

                        {/* Action Button */}
                        <td className="py-3.5 px-5 text-right">
                          <button
                            onClick={() => handleOpenStatusModal(order)}
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-600 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
                          >
                            <EditIcon />
                            <span>Update</span>
                          </button>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        )}

        {/* Pagination Bar */}
        {pagination && pagination.totalPages > 1 && (
          <div className="p-4 border-t border-slate-100 bg-slate-50/50 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-500">
            <span>
              Showing Page <strong className="text-slate-800">{pagination.page}</strong> of{" "}
              <strong className="text-slate-800">{pagination.totalPages}</strong> ({pagination.totalOrders} total entries)
            </span>
            <div className="flex items-center gap-2">
              <button
                disabled={pagination.page <= 1}
                onClick={() => setPage((p) => Math.max(p - 1, 1))}
                className="inline-flex items-center gap-1 px-3 py-1.5 border border-slate-200 rounded-xl bg-white font-medium text-slate-700 hover:bg-slate-50 disabled:opacity-40 disabled:hover:bg-white transition-all shadow-2xs"
              >
                <ChevronLeftIcon />
                <span>Previous</span>
              </button>
              <button
                disabled={pagination.page >= pagination.totalPages}
                onClick={() => setPage((p) => p + 1)}
                className="inline-flex items-center gap-1 px-3 py-1.5 border border-slate-200 rounded-xl bg-white font-medium text-slate-700 hover:bg-slate-50 disabled:opacity-40 disabled:hover:bg-white transition-all shadow-2xs"
              >
                <span>Next</span>
                <ChevronRightIcon />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* UPDATE STATUS MODAL */}
      {selectedOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="bg-white w-full max-w-md rounded-2xl shadow-2xl border border-slate-100 overflow-hidden transform transition-all">
            {/* Modal Header */}
            <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
              <h2 className="text-base font-bold text-slate-900">Update Fulfillment Status</h2>
              <button
                onClick={() => setSelectedOrder(null)}
                className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100 transition-colors"
              >
                <XIcon />
              </button>
            </div>

            {/* Modal Body */}
            <form onSubmit={handleStatusSubmit} className="p-6 space-y-5">
              {/* Order Context Card */}
              <div className="bg-slate-50 border border-slate-200/60 rounded-xl p-3.5 space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-xs text-slate-400">Order ID</span>
                  <span className="font-mono text-xs font-bold text-slate-800">
                    #{selectedOrder._id}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-xs text-slate-400">Customer</span>
                  <span className="text-xs font-semibold text-slate-800">
                    {selectedOrder.user?.fullName || "Guest Customer"}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-xs text-slate-400">Total Price</span>
                  <span className="text-xs font-bold text-emerald-600">
                    ৳{selectedOrder.totalPrice?.toFixed(2) || "0.00"}
                  </span>
                </div>
              </div>

              {/* Status Select */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                  Select New Status <span className="text-rose-500">*</span>
                </label>
                <select
                  value={newStatus}
                  onChange={(e) => setNewStatus(e.target.value)}
                  className="w-full border border-slate-200 rounded-xl px-3.5 py-2.5 text-sm text-slate-800 focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 focus:outline-none capitalize transition-all bg-white"
                >
                  {ALLOWED_STATUSES.map((st) => (
                    <option key={st} value={st}>
                      {st.charAt(0).toUpperCase() + st.slice(1)}
                    </option>
                  ))}
                </select>
              </div>

              {/* Actions Footer */}
              <div className="pt-3 border-t border-slate-100 flex justify-end gap-2.5">
                <button
                  type="button"
                  onClick={() => setSelectedOrder(null)}
                  className="px-4 py-2.5 rounded-xl border border-slate-200 text-xs font-semibold text-slate-600 hover:bg-slate-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isUpdating}
                  className="bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white px-5 py-2.5 rounded-xl text-xs font-semibold shadow-xs shadow-indigo-200 transition-colors"
                >
                  {isUpdating ? "Saving Changes..." : "Save Status"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminOrders;