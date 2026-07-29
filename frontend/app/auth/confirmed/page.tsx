"use client";

import { useRouter } from "next/navigation";

export default function ConfirmedPage() {

  const router = useRouter();

  return (
    <main className="min-h-screen bg-gray-100 flex items-center justify-center p-6">

      <div className="bg-white shadow-xl rounded-2xl p-8 w-full max-w-lg text-center">

        <h1 className="text-3xl font-bold mb-4">
          🎉 Email Verified Successfully!
        </h1>


        <p className="text-gray-600 mb-6">
          Welcome to Creator Launch Space AI (CLS AI) 🚀
        </p>


        <p className="text-gray-700 mb-6">
          Your account has been successfully verified.
          You are ready to create amazing AI-powered content.
        </p>


        <div className="bg-gray-50 rounded-xl p-5 text-left mb-6">

          <h2 className="font-bold mb-3">
            Your Free Account Includes:
          </h2>


          <ul className="space-y-2 text-gray-700">

            <li>✓ 5,000 AI Credits</li>
            <li>✓ AI Writer Access</li>
            <li>✓ AI Content History</li>
            <li>✓ Personal Dashboard</li>
            <li>✓ Basic AI Templates</li>

          </ul>

        </div>


        <button
          onClick={() => router.push("/login")}
          className="bg-black text-white px-6 py-3 rounded-xl w-full"
        >
          Login to CLS AI
        </button>


        <p className="text-sm text-gray-500 mt-5">
          Create. Launch. Grow. 🚀
        </p>


      </div>

    </main>
  );
}