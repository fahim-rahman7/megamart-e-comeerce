import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const API = createApi({
  reducerPath: "api",
  baseQuery: fetchBaseQuery({
    baseUrl: import.meta.env.VITE_API_BASE_URL || "http://localhost:3001",
    credentials: "include",
    prepareHeaders: (headers) => {
      const token = localStorage.getItem("acc_tkn");
      if (token) {
        headers.set("authorization", `Bearer ${token}`);
      }
      return headers;
    },
  }),
  tagTypes: ["Product", "Category", "Cart", "Profile", "Order", "User", "Analytics"],
  endpoints: (build) => ({
    // =========================================================================
    // 1. ADMIN DASHBOARD & MANAGEMENT ENDPOINTS
    // =========================================================================

    // GET /admin/analytics
    getDashboardStats: build.query({
      query: () => "/admin/analytics",
      providesTags: ["Analytics"],
    }),

// GET /admin/users
getUserList: build.query({
  query: ({ limit = 10, page = 1, role, verified } = {}) => ({
    url: "/admin/users",
    params: {
      limit,
      page,
      ...(role && role !== "all" && { role }),
      ...(verified && verified !== "all" && { verified }),
    },
  }),
  providesTags: ["User"],
}),

    // PATCH /admin/user/role/:id
    updateUserRole: build.mutation({
      query: ({ id, role }) => ({
        url: `/admin/user/role/${id}`,
        method: "PATCH",
        body: { role },
      }),
      invalidatesTags: ["User"],
    }),

    // GET /admin/carts
    getAllCartsAdmin: build.query({
      query: () => "/admin/carts",
      providesTags: ["Cart"],
    }),

// GET /admin/orders (Admin)
getAllOrdersAdmin: build.query({
  query: ({ page = 1, limit = 10, status } = {}) => ({
    url: "/admin/orders",
    params: {
      page,
      limit,
      ...(status && { status }),
    },
  }),
  providesTags: ["Order"],
}),

    // PATCH /admin/order/status/:id
    updateOrderStatus: build.mutation({
      query: ({ id, status }) => ({
        url: `/admin/order/status/${id}`,
        method: "PATCH",
        body: { status },
      }),
      invalidatesTags: ["Order", "Analytics"],
    }),

    // =========================================================================
    // 2. PRODUCTS ENDPOINTS (STOREFRONT + ADMIN)
    // =========================================================================

    // GET /product/allProduct (Public Storefront)
    getProducts: build.query({
      query: ({ limit = 10, page = 1, category, search, hasDiscount } = {}) => {
        let url = `/product/allProduct?limit=${limit}&page=${page}`;
        if (category) url += `&category=${encodeURIComponent(category)}`;
        if (search) url += `&search=${encodeURIComponent(search)}`;
        if (hasDiscount) url += `&hasDiscount=true`;
        return url;
      },
      providesTags: ["Product"],
    }),

    // GET /product/:slug (Public Storefront)
    getProductDetails: build.query({
      query: (slug) => `/product/${slug}`,
      providesTags: (result, error, slug) => [{ type: "Product", id: slug }],
    }),

    // POST /admin/product/create (Admin - Multipart)
    createProduct: build.mutation({
      query: (formData) => ({
        url: "/admin/product/create",
        method: "POST",
        body: formData,
      }),
      invalidatesTags: ["Product", "Analytics"],
    }),

    // PUT /admin/product/update/:slug (Admin - Multipart)
    updateProduct: build.mutation({
      query: ({ id, formData }) => ({
        url: `/admin/product/update/${id}`,
        method: "PUT",
        body: formData,
      }),
      invalidatesTags: (result, error, { id }) => [
        "Product",
        { type: "Product", id },
      ],
    }),

    // DELETE /admin/product/delete/:id (Admin)
    deleteProduct: build.mutation({
      query: (id) => ({
        url: `/admin/product/delete/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Product", "Analytics"],
    }),

    // =========================================================================
    // 3. CATEGORY ENDPOINTS (STOREFRONT + ADMIN)
    // =========================================================================

    // GET /category/all (Public Storefront)
    getCategoryList: build.query({
      query: () => "/category/all",
      providesTags: ["Category"],
    }),

    // POST /admin/category/create (Admin - Multipart)
    createCategory: build.mutation({
      query: (categoryData) => ({
        url: "/admin/category/create",
        method: "POST",
        body: categoryData,
      }),
      invalidatesTags: ["Category", "Analytics"],
    }),

    // PATCH /admin/category/update/:id (Admin - Multipart)
    updateCategory: build.mutation({
      query: ({ id, formData }) => ({
        url: `/admin/category/update/${id}`,
        method: "PATCH",
        body: formData,
      }),
      invalidatesTags: ["Category"],
    }),

    // DELETE /admin/category/delete/:id (Admin)
    deleteCategory: build.mutation({
      query: (id) => ({
        url: `/admin/category/delete/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Category", "Analytics"],
    }),

    // =========================================================================
    // 4. CART ENDPOINTS
    // =========================================================================

    getCart: build.query({
      query: () => "/cart/userCart",
      providesTags: ["Cart"],
    }),

    addToCart: build.mutation({
      query: (cartData) => ({
        url: "/cart/add",
        method: "POST",
        body: cartData,
      }),
      invalidatesTags: ["Cart"],
    }),

    updateCart: build.mutation({
      query: (cartData) => ({
        url: "/cart/updateCart",
        method: "PUT",
        body: cartData,
      }),
      invalidatesTags: ["Cart"],
      async onQueryStarted({ itemId, quantity }, { dispatch, queryFulfilled }) {
        const patchResult = dispatch(
          API.util.updateQueryData("getCart", undefined, (draft) => {
            const item = draft.cartData?.items?.find((i) => i._id === itemId);
            if (item) {
              const unitPrice = item.subtotal / item.quantity;
              item.quantity = quantity;
              item.subtotal = unitPrice * quantity;
              if (draft.cartData?.items) {
                draft.cartData.totalItems = draft.cartData.items.reduce(
                  (acc, i) => acc + i.quantity,
                  0
                );
              }
            }
          })
        );
        try {
          await queryFulfilled;
        } catch {
          patchResult.undo();
        }
      },
    }),

    removeFromCart: build.mutation({
      query: (cartData) => ({
        url: "/cart/deleteCart",
        method: "DELETE",
        body: cartData,
      }),
      invalidatesTags: ["Cart"],
    }),

    // =========================================================================
    // 5. ORDER & CHECKOUT ENDPOINTS
    // =========================================================================

    cartCheckout: build.mutation({
      query: (orderData) => ({
        url: "/order/checkout/cart",
        method: "POST",
        body: orderData,
      }),
      invalidatesTags: ["Cart", "Order", "Analytics"],
    }),

    directCheckout: build.mutation({
      query: (orderData) => ({
        url: "/order/checkout/direct",
        method: "POST",
        body: orderData,
      }),
      invalidatesTags: ["Order", "Analytics"],
    }),

    getMyOrders: build.query({
      query: () => "/order/myorders",
      providesTags: ["Order"],
    }),

    // =========================================================================
    // 6. AUTHENTICATION & PROFILE ENDPOINTS
    // =========================================================================

    login: build.mutation({
      query: (userData) => ({
        url: "/auth/signin",
        method: "POST",
        body: userData,
      }),
      async onQueryStarted(args, { queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          if (data?.accToken) {
            localStorage.setItem("acc_tkn", data.accToken);
          }
        } catch (error) {
          console.error("Login failed:", error);
        }
      },
    }),

    signUp: build.mutation({
      query: (userData) => ({
        url: "/auth/signup",
        method: "POST",
        body: userData,
      }),
    }),

    verifyEmail: build.mutation({
      query: (otpData) => ({
        url: "/auth/verify-email",
        method: "POST",
        body: otpData,
      }),
    }),

    resendOtp: build.mutation({
      query: (emailData) => ({
        url: "/auth/resend-otp",
        method: "POST",
        body: emailData,
      }),
    }),

    forgetPassword: build.mutation({
      query: (emailData) => ({
        url: "/auth/forget-pass",
        method: "POST",
        body: emailData,
      }),
    }),

    resetPassword: build.mutation({
      query: ({ token, newPass }) => ({
        url: `/auth/reset-pass/${token}`,
        method: "POST",
        body: { newPass },
      }),
    }),

    getProfile: build.query({
      query: () => "/auth/getprofile",
      providesTags: ["Profile"],
    }),

    updateProfile: build.mutation({
      query: (formData) => ({
        url: "/auth/updateprofile",
        method: "PUT",
        body: formData,
      }),
      invalidatesTags: ["Profile"],
    }),
  }),
});

export const {
  // Admin Hooks
  useGetDashboardStatsQuery,
  useGetUserListQuery,
  useUpdateUserRoleMutation,
  useGetAllCartsAdminQuery,
  useGetAllOrdersAdminQuery,
  useUpdateOrderStatusMutation,

  // Products Hooks
  useGetProductsQuery,
  useGetProductDetailsQuery,
  useCreateProductMutation,
  useUpdateProductMutation,
  useDeleteProductMutation,

  // Category Hooks
  useGetCategoryListQuery,
  useCreateCategoryMutation,
  useUpdateCategoryMutation,
  useDeleteCategoryMutation,

  // Cart Hooks
  useGetCartQuery,
  useAddToCartMutation,
  useUpdateCartMutation,
  useRemoveFromCartMutation,

  // Order Hooks
  useDirectCheckoutMutation,
  useCartCheckoutMutation,
  useGetMyOrdersQuery,

  // Auth Hooks
  useLoginMutation,
  useSignUpMutation,
  useVerifyEmailMutation,
  useResendOtpMutation,
  useForgetPasswordMutation,
  useResetPasswordMutation,
  useGetProfileQuery,
  useUpdateProfileMutation,
} = API;