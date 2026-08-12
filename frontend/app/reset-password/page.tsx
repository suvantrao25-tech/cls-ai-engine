"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";

export default function ResetPassword() {
  const router = useRouter();

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleUpdatePassword = async () => {
    if (!password || !confirmPassword) {
      alert("Please fill all fields");
      return;
    }

    if (password !== confirmPassword) {
      alert("Passwords do not match");
      return;
    }

    if (password.length < 6) {
      alert("Password must be at least 6 characters");
      return;
    }

    setLoading(true);

    const { error } = await supabase.auth.updateUser({
      password: password,
    });

    setLoading(false);

    if (error) {
      alert(error.message);
      return;
    }

    alert("Password updated successfully!");

    await supabase.auth.signOut();

    router.push("/login");
  };

  return (
    <main className="min-h-screen flex items-center justify-center bg-gray-100">

      <div className="bg-white p-8 rounded-xl shadow-lg w-full max-w-md">

        <h1 className="text-2xl font-bold text-center">
          Reset Password
        </h1>

        <p className="text-gray-500 text-center mt-2">
          Create your new password.
        </p>

        <input
          type="password"
          placeholder="New Password"
          className="w-full mt-6 p-3 border rounded-lg"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <input
          type="password"
          placeholder="Confirm New Password"
          className="w-full mt-4 p-3 border rounded-lg"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
        />

        <button
          onClick={handleUpdatePassword}
          disabled={loading}
          className="w-full mt-6 bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 disabled:opacity-50"
        >
          {loading ? "Updating..." : "Update Password"}
        </button>

        <p
          className="text-sm text-blue-600 text-center mt-4 cursor-pointer"
          onClick={() => router.push("/login")}
        >
          Back to Login
        </p>

      </div>

    </main>
  );
}