import axios from "axios";

const BASE_URL = `${import.meta.env.VITE_API_URL}/api/schedule-payment`;

export const getScheduledPaymentsByMemberId = async (memberId: string) => {
  const { data } = await axios.get(`${BASE_URL}/member/${memberId}`);
  return data.scheduledPayments;
};

export const deleteScheduledPayment = async (id: string) => {
  const { data } = await axios.delete(`${BASE_URL}/${id}`);
  return data;
};
