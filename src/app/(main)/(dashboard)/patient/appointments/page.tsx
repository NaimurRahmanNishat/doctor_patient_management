/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import React, { useState } from "react";
import { Card } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useGetPatientAppointmentsQuery, useUpdateAppointmentStatusMutation } from "@/lib/features/appointment/appointmentApi";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";

const AppointmentPage = () => {
  const [statusFilter, setStatusFilter] = useState<string>(""); 
  const [page, setPage] = useState<number>(1);
  const limit = 10;

  const { data, isLoading, isError } = useGetPatientAppointmentsQuery({
    status: statusFilter,
    page,
  });

  const [updateStatus] = useUpdateAppointmentStatusMutation();

  const appointments = data?.data || [];
  const total = data?.total || 0;
  const totalPages = Math.ceil(total / limit);

  const handleCancel = async (id: string) => {
    try {
      await updateStatus({
        appointment_id: id,
        status: "CANCELLED",
      }).unwrap();

      alert("Appointment cancelled successfully");
    } catch (err: any) {
      console.error("Failed to cancel appointment:", err?.data || err);
      alert("Failed to cancel appointment");
    }
  };

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <h1 className="pt-6 text-center text-2xl md:text-4xl font-semibold bg-gradient-to-r from-pink-600 via-purple-700 to-blue-800 bg-clip-text text-transparent">
        Your Appointment List
      </h1>
      <p className="text-center text-lg pb-10 pt-4 text-gray-600">
        Personal appointment management center where patients can view, track,
        and manage all their scheduled appointments.
      </p>

      {/* Filter Section */}
      <div className="flex items-center justify-between gap-5 mb-6">
        <Select
          onValueChange={(val) => {
            setStatusFilter(val === "ALL" ? "" : val);
            setPage(1); // filter change করলে প্রথম পেজে যাবে
          }}
          value={statusFilter || "ALL"}
        >
          <SelectTrigger className="w-[220px] cursor-pointer">
            <SelectValue placeholder="Filter by Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="ALL">All</SelectItem>
            <SelectItem value="PENDING">Pending</SelectItem>
            <SelectItem value="CANCELLED">Cancelled</SelectItem>
            <SelectItem value="COMPLETED">Completed</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Appointment Table */}
      <Card className="rounded-2xl shadow-md overflow-x-auto">
        {isLoading ? (
          <p className="p-6 text-center">Loading appointments...</p>
        ) : isError ? (
          <p className="p-6 text-center text-red-500">
            Failed to load appointments
          </p>
        ) : appointments.length === 0 ? (
          <p className="p-6 text-center text-gray-500">No appointments found</p>
        ) : (
          <>
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-100">
                  <th className="p-3 border">Doctor</th>
                  <th className="p-3 border">Specialization</th>
                  <th className="p-3 border">Date</th>
                  <th className="p-3 border">Status</th>
                  <th className="p-3 border">Actions</th>
                </tr>
              </thead>
              <tbody>
                {appointments.map((appt: any, index: number) => (
                  <tr
                    key={appt._id || `appt-${index}`}
                    className="hover:bg-gray-50"
                  >
                    <td className="p-3 border">{appt.doctor?.name || "N/A"}</td>
                    <td className="p-3 border">
                      {appt.doctor?.specialization || "N/A"}
                    </td>
                    <td className="p-3 border">
                      {new Date(appt.date).toLocaleString()}
                    </td>
                    <td className="p-3 border font-medium">{appt.status}</td>
                    <td className="p-3 border">
                      {appt.status === "PENDING" ? (
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button variant="destructive" size="sm">
                              Cancel
                            </Button>
                          </DialogTrigger>
                          <DialogContent>
                            <DialogHeader>
                              <DialogTitle>Cancel Appointment</DialogTitle>
                              <DialogDescription>
                                Are you sure you want to cancel this
                                appointment?
                              </DialogDescription>
                            </DialogHeader>
                            <div className="flex justify-end gap-3 mt-4">
                              <Button
                                variant="outline"
                                onClick={() => handleCancel(appt._id)}
                              >
                                Yes, Cancel
                              </Button>
                            </div>
                          </DialogContent>
                        </Dialog>
                      ) : (
                        <span className="text-gray-400">—</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex justify-center items-center gap-3 mt-6 p-4">
                <Button
                  variant="outline"
                  disabled={page === 1}
                  onClick={() => setPage((prev) => prev - 1)}
                >
                  Previous
                </Button>
                <span>
                  Page {page} of {totalPages}
                </span>
                <Button
                  variant="outline"
                  disabled={page === totalPages}
                  onClick={() => setPage((prev) => prev + 1)}
                >
                  Next
                </Button>
              </div>
            )}
          </>
        )}
      </Card>
    </div>
  );
};

export default AppointmentPage;
