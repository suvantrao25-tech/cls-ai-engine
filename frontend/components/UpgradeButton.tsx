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