import axios from "axios";

export const getTotalMarketLoan = async (): Promise<number> => {
  try {
    const res = await axios.get(`${import.meta.env.VITE_API_URL}/api/loan/total-loan-market`);
    return res.data.total ?? 0;
  } catch (error) {
    console.error("Error fetching total market loan:", error);
    return 0;
  }
};
