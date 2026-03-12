import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import { getCookie } from '../components/utils/cookie'

export const API = createApi({
    reducerPath: 'api',
    baseQuery: fetchBaseQuery({ baseUrl: 'https://dummyjson.com' }),
    endpoints: (build) => ({
      getProducts: build.query({
        query: ({limit,skip,category}) => `/products${category? "/category/"+ category : ""}?limit=${limit}&skip=${skip}`,
      }),
      getProductDetails: build.query({
        query: ({id}) => `/products/${id}`,
      }),
      getCategoryList: build.query({
        query: () => `/products/category-list`,
      }),
      getCart: build.query({
        query: () => `/carts`,
      }),

      getProfile: build.query({
        query: () => ({
          url: `/auth/me`,
          headers: {
            'Authorization': `Bearer ${getCookie()}` , // Pass JWT via Authorization header
          }, 
        })
      }),
      
      login: build.mutation({
        query: (userData)=> ({
          url: `/auth/login`,
          method: 'POST',
          body: userData
        })
      })
    }),
  })

  export const  { useGetProductsQuery, useGetProductDetailsQuery, useGetCategoryListQuery, useLoginMutation , useGetProfileQuery, useGetCartQuery} = API 