"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";

export default function Signup() {

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();

 const handleSignup = async () => {

  const { data, error } = await supabase.auth.signUp({
    email,
    password,
  });


  if (error) {
    alert(error.message);
    return;
  }


  if (data.user) {

    const { error: profileError } = await supabase
      .from("profiles")
      .insert({
  id: data.user.id,
  email: data.user.email,
  full_name: "Creator",
  plan: "FREE",
  credits: 5000,
  words_generated: 0,
  blogs_generated: 0,
});


    if (profileError) {
  console.log(profileError);
  alert(profileError.message);
  return;
}

  }


  alert(
  "Account created successfully! Please check your email to verify your account before logging in."
);

router.push("/login");

};


  return (
    <main className="min-h-screen flex items-center justify-center bg-gray-100">

      <div className="bg-white p-8 rounded-xl shadow-lg w-full max-w-md">

        <h1 className="text-3xl font-bold text-center">
          🚀 Create CLS AI Account
        </h1>

        <p className="text-gray-500 text-center mt-2">
          Start creating AI content today.
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
          placeholder="Create password"
          className="w-full mt-4 p-3 border rounded-lg"
          value={password}
          onChange={(e)=>setPassword(e.target.value)}
        />


        <button
          onClick={handleSignup}
          className="w-full mt-6 bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700"
        >
          Create Account
        </button>


      </div>

    </main>
  );
}