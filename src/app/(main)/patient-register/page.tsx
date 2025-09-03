/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import { useRegisterPatientMutation } from '@/lib/features/auth/authApi';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';

type RegisterFormData = {
  name: string;
  email: string;
  password: string;
  photo_url?: string;
};

const RegisterPatient = () => {
  const router = useRouter();
  const [errorMessage, setErrorMessage] = useState<string>("");
  const [successMessage, setSuccessMessage] = useState<string>("");
  const { register, handleSubmit, formState: { errors } } = useForm<RegisterFormData>();
  const [registerPatient, { isLoading: patientLoading }] = useRegisterPatientMutation();

  const onSubmit = async (formData: RegisterFormData) => {
    try {
      setErrorMessage("");
      setSuccessMessage("");

      await registerPatient({
        name: formData.name,
        email: formData.email,
        password: formData.password,
        photo_url: formData.photo_url || undefined,
      }).unwrap();

      setSuccessMessage("Registration successful! Redirecting to login...");
      router.push("/login");

    } catch (error: any) {
      console.error("Register error:", error);
      const message =
        error?.data?.message ||
        error?.error ||
        "Something went wrong. Please try again.";
      setErrorMessage(message);
    }
  };

  const isLoading = patientLoading;

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="bg-white shadow-xl rounded-2xl border border-gray-200 p-8 w-full max-w-md">
        <p className="text-center text-gray-600 mb-8">
          Sign up to your account
        </p>

        <form className="space-y-5" onSubmit={handleSubmit(onSubmit)}>
          {/* Name */}
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">Full Name</label>
            <input
              type="text"
              placeholder="Enter your name"
              {...register("name", { required: "Name is required" })}
              className={`w-full px-4 py-2 border rounded-lg outline-none focus:ring-2 focus:ring-green-400 ${errors.name ? "border-red-500" : "border-gray-300"}`}
            />
            {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>}
          </div>

          {/* Email */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Email Address</label>
            <input
              type="email"
              placeholder="Enter your email"
              {...register("email", {
                required: "Email is required",
                pattern: { value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i, message: "Invalid email address" }
              })}
              className={`w-full px-4 py-2 border rounded-lg outline-none focus:ring-2 focus:ring-green-400 ${errors.email ? "border-red-500 bg-red-50" : "border-gray-300"}`}
            />
            {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>}
          </div>

          {/* Password */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Password</label>
            <input
              type="password"
              placeholder="Enter your password"
              {...register("password", { 
                required: "Password is required", 
                minLength: { value: 6, message: "Password must be at least 6 characters" } 
              })}
              className={`w-full px-4 py-2 border rounded-lg outline-none focus:ring-2 focus:ring-green-400 ${errors.password ? "border-red-500 bg-red-50" : "border-gray-300"}`}
            />
            {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password.message}</p>}
          </div>

          {/* Photo URL */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Photo URL (optional)</label>
            <input
              type="url"
              placeholder="Enter your photo URL"
              {...register("photo_url")}
              className={`w-full px-4 py-2 border rounded-lg outline-none focus:ring-2 focus:ring-green-400 ${errors.photo_url ? "border-red-500 bg-red-50" : "border-gray-300"}`}
            />
            {errors.photo_url && <p className="text-red-500 text-sm mt-1">{errors.photo_url.message}</p>}
          </div>

          {/* Error & Success Messages */}
          {errorMessage && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-4 text-center">
              {errorMessage}
            </div>
          )}
          {successMessage && (
            <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg mb-4 text-center">
              {successMessage}
            </div>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isLoading}
            className={`w-full py-3 px-4 rounded-lg text-white font-semibold transition-all duration-200 ${isLoading ? "bg-gray-400 cursor-not-allowed" : "bg-blue-600 hover:bg-blue-700 focus:ring-4 focus:ring-blue-200"}`}
          >
            {isLoading ? "Registering..." : "Sign Up"}
          </button>
        </form>

        {/* Footer */}
        <p className="text-sm text-center text-gray-600 mt-6">
          Already have an account?{" "}
          <Link href="/login" className="text-green-500 hover:underline">Login</Link>
        </p>
      </div>
    </div>
  );
};

export default RegisterPatient;
