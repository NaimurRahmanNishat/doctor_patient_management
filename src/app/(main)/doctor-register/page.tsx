/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import { useRegisterDoctorMutation } from "@/lib/features/auth/authApi";
import { useRouter } from "next/navigation";
import Link from "next/link";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { useGetSpecializationsQuery } from "@/lib/features/doctor/doctorApi";

type RegisterFormData = {
  name: string;
  email: string;
  password: string;
  photo_url?: string;
  specialization: string;
};

const RegisterDoctorPage = () => {
  const router = useRouter();
  const [errorMessage, setErrorMessage] = useState<string>("");
  const [successMessage, setSuccessMessage] = useState<string>("");

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormData>();

  const [registerDoctor, { isLoading }] = useRegisterDoctorMutation();
  const {
    data,
    isLoading: specializationsLoading,
    isError,
  } = useGetSpecializationsQuery();

  const specializations = data?.data || [];

  const onSubmit = async (formData: RegisterFormData) => {
    try {
      setErrorMessage("");
      setSuccessMessage("");

      await registerDoctor({
        name: formData.name,
        email: formData.email,
        password: formData.password,
        specialization: formData.specialization,
        photo_url: formData.photo_url || undefined,
      }).unwrap();

      setSuccessMessage("Registration successful! Redirecting to login...");
      setTimeout(() => {
        router.push("/login");
      }, 1500);
    } catch (error: any) {
      console.error("Register error:", error);
      const message =
        error?.data?.message ||
        error?.error ||
        "Something went wrong. Please try again.";
      setErrorMessage(message);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="bg-white shadow-xl rounded-2xl border border-gray-200 p-8 w-full max-w-md">
        <h2 className="text-2xl font-bold text-center mb-4 bg-gradient-to-r bg-clip-text text-transparent from-blue-500 to-indigo-700">
          Doctor Registration
        </h2>
        <p className="text-center text-gray-600 mb-8">
          Sign up to create your doctor account
        </p>

        <form className="space-y-5" onSubmit={handleSubmit(onSubmit)}>
          {/* Name */}
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">
              Full Name
            </label>
            <input
              type="text"
              placeholder="Enter your name"
              {...register("name", { required: "Name is required" })}
              className={`w-full px-4 py-2 border rounded-lg outline-none focus:ring-2 ${
                errors.name ? "border-red-500 bg-red-50" : "border-gray-300"
              }`}
            />
            {errors.name && (
              <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>
            )}
          </div>

          {/* Email */}
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">
              Email Address
            </label>
            <input
              type="email"
              placeholder="Enter your email"
              {...register("email", {
                required: "Email is required",
                pattern: {
                  value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                  message: "Invalid email address",
                },
              })}
              className={`w-full px-4 py-2 border rounded-lg outline-none focus:ring-2 ${
                errors.email ? "border-red-500 bg-red-50" : "border-gray-300"
              }`}
            />
            {errors.email && (
              <p className="text-red-500 text-sm mt-1">
                {errors.email.message}
              </p>
            )}
          </div>

          {/* Password */}
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">
              Password
            </label>
            <input
              type="password"
              placeholder="Enter your password"
              {...register("password", {
                required: "Password is required",
                minLength: {
                  value: 6,
                  message: "Password must be at least 6 characters",
                },
              })}
              className={`w-full px-4 py-2 border rounded-lg outline-none focus:ring-2 ${
                errors.password ? "border-red-500 bg-red-50" : "border-gray-300"
              }`}
            />
            {errors.password && (
              <p className="text-red-500 text-sm mt-1">
                {errors.password.message}
              </p>
            )}
          </div>

          {/* Specialization Dropdown */}
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">
              Specialization
            </label>
            {specializationsLoading ? (
              <p className="text-gray-500 text-sm">Loading specializations...</p>
            ) : isError ? (
              <p className="text-red-500 text-sm">Failed to load specializations</p>
            ) : (
              <select
                {...register("specialization", {
                  required: "Specialization is required",
                })}
                className={`w-full px-4 py-2 border rounded-lg outline-none focus:ring-2 ${
                  errors.specialization
                    ? "border-red-500 bg-red-50"
                    : "border-gray-300"
                }`}
              >
                <option value="">Select specialization</option>
                {specializations?.map((spec: string, index: number) => (
                  <option key={index} value={spec}>
                    {spec}
                  </option>
                ))}
              </select>
            )}
            {errors.specialization && (
              <p className="text-red-500 text-sm mt-1">
                {errors.specialization.message}
              </p>
            )}
          </div>

          {/* Photo URL (optional) */}
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">
              Profile Photo URL (optional)
            </label>
            <input
              type="text"
              placeholder="Enter photo URL"
              {...register("photo_url")}
              className="w-full px-4 py-2 border rounded-lg outline-none focus:ring-2 border-gray-300"
            />
          </div>

          {/* Error & Success Messages */}
          {errorMessage && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-center">
              {errorMessage}
            </div>
          )}
          {successMessage && (
            <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg text-center">
              {successMessage}
            </div>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isLoading}
            className={`w-full py-3 px-4 rounded-lg text-white font-semibold transition-all duration-200 ${
              isLoading
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-blue-600 hover:bg-blue-700 focus:ring-4 focus:ring-blue-200"
            }`}
          >
            {isLoading ? "Registering..." : "Sign Up"}
          </button>
        </form>

        {/* Footer */}
        <p className="text-sm text-center text-gray-600 mt-6">
          Already have an account?{" "}
          <Link href="/login" className="text-green-500 hover:underline">
            Login
          </Link>
        </p>
      </div>
    </div>
  );
};

export default RegisterDoctorPage;
