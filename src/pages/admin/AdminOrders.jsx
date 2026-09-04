import React, { useState } from "react";
import {
  useGetAllOrdersAdminQuery,
  useUpdateOrderStatusMutation,
} from "../../service/api";
import Loading from "../../components/ui/Loading";
import { toast } from "react-toastify";

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

  // Status Badge Styling Helper
  const getStatusBadge = (status = "") => {
    switch (status.toLowerCase()) {
      case "delivered":
        return "bg-green-100 text-green-700 border-green-200";
      case "shipped":
        return "bg-purple-100 text-purple-700 border-purple-200";
      case "confirmed":
        return "bg-blue-100 text-blue-700 border-blue-200";
      case "pending":
        return "bg-amber-100 text-amber-700 border-amber-200";
      case "cancelled":
        return "bg-red-100 text-red-700 border-red-200";
      default:
        return "bg-gray-100 text-gray-600 border-gray-200";
    }
  };

  // Open Status Modal
  const handleOpenStatusModal = (order) => {
    setSelectedOrder(order);
    setNewStatus(order.orderStatus || order.status || "pending");
  };

  // Submit Updated Status
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
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Order Management</h1>
          <p className="text-sm text-gray-500">
            Track, fulfill, and modify global customer purchases
          </p>
        </div>

        {/* Filter by Status */}
        <div className="flex items-center gap-2">
          <label className="text-xs font-semibold text-gray-600 uppercase">
            Filter Status:
          </label>
          <select
            value={statusFilter}
            onChange={(e) => {
              setStatusFilter(e.target.value);
              setPage(1);
            }}
            className="border border-gray-300 rounded-lg px-3 py-1.5 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
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

      {/* Orders Table Container */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        {isLoading || isFetching ? (
          <div className="p-8 flex justify-center">
            <Loading />
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead className="bg-gray-50 border-b border-gray-200 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                <tr>
                  <th className="py-3 px-4">Order Reference</th>
                  <th className="py-3 px-4">Customer</th>
                  <th className="py-3 px-4">Phone No</th>
                  <th className="py-3 px-4">Date</th>
                  <th className="py-3 px-4">Total Amount</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 text-sm">
                {ordersList.length === 0 ? (
                  <tr>
                    <td colSpan="7" className="text-center py-6 text-gray-500">
                      No orders found.
                    </td>
                  </tr>
                ) : (
                  ordersList.map((order) => {
                    const currentStatus = order.orderStatus || order.status || "pending";
                    const userPhone =
                      order.user?.phone ||
                      order.shippingAddress?.phone ||
                      order.phone ||
                      "N/A";

                    return (
                      <tr key={order._id} className="hover:bg-gray-50">
                        <td className="py-3 px-4 font-mono font-medium text-gray-900 truncate max-w-[140px]">
                          #{order._id.slice(-8).toUpperCase()}
                        </td>
                        <td className="py-3 px-4">
                          <div className="font-medium text-gray-900">
                            {order.user?.fullName || "Guest Customer"}
                          </div>
                          <div className="text-xs text-gray-500">
                            {order.user?.email || "No email"}
                          </div>
                        </td>
                        <td className="py-3 px-4 text-gray-700 font-mono text-xs">
                          {userPhone}
                        </td>
                        <td className="py-3 px-4 text-gray-500 text-xs">
                          {order.createdAt
                            ? new Date(order.createdAt).toLocaleDateString("en-US", {
                                year: "numeric",
                                month: "short",
                                day: "numeric",
                              })
                            : "N/A"}
                        </td>
                        <td className="py-3 px-4 font-semibold text-gray-900">
                        ৳{order.totalPrice?.toFixed(2) || "0.00"}
                        </td>
                        <td className="py-3 px-4">
                          <span
                            className={`px-2.5 py-1 text-xs font-semibold rounded-full border capitalize ${getStatusBadge(
                              currentStatus
                            )}`}
                          >
                            {currentStatus}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-right">
                          <button
                            onClick={() => handleOpenStatusModal(order)}
                            className="text-blue-600 hover:underline font-medium text-xs"
                          >
                            Update Status
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

        {/* Pagination Controls */}
        {pagination && pagination.totalPages > 1 && (
          <div className="p-4 border-t border-gray-200 flex items-center justify-between text-sm text-gray-600">
            <span>
              Page {pagination.page} of {pagination.totalPages} ({pagination.totalOrders} total)
            </span>
            <div className="space-x-2">
              <button
                disabled={pagination.page <= 1}
                onClick={() => setPage((p) => Math.max(p - 1, 1))}
                className="px-3 py-1.5 border rounded-md disabled:opacity-50 hover:bg-gray-50 transition-colors"
              >
                Previous
              </button>
              <button
                disabled={pagination.page >= pagination.totalPages}
                onClick={() => setPage((p) => p + 1)}
                className="px-3 py-1.5 border rounded-md disabled:opacity-50 hover:bg-gray-50 transition-colors"
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>

      {/* UPDATE ORDER STATUS MODAL */}
      {selectedOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-white w-full max-w-md rounded-2xl shadow-xl overflow-hidden animate-scaleUp">
            <div className="p-5 border-b border-gray-200 flex justify-between items-center bg-white">
              <h2 className="text-lg font-bold text-gray-800">Update Order Status</h2>
              <button
                onClick={() => setSelectedOrder(null)}
                className="text-gray-400 hover:text-gray-600 text-xl font-bold"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleStatusSubmit} className="p-6 space-y-4">
              <div>
                <p className="text-xs text-gray-500 mb-1">Order Reference</p>
                <p className="text-sm font-mono font-bold text-gray-800">
                  #{selectedOrder._id}
                </p>
              </div>

              <div>
                <p className="text-xs text-gray-500 mb-1">Customer</p>
                <p className="text-sm font-medium text-gray-800">
                  {selectedOrder.user?.fullName || "Guest Customer"} (
                  {selectedOrder.user?.phone || selectedOrder.phone || "No Phone"})
                </p>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 uppercase mb-1">
                  Select Status *
                </label>
                <select
                  value={newStatus}
                  onChange={(e) => setNewStatus(e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none bg-white capitalize"
                >
                  {ALLOWED_STATUSES.map((st) => (
                    <option key={st} value={st}>
                      {st.charAt(0).toUpperCase() + st.slice(1)}
                    </option>
                  ))}
                </select>
              </div>

              <div className="pt-4 border-t border-gray-200 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setSelectedOrder(null)}
                  className="px-4 py-2 border border-gray-300 rounded-lg text-xs font-medium text-gray-700 hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isUpdating}
                  className="bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white px-5 py-2 rounded-lg text-xs font-medium transition-colors"
                >
                  {isUpdating ? "Updating..." : "Save Status"}
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