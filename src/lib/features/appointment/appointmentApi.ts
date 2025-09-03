/* eslint-disable @typescript-eslint/no-explicit-any */
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

interface Appointment {
  _id: string;
  doctorId: string;
  date: string;
  status: "COMPLETED" | "CANCELLED";
}

export const appointmentApi = createApi({
  reducerPath: "appointmentApi",
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
  tagTypes: ["Appointment"],
  endpoints: (builder) => ({
    // createAppointment (compleate)
    createAppointment: builder.mutation<Appointment,{ doctorId: string; date: string }>({
      query: (data) => ({
        url: "/appointments",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Appointment"],
    }),
    // getPatientAppointments
    getPatientAppointments: builder.query<any,{ status?: string; page?: number }>({
      query: ({ status, page = 1 }) => ({
        url: `/appointments/patient?status=${status || ""}&page=${page}`,
        method: "GET",
      }),
      providesTags: ["Appointment"],
    }),
    // getDoctorAppointments
    getDoctorAppointments: builder.query<any,{ status?: string; date?: string; page?: number }>({
      query: ({ status, date, page = 1 }) => ({
        url: `/appointments/doctor?status=${status || ""}&date=${
          date || ""
        }&page=${page}`,
      }),
      providesTags: ["Appointment"],
    }),
    // updateAppointmentStatus
    updateAppointmentStatus: builder.mutation<any,{ appointment_id: string; status: "COMPLETE" | "CANCELLED" }>({
      query: ({ appointment_id, status }) => ({
        url: "/appointments/update-status",
        method: "PATCH",
        body: { appointment_id, status },
      }),
      invalidatesTags: ["Appointment"],
    }),
  }),
});

export const {
  useCreateAppointmentMutation,
  useGetPatientAppointmentsQuery,
  useGetDoctorAppointmentsQuery,
  useUpdateAppointmentStatusMutation,
} = appointmentApi;
