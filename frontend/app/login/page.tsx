"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";

export default function Login() {

  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");


  const handleLogin = async () => {

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });


    if (error) {
  alert(error.message);
  return;
}

alert("Login successful!");
router.push("/dashboard");

  };


  return (
    <main className="min-h-screen flex items-center justify-center bg-gray-100">

      <div className="bg-white p-8 rounded-xl shadow-lg w-full max-w-md">

        <h1 className="text-3xl font-bold text-center">
          🚀 CLS AI Login
        </h1>

        <p className="text-gray-500 text-center mt-2">
          Welcome back! Login to continue.
        </p>


        <input
          type="email"
          placeholder="Enter your email"
          className="w-full mt-6 p-3 border rounded-lg"
          value={email}
          onChange={(e)=>setEmail(e.target.value)}
        />


        <input
          type="password"
          placeholder="Enter your password"
          className="w-full mt-4 p-3 border rounded-lg"
          value={password}
          onChange={(e)=>setPassword(e.target.value)}
        />


        <button
          onClick={handleLogin}
          className="w-full mt-6 bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700"
        >
          Login
        </button>


      </div>

    </main>
  );
}