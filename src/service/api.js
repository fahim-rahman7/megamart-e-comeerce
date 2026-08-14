import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const API = createApi({
  reducerPath: 'api',
  baseQuery: fetchBaseQuery({
    baseUrl: import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001',
    // Ensures browser cookies (acc_tkn, ref_tkn) are sent automatically
    credentials: 'include',
  }),
  tagTypes: ['Product', 'Category', 'Cart', 'Profile', 'Order'],
  endpoints: (build) => ({

    // =========================================================================
    // 1. PRODUCTS ENDPOINTS
    // =========================================================================

    // GET /product/allProduct
    getProducts: build.query({
      query: ({ limit = 10, page = 1, category, search, hasDiscount } = {}) => {
        let url = `/product/allProduct?limit=${limit}&page=${page}`;
        if (category) url += `&category=${encodeURIComponent(category)}`;
        if (search) url += `&search=${encodeURIComponent(search)}`;
        if (hasDiscount) url += `&hasDiscount=true`;
        return url;
      },
      providesTags: ['Product'],
    }),

    // GET /product/:slug
    getProductDetails: build.query({
      query: (slug) => `/product/${slug}`,
      providesTags: (result, error, slug) => [{ type: 'Product', id: slug }],
    }),

    // POST /product/create (Multipart Form Data)
    createProduct: build.mutation({
      query: (formData) => ({
        url: '/product/create',
        method: 'POST',
        body: formData,
      }),
      invalidatesTags: ['Product'],
    }),

    // PUT /product/update/:slug (Multipart Form Data)
    updateProduct: build.mutation({
      query: ({ slug, formData }) => ({
        url: `/product/update/${slug}`,
        method: 'PUT',
        body: formData,
      }),
      invalidatesTags: (result, error, { slug }) => ['Product', { type: 'Product', id: slug }],
    }),

    // =========================================================================
    // 2. CATEGORY ENDPOINTS
    // =========================================================================

    // GET /category/all
    getCategoryList: build.query({
      query: () => '/category/all',
      providesTags: ['Category'],
    }),

    // POST /category/create (Multipart Form Data)
    createCategory: build.mutation({
      query: (categoryData) => ({
        url: '/category/create',
        method: 'POST',
        body: categoryData,
      }),
      invalidatesTags: ['Category'],
    }),

    // PATCH /category/update/:id (Multipart Form Data)
    updateCategory: build.mutation({
      query: ({ id, formData }) => ({
        url: `/category/update/${id}`,
        method: 'PATCH',
        body: formData,
      }),
      invalidatesTags: ['Category'],
    }),

    // DELETE /category/delete/:id
    deleteCategory: build.mutation({
      query: (id) => ({
        url: `/category/delete/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Category'],
    }),

    // =========================================================================
    // 3. CART ENDPOINTS
    // =========================================================================

    // GET /cart/userCart
    getCart: build.query({
      query: () => '/cart/userCart',
      providesTags: ['Cart'],
    }),

    // POST /cart/add
    addToCart: build.mutation({
      query: (cartData) => ({
        url: '/cart/add',
        method: 'POST',
        body: cartData,
      }),
      invalidatesTags: ['Cart'],
    }),

// PUT /cart/updateCart
    updateCart: build.mutation({
      query: (cartData) => ({
        url: '/cart/updateCart',
        method: 'PUT',
        body: cartData,
      }),
      // Keep this so the app guarantees full synchronization with the backend eventually
      invalidatesTags: ['Cart'], 
      
      // Add this Optimistic Update logic
      async onQueryStarted({ itemId, quantity }, { dispatch, queryFulfilled }) {
        // 1. Dispatch an update to the cached 'getCart' data instantly
        const patchResult = dispatch(
          API.util.updateQueryData('getCart', undefined, (draft) => {
            // Find the specific item in our cached cart draft
            const item = draft.cartData?.items?.find((i) => i._id === itemId);
            
            if (item) {
              // Calculate the unit price based on existing subtotal & quantity
              const unitPrice = item.subtotal / item.quantity;
              
              // Apply the new quantity and recalculate subtotal instantly
              item.quantity = quantity;
              item.subtotal = unitPrice * quantity;
              
              // Recalculate total items across the whole cart
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
          // 2. Wait for the actual backend PUT request to complete
          await queryFulfilled;
        } catch {
          // 3. If the backend request fails for any reason, revert the UI instantly
          patchResult.undo();
        }
      },
    }),

    // DELETE /cart/deleteCart
    removeFromCart: build.mutation({
      query: (cartData) => ({
        url: '/cart/deleteCart',
        method: 'DELETE',
        body: cartData,
      }),
      invalidatesTags: ['Cart'],
    }),

    // =========================================================================
    // 4. ORDER & CHECKOUT ENDPOINTS
    // =========================================================================

    // POST /order/checkout
    checkout: build.mutation({
      query: (orderData) => ({
        url: '/order/checkout',
        method: 'POST',
        body: orderData,
      }),
      invalidatesTags: ['Cart'],
    }),

    // GET /order/myorders
    getMyOrders: build.query({
      query: () => '/order/myorders',
      providesTags: ['Order'],
    }),

    // =========================================================================
    // 5. AUTHENTICATION & PROFILE ENDPOINTS
    // =========================================================================

    // POST /auth/signin
    login: build.mutation({
      query: (userData) => ({
        url: '/auth/signin',
        method: 'POST',
        body: userData,
      }),
      invalidatesTags: ['Profile', 'Cart'],
    }),

    // POST /auth/signup
    signUp: build.mutation({
      query: (userData) => ({
        url: '/auth/signup',
        method: 'POST',
        body: userData,
      }),
    }),

    // POST /auth/verify-email
    verifyEmail: build.mutation({
      query: (otpData) => ({
        url: '/auth/verify-email',
        method: 'POST',
        body: otpData,
      }),
    }),

    // POST /auth/resend-otp
    resendOtp: build.mutation({
      query: (emailData) => ({
        url: '/auth/resend-otp',
        method: 'POST',
        body: emailData,
      }),
    }),

    // POST /auth/forget-pass
    forgetPassword: build.mutation({
      query: (emailData) => ({
        url: '/auth/forget-pass',
        method: 'POST',
        body: emailData,
      }),
    }),

    // POST /auth/reset-pass/:token
    resetPassword: build.mutation({
      query: ({ token, newPass }) => ({
        url: `/auth/reset-pass/${token}`,
        method: 'POST',
        body: { newPass },
      }),
    }),

    // GET /auth/getprofile
    getProfile: build.query({
      query: () => '/auth/getprofile',
      providesTags: ['Profile'],
    }),

    // PUT /auth/updateprofile (Multipart Form Data for Avatar)
    updateProfile: build.mutation({
      query: (formData) => ({
        url: '/auth/updateprofile',
        method: 'PUT',
        body: formData,
      }),
      invalidatesTags: ['Profile'],
    }),

    // GET /auth/userlist (Admin/Moderator)
    getUserList: build.query({
      query: ({ verified, limit = 10, page = 1 } = {}) => {
        let url = `/auth/userlist?limit=${limit}&page=${page}`;
        if (verified !== undefined) url += `&verified=${verified}`;
        return url;
      },
    }),
  }),
});

// Auto-generated hooks for components
export const {
  // Products Hooks
  useGetProductsQuery,
  useGetProductDetailsQuery,
  useCreateProductMutation,
  useUpdateProductMutation,

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
  useCheckoutMutation,
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
  useGetUserListQuery,
} = API;