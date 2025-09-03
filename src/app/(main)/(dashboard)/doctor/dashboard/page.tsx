"use client";
import React, { useState } from "react";
import { useGetDoctorAppointmentsQuery, useUpdateAppointmentStatusMutation } from "@/lib/features/appointment/appointmentApi";
import { format } from "date-fns";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";

interface Appointment {
  _id: string;
  patientName: string;
  date?: string;
  status: "PENDING" | "COMPLETE" | "CANCELLED";
}

const DoctorDashboardpage = () => {
  const [page, setPage] = useState(1);
  const [statusFilter, setStatusFilter] = useState<string>("");
  const [dateFilter, setDateFilter] = useState<string>("");
  const [selectedAppointment, setSelectedAppointment] = useState<Appointment | null>(null);
  const [actionType, setActionType] = useState<"COMPLETE" | "CANCELLED" | null>(null);

  // fetch appointments
  const { data, isLoading } = useGetDoctorAppointmentsQuery({ page, status: statusFilter, date: dateFilter },{ refetchOnMountOrArgChange: true });
  const [updateStatus, { isLoading: updating }] = useUpdateAppointmentStatusMutation();

  // open confirmation dialog
  const handleStatusChange = (appointment: Appointment, status: "COMPLETE" | "CANCELLED") => {
    setSelectedAppointment(appointment);
    setActionType(status);
  };

  // confirm action
  const confirmStatusChange = async () => {
    if (!selectedAppointment || !actionType) return;
    try {
      await updateStatus({ appointment_id: selectedAppointment._id, status: actionType }).unwrap();
      setSelectedAppointment(null);
      setActionType(null);
    } catch (err) {
      console.error("Failed to update status:", err);
    }
  };

  // safe date formatting helper
  const formatDate = (dateStr?: string) => {
    if (!dateStr) return "Invalid date";
    const d = new Date(dateStr);
    if (isNaN(d.getTime())) return "Invalid date";
    return format(d, "PPpp");
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4 md:mb-12 text-center">Welcome to Doctor dashboard</h1>

      {/* filters */}
      <div className="flex gap-4 mb-4 flex-wrap">
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="border px-3 py-2 rounded-md"
        >
          <option value="">All Status</option>
          <option value="PENDING">Pending</option>
          <option value="COMPLETE">Completed</option>
          <option value="CANCELLED">Cancelled</option>
        </select>

        <input
          type="date"
          value={dateFilter}
          onChange={(e) => setDateFilter(e.target.value)}
          className="border px-3 py-2 rounded-md"
        />

        <Button onClick={() => setPage(1)} variant="outline">
          Filter
        </Button>
      </div>

      {/* appointment table */}
      <div className="overflow-x-auto border rounded-md">
        <table className="w-full table-auto">
          <thead>
            <tr className="bg-gray-100">
              <th className="p-2 text-left">Patient</th>
              <th className="p-2 text-left">Date & Time</th>
              <th className="p-2 text-left">Status</th>
              <th className="p-2 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              <tr>
                <td colSpan={4} className="p-4 text-center">
                  Loading...
                </td>
              </tr>
            ) : data?.appointments?.length > 0 ? (
              data.appointments.map((appointment: Appointment) => (
                <tr key={appointment._id} className="border-t">
                  <td className="p-2">{appointment.patientName}</td>
                  <td className="p-2">{formatDate(appointment.date)}</td>
                  <td className="p-2">{appointment.status}</td>
                  <td className="p-2 flex gap-2">
                    {appointment.status === "PENDING" && (
                      <>
                        <Button
                          size="sm"
                          variant="default"
                          onClick={() => handleStatusChange(appointment, "COMPLETE")}
                        >
                          Complete
                        </Button>
                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={() => handleStatusChange(appointment, "CANCELLED")}
                        >
                          Cancel
                        </Button>
                      </>
                    )}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={4} className="p-4 text-center">
                  No appointments found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* pagination */}
      <div className="mt-4 flex justify-between items-center">
        <Button onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={page === 1}>
          Previous
        </Button>
        <span>Page {page}</span>
        <Button
          onClick={() => setPage((p) => p + 1)}
          disabled={data?.appointments?.length < 10}
        >
          Next
        </Button>
      </div>

      {/* confirmation dialog */}
      <Dialog open={!!selectedAppointment} onOpenChange={() => setSelectedAppointment(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {actionType === "COMPLETE" ? "Mark as Completed" : "Cancel Appointment"}
            </DialogTitle>
          </DialogHeader>
          <p className="mb-4">
            Are you sure you want to {actionType?.toLowerCase()} this appointment with{" "}
            {selectedAppointment?.patientName} on {formatDate(selectedAppointment?.date)}
          </p>
          <DialogFooter className="flex gap-2">
            <Button variant="outline" onClick={() => setSelectedAppointment(null)}>
              Cancel
            </Button>
            <Button onClick={confirmStatusChange} disabled={updating}>
              Confirm
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default DoctorDashboardpage;
