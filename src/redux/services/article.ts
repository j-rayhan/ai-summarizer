// Need to use the React-specific entry point to import createApi
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'

const RapidAPIKEY = import.meta.env.VITE_RAPID_API_KEY

// Define a service using a base URL and expected endpoints
export const articleApi = createApi({
  reducerPath: 'articleApi',
  baseQuery: fetchBaseQuery({ 
    baseUrl: 'https://article-extractor-and-summarizer.p.rapidapi.com/',
    prepareHeaders: (headers) => {
      headers.set('X-RapidAPI-Key', RapidAPIKEY)
      headers.set('X-RapidAPI-Host', 'article-extractor-and-summarizer.p.rapidapi.com')

      return headers;
    }
  }),

  endpoints: (builder) => ({
    getSummary: builder.query({
      query: (params) => `summarize?url=${encodeURIComponent(params.articleUrl)}&length=3`,
    }),
  }),
})

// Export hooks for usage in functional components, which are
// auto-generated based on the defined endpoints
export const { useLazyGetSummaryQuery } = articleApi
