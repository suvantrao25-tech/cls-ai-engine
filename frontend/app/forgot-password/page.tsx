"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";

export default function ForgotPassword() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const handleReset = async () => {
    if (!email.trim()) {
      alert("Please enter your email");
      return;
    }

    setLoading(true);

    const { data, error } =
      await supabase.auth.resetPasswordForEmail(email.trim(), {
        redirectTo: "http://localhost:3000/reset-password",
      });

    console.log("Reset data:", data);
    console.log("Reset error:", error);

    setLoading(false);

    if (error) {
      alert(error.message);
      return;
    }

    alert("Password reset link sent to your email");
  };

  return (
    <main className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-xl shadow-lg w-full max-w-md">
        <h1 className="text-2xl font-bold text-center">
          Forgot Password
        </h1>

        <p className="text-gray-500 text-center mt-2">
          Enter your email to reset your password.
        </p>

        <input
          type="email"
          placeholder="Enter your email"
          className="w-full mt-6 p-3 border rounded-lg"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <button
          type="button"
          onClick={handleReset}
          disabled={loading}
          className="w-full mt-6 bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 disabled:opacity-50"
        >
          {loading ? "Sending..." : "Send Reset Link"}
        </button>

        <p
          className="text-blue-600 text-sm text-center mt-4 cursor-pointer"
          onClick={() => router.push("/login")}
        >
          Back to Login
        </p>
      </div>
    </main>
  );
}