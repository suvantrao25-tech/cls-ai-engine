"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";

export default function Login() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    if (!email.trim() || !password) {
      alert("Please enter email and password");
      return;
    }

    setLoading(true);

    console.log("Login clicked");
    console.log("Login email:", email);

    const { data, error } = await supabase.auth.signInWithPassword({
      email: email.trim(),
      password: password,
    });

    console.log("Login data:", data);
    console.log("Login error:", error);

    if (error) {
      setLoading(false);
      alert(error.message);
      return;
    }

    if (data.user) {
      const { data: profile, error: profileError } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", data.user.id)
        .single();

      console.log("Profile:", profile);
      console.log("Profile error:", profileError);

      if (!profile) {
        const { error: insertError } = await supabase
          .from("profiles")
          .insert({
            id: data.user.id,
            email: data.user.email,
            full_name: "Creator",
            plan: "FREE",
            credits: 5000,
            words_generated: 0,
            blogs_generated: 0,
            subscription_status: "active",
            subscription_plan: "FREE",
          });

        if (insertError) {
          console.error("Profile insert error:", insertError);
        }
      }
    }

    setLoading(false);

    alert("Login successful!");

    router.push("/dashboard");
  };

  return (
    <main className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-xl shadow-lg w-full max-w-md">
        <div className="flex flex-col items-center">

          <h1 className="text-2xl font-bold">
            CLS AI Login
          </h1>

          <p className="text-gray-500 text-center mt-2">
            Welcome back! Login to continue.
          </p>

          <input
            type="email"
            placeholder="Enter your email"
            className="w-full mt-6 p-3 border rounded-lg"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <input
            type="password"
            placeholder="Enter your password"
            className="w-full mt-4 p-3 border rounded-lg"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <button
            type="button"
            onClick={handleLogin}
            disabled={loading}
            className="w-full mt-6 bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 disabled:opacity-50"
          >
            {loading ? "Logging in..." : "Login"}
          </button>

          <p
            className="text-sm text-blue-600 mt-4 cursor-pointer"
            onClick={() => router.push("/forgot-password")}
          >
            Forgot Password?
          </p>

          <p className="text-sm text-gray-600 mt-3">
            Don't have an account?{" "}
            <span
              className="text-blue-600 cursor-pointer font-medium"
              onClick={() => router.push("/signup")}
            >
              Sign Up
            </span>
          </p>

        </div>
      </div>
    </main>
  );
}