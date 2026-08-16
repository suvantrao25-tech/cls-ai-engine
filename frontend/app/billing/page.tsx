"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase";

declare global {
  interface Window {
    Razorpay: any;
  }
}

export default function BillingPage() {
  const [plan, setPlan] = useState("FREE");

  const handlePayment = async () => {
    console.log("🔥 HANDLE PAYMENT CALLED");
    const {
  data: { session },
} = await supabase.auth.getSession();

if (!session) {
  alert("Please login first.");
  return;
}
    try {
      const response = await fetch(
  `${process.env.NEXT_PUBLIC_API_URL}/api/payment/create-order`,
  {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${session.access_token}`,
    },
  }
);

console.log("CREATE ORDER STATUS:", response.status);

const data = await response.json();

console.log("CREATE ORDER RESPONSE:", data);

if (!data.success) {
  alert("Payment order create nahi hua");
  return;
}

      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
        amount: data.order.amount,
        currency: data.order.currency,
        name: "CLS AI",
        description: "Creator Pro - Monthly Plan",
        order_id: data.order.id,

        handler: async function (response: any) {
  try {
    const verifyResponse = await fetch(
  `${process.env.NEXT_PUBLIC_API_URL}/api/payment/verify-payment`,
  {
        method: "POST",
        headers: {
  "Content-Type": "application/json",
  Authorization: `Bearer ${session.access_token}`,
},
        body: JSON.stringify({
          razorpay_order_id: response.razorpay_order_id,
          razorpay_payment_id: response.razorpay_payment_id,
          razorpay_signature: response.razorpay_signature,
        }),
      }
    );

    const verifyData = await verifyResponse.json();

    if (!verifyData.success) {
      alert("Payment verify nahi hua.");
      return;
    }

    setPlan("CREATOR PRO");

    alert("Payment successful! Creator Pro activated.");
  } catch (error) {
    console.error("Verification error:", error);
    alert("Payment verify nahi ho saka.");
  }
},

        prefill: {
          name: "",
          email: "",
          contact: "",
        },

        theme: {
          color: "#2563eb",
        },
      };

      console.log("RAZORPAY OPTIONS:", options);

const razorpay = new window.Razorpay(options);

console.log("RAZORPAY INSTANCE CREATED");

razorpay.on("payment.failed", function (response: any) {
  console.error("RAZORPAY PAYMENT FAILED:", response);
});

razorpay.open();

console.log("RAZORPAY OPEN CALLED");
    } catch (error) {
      console.error("Payment error:", error);
      alert("Payment start nahi ho saka");
    }
  };

  const plans = [
    {
      name: "FREE",
      price: "₹0",
      words: "5,000 AI Words",
      features: [
        "AI Writer Access",
        "Basic Templates",
        "Save Content",
      ],
    },
    {
      name: "CREATOR PRO",
      price: "₹299",
      words: "50,000 AI Words / Month",
      popular: true,
      features: [
        "All AI Templates",
        "Unlimited Saved Content",
        "Priority AI Generation",
        "SEO Writing Tools",
      ],
    },
    {
      name: "BUSINESS",
      price: "Coming Soon",
      words: "Unlimited AI Words",
      features: [
        "Everything in Pro",
        "Advanced AI Tools",
        "Team Access",
        "API Access",
      ],
    },
  ];

  return (
  <main className="min-h-screen bg-gray-100 p-6">
    <div className="max-w-6xl mx-auto">

      {/* HEADER */}

        <div className="text-center mb-10">
          <h1 className="text-3xl font-bold text-gray-900">
            Billing & Plans
          </h1>

          <p className="text-gray-500 mt-2">
            Choose the plan that works best for you.
          </p>
        </div>

        <div className="bg-white rounded-xl shadow p-6 mb-8">
          <p className="text-sm text-gray-500">
            Current Plan
          </p>

          <h2 className="text-2xl font-bold mt-1 text-gray-900">
            {plan}
          </h2>

          <p className="text-gray-500 mt-1">
            {plan === "CREATOR PRO"
              ? "50,000 AI Words / Month"
              : "5,000 AI Words"}
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6">

          {plans.map((item) => (
            <div
              key={item.name}
              className={`relative bg-white rounded-2xl shadow-lg p-6 ${
                item.popular
                  ? "border-2 border-blue-600"
                  : "border border-gray-200"
              }`}
            >

              {item.popular && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                  <span className="bg-blue-600 text-white px-4 py-1 rounded-full text-sm font-semibold">
                    Most Popular
                  </span>
                </div>
              )}

              <h2 className="text-2xl font-bold mt-2 text-gray-900">
                {item.name}
              </h2>

              <div className="mt-5">
                <span className="text-4xl font-bold text-gray-900">
                  {item.price}
                </span>

                {item.name === "CREATOR PRO" && (
                  <span className="text-gray-500">
                    {" "}/ month
                  </span>
                )}
              </div>

              <p className="text-gray-600 mt-3 font-medium">
                {item.words}
              </p>

              <div className="mt-6 space-y-3">
                {item.features.map((feature) => (
                  <p
                    key={feature}
                    className="text-gray-700"
                  >
                    ✓ {feature}
                  </p>
                ))}
              </div>

              <button
                type="button"
                disabled={item.name === "BUSINESS"}
                onClick={() => {
  if (item.name === "FREE") {
    setPlan("FREE");
  }

  if (item.name === "CREATOR PRO") {
    handlePayment();
  }
}}
                className={`mt-8 w-full py-3 rounded-xl font-bold ${
                  item.name === "FREE"
                    ? "bg-gray-200 text-gray-600"
                    : item.name === "BUSINESS"
                    ? "bg-gray-200 text-gray-500 cursor-not-allowed"
                    : "bg-blue-600 text-white hover:bg-blue-700"
                }`}
              >
                {item.name === "FREE"
                  ? "Current Plan"
                  : item.name === "BUSINESS"
                  ? "Coming Soon"
                  : "Upgrade Now — ₹299"}
              </button>

              {item.name === "CREATOR PRO" && (
                <p className="text-xs text-gray-500 text-center mt-3">
                  ₹299/month • Auto-renewal
                </p>
              )}

            </div>
          ))}

        </div>

        <div className="bg-white rounded-xl shadow p-6 mt-10">

          <h2 className="text-xl font-bold text-gray-900">
            Billing Details
          </h2>

          <div className="mt-4 space-y-3 text-gray-600">

            <p>
              <strong>Current Plan:</strong>{" "}
              {plan}
            </p>

            <p>
              <strong>Monthly Price:</strong>{" "}
              {plan === "CREATOR PRO" ? "₹299" : "₹0"}
            </p>

            <p>
              <strong>Billing:</strong>{" "}
              {plan === "CREATOR PRO"
                ? "Monthly"
                : "No billing"}
            </p>

            <p>
              <strong>AI Words:</strong>{" "}
              {plan === "CREATOR PRO"
                ? "50,000 / Month"
                : "5,000"}
            </p>

            <p>
              <strong>Unused Words:</strong>{" "}
              Do not roll over
            </p>

            <p>
              <strong>Auto Renewal:</strong>{" "}
              {plan === "CREATOR PRO"
                ? "Enabled"
                : "Not Applicable"}
            </p>

          </div>

        </div>

        <div className="bg-white rounded-xl shadow p-6 mt-6">

          <h2 className="text-xl font-bold text-gray-900">
            Payment History
          </h2>

          <div className="mt-4 border rounded-lg p-6 text-center text-gray-500">
            No payments yet.
          </div>

        </div>

      </div>
    </main>
  );
}