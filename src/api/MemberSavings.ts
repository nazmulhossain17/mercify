import api from "./axiosInstance";

export const getMemberSavings = async (memberId: string) => {
  try {
    const response = await api.get(`/api/savings/member/${memberId}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching member savings:", error);
    throw error;
  }
};
