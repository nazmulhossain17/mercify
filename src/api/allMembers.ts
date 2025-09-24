import type { MemberProfile } from "@/types/auth";
import api from "./axiosInstance";

export const getAllMembers = async (): Promise<MemberProfile[]> => {
  const res = await api.get<MemberProfile[]>("/member");
  return res.data;
};
