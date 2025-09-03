/* eslint-disable @typescript-eslint/no-explicit-any */
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const doctorApi = createApi({
  reducerPath: "doctorApi",
  baseQuery: fetchBaseQuery({
    baseUrl: "https://appointment-manager-node.onrender.com/api/v1",
    prepareHeaders: (headers, { getState }) => {
      const token = (getState() as any)?.auth?.token;
      if (token) {
        headers.set("authorization", `Bearer ${token}`);
      }
      return headers;
    },
  }),
  tagTypes: ["Doctor", "Specialization"],
  endpoints: (builder) => ({
    // getDoctors
    getDoctors: builder.query<any,{ page?: number; limit?: number; search?: string; specialization?: string; }>({
      query: ({ page = 1, limit = 10, search, specialization }) => ({
        url: `/doctors?page=${page}&limit=${limit}&search=${
          search || ""
        }&specialization=${specialization || ""}`,
      }),
      providesTags: ["Doctor"],
    }),
    // getSpecializations
    getSpecializations: builder.query<any, void>({
      query: () => ({
        url: "/specializations",
        method: "GET",
      }),
      providesTags: ["Specialization"],
    }),
  }),
});

export const { useGetDoctorsQuery, useGetSpecializationsQuery } = doctorApi;
