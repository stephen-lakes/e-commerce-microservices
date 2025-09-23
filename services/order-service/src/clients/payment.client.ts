import fetch from "node-fetch";

const PAYMENT_URL = process.env.PAYMENT_URL || "http://localhost:3004";

export const makePayment = async ({
  customerId,
  orderId,
  productId,
  amount,
}: any) => {
  try {
    const res = await fetch(`${PAYMENT_URL}/payments`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ customerId, orderId, productId, amount }),
    });

    if (!res.ok) {
      const text = await res.text();
      throw new Error(`Payment Service error ${res.status}: ${text}`);
    }

    const data = await res.json();
    return data; // { success: true, transaction: {...} }
  } catch (error) {
    console.error(error);
  }
};
