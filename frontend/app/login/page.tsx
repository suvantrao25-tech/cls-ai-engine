"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";

export default function Login() {

  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");


  const handleLogin = async () => {

  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });


  if (error) {
    alert(error.message);
    return;
  }


  if (data.user) {

    const { data: profile } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", data.user.id)
      .single();


    if (!profile) {

      await supabase
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

    }

  }


  alert("Login successful!");

  router.push("/dashboard");

};


    

  return (
    <main className="min-h-screen flex items-center justify-center bg-gray-100">

      <div className="bg-white p-8 rounded-xl shadow-lg w-full max-w-md">

        <div className="flex flex-col items-center">
  <img
    src="/cls-ai-logo.png"
    alt="CLS AI"
    className="w-20 h-20 object-contain"
  />

  <h1 className="text-3xl font-bold text-center mt-3">
    CLS AI Login
  </h1>
</div>

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