"use client";

import { supabase } from "@/lib/supabase";

export default function UpgradeButton() {
  const handlePayment = async () => {
    console.log("🔥 Upgrade button clicked");

    try {
      // ---------------------------------------------
      // GET LOGGED-IN SUPABASE SESSION
      // ---------------------------------------------

      const {
        data: { session },
        error: sessionError,
      } = await supabase.auth.getSession();

      console.log("SESSION EXISTS:", !!session);
      console.log("TOKEN EXISTS:", !!session?.access_token);
      console.log("USER EMAIL:", session?.user?.email);

      if (sessionError) {
        console.error("SESSION ERROR:", sessionError);
      }

      if (!session?.access_token) {
        alert("Please login first.");
        return;
      }

      // ---------------------------------------------
      // DETECT PAYMENT CURRENCY
      // ---------------------------------------------
      //
      // India -> INR
      // Other browser locales -> USD
      //
      // Backend remains the final authority for price.
      // ---------------------------------------------

      const browserLocale =
        typeof navigator !== "undefined"
          ? navigator.language
          : "en-IN";

      const isIndia =
        browserLocale.toLowerCase().includes("-in") ||
        browserLocale.toLowerCase() === "en-in";

      const requestedCurrency = "INR";

      console.log("BROWSER LOCALE:", browserLocale);
      console.log("REQUESTED CURRENCY:", requestedCurrency);

      // ---------------------------------------------
      // CREATE RAZORPAY ORDER
      // ---------------------------------------------

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/payment/create-order`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${session.access_token}`,
          },
          body: JSON.stringify({
            currency: requestedCurrency,
          }),
        }
      );

      console.log("ORDER STATUS:", response.status);

      const data = await response.json();

      console.log("ORDER RESPONSE:", data);

      if (!response.ok || !data.success) {
        alert(data.message || "Order creation failed");
        return;
      }

      // ---------------------------------------------
      // RAZORPAY KEY
      // ---------------------------------------------

      const razorpayKeyId =
        process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID?.trim();

      if (!razorpayKeyId) {
        alert("Razorpay Key ID missing");
        return;
      }

      // ---------------------------------------------
      // RAZORPAY CHECKOUT
      // ---------------------------------------------

      const options = {
        key: razorpayKeyId,

        amount: data.order.amount,

        currency: data.order.currency,

        name: "CLS AI",

        description: "CLS AI Pro Plan",

        order_id: data.order.id,

        handler: async function (paymentResponse: any) {
          console.log("PAYMENT RESPONSE:", paymentResponse);

          try {
            // ---------------------------------------------
            // VERIFY PAYMENT
            // ---------------------------------------------

            const verifyResponse = await fetch(
              `${process.env.NEXT_PUBLIC_API_URL}/api/payment/verify-payment`,
              {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                  Authorization: `Bearer ${session.access_token}`,
                },
                body: JSON.stringify({
                  razorpay_order_id:
                    paymentResponse.razorpay_order_id,

                  razorpay_payment_id:
                    paymentResponse.razorpay_payment_id,

                  razorpay_signature:
                    paymentResponse.razorpay_signature,
                }),
              }
            );

            const verifyData = await verifyResponse.json();

            console.log("VERIFY RESPONSE:", verifyData);

            if (!verifyResponse.ok || !verifyData.success) {
              alert(
                verifyData.message ||
                  "Payment verification failed."
              );
              return;
            }

            alert(
              "Payment successful! Creator Pro activated."
            );

            window.location.reload();
          } catch (error) {
            console.error("VERIFY ERROR:", error);

            alert(
              "Payment verification failed."
            );
          }
        },

        prefill: {
          name: "",
          email: session.user.email || "",
          contact: "",
        },

        theme: {
          color: "#2563eb",
        },
      };

      // ---------------------------------------------
      // CHECK RAZORPAY
      // ---------------------------------------------

      if (!(window as any).Razorpay) {
        alert(
          "Razorpay load nahi hua. Page refresh karo."
        );
        return;
      }

      // ---------------------------------------------
      // OPEN CHECKOUT
      // ---------------------------------------------

      const paymentObject =
        new (window as any).Razorpay(options);

      paymentObject.on(
        "payment.failed",
        function (error: any) {
          console.error(
            "PAYMENT FAILED:",
            error
          );

          alert(
            "Payment failed. Please try again."
          );
        }
      );

      paymentObject.open();
    } catch (error) {
      console.error(
        "PAYMENT ERROR:",
        error
      );

      alert(
        "Payment start nahi ho saka."
      );
    }
  };

  return (
    <button
      type="button"
      onClick={handlePayment}
      className="px-6 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700"
    >
      Upgrade to Pro →
    </button>
  );
}
