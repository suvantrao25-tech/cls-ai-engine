"use client";

export default function UpgradeButton() {
  const handlePayment = async () => {
    console.log("Upgrade button clicked");

    try {
      const response = await fetch(
  `${process.env.NEXT_PUBLIC_API_URL}/api/payment/create-order`,
  {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      amount: 299,
    }),
  }
);

      const data = await response.json();
      console.log(data);

      if (!data.success) {
        alert("Order creation failed");
        return;
      }

      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
        amount: data.order.amount,
        currency: data.order.currency,
        name: "CLS AI",
        description: "CLS AI Pro Plan",
        order_id: data.order.id,

        handler: function (response: any) {
          alert(
            "Payment Successful!\nPayment ID: " +
              response.razorpay_payment_id
          );

          console.log(response);
        },

        prefill: {
          name: "",
          email: "",
        },

        theme: {
          color: "#2563eb",
        },
      };

      const paymentObject = new (window as any).Razorpay(options);
      paymentObject.open();

    } catch (err) {
      console.error(err);
      alert("Payment failed");
    }
  };

  return (
    <button
      onClick={handlePayment}
      className="mt-6 bg-white text-blue-600 px-6 py-3 rounded-lg font-bold shadow-lg hover:bg-blue-50 hover:scale-105 transition"
    >
      Upgrade to Pro →
    </button>
  );
}