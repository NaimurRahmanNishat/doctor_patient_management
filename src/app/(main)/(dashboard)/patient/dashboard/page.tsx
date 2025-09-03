/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useGetDoctorsQuery, useGetSpecializationsQuery } from "@/lib/features/doctor/doctorApi";
import { useCreateAppointmentMutation } from "@/lib/features/appointment/appointmentApi";
import DoctorCard from "@/components/shared/DoctorCard";

const PatientPage = () => {
  const [search, setSearch] = useState("");
  const [specialization, setSpecialization] = useState("all");
  const [page, setPage] = useState(1);
  const itemsPerPage = 10;

  const { data, isLoading, isError } = useGetDoctorsQuery({ page, limit: itemsPerPage, search: search || undefined, specialization: specialization === "all" ? undefined : specialization });
  const { data: specializationsData, isLoading: specializationsLoading, isError: specializationsError } = useGetSpecializationsQuery();
  const [createAppointment] = useCreateAppointmentMutation();

  const specializations = specializationsData?.data || [];
  const doctors = data?.data || [];
  const total = data?.total || 0;
  const totalPages = Math.ceil(total / itemsPerPage);

  const getDoctorImage = (url?: string) => {
    if (!url) return "/default-doctor.png";
    try {
      const validUrl = new URL(url);
      if (
        validUrl.hostname.includes("appointment-manager-node.onrender.com") ||
        validUrl.hostname === "randomuser.me"
      ) {
        return url;
      }
      return "/default-doctor.png";
    } catch {
      return "/default-doctor.png";
    }
  };

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <h1 className="text-2xl text-center pb-6 font-bold mb-6">Find a Doctor</h1>

      {/* Search + Filter */}
      <div className="flex flex-col justify-between sm:flex-row gap-4 mb-6">
        <Input
          placeholder="Search by doctor name..."
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setPage(1);
          }}
          className="w-full sm:w-1/2"
        />

        <Select
          onValueChange={(val) => {
            setSpecialization(val);
            setPage(1);
          }}
          value={specialization}
        >
          <SelectTrigger className="w-full sm:w-1/3">
            <SelectValue placeholder="Filter by specialization" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all" className="text-muted-foreground">
              All
            </SelectItem>
            {!specializationsLoading &&
              !specializationsError &&
              specializations?.map((spec: string) => (
                <SelectItem key={spec} value={spec}>
                  {spec}
                </SelectItem>
              ))}
          </SelectContent>
        </Select>
      </div>

      {/* Loading & Error */}
      {isLoading && <p className="text-center">Loading doctors...</p>}
      {isError && (
        <p className="text-center text-red-500">Failed to fetch doctors. Try again.</p>
      )}

      {/* Doctor List */}
      {!isLoading && doctors.length === 0 && (
        <p className="text-center text-gray-500">No doctors found.</p>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {doctors.map((doc: any, index: number) => (
          <DoctorCard
            key={index}
            doctor={doc}
            getDoctorImage={getDoctorImage}
            createAppointment={createAppointment}
          />
        ))}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center items-center gap-3 mt-8">
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
    </div>
  );
};

export default PatientPage;
