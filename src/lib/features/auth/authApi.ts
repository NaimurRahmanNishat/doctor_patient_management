/* eslint-disable @typescript-eslint/no-explicit-any */
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export interface IUser {
  id: string;
  name: string;
  email: string;
  role: "DOCTOR" | "PATIENT";
  photo_url?: string;
  specialization?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface LoginRequest {
  email: string;
  password: string;
  role: "DOCTOR" | "PATIENT";
}

export interface RegisterPatient {
  name: string;
  email: string;
  password: string;
  photo_url?: string;
}

export interface RegisterDoctor extends RegisterPatient {
  specialization: string;
}

export interface AuthResponse {
  success: boolean;
  statusCode: number;
  message: string;
  data: {
    token: string;
    user: IUser;
  };
}

export const authApi = createApi({
  reducerPath: "authApi",
  baseQuery: fetchBaseQuery({
    baseUrl: "https://appointment-manager-node.onrender.com/api/v1",
    credentials: "include",
    prepareHeaders: (headers, { getState }) => {
      const token = (getState() as any).auth?.token;

      headers.set("Content-Type", "application/json");

      if (token) {
        headers.set("authorization", `Bearer ${token}`);
      }

      return headers;
    },
  }),
  tagTypes: ["Auth"],
  endpoints: (builder) => ({
    login: builder.mutation<AuthResponse, LoginRequest>({
      query: (data) => ({
        url: "/auth/login",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Auth"],
    }),
    registerPatient: builder.mutation<AuthResponse, RegisterPatient>({
      query: (data) => ({
        url: "/auth/register/patient",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Auth"],
    }),
    registerDoctor: builder.mutation<AuthResponse, RegisterDoctor>({
      query: (data) => ({
        url: "/auth/register/doctor",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Auth"],
    }),
  }),
});

export const {
  useLoginMutation,
  useRegisterPatientMutation,
  useRegisterDoctorMutation,
} = authApi;
