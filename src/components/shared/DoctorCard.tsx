/* eslint-disable @typescript-eslint/no-explicit-any */
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Calendar } from "@/components/ui/calendar";
import { useState } from "react";
import { Button } from "../ui/button";
import Image from "next/image";
// Doctor Card with improved error handling
const DoctorCard = ({
  doctor,
  getDoctorImage,
  createAppointment,
}: any) => {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);
  const [appointmentSuccess, setAppointmentSuccess] = useState(false);
  const [appointmentError, setAppointmentError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

const handleBookAppointment = async () => {
  if (!selectedDate) return;

  // Check doctorId exists
  const doctorId = doctor._id || doctor.id;
  if (!doctorId) {
    setAppointmentError("Doctor ID missing. Cannot book appointment.");
    return;
  }

  setLoading(true);
  setAppointmentError(null);
  try {
    const result = await createAppointment({
      doctorId,
      date: selectedDate.toISOString(),
    }).unwrap();

    console.log("Appointment booked:", result);
    setAppointmentSuccess(true);
  } catch (err: any) {
    console.error("Booking error:", err);
    if (err?.data) {
      setAppointmentError(
        typeof err.data === "string" ? err.data : JSON.stringify(err.data)
      );
    } else if (err?.error) {
      setAppointmentError(err.error);
    } else {
      setAppointmentError("Unknown error occurred.");
    }
    setAppointmentSuccess(false);
  } finally {
    setLoading(false);
  }
};


  return (
    <Card className="rounded-2xl shadow-md">
      <CardHeader>
        <CardTitle className="flex items-center gap-3">
          <Image
            src={getDoctorImage(doctor.photo_url)}
            alt={doctor.name || "Doctor"}
            width={48}
            height={48}
            className="w-12 h-12 rounded-full object-cover"
          />
          <div>
            <p className="font-semibold">{doctor.name}</p>
            <p className="text-sm text-gray-500">{doctor.specialization}</p>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Dialog>
          <DialogTrigger asChild>
            <Button className="w-full cursor-pointer">Book Appointment</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Book Appointment with {doctor.name}</DialogTitle>
            </DialogHeader>

            <Calendar
              mode="single"
              selected={selectedDate}
              onSelect={setSelectedDate}
              className="rounded-md border"
            />

            <Button
              className="mt-4 w-full"
              onClick={handleBookAppointment}
              disabled={!selectedDate || loading}
            >
              {loading ? "Booking..." : "Confirm Appointment"}
            </Button>

            {appointmentSuccess && selectedDate && (
              <p className="text-green-600 font-medium mt-2">
                Appointment booked for {selectedDate.toDateString()}
              </p>
            )}

            {appointmentError && (
              <p className="text-red-600 font-medium mt-2">
                {appointmentError}
              </p>
            )}
          </DialogContent>
        </Dialog>
      </CardContent>
    </Card>
  );
};

export default DoctorCard;