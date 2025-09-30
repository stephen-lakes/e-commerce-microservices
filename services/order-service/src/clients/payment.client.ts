import axios from "axios";

const PAYMENT_URL = process.env.PAYMENT_URL || `http://localhost:3004/api/v1`;

export const makePayment = async ({
  customerId,
  orderId,
  productId,
  amount,
}: any) => {
  try {
    const res = await axios.post(`${PAYMENT_URL}/payments`, {
      customerId,
      orderId,
      productId,
      amount,
    });

    return res.data;
  } catch (error: any) {
    console.error(
      `Payment Service error ${error.response?.status}: ${error.response?.data}`
    );
    throw error;
  }
};
