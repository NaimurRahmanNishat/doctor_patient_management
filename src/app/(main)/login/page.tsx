/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import React, { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { useLoginMutation } from "@/lib/features/auth/authApi";
import { setUser } from "@/lib/features/auth/authSlice";
import { useDispatch } from "react-redux";
import { useRouter } from "next/navigation";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

type LoginFormData = {
  email: string;
  password: string;
  role: "DOCTOR" | "PATIENT";
};

const LoginPage = () => {
  const router = useRouter();
  const dispatch = useDispatch();
  const [errorMessage, setErrorMessage] = useState<string>("");
  const [successMessage, setSuccessMessage] = useState<string>("");
  const { register, handleSubmit, control, formState: { errors } } = useForm<LoginFormData>();
  const [login, { isLoading }] = useLoginMutation();

const onSubmit = async (formData: LoginFormData) => {
  try {
    setErrorMessage("");
    setSuccessMessage("");
    const response = await login(formData).unwrap();
    
    // console.log("API Response:", response); 
    
    if (response && response.data) {
      const { user, token } = response.data; 
      dispatch(setUser({ user, token }));
      setSuccessMessage("Login successful! Redirecting...");
      router.push("/");
    } else {
      throw new Error("Invalid response format");
    }
  } catch (error: any) {
    console.error("Login error:", error);
    const message =
      error?.data?.message ||
      error?.error ||
      "Invalid credentials. Please try again.";
    setErrorMessage(message);
  }
};

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="bg-white shadow-xl rounded-2xl border border-gray-200 p-8 w-full max-w-md">
        <h2 className="text-2xl font-bold text-center mb-4 bg-gradient-to-r bg-clip-text text-transparent from-blue-500 to-indigo-700">
          Doctor Appointment Management System
        </h2>
        <p className="text-center text-gray-600 mb-8">Login to your account</p>

        <form className="space-y-5" onSubmit={handleSubmit(onSubmit)}>
          {/* Email */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
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
              className={`w-full px-4 py-2 border rounded-lg outline-none focus:ring-2 focus:ring-green-400 ${
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
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Password
            </label>
            <input
              type="password"
              placeholder="Enter your password"
              {...register("password", { required: "Password is required" })}
              className={`w-full px-4 py-2 border rounded-lg outline-none focus:ring-2 focus:ring-green-400 ${
                errors.password ? "border-red-500 bg-red-50" : "border-gray-300"
              }`}
            />
            {errors.password && (
              <p className="text-red-500 text-sm mt-1">
                {errors.password.message}
              </p>
            )}
          </div>

          {/* Role */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Select Role
            </label>
            <Controller
              name="role"
              control={control}
              rules={{ required: "Role is required" }}
              render={({ field }) => (
                <Select onValueChange={field.onChange} value={field.value}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select role" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="PATIENT">PATIENT</SelectItem>
                    <SelectItem value="DOCTOR">DOCTOR</SelectItem>
                  </SelectContent>
                </Select>
              )}
            />
            {errors.role && (
              <p className="text-red-500 text-sm mt-1">{errors.role.message}</p>
            )}
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
            className={`w-full py-3 px-4 rounded-lg text-white font-semibold transition-all duration-200 ${
              isLoading
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-blue-600 hover:bg-blue-700 focus:ring-4 focus:ring-blue-200"
            }`}
          >
            {isLoading ? "Logging in..." : "Login"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;
